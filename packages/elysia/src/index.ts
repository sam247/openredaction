/**
 * Elysia plugins for PII detection
 * Local-first server-side PII detection and redaction
 */

import type {
  DetectionResult,
  OpenRedactionOptions,
} from "@openredaction/core";
import { OpenRedaction } from "@openredaction/core";
import { Elysia, t } from "elysia";

/**
 * PII detection info stored in Elysia context
 */
export type PIIDetectionInfo = {
  detected: boolean;
  count: number;
  result: DetectionResult;
  redacted?: Record<string, unknown>;
};

/**
 * Minimal request context passed to the onDetection callback
 */
export type ElysiaPIIContext = {
  path: string;
  body: unknown;
  headers: Record<string, string | undefined>;
};

/**
 * Plugin options
 */
export interface OpenRedactionPluginOptions extends OpenRedactionOptions {
  /** Auto-redact request body (default: false) */
  autoRedact?: boolean;
  /** Fields to check in request body (default: all) */
  fields?: string[];
  /** Skip detection for certain routes (regex patterns) */
  skipRoutes?: RegExp[];
  /** Add PII detection results to context (default: true) */
  attachResults?: boolean;
  /** Custom handler for PII detection */
  onDetection?: (ctx: ElysiaPIIContext, result: DetectionResult) => void;
  /** Fail request if PII detected (default: false) */
  failOnPII?: boolean;
  /** Add response headers with PII info (default: false) */
  addHeaders?: boolean;
}

const EMPTY_RESULT: DetectionResult = {
  original: "",
  redacted: "",
  detections: [],
  redactionMap: {},
  stats: { piiCount: 0 },
};

/**
 * Run PII detection on a request body and return aggregated results.
 */
async function detectPIIInBody(
  detector: OpenRedaction,
  body: Record<string, unknown>,
  fields: string[],
  autoRedact: boolean,
): Promise<{
  totalDetections: number;
  results: Record<string, DetectionResult>;
  redactedBody: Record<string, unknown>;
}> {
  const fieldsToCheck = fields.length > 0 ? fields : Object.keys(body);
  const textsToCheck: Array<{ field: string; value: string }> = [];

  for (const field of fieldsToCheck) {
    const value = body[field];
    if (typeof value === "string" && value.length > 0) {
      textsToCheck.push({ field, value });
    }
  }

  let totalDetections = 0;
  const results: Record<string, DetectionResult> = {};
  const redactedBody: Record<string, unknown> = { ...body };

  for (const { field, value } of textsToCheck) {
    const result = await detector.detect(value);

    if (result.detections.length > 0) {
      totalDetections += result.detections.length;
      results[field] = result;

      if (autoRedact) {
        redactedBody[field] = result.redacted;
      }
    }
  }

  return { totalDetections, results, redactedBody };
}

/**
 * Create Elysia plugin for PII detection middleware.
 *
 * Uses `.derive()` to add typed `pii` and `redactedBody` context properties,
 * then `.onBeforeHandle()` for side effects (headers, callbacks, failOnPII).
 */
export function openredactionPlugin(options: OpenRedactionPluginOptions = {}) {
  const {
    autoRedact = false,
    fields = [],
    skipRoutes = [],
    attachResults = true,
    onDetection,
    failOnPII = false,
    addHeaders = false,
    ...detectorOptions
  } = options;

  const detector = new OpenRedaction(detectorOptions);

  return new Elysia({ name: "openredaction" })
    .derive({ as: "scoped" }, async ({ path, body }) => {
      if (skipRoutes.some((pattern) => pattern.test(path))) {
        return {
          pii: null as PIIDetectionInfo | null,
          redactedBody: null as Record<string, unknown> | null,
        };
      }

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return {
          pii: null as PIIDetectionInfo | null,
          redactedBody: null as Record<string, unknown> | null,
        };
      }

      const { totalDetections, results, redactedBody } = await detectPIIInBody(
        detector,
        body as Record<string, unknown>,
        fields,
        autoRedact,
      );

      const firstKey = Object.keys(results)[0];

      const pii: PIIDetectionInfo | null = attachResults
        ? {
            detected: totalDetections > 0,
            count: totalDetections,
            result: results[firstKey] || EMPTY_RESULT,
            redacted: autoRedact ? redactedBody : undefined,
          }
        : null;

      return {
        pii,
        redactedBody: autoRedact && totalDetections > 0 ? redactedBody : null,
      };
    })
    .onBeforeHandle({ as: "scoped" }, ({ path, body, headers, pii, set }) => {
      if (!pii?.detected) {
        return;
      }

      if (addHeaders && pii.count > 0) {
        set.headers["X-PII-Detected"] = "true";
        set.headers["X-PII-Count"] = pii.count.toString();
      }

      if (onDetection && pii.count > 0) {
        const ctx: ElysiaPIIContext = { path, body, headers };
        onDetection(ctx, pii.result);
      }

      if (failOnPII && pii.count > 0) {
        set.status = 400;

        return {
          error: "PII detected in request",
          message:
            "Personal Identifiable Information was detected and rejected",
          piiCount: pii.count,
        };
      }

      return;
    });
}

/**
 * Create Elysia plugin with a pre-built POST /detect route.
 *
 * Accepts `{ text: string }` body and returns detection results as JSON.
 */
export function detectPIIPlugin(options: OpenRedactionOptions = {}) {
  const detector = new OpenRedaction(options);

  return new Elysia({ name: "openredaction-detect" }).post(
    "/detect",
    async ({ body }) => {
      const result = await detector.detect(body.text);

      return {
        detected: result.detections.length > 0,
        count: result.detections.length,
        detections: result.detections,
        redacted: result.redacted,
        stats: result.stats,
      };
    },
    {
      body: t.Object({
        text: t.String(),
      }),
    },
  );
}

/**
 * Create Elysia plugin with a pre-built POST /report route.
 *
 * Accepts `{ text: string, format?: "json"|"html"|"markdown", title?: string }`
 * and returns a detection report in the requested format.
 */
export function generateReportPlugin(options: OpenRedactionOptions = {}) {
  const detector = new OpenRedaction(options);

  return new Elysia({ name: "openredaction-report" }).post(
    "/report",
    async ({ body, set }) => {
      const format = body.format ?? "json";
      const title = body.title ?? "PII Detection Report";

      const result = await detector.detect(body.text);

      if (format === "html") {
        const html = detector.generateReport(result, {
          format: "html",
          title,
        });
        set.headers["Content-Type"] = "text/html";
        return html;
      }

      if (format === "markdown") {
        const md = detector.generateReport(result, {
          format: "markdown",
          title,
        });
        set.headers["Content-Type"] = "text/markdown";
        return md;
      }

      return {
        detected: result.detections.length > 0,
        count: result.detections.length,
        detections: result.detections,
        redacted: result.redacted,
        stats: result.stats,
      };
    },
    {
      body: t.Object({
        text: t.String(),
        format: t.Optional(
          t.Union([
            t.Literal("json"),
            t.Literal("html"),
            t.Literal("markdown"),
          ]),
        ),
        title: t.Optional(t.String()),
      }),
    },
  );
}
