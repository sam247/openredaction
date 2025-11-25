#!/usr/bin/env node
/**
 * Pattern Testing CLI Tool
 * Test custom patterns before deployment
 */

import { OpenRedaction } from '../detector.js';
import { validatePattern, isUnsafePattern } from '../utils/safe-regex.js';
import type { PIIPattern } from '../types';

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
OpenRedaction Pattern Testing Tool

Test custom patterns before deployment to prevent ReDoS vulnerabilities and validate functionality.

Usage:
  openredaction-test-pattern validate <pattern>           Validate pattern safety
  openredaction-test-pattern test <pattern> <text>        Test pattern against sample text
  openredaction-test-pattern check <pattern> [flags]      Check pattern with optional flags
  openredaction-test-pattern benchmark <pattern> <text>   Benchmark pattern performance
  openredaction-test-pattern --help                       Show this help message

Commands:
  validate <pattern>
    Checks if a regex pattern is safe (no ReDoS vulnerabilities)
    Returns: SAFE or UNSAFE with explanation

  test <pattern> <text>
    Tests a pattern against sample text and shows all matches
    Returns: List of matches with positions

  check <pattern> [flags]
    Validates pattern syntax and compiles with optional flags
    Returns: Pattern info and any warnings

  benchmark <pattern> <text>
    Measures pattern execution time and match count
    Returns: Performance metrics

Options:
  --flags <flags>         Regex flags (g, i, m, etc.)
  --timeout <ms>          Regex timeout in milliseconds (default: 100)
  --json                  Output results as JSON
  --verbose               Show detailed output

Examples:
  # Validate a pattern for ReDoS
  openredaction-test-pattern validate "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"

  # Test pattern against sample text
  openredaction-test-pattern test "\\b\\d{3}-\\d{2}-\\d{4}\\b" "SSN: 123-45-6789"

  # Check pattern with flags
  openredaction-test-pattern check "[a-z]+" --flags gi

  # Benchmark pattern performance
  openredaction-test-pattern benchmark "\\b[A-Z][a-z]+ [A-Z][a-z]+\\b" "John Smith and Jane Doe"

  # Test a custom pattern as JSON
  openredaction-test-pattern test "\\b\\d{16}\\b" "Card: 4111111111111111" --json

Safety Checks:
  ✓ Nested quantifiers (e.g., (a+)+)
  ✓ Overlapping alternation (e.g., (a|ab)+)
  ✓ Consecutive quantifiers (e.g., a*+)
  ✓ Dangerous backreferences (e.g., \\1+)
  ✓ Excessive pattern length (>5000 chars)
  ✓ Pattern compilation errors
