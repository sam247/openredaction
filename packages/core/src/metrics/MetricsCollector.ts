/**
 * Metrics collection and export for monitoring redaction operations
 */

import type { IMetricsCollector, IMetricsExporter, RedactionMetrics, DetectionResult, RedactionMode } from '../types';

/**
 * In-memory metrics collector and exporter
 * Collects metrics and provides Prometheus and StatsD export formats
 */
export class InMemoryMetricsCollector implements IMetricsCollector, IMetricsExporter {
  private metrics: RedactionMetrics;

  constructor() {
    this.metrics = this.createEmptyMetrics();
  }

  /**
   * Create empty metrics object
   */
  private createEmptyMetrics(): RedactionMetrics {
    return {
      totalRedactions: 0,
      totalPiiDetected: 0,
      totalProcessingTime: 0,
      averageProcessingTime: 0,
      totalTextLength: 0,
      piiByType: {},
      byRedactionMode: {},
      totalErrors: 0,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Record a redaction operation
   */
  recordRedaction(result: DetectionResult, processingTimeMs: number, redactionMode: RedactionMode): void {
    this.metrics.totalRedactions++;
    this.metrics.totalPiiDetected += result.detections.length;
    this.metrics.totalProcessingTime += processingTimeMs;
    this.metrics.averageProcessingTime = this.metrics.totalProcessingTime / this.metrics.totalRedactions;
    this.metrics.totalTextLength += result.original.length;

    // Count PII by type
    for (const detection of result.detections) {
      this.metrics.piiByType[detection.type] = (this.metrics.piiByType[detection.type] || 0) + 1;
    }

    // Count by redaction mode
    this.metrics.byRedactionMode[redactionMode] = (this.metrics.byRedactionMode[redactionMode] || 0) + 1;

    this.metrics.lastUpdated = new Date().toISOString();
  }

  /**
   * Record an error
   */
  recordError(): void {
    this.metrics.totalErrors++;
    this.metrics.lastUpdated = new Date().toISOString();
  }

  /**
   * Get metrics exporter
   */
  getExporter(): IMetricsExporter {
    return this;
  }

  /**
   * Get current metrics snapshot
   */
  getMetrics(): RedactionMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.metrics = this.createEmptyMetrics();
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheus(metrics: RedactionMetrics = this.metrics, prefix: string = 'openredaction'): string {
    const lines: string[] = [];
    const timestamp = Date.now();

    // Total redactions
    lines.push(`# HELP ${prefix}_total_redactions Total number of redaction operations`);
    lines.push(`# TYPE ${prefix}_total_redactions counter`);
    lines.push(`${prefix}_total_redactions ${metrics.totalRedactions} ${timestamp}`);
    lines.push('');

    // Total PII detected
    lines.push(`# HELP ${prefix}_total_pii_detected Total number of PII items detected`);
    lines.push(`# TYPE ${prefix}_total_pii_detected counter`);
    lines.push(`${prefix}_total_pii_detected ${metrics.totalPiiDetected} ${timestamp}`);
    lines.push('');

    // Average processing time
    lines.push(`# HELP ${prefix}_avg_processing_time_ms Average processing time in milliseconds`);
    lines.push(`# TYPE ${prefix}_avg_processing_time_ms gauge`);
    lines.push(`${prefix}_avg_processing_time_ms ${metrics.averageProcessingTime.toFixed(2)} ${timestamp}`);
    lines.push('');

    // Total processing time
    lines.push(`# HELP ${prefix}_total_processing_time_ms Total processing time in milliseconds`);
    lines.push(`# TYPE ${prefix}_total_processing_time_ms counter`);
    lines.push(`${prefix}_total_processing_time_ms ${metrics.totalProcessingTime.toFixed(2)} ${timestamp}`);
    lines.push('');

    // Total text length
    lines.push(`# HELP ${prefix}_total_text_length Total text length processed in characters`);
    lines.push(`# TYPE ${prefix}_total_text_length counter`);
    lines.push(`${prefix}_total_text_length ${metrics.totalTextLength} ${timestamp}`);
    lines.push('');

    // PII by type
    lines.push(`# HELP ${prefix}_pii_by_type PII detection counts by type`);
    lines.push(`# TYPE ${prefix}_pii_by_type counter`);
    for (const [type, count] of Object.entries(metrics.piiByType)) {
      lines.push(`${prefix}_pii_by_type{type="${type}"} ${count} ${timestamp}`);
    }
    lines.push('');

    // Operations by redaction mode
    lines.push(`# HELP ${prefix}_by_redaction_mode Operation counts by redaction mode`);
    lines.push(`# TYPE ${prefix}_by_redaction_mode counter`);
    for (const [mode, count] of Object.entries(metrics.byRedactionMode)) {
      lines.push(`${prefix}_by_redaction_mode{mode="${mode}"} ${count} ${timestamp}`);
    }
    lines.push('');

    // Total errors
    lines.push(`# HELP ${prefix}_total_errors Total number of errors`);
    lines.push(`# TYPE ${prefix}_total_errors counter`);
    lines.push(`${prefix}_total_errors ${metrics.totalErrors} ${timestamp}`);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Export metrics in StatsD format
   */
  exportStatsD(metrics: RedactionMetrics = this.metrics, prefix: string = 'openredaction'): string[] {
    const lines: string[] = [];

    // Counter metrics
    lines.push(`${prefix}.total_redactions:${metrics.totalRedactions}|c`);
    lines.push(`${prefix}.total_pii_detected:${metrics.totalPiiDetected}|c`);
    lines.push(`${prefix}.total_processing_time_ms:${metrics.totalProcessingTime.toFixed(2)}|c`);
    lines.push(`${prefix}.total_text_length:${metrics.totalTextLength}|c`);
    lines.push(`${prefix}.total_errors:${metrics.totalErrors}|c`);

    // Gauge metrics
    lines.push(`${prefix}.avg_processing_time_ms:${metrics.averageProcessingTime.toFixed(2)}|g`);

    // PII by type (with tags)
    for (const [type, count] of Object.entries(metrics.piiByType)) {
      lines.push(`${prefix}.pii_by_type:${count}|c|#type:${type}`);
    }

    // Operations by redaction mode (with tags)
    for (const [mode, count] of Object.entries(metrics.byRedactionMode)) {
      lines.push(`${prefix}.by_redaction_mode:${count}|c|#mode:${mode}`);
    }

    return lines;
  }
}
