/**
 * Hono middleware for PII detection
 * Local-first server-side PII detection and redaction
 */

import type {
  DetectionResult,
  OpenRedactionOptions,
} from "@openredaction/core";
import { OpenRedaction } from "@openredaction/core";
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";

/**
 * PII detection info stored in Hono context
 */
export interface PIIDetectionInfo {
  detected: boolean;
  count: number;
  result: DetectionResult;
  redacted?: Record<string, unknown>;
}

/**
 * Hono context variables added by the middleware
 */
export interface PIIContextVariables {
  pii?: PIIDetectionInfo;
  redactedBody?: Record<string, unknown>;
}

/**
 * Middleware options
 */
export interface OpenRedactionMiddlewareOptions extends OpenRedactionOptions {
  /** Auto-redact request body (default: false) */
  autoRedact?: boolean;
  /** Fields to check in request body (default: all) */
  fields?: string[];
  /** Skip detection for certain routes (regex patterns) */
  skipRoutes?: RegExp[];
  /** Add PII detection results to context (default: true) */
  attachResults?: boolean;
  /** Custom handler for PII detection */
  onDetection?: (c: Context, result: DetectionResult) => void;
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
 * Create Hono middleware for PII detection
 */
export function openredactionMiddleware(
  options: OpenRedactionMiddlewareOptions = {},
) {
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

  return createMiddleware<{ Variables: PIIContextVariables }>(
    async (c, next) => {
      if (skipRoutes.some((pattern) => pattern.test(c.req.path))) {
        return next();
      }

      let body: Record<string, unknown>;
      try {
        body = await c.req.json();
      } catch {
        return next();
      }

      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return next();
      }

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

      if (attachResults) {
        const firstKey = Object.keys(results)[0];
        c.set("pii", {
          detected: totalDetections > 0,
          count: totalDetections,
          result: results[firstKey] || EMPTY_RESULT,
          redacted: autoRedact ? redactedBody : undefined,
        });
      }

      if (autoRedact && totalDetections > 0) {
        c.set("redactedBody", redactedBody);
      }

      if (addHeaders && totalDetections > 0) {
        c.header("X-PII-Detected", "true");
        c.header("X-PII-Count", totalDetections.toString());
      }

      if (
        onDetection &&
        totalDetections > 0 &&
        Object.keys(results).length > 0
      ) {
        const firstKey = Object.keys(results)[0];
        onDetection(c, results[firstKey]);
      }

      if (failOnPII && totalDetections > 0) {
        return c.json(
          {
            error: "PII detected in request",
            message:
              "Personal Identifiable Information was detected and rejected",
            piiCount: totalDetections,
            fields: Object.keys(results),
          },
          400,
        );
      }

      await next();
    },
  );
}

/**
 * Hono route handler for PII detection
 */
export function detectPII(options: OpenRedactionOptions = {}) {
  const detector = new OpenRedaction(options);

  return async (c: Context): Promise<Response> => {
    let text: string | undefined;

    const contentType = c.req.header("Content-Type") || "";

    if (contentType.includes("application/json")) {
      try {
        const body = await c.req.json();
        text = typeof body?.text === "string" ? body.text : undefined;
      } catch {
        // fall through to query
      }
    }

    if (text === undefined) {
      const queryText = c.req.query("text");
      text = typeof queryText === "string" ? queryText : undefined;
    }

    if (!text) {
      return c.json(
        {
          error: "Missing text parameter",
          message: "Provide text in request body or query parameter",
        },
        400,
      );
    }

    try {
      const result = await detector.detect(text);

      return c.json({
        detected: result.detections.length > 0,
        count: result.detections.length,
        detections: result.detections,
        redacted: result.redacted,
        stats: result.stats,
      });
    } catch (error) {
      return c.json(
        {
          error: "Detection failed",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        500,
      );
    }
  };
}

/**
 * Hono route handler for generating reports
 */
export function generateReport(options: OpenRedactionOptions = {}) {
  const detector = new OpenRedaction(options);

  return async (c: Context): Promise<Response> => {
    let text: string | undefined;
    let format = "json";
    let title = "PII Detection Report";

    const contentType = c.req.header("Content-Type") || "";

    if (contentType.includes("application/json")) {
      try {
        const body = await c.req.json();
        text = typeof body?.text === "string" ? body.text : undefined;
        if (typeof body?.format === "string") {
          format = body.format;
        }
        if (typeof body?.title === "string") {
          title = body.title;
        }
      } catch {
        // fall through to query
      }
    }

    if (text === undefined) {
      text = c.req.query("text") || undefined;
    }
    const queryFormat = c.req.query("format");
    if (typeof queryFormat === "string") {
      format = queryFormat;
    }

    if (!text) {
      return c.json({ error: "Missing text parameter" }, 400);
    }

    try {
      const result = await detector.detect(text);

      if (format === "html") {
        const html = detector.generateReport(result, {
          format: "html",
          title,
        });
        return c.html(html);
      }

      if (format === "markdown") {
        const md = detector.generateReport(result, {
          format: "markdown",
          title,
        });
        c.header("Content-Type", "text/markdown");
        return c.body(md);
      }

      return c.json({
        detected: result.detections.length > 0,
        count: result.detections.length,
        detections: result.detections,
        redacted: result.redacted,
        stats: result.stats,
      });
    } catch (error) {
      return c.json(
        {
          error: "Report generation failed",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        500,
      );
    }
  };
}