`);
}

interface CLIOptions {
  flags?: string;
  timeout?: number;
  json?: boolean;
  verbose?: boolean;
}

function parseOptions(args: string[]): CLIOptions {
  const options: CLIOptions = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--flags' && args[i + 1]) {
      options.flags = args[i + 1];
      i++;
    } else if (args[i] === '--timeout' && args[i + 1]) {
      options.timeout = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--json') {
      options.json = true;
    } else if (args[i] === '--verbose') {
      options.verbose = true;
    }
  }

  return options;
}

function validatePatternCommand(pattern: string, options: CLIOptions) {
  const result: any = {
    pattern,
    safe: true,
    warnings: [],
    errors: []
  };

  try {
    // Check for unsafe patterns
    if (isUnsafePattern(pattern)) {
      result.safe = false;
      result.errors.push('Pattern contains potentially unsafe constructs (ReDoS risk)');

      // Identify specific issues
      if (/(\([^)]*[*+{][^)]*\)[*+{])/.test(pattern)) {
        result.warnings.push('Nested quantifiers detected: (a+)+ or (a*)*');
      }
      if (/\([^)]*\|[^)]*\)[*+{]/.test(pattern)) {
        result.warnings.push('Overlapping alternation with quantifier: (a|ab)+');
      }
      if (/[*+?{][*+?{]/.test(pattern)) {
        result.warnings.push('Consecutive quantifiers: a*+ or a+*');
      }
      if (/\\\d[*+{]/.test(pattern)) {
        result.warnings.push('Backreference with quantifier: \\1+');
      }
    }

    // Check pattern length
    if (pattern.length > 5000) {
      result.safe = false;
      result.errors.push(`Pattern too long: ${pattern.length} chars (max 5000)`);
    }

    // Validate pattern compilation
    validatePattern(pattern);

    if (result.safe) {
      result.message = '✓ Pattern is SAFE';
    }
  } catch (error) {
    result.safe = false;
    result.errors.push((error as Error).message);
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('\nPattern Validation Result:');
    console.log('─'.repeat(50));
    console.log(`Pattern: ${pattern}`);
    console.log(`Status: ${result.safe ? '✓ SAFE' : '✗ UNSAFE'}`);

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach((w: string) => console.log(`  ⚠ ${w}`));
    }

    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach((e: string) => console.log(`  ✗ ${e}`));
    }

    if (result.safe) {
      console.log('\n✓ Pattern is safe to use');
    } else {
      console.log('\n✗ Pattern is NOT safe - please revise before use');
    }
  }

  process.exit(result.safe ? 0 : 1);
}

function testPatternCommand(pattern: string, text: string, options: CLIOptions) {
  const result: any = {
    pattern,
    text,
    matches: [],
    matchCount: 0
  };

  try {
    // First validate the pattern
    validatePattern(pattern);

    // Create regex with flags
    const flags = options.flags || 'g';
    const regex = new RegExp(pattern, flags);

    // Find all matches
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      result.matches.push({
        value: match[0],
        captureGroups: match.slice(1),
        index: match.index,
        length: match[0].length
      });

      result.matchCount++;

      // Prevent infinite loops
      if (result.matchCount >= 1000) {
        result.warning = 'Stopped after 1000 matches';
        break;
      }

      // Prevent infinite loop on zero-length matches
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }

    result.success = true;
  } catch (error) {
    result.success = false;
    result.error = (error as Error).message;
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('\nPattern Test Result:');
    console.log('─'.repeat(50));
    console.log(`Pattern: ${pattern}`);
    console.log(`Flags: ${options.flags || 'g'}`);
    console.log(`Text: ${text}`);
    console.log(`Matches: ${result.matchCount}`);

    if (result.matchCount > 0) {
      console.log('\nMatches Found:');
      result.matches.forEach((m: any, i: number) => {
        console.log(`  ${i + 1}. "${m.value}" at position ${m.index}`);
        if (m.captureGroups.length > 0 && m.captureGroups.some((g: string) => g)) {
          console.log(`     Capture groups: [${m.captureGroups.join(', ')}]`);
        }
      });
    } else {
      console.log('\n⚠ No matches found');
    }

    if (result.warning) {
      console.log(`\n⚠ ${result.warning}`);
    }

    if (result.error) {
      console.log(`\n✗ Error: ${result.error}`);
    }
  }

  process.exit(result.success ? 0 : 1);
}

function checkPatternCommand(pattern: string, options: CLIOptions) {
  const result: any = {
    pattern,
    valid: false,
    info: {},
    warnings: []
  };

  try {
    // Validate pattern
    validatePattern(pattern);

    // Compile with flags
    const flags = options.flags || '';
    const regex = new RegExp(pattern, flags);

    result.valid = true;
    result.info = {
      source: regex.source,
      flags: regex.flags,
      length: pattern.length,
      hasGroups: /\([^)]*\)/.test(pattern),
      hasQuantifiers: /[*+?{]/.test(pattern),
      hasAnchors: /[\^$]/.test(pattern),
      hasLookahead: /\(\?[=!]/.test(pattern),
      hasLookbehind: /\(\?<[=!]/.test(pattern)
    };

    // Check for potential issues
    if (isUnsafePattern(pattern)) {
      result.warnings.push('Pattern may be vulnerable to ReDoS attacks');
    }

    if (pattern.length > 1000) {
      result.warnings.push('Pattern is very long, may impact performance');
    }

    if (!flags.includes('g') && /[*+{]/.test(pattern)) {
      result.warnings.push('Pattern has quantifiers but no global flag - will only match once');
    }
  } catch (error) {
    result.valid = false;
    result.error = (error as Error).message;
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('\nPattern Check Result:');
    console.log('─'.repeat(50));
    console.log(`Pattern: ${pattern}`);
    console.log(`Flags: ${options.flags || '(none)'}`);
    console.log(`Valid: ${result.valid ? '✓ Yes' : '✗ No'}`);

    if (result.valid) {
      console.log('\nPattern Info:');
      console.log(`  Length: ${result.info.length} characters`);
      console.log(`  Has capture groups: ${result.info.hasGroups ? 'Yes' : 'No'}`);
      console.log(`  Has quantifiers: ${result.info.hasQuantifiers ? 'Yes' : 'No'}`);
      console.log(`  Has anchors (^/$): ${result.info.hasAnchors ? 'Yes' : 'No'}`);
      console.log(`  Has lookahead: ${result.info.hasLookahead ? 'Yes' : 'No'}`);
      console.log(`  Has lookbehind: ${result.info.hasLookbehind ? 'Yes' : 'No'}`);
    }

    if (result.warnings.length > 0) {
      console.log('\nWarnings:');
      result.warnings.forEach((w: string) => console.log(`  ⚠ ${w}`));
    }

    if (result.error) {
      console.log(`\n✗ Error: ${result.error}`);
    }
  }

  process.exit(result.valid ? 0 : 1);
}

function benchmarkPatternCommand(pattern: string, text: string, options: CLIOptions) {
  const result: any = {
    pattern,
    text,
    textLength: text.length,
    metrics: {}
  };

  try {
    validatePattern(pattern);

    const flags = options.flags || 'g';
    const regex = new RegExp(pattern, flags);

    // Benchmark
    const startTime = performance.now();
    let matchCount = 0;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      matchCount++;

      if (matchCount >= 10000) {
        result.warning = 'Stopped after 10000 matches';
        break;
      }

      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }
    }

    const endTime = performance.now();
    const executionTime = endTime - startTime;

    result.metrics = {
      executionTime: `${executionTime.toFixed(3)}ms`,
      matchCount,
      matchesPerMs: matchCount > 0 ? (matchCount / executionTime).toFixed(2) : '0',
      charsPerMs: (text.length / executionTime).toFixed(0)
    };

    result.success = true;
  } catch (error) {
    result.success = false;
    result.error = (error as Error).message;
  }

  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('\nPattern Benchmark Result:');
    console.log('─'.repeat(50));
    console.log(`Pattern: ${pattern}`);
    console.log(`Text length: ${result.textLength} characters`);
    console.log('\nPerformance Metrics:');
    console.log(`  Execution time: ${result.metrics.executionTime}`);
    console.log(`  Matches found: ${result.metrics.matchCount}`);
    console.log(`  Throughput: ${result.metrics.charsPerMs} chars/ms`);

    if (result.warning) {
      console.log(`\n⚠ ${result.warning}`);
    }

    if (result.error) {
      console.log(`\n✗ Error: ${result.error}`);
    }

    // Performance assessment
    const execTime = parseFloat(result.metrics.executionTime);
    console.log('\nPerformance Assessment:');
    if (execTime < 1) {
      console.log('  ✓ Excellent - Very fast execution');
    } else if (execTime < 10) {
      console.log('  ✓ Good - Acceptable performance');
    } else if (execTime < 50) {
      console.log('  ⚠ Fair - May be slow on large texts');
    } else {
      console.log('  ✗ Poor - Pattern needs optimization');
    }
  }

  process.exit(result.success ? 0 : 1);
}

async function main() {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const command = args[0];
  const options = parseOptions(args);

  try {
    switch (command) {
      case 'validate': {
        const pattern = args[1];
        if (!pattern) {
          console.error('Error: Pattern is required');
          console.log('Usage: openredaction-test-pattern validate <pattern>');
          process.exit(1);
        }
        validatePatternCommand(pattern, options);
        break;
      }

      case 'test': {
        const pattern = args[1];
        const text = args[2];
        if (!pattern || !text) {
          console.error('Error: Pattern and text are required');
          console.log('Usage: openredaction-test-pattern test <pattern> <text>');
          process.exit(1);
        }
        testPatternCommand(pattern, text, options);
        break;
      }

      case 'check': {
        const pattern = args[1];
        if (!pattern) {
          console.error('Error: Pattern is required');
          console.log('Usage: openredaction-test-pattern check <pattern> [--flags <flags>]');
          process.exit(1);
        }
        checkPatternCommand(pattern, options);
        break;
      }

      case 'benchmark': {
        const pattern = args[1];
        const text = args[2];
        if (!pattern || !text) {
          console.error('Error: Pattern and text are required');
          console.log('Usage: openredaction-test-pattern benchmark <pattern> <text>');
          process.exit(1);
        }
        benchmarkPatternCommand(pattern, text, options);
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        console.log('Run with --help for usage information');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', (error as Error).message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
