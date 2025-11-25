/**
 * REST API Server for OpenRedaction
 * Provides HTTP/REST endpoints for PII detection and redaction
 */

import type { OpenRedactionOptions, DetectionResult } from '../types';
import { OpenRedaction } from '../detector';
import type { TenantManager } from '../tenancy/TenantManager';
import type { WebhookManager } from '../webhooks/WebhookManager';
import type { PersistentAuditLogger } from '../audit/PersistentAuditLogger';
import type { PrometheusServer } from '../metrics/PrometheusServer';

/**
 * API Server configuration
 */
export interface APIServerConfig {
  /** Server port (default: 3000) */
  port?: number;
  /** Server host (default: '0.0.0.0') */
  host?: string;
  /** Enable CORS (default: true) */
  enableCors?: boolean;
  /** CORS origin (default: '*') */
  corsOrigin?: string | string[];
  /** API key for authentication (optional) */
  apiKey?: string;
  /** Enable rate limiting (default: true) */
  enableRateLimit?: boolean;
  /** Rate limit: requests per minute (default: 60) */
  rateLimit?: number;
  /** Request body size limit (default: '10mb') */
  bodyLimit?: string;
  /** Enable request logging (default: true) */
  enableLogging?: boolean;
  /** Tenant manager (for multi-tenant mode) */
  tenantManager?: TenantManager;
  /** Webhook manager */
  webhookManager?: WebhookManager;
  /** Persistent audit logger */
  auditLogger?: PersistentAuditLogger;
  /** Prometheus server */
  prometheusServer?: PrometheusServer;
  /** Default OpenRedaction options (for non-tenant mode) */
  defaultOptions?: OpenRedactionOptions;
}

/**
 * API request with authentication
 */
export interface APIRequest {
  /** Request body */
  body: any;
  /** Headers */
  headers: Record<string, string | string[] | undefined>;
  /** Query parameters */
  query: Record<string, string | string[] | undefined>;
  /** Path parameters */
  params: Record<string, string>;
  /** Authenticated tenant ID (if multi-tenant) */
  tenantId?: string;
  /** Client IP address */
  ip?: string;
}

/**
 * API response
 */
export interface APIResponse {
  /** Status code */
  status: number;
  /** Response body */
  body: any;
  /** Headers */
  headers?: Record<string, string>;
}

/**
 * REST API Server
 * Lightweight HTTP server for OpenRedaction with Express-like interface
 */
export class APIServer {
  private server?: any;
  private config: Required<Omit<APIServerConfig, 'apiKey' | 'tenantManager' | 'webhookManager' | 'auditLogger' | 'prometheusServer' | 'defaultOptions' | 'corsOrigin'>> &
    Pick<APIServerConfig, 'apiKey' | 'tenantManager' | 'webhookManager' | 'auditLogger' | 'prometheusServer' | 'defaultOptions' | 'corsOrigin'>;
  private detector?: OpenRedaction;
  private isRunning: boolean = false;
  private rateLimitTracking: Map<string, number[]> = new Map();

  constructor(config?: APIServerConfig) {
    this.config = {
      port: config?.port ?? 3000,
      host: config?.host ?? '0.0.0.0',
      enableCors: config?.enableCors ?? true,
      corsOrigin: config?.corsOrigin ?? '*',
      apiKey: config?.apiKey,
      enableRateLimit: config?.enableRateLimit ?? true,
      rateLimit: config?.rateLimit ?? 60,
      bodyLimit: config?.bodyLimit ?? '10mb',
      enableLogging: config?.enableLogging ?? true,
      tenantManager: config?.tenantManager,
      webhookManager: config?.webhookManager,
      auditLogger: config?.auditLogger,
      prometheusServer: config?.prometheusServer,
      defaultOptions: config?.defaultOptions
    };

    // Initialize detector if not using multi-tenant mode
    if (!this.config.tenantManager) {
      this.detector = new OpenRedaction(this.config.defaultOptions);
    }
  }

