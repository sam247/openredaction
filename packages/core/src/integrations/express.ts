/**
 * Express middleware for PII detection
 * Local-first server-side PII detection and redaction
 */

import { OpenRedaction } from '../detector';
import type { DetectionResult, OpenRedactionOptions } from '../types';
import type { Request, Response, NextFunction } from 'express';

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
  /** Add PII detection results to request object (default: true) */
  attachResults?: boolean;
  /** Custom handler for PII detection */
  onDetection?: (req: Request, result: DetectionResult) => void;
  /** Fail request if PII detected (default: false) */
  failOnPII?: boolean;
  /** Add response headers with PII info (default: false) */
  addHeaders?: boolean;
}

/**
 * Extended Express Request with PII detection results
 */
export interface OpenRedactionRequest extends Request {
  pii?: {
    detected: boolean;
    count: number;
    result: DetectionResult;
    redacted?: any;
  };
}

/**
 * Create Express middleware for PII detection
 */
export function openredactionMiddleware(options: OpenRedactionMiddlewareOptions = {}) {
  // Extract middleware-specific options
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

  // Create detector with only OpenRedactionOptions
  const detector = new OpenRedaction(detectorOptions);

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip if route matches skip pattern
    if (skipRoutes.some(pattern => pattern.test(req.path))) {
      return next();
    }

    // Only process if there's a body
    if (!req.body || typeof req.body !== 'object') {
      return next();
    }

    try {
      // Determine which fields to check
      const fieldsToCheck = fields.length > 0
        ? fields
        : Object.keys(req.body);

      // Collect all text to check
      const textsToCheck: Array<{ field: string; value: string }> = [];

      for (const field of fieldsToCheck) {
        const value = req.body[field];
        if (typeof value === 'string' && value.length > 0) {
          textsToCheck.push({ field, value });
        }
      }

      // Detect PII in all fields
      let totalDetections = 0;
      const results: Record<string, DetectionResult> = {};
      const redactedBody: any = { ...req.body };

      for (const { field, value } of textsToCheck) {
        const result = await detector.detect(value);

        if (result.detections.length > 0) {
          totalDetections += result.detections.length;
          results[field] = result;

          // Auto-redact if enabled
          if (autoRedact) {
            redactedBody[field] = result.redacted;
          }
        }
      }

      // Attach results to request
      if (attachResults) {
        const extReq = req as OpenRedactionRequest;
        extReq.pii = {
          detected: totalDetections > 0,
          count: totalDetections,
          result: results[Object.keys(results)[0]] || {
            original: '',
            redacted: '',
            detections: [],
            redactionMap: {},
            stats: { piiCount: 0 }
          },
          redacted: autoRedact ? redactedBody : undefined
        };
      }

      // Replace body if auto-redact is enabled
      if (autoRedact && totalDetections > 0) {
        req.body = redactedBody;
      }

      // Add response headers if enabled
      if (addHeaders && totalDetections > 0) {
        res.setHeader('X-PII-Detected', 'true');
        res.setHeader('X-PII-Count', totalDetections.toString());
      }

      // Call custom handler
      if (onDetection && totalDetections > 0 && Object.keys(results).length > 0) {
        onDetection(req, results[Object.keys(results)[0]]);
      }

      // Fail if PII detected and failOnPII is true
      if (failOnPII && totalDetections > 0) {
        return res.status(400).json({
          error: 'PII detected in request',
          message: 'Personal Identifiable Information was detected and rejected',
          piiCount: totalDetections,
          fields: Object.keys(results)
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Express route handler for PII detection
 */
export function detectPII(options: OpenRedactionOptions = {}) {
  const detector = new OpenRedaction(options);

  return async (req: Request, res: Response): Promise<void> => {
    const text = req.body?.text || req.query.text as string;

    if (!text) {
      res.status(400).json({
        error: 'Missing text parameter',
        message: 'Provide text in request body or query parameter'
      });
      return;
    }

    try {
      const result = await detector.detect(text);

      res.json({
        detected: result.detections.length > 0,
        count: result.detections.length,
        detections: result.detections,
        redacted: result.redacted,
        stats: result.stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Detection failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}

/**
 * Express route handler for generating reports
 */
export function generateReport(options: OpenRedactionOptions = {}) {
  const detector = new OpenRedaction(options);

  return async (req: Request, res: Response): Promise<void> => {
    const text = req.body?.text;
    const format = (req.body?.format || req.query.format || 'json') as string;

    if (!text) {
      res.status(400).json({
        error: 'Missing text parameter'
      });
      return;
    }

    try {
      const result = await detector.detect(text);

    if (format === 'html') {
      const html = detector.generateReport(result, {
        format: 'html',
        title: req.body?.title || 'PII Detection Report'
      });
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } else if (format === 'markdown') {
      const md = detector.generateReport(result, {
        format: 'markdown',
        title: req.body?.title || 'PII Detection Report'
      });
      res.setHeader('Content-Type', 'text/markdown');
      res.send(md);
    } else {
      res.json({
        detected: result.detections.length > 0,
        count: result.detections.length,
        detections: result.detections,
        redacted: result.redacted,
        stats: result.stats
      });
    }
    } catch (error) {
      res.status(500).json({
        error: 'Report generation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };
}
