/**
 * Tests for Report Generation
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';
import { createReportGenerator } from '../src/reports/ReportGenerator';

describe('Report Generation', () => {
  describe('Basic report generation', () => {
    it('should generate HTML report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Contact: admin@business.co.uk, Phone: 07700900123';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        title: 'Test Report'
      });

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('Test Report');
      expect(html).toContain('PII Detected');
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(100);
    });

    it('should generate Markdown report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Contact: admin@business.co.uk, Phone: 07700900123';
      const result = detector.detect(text);

      const md = detector.generateReport(result, {
        format: 'markdown',
        title: 'Test Report'
      });

      expect(md).toContain('# Test Report');
      expect(md).toContain('## Summary Statistics');
      expect(md).toContain('Total PII Detected');
      expect(md).toBeDefined();
      expect(md.length).toBeGreaterThan(50);
    });

    it('should use helper to create report generator', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const generator = createReportGenerator(detector);

      expect(generator).toBeDefined();

      const text = 'Email: test@business.co.uk';
      const result = detector.detect(text);

      const report = generator.generate(result, { format: 'markdown' });
      expect(report).toContain('# PII Detection Report');
    });
  });

  describe('HTML report content', () => {
    it('should include statistics in HTML report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: user@business.co.uk, Phone: 07700900123, Card: 4532015112830366';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        includeStatistics: true
      });

      expect(html).toContain('Summary Statistics');
      expect(html).toContain('PII Detected');
      expect(html).toContain('Unique Types');
    });

    it('should include detection details in HTML report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Contact: admin@business.co.uk';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        includeDetectionDetails: true
      });

      expect(html).toContain('Detection Details');
      expect(html).toContain('EMAIL');
      expect(html).toContain('admin@business.co.uk');
    });

    it('should include redacted text in HTML report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Contact: admin@business.co.uk';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        includeRedactedText: true
      });

      expect(html).toContain('Redacted Text');
      expect(html).toContain('[EMAIL_');
    });

    it('should include original text when requested', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Contact: admin@business.co.uk';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        includeOriginalText: true
      });

      expect(html).toContain('Original Text');
      expect(html).toContain('admin@business.co.uk');
    });

    it('should not include original text by default', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Secret: admin@business.co.uk';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html'
      });

      // Should not contain the original text section
      expect(html).not.toContain('Original Text (Sensitive)');
    });

    it('should include metadata in HTML report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: test@business.co.uk';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        organizationName: 'Acme Corp',
        metadata: {
          'Project': 'Test Project',
          'Version': '1.0.0'
        }
      });

      expect(html).toContain('Acme Corp');
      expect(html).toContain('Test Project');
      expect(html).toContain('1.0.0');
    });

    it('should escape HTML in content', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: <script>alert("xss")</script>@business.co.uk';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        title: '<script>alert("xss")</script>'
      });

      // Should escape the HTML
      expect(html).not.toContain('<script>alert("xss")</script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('Markdown report content', () => {
    it('should include statistics in Markdown report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: user@business.co.uk, Phone: 07700900123';
      const result = detector.detect(text);

      const md = detector.generateReport(result, {
        format: 'markdown',
        includeStatistics: true
      });

      expect(md).toContain('## Summary Statistics');
      expect(md).toContain('Total PII Detected');
      expect(md).toContain('| Metric | Value |');
    });

    it('should include detection breakdown in Markdown', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: user@business.co.uk, Phone: 07700900123';
      const result = detector.detect(text);

      const md = detector.generateReport(result, {
        format: 'markdown'
      });

      expect(md).toContain('### Detection Breakdown');
      expect(md).toContain('| PII Type | Count | Percentage |');
    });

    it('should include redacted text in code blocks', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Contact: admin@business.co.uk';
      const result = detector.detect(text);

      const md = detector.generateReport(result, {
        format: 'markdown',
        includeRedactedText: true
      });

      expect(md).toContain('## Redacted Text');
      expect(md).toContain('```');
      expect(md).toContain('[EMAIL_');
    });

    it('should include warning for original text', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Secret: admin@business.co.uk';
      const result = detector.detect(text);

      const md = detector.generateReport(result, {
        format: 'markdown',
        includeOriginalText: true
      });

      expect(md).toContain('⚠️ **WARNING:**');
      expect(md).toContain('admin@business.co.uk');
    });

    it('should include metadata in Markdown report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: test@business.co.uk';
      const result = detector.detect(text);

      const md = detector.generateReport(result, {
        format: 'markdown',
        organizationName: 'Test Org',
        metadata: {
          'Environment': 'Production',
          'Scan ID': 'ABC123'
        }
      });

      expect(md).toContain('Test Org');
      expect(md).toContain('Environment');
      expect(md).toContain('Production');
      expect(md).toContain('Scan ID');
    });
  });

  describe('Report types', () => {
    it('should generate summary report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: user@business.co.uk';
      const result = detector.detect(text);

      const report = detector.generateReport(result, {
        format: 'markdown',
        type: 'summary'
      });

      expect(report).toContain('Report Type: SUMMARY');
    });

    it('should generate detailed report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: user@business.co.uk';
      const result = detector.detect(text);

      const report = detector.generateReport(result, {
        format: 'markdown',
        type: 'detailed'
      });

      expect(report).toContain('Report Type: DETAILED');
    });

    it('should generate compliance report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: user@business.co.uk';
      const result = detector.detect(text);

      const report = detector.generateReport(result, {
        format: 'markdown',
        type: 'compliance',
        organizationName: 'Compliance Corp'
      });

      expect(report).toContain('Report Type: COMPLIANCE');
      expect(report).toContain('Compliance Corp');
    });
  });

  describe('Statistics calculations', () => {
    it('should calculate correct statistics', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = `
        Email: user1@business.co.uk
        Email: user2@business.co.uk
        Phone: 07700900123
        Card: 4532015112830366
      `;
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        includeStatistics: true
      });

      // Should show 4 total detections
      expect(html).toContain('PII Detected');
      // Should show unique types (EMAIL, PHONE, CREDIT_CARD)
      expect(html).toContain('Unique Types');
    });

    it('should show type breakdown', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = `
        Email: user1@business.co.uk
        Email: user2@business.co.uk
        Phone: 07700900123
      `;
      const result = detector.detect(text);

      const md = detector.generateReport(result, {
        format: 'markdown'
      });

      expect(md).toContain('Detection Breakdown');
      expect(md).toContain('EMAIL');
      expect(md).toContain('PHONE');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty detection results', () => {
      const detector = new OpenRedaction();
      const text = 'This text has no PII';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html'
      });

      expect(html).toContain('0');
      expect(html).toContain('PII Detected');
    });

    it('should handle very long text', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const longText = 'a'.repeat(10000) + ' Email: test@business.co.uk ' + 'b'.repeat(10000);
      const result = detector.detect(longText);

      const report = detector.generateReport(result, {
        format: 'markdown',
        includeRedactedText: true
      });

      expect(report).toBeDefined();
      expect(report.length).toBeGreaterThan(100);
    });

    it('should handle special characters in metadata', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Email: test@business.co.uk';
      const result = detector.detect(text);

      const html = detector.generateReport(result, {
        format: 'html',
        metadata: {
          'Test & Special': 'Value <with> "quotes"'
        }
      });

      expect(html).toContain('&amp;');
      expect(html).toContain('&lt;');
      expect(html).toContain('&quot;');
    });
  });

  describe('Real-world scenarios', () => {
    it('should generate compliance audit report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = `
        Customer Support Ticket #12345

        Customer Name: John Smith
        Email: john.smith@customer.com
        Phone: +44 7700 900123
        Credit Card: 4532 0151 1283 0366

        Issue: Unable to process payment
      `;

      const result = detector.detect(text);

      const report = detector.generateReport(result, {
        format: 'html',
        type: 'compliance',
        title: 'GDPR Compliance Audit',
        organizationName: 'Acme Support Ltd',
        metadata: {
          'Audit Date': '2024-01-15',
          'Auditor': 'Security Team',
          'Ticket ID': '#12345'
        },
        includeRedactedText: true,
        includeDetectionDetails: false, // Privacy-safe - don't show actual values
        includeOriginalText: false // Privacy-safe
      });

      expect(report).toContain('GDPR Compliance Audit');
      expect(report).toContain('Acme Support Ltd');
      expect(report).toContain('Security Team');
      expect(report).toContain('[EMAIL_');
      // Should not contain sensitive data
      expect(report).not.toContain('john.smith@customer.com');
      expect(report).not.toContain('4532 0151 1283 0366');
    });

    it('should generate development debug report', () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const text = 'Dev test: test@example.com, Real: admin@business.co.uk';
      const result = detector.detect(text);

      const report = detector.generateReport(result, {
        format: 'markdown',
        type: 'detailed',
        title: 'Development Debug Report',
        includeDetectionDetails: true,
        includeStatistics: true,
        includeOriginalText: true // OK for dev
      });

      expect(report).toContain('Development Debug Report');
      expect(report).toContain('## Detection Details');
      expect(report).toBeDefined();
    });
  });
});
