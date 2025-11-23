/**
 * Express API Example
 * Demonstrates OpenRedact middleware and route handlers
 */

const express = require('express');
const {
  OpenRedact,
  openRedactMiddleware,
  detectPII,
  generateReport
} = require('openredact');

const app = express();
app.use(express.json());

// Example 1: Global middleware with auto-redaction
app.use('/api/secure', openRedactMiddleware({
  autoRedact: true,
  enableContextAnalysis: true,
  addHeaders: true,
  onDetection: (req, result) => {
    console.log(`⚠️  PII detected in ${req.path}: ${result.detections.length} items`);
  }
}));

// Example 2: Middleware that fails on PII
app.use('/api/strict', openRedactMiddleware({
  failOnPII: true,
  fields: ['message', 'content'], // Only check specific fields
  skipRoutes: [/^\/api\/strict\/public/] // Skip certain routes
}));

// Example 3: Basic route with middleware
app.post('/api/secure/submit', (req, res) => {
  // PII is automatically redacted by middleware
  console.log('Received (redacted):', req.body);

  res.json({
    success: true,
    message: 'Data processed with PII redaction',
    piiDetected: req.pii?.detected || false,
    piiCount: req.pii?.count || 0
  });
});

// Example 4: Strict endpoint that rejects PII
app.post('/api/strict/comment', (req, res) => {
  // This will be rejected by middleware if PII is found
  res.json({
    success: true,
    message: 'Comment accepted (no PII detected)'
  });
});

// Example 5: Public endpoint (skipped by middleware)
app.post('/api/strict/public/feedback', (req, res) => {
  res.json({
    success: true,
    message: 'Public feedback received'
  });
});

// Example 6: Direct detection endpoint
app.post('/api/detect', detectPII({
  enableContextAnalysis: true
}));

// Example 7: Report generation endpoint
app.post('/api/report', generateReport({
  enableContextAnalysis: true
}));

// Example 8: Custom detection logic
app.post('/api/analyze', async (req, res) => {
  const { text, options = {} } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const detector = new OpenRedact({
    enableContextAnalysis: true,
    ...options
  });

  const result = detector.detect(text);

  // Custom response with additional metadata
  res.json({
    hasPII: result.detections.length > 0,
    count: result.detections.length,
    redacted: result.redacted,
    detections: result.detections.map(d => ({
      type: d.type,
      severity: d.severity,
      confidence: d.confidence,
      position: d.position
      // Note: Not returning actual 'value' for privacy
    })),
    stats: result.stats,
    breakdown: result.detections.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {})
  });
});

// Example 9: Batch processing endpoint
app.post('/api/batch', async (req, res) => {
  const { documents, parallel = false } = req.body;

  if (!Array.isArray(documents)) {
    return res.status(400).json({ error: 'Documents array is required' });
  }

  const { createBatchProcessor } = require('openredact');
  const detector = new OpenRedact({ enableContextAnalysis: true });
  const batch = createBatchProcessor(detector);

  const result = parallel
    ? await batch.processParallel(documents)
    : batch.processSequential(documents);

  const stats = batch.getAggregatedStats(result.results);

  res.json({
    processed: result.stats.totalDocuments,
    totalDetections: stats.totalDetections,
    byType: stats.detectionsByType,
    bySeverity: stats.detectionsBySeverity,
    avgConfidence: stats.avgConfidence,
    processingTime: result.stats.totalTime,
    avgTimePerDoc: result.stats.avgTimePerDocument
  });
});

// Example 10: Health check with PII detection status
app.get('/api/health', (req, res) => {
  const detector = new OpenRedact();
  const testResult = detector.detect('test@example.com');

  res.json({
    status: 'healthy',
    piiDetection: 'operational',
    patterns: detector.getPatterns().length,
    version: require('../../packages/core/package.json').version
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 OpenRedact Express API Example`);
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST /api/secure/submit      - Auto-redact PII`);
  console.log(`  POST /api/strict/comment     - Reject if PII found`);
  console.log(`  POST /api/detect             - Detect PII in text`);
  console.log(`  POST /api/report             - Generate PII report`);
  console.log(`  POST /api/analyze            - Custom analysis`);
  console.log(`  POST /api/batch              - Batch processing`);
  console.log(`  GET  /api/health             - Health check`);
  console.log(`\nExample request:`);
  console.log(`  curl -X POST http://localhost:${PORT}/api/detect \\`);
  console.log(`    -H "Content-Type: application/json" \\`);
  console.log(`    -d '{"text":"Contact john@example.com"}'`);
});

module.exports = app;
