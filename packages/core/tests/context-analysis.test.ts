/**
 * Tests for Context Analysis functionality
 */

import { describe, it, expect } from 'vitest';
import {
  extractContext,
  inferDocumentType,
  analyzeContextFeatures,
  calculateContextConfidence,
  analyzeFullContext
} from '../src/context/ContextAnalyzer';
import { OpenRedaction } from '../src/detector';

describe('Context Analysis', () => {
  describe('extractContext', () => {
    it('should extract words before and after detection', () => {
      const text = 'Please contact John Doe at john@example.com for more information';
      const startPos = text.indexOf('john@example.com');
      const endPos = startPos + 'john@example.com'.length;

      const context = extractContext(text, startPos, endPos, 5, 5);

      expect(context.beforeWords).toHaveLength(5);
      expect(context.beforeWords).toContain('contact');
      expect(context.beforeWords).toContain('at');
      expect(context.afterWords).toHaveLength(3); // only 3 words after
      expect(context.afterWords).toContain('for');
      expect(context.afterWords).toContain('more');
    });

    it('should extract full sentence', () => {
      const text = 'Hello world. Contact john@example.com for info. Thank you.';
      const startPos = text.indexOf('john@example.com');
      const endPos = startPos + 'john@example.com'.length;

      const context = extractContext(text, startPos, endPos);

      expect(context.sentence).toContain('Contact');
      expect(context.sentence).toContain('john@example.com');
      expect(context.sentence).toContain('for info');
      expect(context.sentence).not.toContain('Hello world');
      expect(context.sentence).not.toContain('Thank you');
    });
  });

  describe('inferDocumentType', () => {
    it('should identify email documents', () => {
      const emailText = 'From: john@example.com\nTo: jane@example.com\nSubject: Meeting\n\nDear Jane,';
      expect(inferDocumentType(emailText)).toBe('email');
    });

    it('should identify code documents', () => {
      const codeText = 'function getData() {\n  const result = await fetch();\n  return result;\n  if (x) { const y = 10; let z; }\n}';
      expect(inferDocumentType(codeText)).toBe('code');
    });

    it('should identify chat documents', () => {
      const chatText = '<user1> hello\n<user2> hi there\n[10:30] message\n[10:31] another\n>quote';
      expect(inferDocumentType(chatText)).toBe('chat');
    });

    it('should default to document type', () => {
      const plainText = 'This is a plain document with some information.';
      expect(inferDocumentType(plainText)).toBe('document');
    });
  });

  describe('analyzeContextFeatures', () => {
    it('should detect technical context', () => {
      const context = 'API endpoint at https://api.server.com returns JSON data';
      const features = analyzeContextFeatures(context);

      expect(features.hasTechnicalContext).toBe(true);
      // Note: may also detect example context due to "example" keyword
    });

    it('should detect medical context', () => {
      const context = 'Patient John Doe visited the hospital for treatment';
      const features = analyzeContextFeatures(context);

      expect(features.hasMedicalContext).toBe(true);
      expect(features.hasBusinessContext).toBe(false);
    });

    it('should detect financial context', () => {
      const context = 'Transfer $500 from account 12345 to bank account';
      const features = analyzeContextFeatures(context);

      expect(features.hasFinancialContext).toBe(true);
      expect(features.hasMedicalContext).toBe(false);
    });

    it('should detect business context', () => {
      const context = 'Company CEO John Smith leads the team at Corporation Inc';
      const features = analyzeContextFeatures(context);

      expect(features.hasBusinessContext).toBe(true);
      expect(features.hasTechnicalContext).toBe(false);
    });

    it('should detect example/test context', () => {
      const context = 'This is a sample test with dummy data';
      const features = analyzeContextFeatures(context);

      expect(features.hasExampleContext).toBe(true);
    });
  });

  describe('calculateContextConfidence', () => {
    it('should reduce confidence for code context', () => {
      const confidence = calculateContextConfidence('john@example.com', 'EMAIL', {
        before: 'const email =',
        after: ';',
        sentence: 'const email = john@example.com;',
        documentType: 'code',
        features: {
          hasTechnicalContext: true,
          hasBusinessContext: false,
          hasMedicalContext: false,
          hasFinancialContext: false,
          hasExampleContext: false,
          relativePosition: 0.5
        }
      });

      expect(confidence).toBeLessThan(0.7); // Below base confidence
    });

    it('should boost confidence for medical patterns in medical context', () => {
      const confidence = calculateContextConfidence('MRN-12345', 'MEDICAL_RECORD', {
        before: 'Patient',
        after: 'requires',
        sentence: 'Patient MRN-12345 requires treatment',
        documentType: 'document',
        features: {
          hasTechnicalContext: false,
          hasBusinessContext: false,
          hasMedicalContext: true,
          hasFinancialContext: false,
          hasExampleContext: false,
          relativePosition: 0.3
        }
      });

      expect(confidence).toBeGreaterThanOrEqual(0.7); // At or above base confidence
    });

    it('should penalize example context', () => {
      const confidence = calculateContextConfidence('test@example.com', 'EMAIL', {
        before: 'sample',
        after: 'dummy',
        sentence: 'sample test@example.com dummy',
        documentType: 'document',
        features: {
          hasTechnicalContext: false,
          hasBusinessContext: false,
          hasMedicalContext: false,
          hasFinancialContext: false,
          hasExampleContext: true,
          relativePosition: 0.5
        }
      });

      expect(confidence).toBeLessThan(0.7); // Reduced (0.8 - 0.15 = 0.65)
      expect(confidence).toBeGreaterThan(0.6);
    });

    it('should boost confidence for positive indicators', () => {
      const confidence = calculateContextConfidence('John Smith', 'NAME', {
        before: 'Dear',
        after: 'wrote',
        sentence: 'Dear John Smith wrote',
        documentType: 'email',
        features: {
          hasTechnicalContext: false,
          hasBusinessContext: false,
          hasMedicalContext: false,
          hasFinancialContext: false,
          hasExampleContext: false,
          relativePosition: 0.1
        }
      });

      expect(confidence).toBeGreaterThan(0.7);
    });
  });

  describe('analyzeFullContext', () => {
    it('should perform complete context analysis', () => {
      const text = 'Dear John, please call me at 555-1234 for more details.';
      const value = '555-1234';
      const startPos = text.indexOf(value);
      const endPos = startPos + value.length;

      const analysis = analyzeFullContext(text, value, 'PHONE', startPos, endPos);

      expect(analysis.beforeWords).toContain('at');
      expect(analysis.afterWords).toContain('for');
      expect(analysis.sentence).toContain(value);
      expect(analysis.documentType).toBe('document');
      expect(analysis.confidence).toBeGreaterThan(0);
      expect(analysis.confidence).toBeLessThanOrEqual(1);
    });
  });

  describe('Integration with OpenRedact', () => {
    it('should work when context analysis is enabled (default)', () => {
      const redactor = new OpenRedaction();
      const result = redactor.detect('Contact john@example.com for info');

      expect(result.detections).toHaveLength(1);
      expect(result.detections[0].type).toBe('EMAIL');
      expect(result.detections[0].confidence).toBeDefined();
      expect(result.detections[0].confidence).toBeGreaterThan(0.5); // Context-aware confidence
      expect(result.detections[0].confidence).toBeLessThanOrEqual(1.0);
    });

    it('should work when context analysis is disabled', () => {
      const redactor = new OpenRedaction({ enableContextAnalysis: false });
      const result = redactor.detect('Contact john@example.com for info');

      expect(result.detections).toHaveLength(1);
      expect(result.detections[0].type).toBe('EMAIL');
      expect(result.detections[0].confidence).toBeDefined();
      expect(result.detections[0].confidence).toBe(1.0); // Default when disabled
    });

    it('should filter low-confidence detections when enabled', () => {
      const redactor = new OpenRedaction({
        enableContextAnalysis: true,
        confidenceThreshold: 0.8
      });

      // This should be filtered due to "example" in context
      const result = redactor.detect('This is a sample test with test@example.com dummy data');

      // May or may not detect depending on confidence
      if (result.detections.length > 0) {
        expect(result.detections[0].confidence).toBeGreaterThanOrEqual(0.8);
      }
    });

    it('should include confidence scores when enabled', () => {
      const redactor = new OpenRedaction({
        enableContextAnalysis: true,
        confidenceThreshold: 0.3
      });

      const result = redactor.detect('Contact john@example.com for information');

      if (result.detections.length > 0) {
        expect(result.detections[0].confidence).toBeGreaterThan(0);
        expect(result.detections[0].confidence).toBeLessThanOrEqual(1);
      }
    });

    it('should pass high-confidence detections', () => {
      const redactor = new OpenRedaction({
        enableContextAnalysis: true,
        confidenceThreshold: 0.5
      });

      const result = redactor.detect('Dear Mr. Smith, please call me at 020-1234-5678');

      expect(result.detections.length).toBeGreaterThan(0);
      result.detections.forEach(detection => {
        expect(detection.confidence).toBeGreaterThanOrEqual(0.5);
      });
    });
  });
});