  /**
   * Start the API server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('[APIServer] Server is already running');
    }

    try {
      // Try to use native http module
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const http = require('http');

      this.server = http.createServer(this.handleRequest.bind(this));

      return new Promise<void>((resolve, reject) => {
        this.server.listen(this.config.port, this.config.host, () => {
          this.isRunning = true;
          console.log(`[APIServer] Server started on http://${this.config.host}:${this.config.port}`);
          console.log(`[APIServer] API Documentation: http://${this.config.host}:${this.config.port}/api/docs`);
          resolve();
        });

        this.server.on('error', (error: any) => {
          reject(new Error(`[APIServer] Failed to start server: ${error.message}`));
        });
      });
    } catch (error: any) {
      throw new Error(`[APIServer] Failed to initialize HTTP server: ${error.message}`);
    }
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    if (!this.isRunning || !this.server) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      this.server.close((error: any) => {
        if (error) {
          reject(new Error(`[APIServer] Failed to stop server: ${error.message}`));
        } else {
          this.isRunning = false;
          console.log('[APIServer] Server stopped');
          resolve();
        }
      });
    });
  }

  /**
   * Handle incoming HTTP requests
   */
  private async handleRequest(req: any, res: any): Promise<void> {
    const startTime = Date.now();

    try {
      // Parse request
      const apiReq = await this.parseRequest(req);

      // CORS
      if (this.config.enableCors) {
        res.setHeader('Access-Control-Allow-Origin', Array.isArray(this.config.corsOrigin) ? this.config.corsOrigin.join(', ') : this.config.corsOrigin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key, X-Tenant-ID');

        if (req.method === 'OPTIONS') {
          res.writeHead(204);
          res.end();
          return;
        }
      }

      // Authentication
      if (this.config.apiKey) {
        const providedKey = apiReq.headers['x-api-key'] as string || apiReq.headers['authorization']?.toString().replace('Bearer ', '');
        if (providedKey !== this.config.apiKey) {
          this.sendResponse(res, {
            status: 401,
            body: { error: 'Unauthorized', message: 'Invalid API key' }
          });
          return;
        }
      }

      // Multi-tenant authentication
      if (this.config.tenantManager) {
        const tenantApiKey = apiReq.headers['x-api-key'] as string;
        if (tenantApiKey) {
          const tenant = this.config.tenantManager.authenticateByApiKey(tenantApiKey);
          if (tenant) {
            apiReq.tenantId = tenant.tenantId;
          } else {
            this.sendResponse(res, {
              status: 401,
              body: { error: 'Unauthorized', message: 'Invalid tenant API key' }
            });
            return;
          }
        } else {
          // Check X-Tenant-ID header
          const tenantId = apiReq.headers['x-tenant-id'] as string;
          if (!tenantId) {
            this.sendResponse(res, {
              status: 400,
              body: { error: 'Bad Request', message: 'X-Tenant-ID header required for multi-tenant mode' }
            });
            return;
          }
          apiReq.tenantId = tenantId;
        }
      }

      // Rate limiting
      if (this.config.enableRateLimit) {
        const clientKey = apiReq.tenantId || apiReq.ip || 'unknown';
        if (!this.checkRateLimit(clientKey)) {
          this.sendResponse(res, {
            status: 429,
            body: { error: 'Too Many Requests', message: `Rate limit exceeded: ${this.config.rateLimit} requests per minute` }
          });
          return;
        }
      }

      // Route request
      const response = await this.routeRequest(apiReq);

      // Log request
      if (this.config.enableLogging) {
        const durationMs = Date.now() - startTime;
        console.log(`[APIServer] ${req.method} ${req.url} ${response.status} ${durationMs}ms`);
      }

      this.sendResponse(res, response);
    } catch (error: any) {
      console.error('[APIServer] Request handler error:', error);
      this.sendResponse(res, {
        status: 500,
        body: { error: 'Internal Server Error', message: error.message }
      });
    }
  }

  /**
   * Parse HTTP request
   */
  private async parseRequest(req: any): Promise<APIRequest> {
    // Parse URL
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    // Parse body
    let body: any = {};
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      body = await this.parseBody(req);
    }

    return {
      body,
      headers: req.headers,
      query: Object.fromEntries(url.searchParams),
      params: {},
      ip: req.socket.remoteAddress
    };
  }

