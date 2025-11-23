import { OpenRedaction } from '../detector';
import { ConfigLoader } from '../config/ConfigLoader';
import * as fs from 'fs';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
OpenRedaction CLI - Detect and redact PII from text

Usage:
  openredaction detect <text>              Detect and redact PII
  openredaction scan <text>                Scan for PII and show severity breakdown
  openredaction feedback <type> <text>     Record feedback (false-positive, false-negative)
  openredaction stats                      Show learning statistics
  openredaction export                     Export learned patterns
  openredaction import <file>              Import learned patterns from file
  openredaction init                       Create default config file
  openredaction --help                     Show this help message

Detection Options:
  --preset <name>                       Use compliance preset (gdpr, hipaa, ccpa)
  --patterns <types>                    Comma-separated list of pattern types to use
  --no-names                            Exclude name detection
  --no-emails                           Exclude email detection
  --no-phones                           Exclude phone detection
  --no-addresses                        Exclude address detection
  --json                                Output as JSON

Feedback Options:
  --type <pattern-type>                 Pattern type (EMAIL, SSN, etc.)
  --context <text>                      Surrounding context

Examples:
  openredaction detect "Email john@example.com"
  openredaction detect "SSN: 123-45-6789" --preset hipaa
  openredaction scan "Contact john@example.com or call 555-123-4567"
  openredaction feedback false-positive "API" --type NAME --context "Call the API"
  openredaction stats
  openredaction export > learned-patterns.json
  openredaction init
  `);
}

async function main() {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];

  // Handle commands that don't need text
  if (command === 'init') {
    ConfigLoader.createDefaultConfig();
    return;
  }

  if (command === 'stats') {
    const redactor = new OpenRedaction();
    const stats = redactor.getLearningStats();

    if (!stats) {
      console.log('No learning data available yet.');
      return;
    }

    console.log('\n=== Learning Statistics ===\n');
    console.log(`Total Detections:   ${stats.totalDetections}`);
    console.log(`False Positives:    ${stats.falsePositives}`);
    console.log(`False Negatives:    ${stats.falseNegatives}`);
    console.log(`Accuracy:           ${(stats.accuracy * 100).toFixed(2)}%`);
    console.log(`Last Updated:       ${new Date(stats.lastUpdated).toLocaleString()}\n`);

    const whitelist = redactor.getLearnedWhitelist();
    if (whitelist.length > 0) {
      console.log(`Learned Whitelist (${whitelist.length} entries):`);
      whitelist.slice(0, 10).forEach(entry => {
        console.log(`  - "${entry.pattern}" (confidence: ${(entry.confidence * 100).toFixed(0)}%, occurrences: ${entry.occurrences})`);
      });
      if (whitelist.length > 10) {
        console.log(`  ... and ${whitelist.length - 10} more`);
      }
    }

    return;
  }

  if (command === 'export') {
    const redactor = new OpenRedaction();
    const learnings = redactor.exportLearnings({ minConfidence: 0.7 });

    if (!learnings) {
      console.error('No learning data to export');
      process.exit(1);
    }

    console.log(JSON.stringify(learnings, null, 2));
    return;
  }

  if (command === 'import') {
    const filePath = args[1];
    if (!filePath) {
      console.error('Error: No file path provided');
      console.log('Usage: openredact import <file>');
      process.exit(1);
    }

    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${filePath}`);
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const redactor = new OpenRedaction();
    redactor.importLearnings(data, true);

    console.log(`Successfully imported learnings from ${filePath}`);
    return;
  }

  if (!['detect', 'scan', 'feedback'].includes(command)) {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  }

  const text = args[1];
  if (!text) {
    console.error('Error: No text provided');
    printHelp();
    process.exit(1);
  }

  // Parse options
  const options: any = {};
  const jsonOutput = args.includes('--json');

  for (let i = 2; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--preset' && args[i + 1]) {
      options.preset = args[i + 1];
      i++;
    } else if (arg === '--patterns' && args[i + 1]) {
      options.patterns = args[i + 1].split(',');
      i++;
    } else if (arg === '--no-names') {
      options.includeNames = false;
    } else if (arg === '--no-emails') {
      options.includeEmails = false;
    } else if (arg === '--no-phones') {
      options.includePhones = false;
    } else if (arg === '--no-addresses') {
      options.includeAddresses = false;
    }
  }

  const shield = new OpenRedaction(options);

  if (command === 'feedback') {
    const feedbackType = text; // false-positive or false-negative
    const feedbackText = args[2];

    if (!feedbackText) {
      console.error('Error: No feedback text provided');
      console.log('Usage: openredact feedback <false-positive|false-negative> <text> [--type TYPE] [--context CONTEXT]');
      process.exit(1);
    }

    if (!['false-positive', 'false-negative'].includes(feedbackType)) {
      console.error('Error: Feedback type must be "false-positive" or "false-negative"');
      process.exit(1);
    }

    // Parse feedback options
    let patternType = 'UNKNOWN';
    let context = '';

    for (let i = 3; i < args.length; i++) {
      if (args[i] === '--type' && args[i + 1]) {
        patternType = args[i + 1];
        i++;
      } else if (args[i] === '--context' && args[i + 1]) {
        context = args[i + 1];
        i++;
      }
    }

    if (feedbackType === 'false-positive') {
      shield.recordFalsePositive(
        { type: patternType, value: feedbackText, placeholder: '', position: [0, 0], severity: 'medium' },
        context
      );
      console.log(`\nRecorded false positive: "${feedbackText}" (${patternType})`);

      const confidence = shield.getLearningStore()?.getConfidence(feedbackText) || 0;
      console.log(`Current confidence: ${(confidence * 100).toFixed(0)}%`);

      if (confidence >= 0.85) {
        console.log('✓ Auto-added to whitelist (confidence >= 85%)');
      } else {
        console.log(`  Need ${Math.ceil((0.85 - confidence) * 20)} more occurrence(s) for auto-whitelist`);
      }
    } else {
      shield.recordFalseNegative(feedbackText, patternType, context);
      console.log(`\nRecorded false negative: "${feedbackText}" (expected type: ${patternType})`);
      console.log('This will be considered for pattern adjustments.');
    }

    return;
  }

  if (command === 'detect') {
    const result = shield.detect(text);

    if (jsonOutput) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log('\n=== PII Detection Results ===\n');
      console.log(`Original:  ${result.original}`);
      console.log(`Redacted:  ${result.redacted}\n`);

      if (result.detections.length === 0) {
        console.log('No PII detected.');
      } else {
        console.log(`Found ${result.detections.length} PII instance(s):\n`);
        result.detections.forEach((detection, i) => {
          console.log(`${i + 1}. ${detection.type} (${detection.severity})`);
          console.log(`   Value: ${detection.value}`);
          console.log(`   Placeholder: ${detection.placeholder}`);
          console.log(`   Position: [${detection.position[0]}, ${detection.position[1]}]\n`);
        });
      }

      if (result.stats) {
        console.log(`Processing time: ${result.stats.processingTime}ms`);
      }
    }
  } else if (command === 'scan') {
    const scan = shield.scan(text);

    if (jsonOutput) {
      console.log(JSON.stringify(scan, null, 2));
    } else {
      console.log('\n=== PII Scan Results ===\n');
      console.log(`Total PII found: ${scan.total}\n`);
      console.log(`High severity:   ${scan.high.length}`);
      scan.high.forEach(d => console.log(`  - ${d.type}: ${d.value}`));

      console.log(`\nMedium severity: ${scan.medium.length}`);
      scan.medium.forEach(d => console.log(`  - ${d.type}: ${d.value}`));

      console.log(`\nLow severity:    ${scan.low.length}`);
      scan.low.forEach(d => console.log(`  - ${d.type}: ${d.value}`));
    }
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
