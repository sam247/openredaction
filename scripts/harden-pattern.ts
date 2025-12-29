#!/usr/bin/env tsx
/**
 * Pattern Hardening Script
 * Automates pattern updates with validation and rollback capability
 * 
 * Usage:
 *   tsx scripts/harden-pattern.ts <pattern-type> [options]
 * 
 * Options:
 *   --dry-run: Show what would be changed without making changes
 *   --rollback: Rollback the last change
 *   --test: Run tests after hardening
 *   --batch: Process multiple patterns from a file
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

interface PatternChange {
  patternType: string;
  file: string;
  lineNumber: number;
  oldRegex: string;
  newRegex: string;
  oldValidator?: string;
  newValidator?: string;
  timestamp: string;
}

interface HardeningConfig {
  changes: PatternChange[];
  rollbackPoint?: number;
}

const CONFIG_FILE = join(process.cwd(), '.hardening-config.json');
const BACKUP_DIR = join(process.cwd(), '.hardening-backups');

/**
 * Load hardening configuration
 */
function loadConfig(): HardeningConfig {
  if (existsSync(CONFIG_FILE)) {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
  }
  return { changes: [] };
}

/**
 * Save hardening configuration
 */
function saveConfig(config: HardeningConfig): void {
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

/**
 * Create backup of a file
 */
function backupFile(filePath: string): string {
  if (!existsSync(BACKUP_DIR)) {
    execSync(`mkdir -p "${BACKUP_DIR}"`);
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = join(BACKUP_DIR, `${filePath.replace(/\//g, '_')}.${timestamp}.bak`);
  
  const content = readFileSync(filePath, 'utf-8');
  writeFileSync(backupPath, content);
  
  return backupPath;
}

/**
 * Restore file from backup
 */
function restoreFile(backupPath: string, originalPath: string): void {
  const content = readFileSync(backupPath, 'utf-8');
  writeFileSync(originalPath, content);
}

/**
 * Find pattern definition in source files
 */
function findPattern(patternType: string): { file: string; lineNumber: number; content: string } | null {
  const patternsDir = join(process.cwd(), 'packages/core/src/patterns');
  const files = [
    'contact.ts',
    'personal.ts',
    'financial.ts',
    'government.ts',
    'network.ts',
    'digital-identity.ts',
    'international.ts'
  ];
  
  // Also check industry patterns
  const industryDirs = [
    'industries/healthcare.ts',
    'industries/financial.ts',
    'industries/legal.ts',
    'industries/education.ts',
    'industries/technology.ts',
    'industries/hr.ts',
    'industries/insurance.ts',
    'industries/retail.ts',
    'industries/telecoms.ts',
    'industries/manufacturing.ts',
    'industries/transportation.ts',
    'industries/media.ts',
    'industries/charitable.ts',
    'industries/procurement.ts',
    'industries/emergency-services.ts',
    'industries/real-estate.ts',
    'industries/gig-economy.ts',
    'industries/hospitality.ts',
    'industries/professional-certifications.ts',
    'industries/gaming.ts',
    'industries/vehicles.ts',
    'industries/logistics.ts',
    'industries/aviation.ts',
    'industries/maritime.ts',
    'industries/environmental.ts'
  ];
  
  files.push(...industryDirs);
  
  for (const file of files) {
    const filePath = join(patternsDir, file);
    if (!existsSync(filePath)) continue;
    
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(`type: '${patternType}'`) || lines[i].includes(`type: "${patternType}"`)) {
        // Find the pattern block (usually spans multiple lines)
        let patternContent = '';
        let braceCount = 0;
        let startLine = i;
        
        for (let j = i; j < lines.length; j++) {
          patternContent += lines[j] + '\n';
          braceCount += (lines[j].match(/\{/g) || []).length;
          braceCount -= (lines[j].match(/\}/g) || []).length;
          
          if (braceCount === 0 && j > i) {
            return {
              file: filePath,
              lineNumber: startLine + 1,
              content: patternContent.trim()
            };
          }
        }
      }
    }
  }
  
  return null;
}

