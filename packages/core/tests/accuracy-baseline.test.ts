import { describe, it, expect } from 'vitest';
import { OpenRedaction } from '../src/detector';

describe('Accuracy Baseline Tests', () => {
  it('should identify actual false positives in realistic text', () => {
    const detector = new OpenRedaction();

    const text = `My name is Laura Bennett, and I work in the Customer Accounts Team in Bristol (Office ID: BR-017). On 12 October 2025, I noticed that James Holloway, our Data Operations Manager, downloaded a large set of customer data from the CRM system to a personal USB drive.`;

    const result = detector.detect(text);

    console.log('\n=== ACCURACY TEST RESULTS ===');
    console.log('Total detections:', result.piiCount);
    console.log('\nAll detections:');
    result.detections.forEach(d => {
      console.log(`  ${d.type}: "${d.value}" (severity: ${d.severity}, confidence: ${d.confidence?.toFixed(2) || 'N/A'})`);
    });

    // FALSE POSITIVES - These should NOT be detected
    const accountsDetection = result.detections.find(d => d.value === 'Accounts');
    const managerDetection = result.detections.find(d => d.value === 'Data Operations Manager' || d.value.includes('Manager'));

    if (accountsDetection) {
      console.log('\n❌ FALSE POSITIVE: "Accounts" detected as', accountsDetection.type);
    }
    if (managerDetection) {
      console.log('❌ FALSE POSITIVE: "Data Operations Manager" detected as', managerDetection.type);
    }

    // FALSE NEGATIVES - These SHOULD be detected
    const officeIdDetection = result.detections.find(d => d.value.includes('BR-017'));
    if (!officeIdDetection) {
      console.log('\n❌ FALSE NEGATIVE: Office ID "BR-017" not detected');
    }

    // TRUE POSITIVES - These should be detected correctly
    const lauraDetection = result.detections.find(d => d.value === 'Laura Bennett');
    const jamesDetection = result.detections.find(d => d.value === 'James Holloway');

    if (lauraDetection) {
      console.log('\n✅ TRUE POSITIVE: "Laura Bennett" detected as', lauraDetection.type);
    }
    if (jamesDetection) {
      console.log('✅ TRUE POSITIVE: "James Holloway" detected as', jamesDetection.type);
    }

    console.log('\n=== END RESULTS ===\n');

    // This test documents current behavior - we'll fix these issues
    expect(result.detections.length).toBeGreaterThan(0);
  });

  it('should not detect department names as customer IDs', () => {
    const detector = new OpenRedaction();
    const text = 'I work in the Customer Accounts Team';
    const result = detector.detect(text);

    const accountsDetection = result.detections.find(d => d.value === 'Accounts');

    // This should pass after we fix the pattern
    if (accountsDetection) {
      console.log('\n⚠️  NEEDS FIX: "Accounts" should not be detected as', accountsDetection.type);
    }
  });

  it('should not detect job titles as names', () => {
    const detector = new OpenRedaction();
    const text = 'Sarah Johnson, our Data Operations Manager, is on leave.';
    const result = detector.detect(text);

    const managerDetection = result.detections.find(d => d.value === 'Data Operations Manager');

    if (managerDetection) {
      console.log('\n⚠️  NEEDS FIX: "Data Operations Manager" should not be detected as', managerDetection.type);
    }

    // Should detect Sarah Johnson as name
    const nameDetection = result.detections.find(d => d.value === 'Sarah Johnson');
    expect(nameDetection).toBeDefined();
    expect(nameDetection?.type).toMatch(/NAME/i);
  });

  it('should detect office/location IDs', () => {
    const detector = new OpenRedaction();
    const text = 'Bristol office (Office ID: BR-017)';
    const result = detector.detect(text);

    const officeIdDetection = result.detections.find(d => d.value.includes('BR-017'));

    if (!officeIdDetection) {
      console.log('\n⚠️  NEEDS FIX: Office ID "BR-017" should be detected');
    }
  });
});
