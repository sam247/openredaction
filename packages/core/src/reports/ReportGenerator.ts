/**
 * Report generation for PII detection results
 * Generates static HTML and Markdown reports - 100% offline, zero dependencies
 */

import { DetectionResult } from '../types';
import { OpenRedact } from '../detector';

/**
 * Report format options
 */
export type ReportFormat = 'html' | 'markdown';

/**
 * Report type options
 */
export type ReportType = 'summary' | 'detailed' | 'compliance';

/**
 * Report generation options
 */
export interface ReportOptions {
  /** Report format */
  format: ReportFormat;
  /** Report type */
  type?: ReportType;
  /** Report title */
  title?: string;
  /** Include original text (default: false for privacy) */
  includeOriginalText?: boolean;
  /** Include redacted text (default: true) */
  includeRedactedText?: boolean;
  /** Include detection details (default: true) */
  includeDetectionDetails?: boolean;
  /** Include statistics (default: true) */
  includeStatistics?: boolean;
  /** Include explanation (requires ExplainAPI, default: false) */
  includeExplanation?: boolean;
  /** Company/project name for compliance reports */
  organizationName?: string;
  /** Additional metadata */
  metadata?: Record<string, string>;
}

/**
 * Report generator for PII detection results
 */
export class ReportGenerator {
  constructor(_detector: OpenRedact) {
    // Detector not currently used, reserved for future features
  }

  /**
   * Generate a report from detection results
   */
  generate(result: DetectionResult, options: ReportOptions): string {
    const opts: Required<ReportOptions> = {
      format: options.format,
      type: options.type || 'summary',
      title: options.title || 'PII Detection Report',
      includeOriginalText: options.includeOriginalText ?? false,
      includeRedactedText: options.includeRedactedText ?? true,
      includeDetectionDetails: options.includeDetectionDetails ?? true,
      includeStatistics: options.includeStatistics ?? true,
      includeExplanation: options.includeExplanation ?? false,
      organizationName: options.organizationName || 'Organization',
      metadata: options.metadata || {}
    };

    if (opts.format === 'html') {
      return this.generateHTML(result, opts);
    } else {
      return this.generateMarkdown(result, opts);
    }
  }

