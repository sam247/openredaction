/**
 * Prometheus metrics HTTP server for monitoring
 * Exposes /metrics endpoint for Prometheus scraping
 */

import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import type { IMetricsCollector } from "@openredaction/core";

/**
 * Prometheus server options
 */
export interface PrometheusServerOptions {
  /** Port to listen on (default: 9090) */
  port?: number;
  /** Host to bind to (default: '0.0.0.0') */
  host?: string;
  /** Metrics path (default: '/metrics') */
  metricsPath?: string;
  /** Metrics prefix (default: 'openredaction') */
  prefix?: string;
  /** Health check path (default: '/health') */
  healthPath?: string;
  /** Enable CORS (default: false) */
  enableCors?: boolean;
  /** Basic auth username (optional) */
  username?: string;
  /** Basic auth password (optional) */
  password?: string;
}

/**
 * Prometheus metrics HTTP server
 * Provides a lightweight HTTP server for exposing metrics to Prometheus
 */
export class PrometheusServer {
  private server?: Server;
  private metricsCollector: IMetricsCollector;
  private options: Required<
    Omit<PrometheusServerOptions, "username" | "password">
  > &
    Pick<PrometheusServerOptions, "username" | "password">;
  private isRunning: boolean = false;
  private requestCount: number = 0;
  private lastScrapeTime?: Date;

  constructor(
    metricsCollector: IMetricsCollector,
    options?: PrometheusServerOptions,
  ) {
    this.metricsCollector = metricsCollector;
    this.options = {
      port: options?.port ?? 9090,
      host: options?.host ?? "0.0.0.0",
      metricsPath: options?.metricsPath ?? "/metrics",
      prefix: options?.prefix ?? "openredaction",
      healthPath: options?.healthPath ?? "/health",
      enableCors: options?.enableCors ?? false,
      username: options?.username,
      password: options?.password,
    };
  }

  /**
   * Start the Prometheus metrics server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error("[PrometheusServer] Server is already running");
    }

    try {
      const server = createServer(this.handleRequest.bind(this));
      this.server = server;

      return new Promise<void>((resolve, reject) => {
        server.listen(this.options.port, this.options.host, () => {
          this.isRunning = true;
          console.log(
            `[PrometheusServer] Metrics server started on http://${this.options.host}:${this.options.port}${this.options.metricsPath}`,
          );
          resolve();
        });

        server.on("error", (error: any) => {
          reject(
            new Error(
              `[PrometheusServer] Failed to start server: ${error.message}`,
            ),
          );
        });
      });
    } catch (error: any) {
      throw new Error(
        `[PrometheusServer] Failed to initialize HTTP server: ${error.message}`,
      );
    }
  }

  /**
   * Stop the server
   */
  async stop(): Promise<void> {
    if (!this.isRunning || !this.server) {
      return;
    }

    const server = this.server;

    return new Promise<void>((resolve, reject) => {
      server.close((error: any) => {
        if (error) {
          reject(
            new Error(
              `[PrometheusServer] Failed to stop server: ${error.message}`,
            ),
          );
        } else {
          this.isRunning = false;
          console.log("[PrometheusServer] Server stopped");
          resolve();
        }
      });
    });
  }

  /**
   * Handle incoming HTTP requests
   */
  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    this.requestCount++;