  /**
   * Parse request body
   */
  private async parseBody(req: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(body || '{}'));
        } catch {
          resolve({});
        }
      });
      req.on('error', reject);
    });
  }

  /**
   * Route request to appropriate handler
   */
  private async routeRequest(req: APIRequest): Promise<APIResponse> {
    const url = new URL(req.headers.host ? `http://${req.headers.host}` : 'http://localhost');
    const path = url.pathname;
    const method = req.headers[':method'] || 'GET';

    // API routes
    if (path === '/api/detect' && method === 'POST') {
      return this.handleDetect(req);
    }
    if (path === '/api/redact' && method === 'POST') {
      return this.handleRedact(req);
    }
    if (path === '/api/restore' && method === 'POST') {
      return this.handleRestore(req);
    }
    if (path === '/api/audit/logs' && method === 'GET') {
      return this.handleAuditLogs(req);
    }
    if (path === '/api/audit/stats' && method === 'GET') {
      return this.handleAuditStats(req);
    }
    if (path === '/api/metrics' && method === 'GET') {
      return this.handleMetrics(req);
    }
    if (path === '/api/patterns' && method === 'GET') {
      return this.handleGetPatterns(req);
    }
    if (path === '/api/health' && method === 'GET') {
      return this.handleHealth(req);
    }
    if (path === '/api/docs' && method === 'GET') {
      return this.handleDocs(req);
    }
    if (path === '/' && method === 'GET') {
      return this.handleRoot(req);
    }

    return {
      status: 404,
      body: { error: 'Not Found', message: `Route not found: ${method} ${path}` }
    };
  }

  /**
   * Handle POST /api/detect
   */
  private async handleDetect(req: APIRequest): Promise<APIResponse> {
    const { text, options } = req.body;

    if (!text || typeof text !== 'string') {
      return {
        status: 400,
        body: { error: 'Bad Request', message: 'Missing or invalid "text" field' }
      };
    }

    try {
      let result: DetectionResult;

      if (req.tenantId && this.config.tenantManager) {
        // Multi-tenant mode
        result = await this.config.tenantManager.detect(req.tenantId, text);
      } else if (this.detector) {
        // Single-tenant mode
        result = this.detector.detect(text);
      } else {
        throw new Error('No detector available');
      }

      // Emit webhook events
      if (this.config.webhookManager) {
        await this.config.webhookManager.emitHighRiskPII(result, req.tenantId);
        await this.config.webhookManager.emitBulkPII(result, 10, req.tenantId);
      }

      return {
        status: 200,
        body: {
          success: true,
          result: {
            detections: result.detections,
            stats: result.stats
          }
        }
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { error: 'Detection Failed', message: error.message }
      };
    }
  }

  /**
   * Handle POST /api/redact
   */
  private async handleRedact(req: APIRequest): Promise<APIResponse> {
    const { text, options } = req.body;

    if (!text || typeof text !== 'string') {
      return {
        status: 400,
        body: { error: 'Bad Request', message: 'Missing or invalid "text" field' }
      };
    }

    try {
      let result: DetectionResult;

      if (req.tenantId && this.config.tenantManager) {
        result = await this.config.tenantManager.detect(req.tenantId, text);
      } else if (this.detector) {
        result = this.detector.detect(text);
      } else {
        throw new Error('No detector available');
      }

      return {
        status: 200,
        body: {
          success: true,
          result: {
            original: result.original,
            redacted: result.redacted,
            detections: result.detections,
            stats: result.stats
          }
        }
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { error: 'Redaction Failed', message: error.message }
      };
    }
  }

  /**
   * Handle POST /api/restore
   */
  private async handleRestore(req: APIRequest): Promise<APIResponse> {
    const { redacted, redactionMap } = req.body;

    if (!redacted || !redactionMap) {
      return {
        status: 400,
        body: { error: 'Bad Request', message: 'Missing "redacted" or "redactionMap" fields' }
      };
    }

    try {
      let detector: OpenRedaction;

      if (req.tenantId && this.config.tenantManager) {
        detector = this.config.tenantManager.getDetector(req.tenantId);
      } else if (this.detector) {
        detector = this.detector;
      } else {
        throw new Error('No detector available');
      }

      const restored = detector.restore(redacted, redactionMap);

      return {
        status: 200,
        body: {
          success: true,
          result: { restored }
        }
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { error: 'Restore Failed', message: error.message }
      };
    }
  }

  /**
   * Handle GET /api/audit/logs
   */
  private async handleAuditLogs(req: APIRequest): Promise<APIResponse> {
    if (!this.config.auditLogger) {
      return {
        status: 501,
        body: { error: 'Not Implemented', message: 'Audit logging not configured' }
      };
    }

    try {
      const limit = parseInt(req.query.limit as string || '100');
      const logs = await this.config.auditLogger.queryLogs({ limit });

      return {
        status: 200,
        body: {
          success: true,
          logs
        }
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { error: 'Query Failed', message: error.message }
      };
    }
  }

  /**
   * Handle GET /api/audit/stats
   */
  private async handleAuditStats(req: APIRequest): Promise<APIResponse> {
    if (!this.config.auditLogger) {
      return {
        status: 501,
        body: { error: 'Not Implemented', message: 'Audit logging not configured' }
      };
    }

    try {
      const stats = await this.config.auditLogger.getStatsAsync();

      return {
        status: 200,
        body: {
          success: true,
          stats
        }
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { error: 'Query Failed', message: error.message }
      };
    }
  }

  /**
   * Handle GET /api/metrics
   */
  private async handleMetrics(req: APIRequest): Promise<APIResponse> {
    if (this.detector) {
      // Single-tenant metrics
      return {
        status: 200,
        body: {
          success: true,
          metrics: {}
        }
      };
    }

    if (this.config.tenantManager && req.tenantId) {
      // Multi-tenant metrics
      const usage = this.config.tenantManager.getTenantUsage(req.tenantId);

      return {
        status: 200,
        body: {
          success: true,
          metrics: usage
        }
      };
    }

    return {
      status: 501,
      body: { error: 'Not Implemented', message: 'Metrics not configured' }
    };
  }

  /**
   * Handle GET /api/patterns
   */
  private async handleGetPatterns(req: APIRequest): Promise<APIResponse> {
    try {
      let detector: OpenRedaction;

      if (req.tenantId && this.config.tenantManager) {
        detector = this.config.tenantManager.getDetector(req.tenantId);
      } else if (this.detector) {
        detector = this.detector;
      } else {
        throw new Error('No detector available');
      }

      const patterns = detector.getPatterns();

      return {
        status: 200,
        body: {
          success: true,
          patterns: patterns.map(p => ({
            type: p.type,
            priority: p.priority,
            description: p.description,
            severity: p.severity
          }))
        }
      };
    } catch (error: any) {
      return {
        status: 500,
        body: { error: 'Query Failed', message: error.message }
      };
    }
  }

  /**
   * Handle GET /api/health
   */
  private async handleHealth(req: APIRequest): Promise<APIResponse> {
    return {
      status: 200,
      body: {
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        multiTenant: !!this.config.tenantManager,
        features: {
          audit: !!this.config.auditLogger,
          webhooks: !!this.config.webhookManager,
          prometheus: !!this.config.prometheusServer
        }
      }
    };
  }

  /**
   * Handle GET /api/docs
   */
  private async handleDocs(req: APIRequest): Promise<APIResponse> {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OpenRedaction API Documentation</title>
  <style>
    body { font-family: sans-serif; max-width: 1200px; margin: 50px auto; padding: 20px; }
    h1 { color: #333; }
    h2 { color: #666; margin-top: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    .endpoint { background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 4px; border-left: 4px solid #0066cc; }
    .method { display: inline-block; padding: 4px 8px; border-radius: 3px; font-weight: bold; font-size: 12px; margin-right: 10px; }
    .method.post { background: #49cc90; color: white; }
    .method.get { background: #61affe; color: white; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>OpenRedaction REST API</h1>
  <p>Production-ready PII detection and redaction API</p>

  <h2>Authentication</h2>
  <p>Include your API key in the <code>X-API-Key</code> header or <code>Authorization: Bearer YOUR_KEY</code> header.</p>
  ${this.config.tenantManager ? '<p>For multi-tenant mode, also include <code>X-Tenant-ID</code> header.</p>' : ''}

  <h2>Endpoints</h2>

  <div class="endpoint">
    <span class="method post">POST</span>
    <strong>/api/detect</strong>
    <p>Detect PII in text without redaction</p>
    <pre>{
  "text": "My email is john@example.com and SSN is 123-45-6789",
  "options": {
    "includeNames": true,
    "includeEmails": true
  }
}</pre>
  </div>

  <div class="endpoint">
    <span class="method post">POST</span>
    <strong>/api/redact</strong>
    <p>Detect and redact PII in text</p>
    <pre>{
  "text": "My email is john@example.com",
  "options": {
    "redactionMode": "placeholder"
  }
}</pre>
  </div>

  <div class="endpoint">
    <span class="method post">POST</span>
    <strong>/api/restore</strong>
    <p>Restore original text from redacted text</p>
    <pre>{
  "redacted": "My email is [EMAIL_1]",
  "redactionMap": {
    "[EMAIL_1]": "john@example.com"
  }
}</pre>
  </div>

  <div class="endpoint">
    <span class="method get">GET</span>
    <strong>/api/patterns</strong>
    <p>Get available PII patterns</p>
  </div>

  <div class="endpoint">
    <span class="method get">GET</span>
    <strong>/api/audit/logs</strong>
    <p>Get audit logs (requires audit logger)</p>
    <p>Query params: <code>limit</code> (default: 100)</p>
  </div>

  <div class="endpoint">
    <span class="method get">GET</span>
    <strong>/api/audit/stats</strong>
    <p>Get audit statistics (requires audit logger)</p>
  </div>

  <div class="endpoint">
    <span class="method get">GET</span>
    <strong>/api/metrics</strong>
    <p>Get usage metrics</p>
  </div>

  <div class="endpoint">
    <span class="method get">GET</span>
    <strong>/api/health</strong>
    <p>Health check endpoint</p>
  </div>

  <h2>Configuration</h2>
  <ul>
    <li>Port: ${this.config.port}</li>
    <li>Host: ${this.config.host}</li>
    <li>CORS: ${this.config.enableCors ? 'Enabled' : 'Disabled'}</li>
    <li>Rate Limiting: ${this.config.enableRateLimit ? `${this.config.rateLimit} req/min` : 'Disabled'}</li>
    <li>Multi-Tenant: ${this.config.tenantManager ? 'Enabled' : 'Disabled'}</li>
    <li>Audit Logging: ${this.config.auditLogger ? 'Enabled' : 'Disabled'}</li>
    <li>Webhooks: ${this.config.webhookManager ? 'Enabled' : 'Disabled'}</li>
  </ul>
</body>
</html>
    `.trim();

    return {
      status: 200,
      body: html,
      headers: { 'Content-Type': 'text/html' }
    };
  }

  /**
   * Handle GET /
   */
  private async handleRoot(req: APIRequest): Promise<APIResponse> {
    return {
      status: 200,
      body: {
        name: 'OpenRedaction API',
        version: '1.0.0',
        documentation: `/api/docs`,
        health: `/api/health`,
        endpoints: [
          'POST /api/detect',
          'POST /api/redact',
          'POST /api/restore',
          'GET /api/patterns',
          'GET /api/audit/logs',
          'GET /api/audit/stats',
          'GET /api/metrics',
          'GET /api/health'
        ]
      }
    };
  }

  /**
   * Send HTTP response
   */
  private sendResponse(res: any, response: APIResponse): void {
    const headers = {
      'Content-Type': 'application/json',
      ...response.headers
    };

    res.writeHead(response.status, headers);

    if (typeof response.body === 'string') {
      res.end(response.body);
    } else {
      res.end(JSON.stringify(response.body));
    }
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(clientKey: string): boolean {
    const now = Date.now();
    const timestamps = this.rateLimitTracking.get(clientKey) || [];

    // Remove timestamps older than 1 minute
    const oneMinuteAgo = now - 60 * 1000;
    const recentTimestamps = timestamps.filter(ts => ts > oneMinuteAgo);

    if (recentTimestamps.length >= this.config.rateLimit) {
      return false;
    }

    recentTimestamps.push(now);
    this.rateLimitTracking.set(clientKey, recentTimestamps);

    return true;
  }
}

/**
 * Create an API server instance
 */
export function createAPIServer(config?: APIServerConfig): APIServer {
  return new APIServer(config);
}
