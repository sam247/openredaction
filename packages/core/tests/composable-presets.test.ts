/**
 * Composable Presets Tests
 * Tests the new composable preset system that allows combining multiple presets
 */

import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Composable Presets', () => {
  it('should combine personal and financial presets', () => {
    const detector = new OpenRedaction({
      presets: ['personal', 'financial']
    });

    const text = 'Email john@example.com, card 4111111111111111';
    const result = detector.detect(text);

    // Should detect both email (personal) and credit card (financial)
    expect(result.detections.length).toBeGreaterThanOrEqual(2);

    const types = result.detections.map(d => d.type);
    expect(types).toContain('EMAIL');
    expect(types).toContain('CREDIT_CARD');
  });

  it('should combine gdpr, financial, and personal presets', () => {
    const detector = new OpenRedaction({
      presets: ['gdpr', 'financial', 'personal']
    });

    const text = 'Contact: john@example.com, Card: 4111111111111111, IP: 8.8.8.8';
    const result = detector.detect(text);

    // Should detect email, credit card, and IP address
    expect(result.detections.length).toBeGreaterThanOrEqual(3);

    const types = result.detections.map(d => d.type);
    expect(types).toContain('EMAIL');
    expect(types).toContain('CREDIT_CARD');
    expect(types).toContain('IPV4');
  });

  it('should combine tech and personal presets', () => {
    const detector = new OpenRedaction({
      presets: ['tech', 'personal']
    });

    const text = 'Contact: john@example.com, IP: 8.8.8.8, Bearer: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
    const result = detector.detect(text);

    // Should detect email, IP, and JWT/bearer token
    expect(result.detections.length).toBeGreaterThanOrEqual(2);

    const types = result.detections.map(d => d.type);
    expect(types).toContain('EMAIL');
    expect(types).toContain('IPV4');
  });

  it('should maintain backward compatibility with single preset', () => {
    const detector = new OpenRedaction({
      preset: 'gdpr'
    });

    const text = 'Email: john@example.com';
    const result = detector.detect(text);

    expect(result.detections.length).toBeGreaterThanOrEqual(1);
    expect(result.detections[0].type).toBe('EMAIL');
  });

  it('should handle empty presets array', () => {
    const detector = new OpenRedaction({
      presets: []
    });

    // Should fall back to default patterns
    const text = 'Email: john@example.com';
    const result = detector.detect(text);

    expect(result.detections.length).toBeGreaterThanOrEqual(1);
  });

  it('should prioritize presets over single preset', () => {
    const detector = new OpenRedaction({
      preset: 'gdpr',
      presets: ['personal', 'financial']
    });

    // Should use presets array (personal + financial) not single preset (gdpr)
    const text = 'Card: 4111111111111111';
    const result = detector.detect(text);

    // Should detect credit card from financial preset
    expect(result.detections.length).toBeGreaterThanOrEqual(1);
    expect(result.detections[0].type).toBe('CREDIT_CARD');
  });

  it('should handle healthcare preset', () => {
    const detector = new OpenRedaction({
      presets: ['healthcare', 'personal']
    });

    const text = 'Patient ID: MRN-123456, Email: patient@example.com';
    const result = detector.detect(text);

    // Should detect patient ID and email
    const types = result.detections.map(d => d.type);
    expect(types).toContain('EMAIL');
  });

  it('should deduplicate patterns from multiple presets', () => {
    // Both personal and gdpr include EMAIL
    const detector = new OpenRedaction({
      presets: ['personal', 'gdpr']
    });

    const text = 'Email: john@example.com';
    const result = detector.detect(text);

    // Should only detect email once, not twice
    const emailDetections = result.detections.filter(d => d.type === 'EMAIL');
    expect(emailDetections.length).toBe(1);
  });
});
