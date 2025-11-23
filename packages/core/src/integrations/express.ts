/**
 * Express middleware for PII detection
 * Local-first server-side PII detection and redaction
 */

import { OpenRedact } from '../detector';
import type { DetectionResult, OpenRedactOptions } from '../types';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware options
 */
export interface OpenRedactMiddlewareOptions extends OpenRedactOptions {
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
export interface OpenRedactRequest extends Request {
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
export function openRedactMiddleware(options: OpenRedactMiddlewareOptions = {}) {
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

  // Create detector with only OpenRedactOptions
  const detector = new OpenRedact(detectorOptions);

  return (req: Request, res: Response, next: NextFunction) => {
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
        const result = detector.detect(value);

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
        const extReq = req as OpenRedactRequest;
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
export function detectPII(options: OpenRedactOptions = {}) {
  const detector = new OpenRedact(options);

  return (req: Request, res: Response): void => {
    const text = req.body?.text || req.query.text as string;

    if (!text) {
      res.status(400).json({
        error: 'Missing text parameter',
        message: 'Provide text in request body or query parameter'
      });
      return;
    }

    const result = detector.detect(text);

    res.json({
      detected: result.detections.length > 0,
      count: result.detections.length,
      detections: result.detections,
      redacted: result.redacted,
      stats: result.stats
    });
  };
}

/**
 * Express route handler for generating reports
 */
export function generateReport(options: OpenRedactOptions = {}) {
  const detector = new OpenRedact(options);

  return (req: Request, res: Response): void => {
    const text = req.body?.text;
    const format = (req.body?.format || req.query.format || 'json') as string;

    if (!text) {
      res.status(400).json({
        error: 'Missing text parameter'
      });
      return;
    }

    const result = detector.detect(text);

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
  };
}