  /**
   * Generate HTML report
   */
  private generateHTML(result: DetectionResult, options: Required<ReportOptions>): string {
    const timestamp = new Date().toISOString();
    const stats = this.calculateStatistics(result);

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(options.title)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2c3e50;
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    h2 {
      color: #34495e;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 8px;
    }
    h3 {
      color: #7f8c8d;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .meta {
      background: #ecf0f1;
      padding: 15px;
      border-radius: 4px;
      margin-bottom: 20px;
      font-size: 0.9em;
    }
    .meta-item {
      margin: 5px 0;
    }
    .meta-label {
      font-weight: 600;
      color: #34495e;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .stat-card.warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .stat-card.success {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    .stat-value {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .stat-label {
      font-size: 0.9em;
      opacity: 0.9;
    }
    .detection-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .detection-table th,
    .detection-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ecf0f1;
    }
    .detection-table th {
      background: #34495e;
      color: white;
      font-weight: 600;
    }
    .detection-table tr:hover {
      background: #f8f9fa;
    }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .badge-high {
      background: #e74c3c;
      color: white;
    }
    .badge-medium {
      background: #f39c12;
      color: white;
    }
    .badge-low {
      background: #3498db;
      color: white;
    }
    .text-box {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 20px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .highlight {
      background: #f39c12;
      color: #2c3e50;
      padding: 2px 4px;
      border-radius: 2px;
      font-weight: 600;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ecf0f1;
      text-align: center;
      color: #7f8c8d;
      font-size: 0.9em;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${this.escapeHtml(options.title)}</h1>

    <div class="meta">
      <div class="meta-item">
        <span class="meta-label">Generated:</span> ${timestamp}
      </div>
      <div class="meta-item">
        <span class="meta-label">Organization:</span> ${this.escapeHtml(options.organizationName)}
      </div>
`;

    // Add custom metadata
    for (const [key, value] of Object.entries(options.metadata)) {
      html += `      <div class="meta-item">
        <span class="meta-label">${this.escapeHtml(key)}:</span> ${this.escapeHtml(value)}
      </div>
`;
    }

    html += `    </div>
`;

    // Statistics section
    if (options.includeStatistics) {
      html += `
    <h2>Summary Statistics</h2>
    <div class="stats">
      <div class="stat-card ${stats.totalDetections > 0 ? 'warning' : 'success'}">
        <div class="stat-value">${stats.totalDetections}</div>
        <div class="stat-label">PII Detected</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.uniqueTypes}</div>
        <div class="stat-label">Unique Types</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${stats.highSeverity}</div>
        <div class="stat-label">High Severity</div>
      </div>
      ${result.stats?.processingTime ? `
      <div class="stat-card success">
        <div class="stat-value">${result.stats.processingTime}ms</div>
        <div class="stat-label">Processing Time</div>
      </div>` : ''}
    </div>
`;

      // Type breakdown
      html += `
    <h3>Detection Breakdown</h3>
    <table class="detection-table">
      <thead>
        <tr>
          <th>PII Type</th>
          <th>Count</th>
          <th>Percentage</th>
        </tr>
      </thead>
      <tbody>
`;
      for (const [type, count] of Object.entries(stats.typeBreakdown)) {
        const percentage = ((count / stats.totalDetections) * 100).toFixed(1);
        html += `        <tr>
          <td>${this.escapeHtml(type)}</td>
          <td>${count}</td>
          <td>${percentage}%</td>
        </tr>
`;
      }
      html += `      </tbody>
    </table>
`;
    }

    // Detection details
    if (options.includeDetectionDetails && result.detections.length > 0) {
      html += `
    <h2>Detection Details</h2>
    <table class="detection-table">
      <thead>
        <tr>
          <th>Type</th>
          <th>Value</th>
          <th>Position</th>
          <th>Severity</th>
          ${result.detections[0].confidence !== undefined ? '<th>Confidence</th>' : ''}
        </tr>
      </thead>
      <tbody>
`;
      for (const detection of result.detections) {
        const severityClass = detection.severity === 'high' ? 'badge-high' :
                             detection.severity === 'medium' ? 'badge-medium' : 'badge-low';
        html += `        <tr>
          <td>${this.escapeHtml(detection.type)}</td>
          <td><code>${this.escapeHtml(detection.value)}</code></td>
          <td>${detection.position[0]}-${detection.position[1]}</td>
          <td><span class="badge ${severityClass}">${detection.severity.toUpperCase()}</span></td>
          ${detection.confidence !== undefined ? `<td>${(detection.confidence * 100).toFixed(1)}%</td>` : ''}
        </tr>
`;
      }
      html += `      </tbody>
    </table>
`;
    }

    // Redacted text
    if (options.includeRedactedText) {
      html += `
    <h2>Redacted Text</h2>
    <div class="text-box">${this.escapeHtml(result.redacted)}</div>
`;
    }

    // Original text (privacy warning)
    if (options.includeOriginalText) {
      html += `
    <h2>Original Text (Sensitive)</h2>
    <div class="text-box">${this.escapeHtml(result.original)}</div>
`;
    }

    // Footer
    html += `
    <div class="footer">
      <p>Generated by OpenRedact - Production-ready PII detection library</p>
      <p>Report Type: ${options.type.toUpperCase()} | Format: HTML</p>
    </div>
  </div>
</body>
</html>`;

    return html;
  }

  /**
   * Generate Markdown report
   */
  private generateMarkdown(result: DetectionResult, options: Required<ReportOptions>): string {
    const timestamp = new Date().toISOString();
    const stats = this.calculateStatistics(result);

    let md = `# ${options.title}\n\n`;

    // Metadata
    md += `## Metadata\n\n`;
    md += `- **Generated:** ${timestamp}\n`;
    md += `- **Organization:** ${options.organizationName}\n`;
    for (const [key, value] of Object.entries(options.metadata)) {
      md += `- **${key}:** ${value}\n`;
    }
    md += `\n`;

    // Statistics
    if (options.includeStatistics) {
      md += `## Summary Statistics\n\n`;
      md += `| Metric | Value |\n`;
      md += `|--------|-------|\n`;
      md += `| Total PII Detected | ${stats.totalDetections} |\n`;
      md += `| Unique Types | ${stats.uniqueTypes} |\n`;
      md += `| High Severity | ${stats.highSeverity} |\n`;
      if (result.stats?.processingTime) {
        md += `| Processing Time | ${result.stats.processingTime}ms |\n`;
      }
      md += `\n`;

      // Type breakdown
      md += `### Detection Breakdown\n\n`;
      md += `| PII Type | Count | Percentage |\n`;
      md += `|----------|-------|------------|\n`;
      for (const [type, count] of Object.entries(stats.typeBreakdown)) {
        const percentage = ((count / stats.totalDetections) * 100).toFixed(1);
        md += `| ${type} | ${count} | ${percentage}% |\n`;
      }
      md += `\n`;
    }

    // Detection details
    if (options.includeDetectionDetails && result.detections.length > 0) {
      md += `## Detection Details\n\n`;
      md += `| Type | Value | Position | Severity |${result.detections[0].confidence !== undefined ? ' Confidence |' : ''}\n`;
      md += `|------|-------|----------|----------|${result.detections[0].confidence !== undefined ? '------------|' : ''}\n`;
      for (const detection of result.detections) {
        md += `| ${detection.type} | \`${detection.value}\` | ${detection.position[0]}-${detection.position[1]} | ${detection.severity.toUpperCase()} |`;
        if (detection.confidence !== undefined) {
          md += ` ${(detection.confidence * 100).toFixed(1)}% |`;
        }
        md += `\n`;
      }
      md += `\n`;
    }

    // Redacted text
    if (options.includeRedactedText) {
      md += `## Redacted Text\n\n`;
      md += `\`\`\`\n${result.redacted}\n\`\`\`\n\n`;
    }

    // Original text (privacy warning)
    if (options.includeOriginalText) {
      md += `## Original Text (Sensitive)\n\n`;
      md += `⚠️ **WARNING:** This section contains unredacted sensitive data.\n\n`;
      md += `\`\`\`\n${result.original}\n\`\`\`\n\n`;
    }

    // Footer
    md += `---\n\n`;
    md += `*Generated by OpenRedact - Production-ready PII detection library*\n`;
    md += `*Report Type: ${options.type.toUpperCase()} | Format: MARKDOWN*\n`;

    return md;
  }

  /**
   * Calculate statistics from detection results
   */
  private calculateStatistics(result: DetectionResult): {
    totalDetections: number;
    uniqueTypes: number;
    highSeverity: number;
    typeBreakdown: Record<string, number>;
  } {
    const typeBreakdown: Record<string, number> = {};
    let highSeverity = 0;

    for (const detection of result.detections) {
      typeBreakdown[detection.type] = (typeBreakdown[detection.type] || 0) + 1;
      if (detection.severity === 'high') {
        highSeverity++;
      }
    }

    return {
      totalDetections: result.detections.length,
      uniqueTypes: Object.keys(typeBreakdown).length,
      highSeverity,
      typeBreakdown
    };
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}

/**
 * Helper to create report generator
 */
export function createReportGenerator(detector: OpenRedact): ReportGenerator {
  return new ReportGenerator(detector);
}
