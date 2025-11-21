import { PIIShield } from '../detector';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
PII Shield CLI - Detect and redact PII from text

Usage:
  pii-shield detect <text>     Detect and redact PII
  pii-shield scan <text>        Scan for PII and show severity breakdown
  pii-shield --help             Show this help message

Options:
  --preset <name>               Use compliance preset (gdpr, hipaa, ccpa)
  --patterns <types>            Comma-separated list of pattern types to use
  --no-names                    Exclude name detection
  --no-emails                   Exclude email detection
  --no-phones                   Exclude phone detection
  --no-addresses                Exclude address detection
  --json                        Output as JSON

Examples:
  pii-shield detect "Email john@example.com"
  pii-shield detect "SSN: 123-45-6789" --preset hipaa
  pii-shield scan "Contact john@example.com or call 555-123-4567"
  pii-shield detect "Card: 4532015112830366" --json
  `);
}

function main() {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];
  if (!['detect', 'scan'].includes(command)) {
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

  const shield = new PIIShield(options);

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

main();
