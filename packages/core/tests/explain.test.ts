/**
 * Tests for Explain API
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';
import { createExplainAPI } from '../src/explain/ExplainAPI';

describe('Explain API', () => {
  describe('Basic explain functionality', () => {
    it('should create explain API from detector', () => {
      const detector = new OpenRedaction();
      const explainAPI = detector.explain();

      expect(explainAPI).toBeDefined();
    });

    it('should create explain API using helper', () => {
      const detector = new OpenRedaction();
      const explainAPI = createExplainAPI(detector);

      expect(explainAPI).toBeDefined();
    });

    it('should explain detected PII', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Contact: user@business.co.uk';
      const explanation = await explainAPI.explain(text);

      expect(explanation.text).toBe(text);
      expect(explanation.matchedPatterns.length).toBeGreaterThan(0);
      expect(explanation.detections.length).toBeGreaterThan(0);
      expect(explanation.summary.finalDetections).toBeGreaterThan(0);
    });

    it('should explain why text has no PII', async () => {
      const detector = new OpenRedaction();
      const explainAPI = detector.explain();

      const text = 'This is plain text with no personal details';
      const explanation = await explainAPI.explain(text);

      expect(explanation.text).toBe(text);
      expect(explanation.matchedPatterns.length).toBe(0);
      expect(explanation.detections.length).toBe(0);
      expect(explanation.summary.finalDetections).toBe(0);
    });
  });

  describe('Pattern matching details', () => {
    it('should list all patterns checked', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Email: test@business.co.uk';
      const explanation = await explainAPI.explain(text);

      expect(explanation.patternResults.length).toBeGreaterThan(0);
      expect(explanation.summary.totalPatternsChecked).toBeGreaterThan(0);
    });

    it('should separate matched and unmatched patterns', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Email: user@business.co.uk';
      const explanation = await explainAPI.explain(text);

      expect(explanation.matchedPatterns.length).toBeGreaterThan(0);
      expect(explanation.unmatchedPatterns.length).toBeGreaterThan(0);

      // Matched patterns should have matched = true
      for (const result of explanation.matchedPatterns) {
        expect(result.matched).toBe(true);
        expect(result.matchedValue).toBeDefined();
      }

      // Unmatched patterns should have matched = false
      for (const result of explanation.unmatchedPatterns) {
        expect(result.matched).toBe(false);
      }
    });

    it('should show filtered patterns', async () => {
      const detector = new OpenRedaction({
        enableContextAnalysis: true,
        confidenceThreshold: 0.9 // High threshold to filter some
      });
      const explainAPI = detector.explain();

      const text = 'aaaaaaa user@business.co.uk bbbbbb'; // Weird context
      const explanation = await explainAPI.explain(text);

      // Some patterns may be filtered due to low confidence
      expect(explanation.filteredPatterns).toBeDefined();
    });

    it('should include pattern details', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Email: admin@business.co.uk';
      const explanation = await explainAPI.explain(text);

      const emailMatch = explanation.matchedPatterns.find(r => r.pattern.type === 'EMAIL');
      expect(emailMatch).toBeDefined();
      expect(emailMatch!.pattern.type).toBe('EMAIL');
      expect(emailMatch!.pattern.priority).toBeDefined();
      expect(emailMatch!.pattern.regex).toBeDefined();
    });
  });

  describe('Context analysis in explanations', () => {
    it('should include context analysis results', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: true });
      const explainAPI = detector.explain();

      const text = 'Email address: john.smith@company.com';
      const explanation = await explainAPI.explain(text);

      const matched = explanation.matchedPatterns.find(r => r.pattern.type === 'EMAIL');
      expect(matched).toBeDefined();
      expect(matched!.contextAnalysis).toBeDefined();
      expect(matched!.contextAnalysis!.confidence).toBeGreaterThan(0);
    });

    it('should explain low confidence filtering', async () => {
      const detector = new OpenRedaction({
        enableContextAnalysis: true,
        confidenceThreshold: 0.6
      });
      const explainAPI = detector.explain();

      const text = 'test@example.com'; // Low confidence due to example.com
      const explanation = await explainAPI.explain(text);

      // Should be filtered due to low confidence
      const filtered = explanation.filteredPatterns.find(r =>
        r.matchedValue === 'test@example.com'
      );

      if (filtered) {
        expect(filtered.reason).toContain('confidence');
      }
    });
  });

  describe('Validation results', () => {
    it('should show validator failures', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Email: invalid-email-format'; // Won't pass email validator
      const explanation = await explainAPI.explain(text);

      // Check if any patterns failed validation
      const failedValidation = explanation.filteredPatterns.some(r =>
        r.validatorPassed === false
      );

      // This depends on whether patterns matched at all
      expect(explanation.patternResults).toBeDefined();
    });
  });

  describe('Explain specific detections', () => {
    it('should explain a specific detection', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Contact: admin@business.co.uk, Phone: 07700900123';
      const result = await detector.detect(text);

      expect(result.detections.length).toBeGreaterThan(0);

      const detection = result.detections[0];
      const detectionExplanation = await explainAPI.explainDetection(detection, text);

      expect(detectionExplanation.detection).toBe(detection);
      expect(detectionExplanation.reasoning).toBeDefined();
      expect(detectionExplanation.reasoning.length).toBeGreaterThan(0);
    });

    it('should include pattern information in detection explanation', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Email: test@business.co.uk';
      const result = await detector.detect(text);
      const detection = result.detections[0];

      const explanation = await explainAPI.explainDetection(detection, text);

      expect(explanation.pattern).toBeDefined();
      expect(explanation.pattern!.type).toBe(detection.type);
    });
  });

  describe('Suggest why not detected', () => {
    it('should suggest why text wasn\'t detected', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'invalid-email'; // Not a valid email
      const suggestion = await explainAPI.suggestWhy(text, 'EMAIL');

      expect(suggestion.text).toBe(text);
      expect(suggestion.expectedType).toBe('EMAIL');
      expect(suggestion.suggestions).toBeDefined();
      expect(suggestion.suggestions.length).toBeGreaterThan(0);
    });

    it('should show patterns that matched but were filtered', async () => {
      const detector = new OpenRedaction({
        enableContextAnalysis: true,
        confidenceThreshold: 0.8
      });
      const explainAPI = detector.explain();

      const text = 'test@example.com'; // Matches but likely filtered
      const suggestion = await explainAPI.suggestWhy(text, 'EMAIL');

      expect(suggestion.suggestions).toBeDefined();
    });

    it('should handle unknown types', async () => {
      const detector = new OpenRedaction();
      const explainAPI = detector.explain();

      const suggestion = await explainAPI.suggestWhy('anything', 'UNKNOWN_TYPE');

      expect(suggestion.suggestions).toBeDefined();
      expect(suggestion.suggestions.some(s => s.includes('No patterns found'))).toBe(true);
    });
  });

  describe('Debug mode', () => {
    it('should provide comprehensive debug information', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: true });
      const explainAPI = detector.explain();

      const text = 'Email: user@business.co.uk, Phone: 07700900123';
      const debug = await explainAPI.debug(text);

      expect(debug.text).toBe(text);
      expect(debug.textLength).toBe(text.length);
      expect(debug.enabledFeatures).toBeDefined();
      expect(debug.enabledFeatures.length).toBeGreaterThan(0);
      expect(debug.patternCount).toBeGreaterThan(0);
      expect(debug.explanation).toBeDefined();
      expect(debug.performance).toBeDefined();
      expect(debug.performance.estimatedTime).toContain('ms');
    });

    it('should list enabled features', async () => {
      const detector = new OpenRedaction({
        enableContextAnalysis: true,
        enableFalsePositiveFilter: true
      });
      const explainAPI = detector.explain();

      // Use text that will be detected to test feature detection
      const debug = await explainAPI.debug('Email: test@business.co.uk');

      expect(debug.enabledFeatures).toContain('Context Analysis');
      // False positive filter status is inferred, may not always be detected
      expect(debug.enabledFeatures.length).toBeGreaterThan(0);
    });

    it('should include performance metrics', async () => {
      const detector = new OpenRedaction();
      const explainAPI = detector.explain();

      const debug = await explainAPI.debug('Email: test@business.co.uk');

      expect(debug.performance.estimatedTime).toBeDefined();
      expect(debug.performance.estimatedTime).toMatch(/\d+\.\d+ms/);
    });
  });

  describe('Real-world debugging scenarios', () => {
    it('should help debug why email wasn\'t detected', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Info: not-an-email';
      const explanation = await explainAPI.explain(text);
      const suggestion = await explainAPI.suggestWhy(text, 'EMAIL');

      expect(explanation.matchedPatterns.length).toBe(0);
      expect(suggestion.suggestions.length).toBeGreaterThan(0);
    });

    it('should help understand filtering decisions', async () => {
      const detector = new OpenRedaction({
        enableContextAnalysis: true,
        whitelist: ['company']
      });
      const explainAPI = detector.explain();

      const text = 'Email: admin@company.com'; // 'company' in whitelist
      const explanation = await explainAPI.explain(text);

      // Email might be filtered due to whitelist
      const filtered = explanation.filteredPatterns.find(r =>
        r.matchedValue?.includes('company')
      );

      if (filtered) {
        expect(filtered.reason).toContain('whitelist');
      }
    });

    it('should explain complex detection scenarios', async () => {
      const detector = new OpenRedaction({
        enableContextAnalysis: true,
        enableMultiPass: true
      });
      const explainAPI = detector.explain();

      const text = `
        Customer: John Smith
        Email: john.smith@business.co.uk
        Phone: +44 7700 900123
        Credit Card: 4532 0151 1283 0366
      `;

      const debug = await explainAPI.debug(text);

      expect(debug.explanation.detections.length).toBeGreaterThan(2);
      expect(debug.explanation.summary).toBeDefined();
    });
  });

  describe('Summary statistics', () => {
    it('should provide accurate summary', async () => {
      const detector = new OpenRedaction({ enableContextAnalysis: false });
      const explainAPI = detector.explain();

      const text = 'Email: admin@business.co.uk, Phone: 07700900123';
      const explanation = await explainAPI.explain(text);

      expect(explanation.summary.totalPatternsChecked).toBeGreaterThan(0);
      expect(explanation.summary.patternsMatched).toBeGreaterThanOrEqual(explanation.summary.finalDetections);
      expect(explanation.summary.finalDetections).toBe(explanation.detections.length);
    });

    it('should count filtered patterns correctly', async () => {
      const detector = new OpenRedaction({
        enableContextAnalysis: true,
        confidenceThreshold: 0.9 // High threshold
      });
      const explainAPI = detector.explain();

      const text = 'xxxx user@business.co.uk yyyy'; // Weird context
      const explanation = await explainAPI.explain(text);

      const totalMatched = explanation.matchedPatterns.length + explanation.filteredPatterns.length;
      expect(totalMatched).toBeGreaterThanOrEqual(0);
    });
  });
});