    // CORS headers
    if (this.options.enableCors) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );

      if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
      }
    }

    // Only allow GET requests
    if (req.method !== "GET") {
      res.writeHead(405, { "Content-Type": "text/plain" });
      res.end("Method Not Allowed");
      return;
    }

    // Basic authentication
    if (this.options.username && this.options.password) {
      const rawAuth = req.headers.authorization;
      const authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;

      if (!authHeader || !this.validateAuth(authHeader)) {
        res.writeHead(401, {
          "Content-Type": "text/plain",
          "WWW-Authenticate": 'Basic realm="Prometheus Metrics"',
        });
        res.end("Unauthorized");
        return;
      }
    }

    // Route handling
    const url = req.url;

    if (url === this.options.metricsPath) {
      this.handleMetrics(req, res);
    } else if (url === this.options.healthPath) {
      this.handleHealth(req, res);
    } else if (url === "/") {
      this.handleRoot(req, res);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
    }
  }

  /**
   * Handle /metrics endpoint
   */
  private handleMetrics(_req: IncomingMessage, res: ServerResponse): void {
    try {
      this.lastScrapeTime = new Date();

      const exporter = this.metricsCollector.getExporter();
      const metrics = exporter.getMetrics();
      const prometheusFormat = exporter.exportPrometheus(
        metrics,
        this.options.prefix,
      );

      // Add server-specific metrics
      const serverMetrics = this.getServerMetrics();
      const fullMetrics = prometheusFormat + "\n" + serverMetrics;

      res.writeHead(200, { "Content-Type": "text/plain; version=0.0.4" });
      res.end(fullMetrics);
    } catch (error: any) {
      console.error("[PrometheusServer] Error exporting metrics:", error);
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Internal Server Error");
    }
  }

  /**
   * Handle /health endpoint
   */
  private handleHealth(_req: IncomingMessage, res: ServerResponse): void {
    const health = {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      metrics: {
        requestCount: this.requestCount,
        lastScrapeTime: this.lastScrapeTime?.toISOString(),
      },
    };

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(health, null, 2));
  }

  /**
   * Handle / root endpoint
   */
  private handleRoot(_req: IncomingMessage, res: ServerResponse): void {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OpenRedaction Prometheus Exporter</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
    h1 { color: #333; }
    a { color: #0066cc; }
    .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>OpenRedaction Prometheus Exporter</h1>
  <p>This server exposes metrics for Prometheus monitoring.</p>

  <h2>Endpoints</h2>
  <div class="endpoint">
    <strong>GET <a href="${this.options.metricsPath}">${this.options.metricsPath}</a></strong><br>
    Prometheus metrics in text format
  </div>
  <div class="endpoint">
    <strong>GET <a href="${this.options.healthPath}">${this.options.healthPath}</a></strong><br>
    Health check endpoint (JSON)
  </div>

  <h2>Configuration</h2>
  <ul>
    <li>Host: ${this.options.host}</li>
    <li>Port: ${this.options.port}</li>
    <li>Metrics Prefix: ${this.options.prefix}</li>
    <li>CORS Enabled: ${this.options.enableCors}</li>
    <li>Authentication: ${this.options.username ? "Enabled" : "Disabled"}</li>
  </ul>

  <h2>Prometheus Configuration</h2>
  <p>Add this to your <code>prometheus.yml</code>:</p>
  <pre>
scrape_configs:
  - job_name: 'openredaction'
    static_configs:
      - targets: ['${this.options.host}:${this.options.port}']
    metrics_path: '${this.options.metricsPath}'
${
  this.options.username
    ? `    basic_auth:
      username: '${this.options.username}'
      password: '${this.options.password}'`
    : ""
}
  </pre>
</body>
</html>
    `.trim();

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  }

  /**
   * Validate basic authentication
   */
  private validateAuth(authHeader: string): boolean {
    try {
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString(
        "utf-8",
      );
      const [username, password] = credentials.split(":");

      return (
        username === this.options.username && password === this.options.password
      );
    } catch {
      return false;
    }
  }

  /**
   * Get server-specific metrics in Prometheus format
   */
  private getServerMetrics(): string {
    const prefix = this.options.prefix;
    const timestamp = Date.now();
    const lines: string[] = [];

    // Server uptime
    lines.push(
      `# HELP ${prefix}_server_uptime_seconds Server uptime in seconds`,
    );
    lines.push(`# TYPE ${prefix}_server_uptime_seconds counter`);
    lines.push(
      `${prefix}_server_uptime_seconds ${process.uptime().toFixed(2)} ${timestamp}`,
    );
    lines.push("");

    // Request count
    lines.push(
      `# HELP ${prefix}_server_requests_total Total number of requests to metrics server`,
    );
    lines.push(`# TYPE ${prefix}_server_requests_total counter`);
    lines.push(
      `${prefix}_server_requests_total ${this.requestCount} ${timestamp}`,
    );
    lines.push("");

    // Last scrape time
    if (this.lastScrapeTime) {
      const lastScrapeSeconds = Math.floor(
        (Date.now() - this.lastScrapeTime.getTime()) / 1000,
      );
      lines.push(
        `# HELP ${prefix}_server_last_scrape_seconds Seconds since last metrics scrape`,
      );
      lines.push(`# TYPE ${prefix}_server_last_scrape_seconds gauge`);
      lines.push(
        `${prefix}_server_last_scrape_seconds ${lastScrapeSeconds} ${timestamp}`,
      );
      lines.push("");
    }

    // Memory usage
    const mem = process.memoryUsage();
    lines.push(
      `# HELP ${prefix}_server_memory_bytes Server memory usage in bytes`,
    );
    lines.push(`# TYPE ${prefix}_server_memory_bytes gauge`);
    lines.push(
      `${prefix}_server_memory_bytes{type="rss"} ${mem.rss} ${timestamp}`,
    );
    lines.push(
      `${prefix}_server_memory_bytes{type="heapTotal"} ${mem.heapTotal} ${timestamp}`,
    );
    lines.push(
      `${prefix}_server_memory_bytes{type="heapUsed"} ${mem.heapUsed} ${timestamp}`,
    );
    lines.push(
      `${prefix}_server_memory_bytes{type="external"} ${mem.external} ${timestamp}`,
    );
    lines.push("");

    return lines.join("\n");
  }

  /**
   * Get server statistics
   */
  getStats(): {
    isRunning: boolean;
    requestCount: number;
    lastScrapeTime?: Date;
    uptime: number;
    host: string;
    port: number;
    metricsPath: string;
  } {
    return {
      isRunning: this.isRunning,
      requestCount: this.requestCount,
      lastScrapeTime: this.lastScrapeTime,
      uptime: process.uptime(),
      host: this.options.host,
      port: this.options.port,
      metricsPath: this.options.metricsPath,
    };
  }
}

/**
 * Create a Prometheus server instance
 */
export function createPrometheusServer(
  metricsCollector: IMetricsCollector,
  options?: PrometheusServerOptions,
): PrometheusServer {
  return new PrometheusServer(metricsCollector, options);
}
