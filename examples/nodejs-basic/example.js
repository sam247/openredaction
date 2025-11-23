/**
 * Basic Node.js Example
 * Demonstrates core PII detection without any framework
 */

const { OpenRedaction } = require('openredact');

// Initialize detector
const detector = new OpenRedaction({
  enableContextAnalysis: true,
  enableCache: true
});

console.log('🔍 OpenRedaction - Basic Detection Example\n');

// Example 1: Simple detection
console.log('Example 1: Simple Detection');
const text1 = 'Contact John at john.smith@company.com or call 07700 900123';
const result1 = detector.detect(text1);

console.log(`Original: ${result1.original}`);
console.log(`Redacted: ${result1.redacted}`);
console.log(`Found ${result1.detections.length} PII items:\n`);
result1.detections.forEach(d => {
  console.log(`  - ${d.type}: "${d.value}" (confidence: ${(d.confidence * 100).toFixed(1)}%)`);
});
console.log('\n---\n');

// Example 2: Batch processing
console.log('Example 2: Batch Processing');
const { createBatchProcessor } = require('openredact');
const batch = createBatchProcessor(detector);

const documents = [
  'Customer email: alice@example.com',
  'Support ticket: Call +44 7700 900456',
  'Payment: Card 4532015112830366'
];

const batchResult = batch.processSequential(documents);
console.log(`Processed ${batchResult.stats.totalDocuments} documents`);
console.log(`Found ${batchResult.stats.totalDetections} total PII items`);
console.log(`Average time: ${batchResult.stats.avgTimePerDocument.toFixed(2)}ms per document\n`);

// Example 3: Streaming large documents
console.log('Example 3: Streaming Large Documents');
const { createStreamingDetector } = require('openredact');
const streaming = createStreamingDetector(detector, {
  chunkSize: 1000,
  overlap: 100
});

const largeText = 'Contact info: admin@business.co.uk. '.repeat(100);
let chunkCount = 0;
let totalDetections = 0;

for (const chunk of streaming.processStreamSync(largeText)) {
  chunkCount++;
  totalDetections += chunk.detections.length;
}

console.log(`Processed ${chunkCount} chunks`);
console.log(`Found ${totalDetections} PII items\n`);

// Example 4: HTML Report generation
console.log('Example 4: Generating Reports');
const text4 = `
  Customer Support Ticket #12345

  Name: Sarah Johnson
  Email: sarah.j@customer.com
  Phone: +44 7700 900789

  Issue: Payment declined
`;

const result4 = detector.detect(text4);
const htmlReport = detector.generateReport(result4, {
  format: 'html',
  title: 'PII Detection Report',
  organizationName: 'Example Corp',
  includeStatistics: true,
  includeDetectionDetails: true,
  includeRedactedText: true,
  includeOriginalText: false // Privacy-safe
});

// Save report to file
const fs = require('fs');
fs.writeFileSync('pii-report.html', htmlReport);
console.log('✅ HTML report saved to pii-report.html\n');

// Example 5: Debug with explain()
console.log('Example 5: Debugging with explain()');
const explainAPI = detector.explain();
const text5 = 'Email me at test@example.com';
const explanation = explainAPI.explain(text5);

console.log(`Matched patterns: ${explanation.matchedPatterns.length}`);
console.log(`Filtered patterns: ${explanation.filteredPatterns.length}`);
console.log(`Final detections: ${explanation.detections.length}`);

if (explanation.filteredPatterns.length > 0) {
  console.log('\nFiltered out:');
  explanation.filteredPatterns.forEach(p => {
    console.log(`  - ${p.pattern.type}: ${p.reason}`);
  });
}

console.log('\n✅ All examples completed!');