/**
 * Update regex pattern to handle separators
 */
function updateRegexForSeparators(regex: string): string {
  // Replace [\s.-]? with [\s\u00A0.-]? to include non-breaking spaces
  let updated = regex.replace(/\[\\s\.-\]\?/g, '[\\s\\u00A0.-]?');
  
  // Replace [\s-]? with [\s\u00A0-]?
  updated = updated.replace(/\[\\s-\]\?/g, '[\\s\\u00A0-]?');
  
  // Replace [\s.]? with [\s\u00A0.]?
  updated = updated.replace(/\[\\s\.\]\?/g, '[\\s\\u00A0.]?');
  
  return updated;
}

/**
 * Update validator to normalize separators
 */
function updateValidatorForSeparators(validatorCode: string): string {
  // Check if already has normalization
  if (validatorCode.includes('normalizeSeparators') || validatorCode.includes('replace(/[\\s')) {
    return validatorCode; // Already normalized
  }
  
  // Add normalization at the start of validator
  const normalized = `const cleaned = value.replace(/[\\s\\u00A0.-]/g, '');\n      `;
  
  // Replace value with cleaned in the validator logic
  if (validatorCode.includes('value.replace')) {
    // Already has some normalization, enhance it
    return validatorCode.replace(/value\.replace\([^)]+\)/g, (match) => {
      if (!match.includes('\\u00A0')) {
        return match.replace(/\)/g, '').replace(/\[/g, '[\\u00A0') + ')';
      }
      return match;
    });
  }
  
  // Insert normalization and update references
  const lines = validatorCode.split('\n');
  const result: string[] = [];
  let normalizedAdded = false;
  
  for (const line of lines) {
    if (!normalizedAdded && line.trim().startsWith('const') || line.trim().startsWith('if')) {
      result.push(`      const cleaned = value.replace(/[\\s\\u00A0.-]/g, '');`);
      normalizedAdded = true;
    }
    
    // Replace value references with cleaned (but not in the normalization line itself)
    if (normalizedAdded && line.includes('value') && !line.includes('cleaned = value')) {
      result.push(line.replace(/\bvalue\b/g, 'cleaned'));
    } else {
      result.push(line);
    }
  }
  
  if (!normalizedAdded) {
    result.unshift(`      const cleaned = value.replace(/[\\s\\u00A0.-]/g, '');`);
  }
  
  return result.join('\n');
}

/**
 * Harden a pattern
 */
function hardenPattern(patternType: string, dryRun: boolean = false): void {
  console.log(`\n🔧 Hardening pattern: ${patternType}`);
  
  const pattern = findPattern(patternType);
  if (!pattern) {
    console.error(`❌ Pattern ${patternType} not found`);
    process.exit(1);
  }
  
  console.log(`📁 Found in: ${pattern.file} (line ${pattern.lineNumber})`);
  
  // Extract regex and validator
  const regexMatch = pattern.content.match(/regex:\s*(\/[^\/]+\/[gimuy]*)/);
  const validatorMatch = pattern.content.match(/validator:\s*\([^)]+\)\s*=>\s*\{([^}]+)\}/s);
  
  if (!regexMatch) {
    console.error(`❌ Could not find regex in pattern definition`);
    process.exit(1);
  }
  
  const oldRegex = regexMatch[1];
  const newRegex = updateRegexForSeparators(oldRegex);
  
  let oldValidator: string | undefined;
  let newValidator: string | undefined;
  
  if (validatorMatch) {
    oldValidator = validatorMatch[1].trim();
    newValidator = updateValidatorForSeparators(oldValidator);
  }
  
  console.log(`\n📝 Changes:`);
  console.log(`   Regex: ${oldRegex} → ${newRegex}`);
  if (oldValidator && newValidator && oldValidator !== newValidator) {
    console.log(`   Validator: Updated to normalize separators`);
  }
  
  if (dryRun) {
    console.log(`\n✅ Dry run complete - no changes made`);
    return;
  }
  
  // Backup file
  const backupPath = backupFile(pattern.file);
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Update file
  let content = readFileSync(pattern.file, 'utf-8');
  
  // Replace regex
  content = content.replace(
    new RegExp(`regex:\\s*${oldRegex.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'),
    `regex: ${newRegex}`
  );
  
  // Replace validator if changed
  if (oldValidator && newValidator && oldValidator !== newValidator) {
    const oldValidatorFull = `validator: (${validatorMatch[0].match(/\([^)]+\)/)?.[0]}) => {${oldValidator}}`;
    const validatorParams = validatorMatch[0].match(/\([^)]+\)/)?.[0] || '(value: string, context: string)';
    const newValidatorFull = `validator: ${validatorParams} => {\n${newValidator}\n    }`;
    
    content = content.replace(
      new RegExp(oldValidatorFull.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 's'),
      newValidatorFull
    );
  }
  
  writeFileSync(pattern.file, content);
  
  // Record change
  const config = loadConfig();
  config.changes.push({
    patternType,
    file: pattern.file,
    lineNumber: pattern.lineNumber,
    oldRegex,
    newRegex,
    oldValidator,
    newValidator,
    timestamp: new Date().toISOString()
  });
  config.rollbackPoint = config.changes.length - 1;
  saveConfig(config);
  
  console.log(`✅ Pattern hardened successfully`);
}

/**
 * Rollback last change
 */
function rollback(): void {
  const config = loadConfig();
  
  if (!config.rollbackPoint && config.rollbackPoint !== 0) {
    console.error(`❌ No changes to rollback`);
    process.exit(1);
  }
  
  const change = config.changes[config.rollbackPoint];
  console.log(`\n⏪ Rolling back: ${change.patternType}`);
  
  // Find backup file
  const backupFiles = execSync(`ls -t "${BACKUP_DIR}" | grep "${change.file.replace(/\//g, '_')}" | head -1`)
    .toString()
    .trim();
  
  if (!backupFiles) {
    console.error(`❌ Backup file not found`);
    process.exit(1);
  }
  
  const backupPath = join(BACKUP_DIR, backupFiles);
  restoreFile(backupPath, change.file);
  
  // Remove from config
  config.changes.splice(config.rollbackPoint, 1);
  config.rollbackPoint = config.changes.length > 0 ? config.changes.length - 1 : undefined;
  saveConfig(config);
  
  console.log(`✅ Rollback complete`);
}

/**
 * Run tests
 */
function runTests(patternType?: string): void {
  console.log(`\n🧪 Running tests...`);
  
  try {
    if (patternType) {
      execSync(`cd packages/core && npm test -- pattern-hardening.test.ts -t "${patternType}"`, {
        stdio: 'inherit'
      });
    } else {
      execSync('cd packages/core && npm test', { stdio: 'inherit' });
    }
    console.log(`✅ All tests passed`);
  } catch (error) {
    console.error(`❌ Tests failed`);
    process.exit(1);
  }
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];
const dryRun = args.includes('--dry-run');
const shouldTest = args.includes('--test');

if (command === 'rollback') {
  rollback();
} else if (command && !command.startsWith('--')) {
  hardenPattern(command, dryRun);
  if (shouldTest && !dryRun) {
    runTests(command);
  }
} else {
  console.log(`
Pattern Hardening Script

Usage:
  tsx scripts/harden-pattern.ts <pattern-type> [options]
  tsx scripts/harden-pattern.ts rollback

Options:
  --dry-run    Show what would be changed without making changes
  --rollback   Rollback the last change
  --test       Run tests after hardening

Examples:
  tsx scripts/harden-pattern.ts POSTCODE_UK --dry-run
  tsx scripts/harden-pattern.ts ZIP_CODE_US --test
  tsx scripts/harden-pattern.ts rollback
  `);
}

