const fs = require('fs');
const path = require('path');
const glob = require('glob');

const patternFiles = glob.sync('packages/core/src/patterns/**/*.ts');

function analyzeRegex(regexText) {
  const notes = [];
  if (/[A-Z]/.test(regexText) && !/[a-z]/.test(regexText)) {
    notes.push('Case-sensitive patterns may miss lowercase, mixed-case, or accented text.');
  }
  if (/\\d/.test(regexText) && !/[\s\-\.]/.test(regexText)) {
    notes.push('Strict digit blocks may miss separators, country codes, or spaced formatting.');
  }
  if (notes.length === 0) {
    notes.push('Limited normalization; obfuscation, punctuation, or Unicode letters may be missed.');
  }
  return notes.join(' ');
}

function falsePositiveRisks(regexText) {
  const risks = [];
  if (/\{\d{3,}/.test(regexText) || /\d\{/.test(regexText) || /\\d\{/.test(regexText)) {
    risks.push('May capture generic numeric strings or inventory-like numbers.');
  }
  if (/[A-Z0-9]{4,}/i.test(regexText)) {
    risks.push('Broad alphanumeric spans could flag codes or IDs unrelated to PII.');
  }
  if (risks.length === 0) {
    risks.push('Context-free matching can pick up unrelated tokens when wording overlaps.');
  }
  return risks.join(' ');
}

function effortEstimate(regexText) {
  const length = regexText.length;
  if (length > 120) return 'high';
  if (length > 60) return 'medium';
  return 'low';
}

const patterns = [];

patternFiles.forEach((filePath) => {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  let current = null;
  lines.forEach((line) => {
    const typeMatch = line.match(/type:\s*'([^']+)'/);
    if (typeMatch) {
      if (current && current.regex) {
        patterns.push(current);
      }
      current = {
        type: typeMatch[1],
        file: filePath,
        regex: null,
        description: null,
        severity: null
      };
    }
    if (current) {
      const regexMatch = line.match(/regex:\s*(\/[^/]*.*\/[^,]*)/);
      if (regexMatch && !current.regex) {
        current.regex = regexMatch[1].trim();
      }
      const descMatch = line.match(/description:\s*'([^']+)'/);
      if (descMatch) {
        current.description = descMatch[1];
      }
      const severityMatch = line.match(/severity:\s*'([^']+)'/);
      if (severityMatch) {
        current.severity = severityMatch[1];
      }
      if (/^\s*[}\]]\s*[;,]?$/.test(line) && current.regex) {
        patterns.push(current);
        current = null;
      }
    }
  });
  if (current && current.regex) {
    patterns.push(current);
  }
});

const riskRank = (severity) => {
  if (!severity) return 'medium';
  if (severity.toLowerCase() === 'high') return 'High';
  if (severity.toLowerCase() === 'medium') return 'Medium';
  return 'Low';
};

const auditRows = patterns.map((p) => {
  const edge = analyzeRegex(p.regex);
  const fp = falsePositiveRisks(p.regex);
  return {
    ...p,
    risk: riskRank(p.severity),
    edge,
    fp,
    effort: effortEstimate(p.regex)
  };
});

const auditTable = [
  '| Pattern Type | Regex | PII Type | Edge cases missed | False positive risks | Risk |',
  '| --- | --- | --- | --- | --- | --- |'
];

auditRows.forEach((row) => {
  const desc = row.description || '—';
  const safeRegex = row.regex.replace(/\|/g, '\\|');
  const safeEdge = row.edge.replace(/\|/g, '/');
  const safeFp = row.fp.replace(/\|/g, '/');
  auditTable.push(`| ${row.type} | \`${safeRegex}\` | ${desc} | ${safeEdge} | ${safeFp} | ${row.risk} |`);
});

fs.writeFileSync('REGEX_AUDIT.md', auditTable.join('\n'));

const high = auditRows.filter((r) => r.risk === 'High');
const medium = auditRows.filter((r) => r.risk === 'Medium');
const low = auditRows.filter((r) => r.risk === 'Low');

function improvement(row) {
  const improvements = [];
  if (/[A-Z]/.test(row.regex) && !/[a-z]/.test(row.regex)) {
    improvements.push('Add case-insensitive Unicode letters and allow diacritics/hyphens.');
  }
  if (/\\d/.test(row.regex)) {
    improvements.push('Permit optional separators and normalize whitespace before matching.');
  }
  if (row.severity === 'high' && !/validator/i.test(row.description || '')) {
    improvements.push('Pair regex with checksum/context validation to reduce noise.');
  }
  if (improvements.length === 0) {
    improvements.push('Add pre-normalization and fallback ML/contextual detection for variants.');
  }
  return improvements.join(' ');
}

function planSection(title, items) {
  const lines = [`## ${title} (${items.length})`];
  lines.push('| Pattern | Regex | Proposed hardening | Effort | Tests to add |');
  lines.push('| --- | --- | --- | --- | --- |');
  items.forEach((item) => {
    lines.push(
      `| ${item.type} | \`${item.regex.replace(/\|/g, '\\|')}\` | ${improvement(item)} | ${item.effort} | ` +
        'Add fixtures for varied locales/obfuscation; verify negatives to avoid business codes. |'
    );
  });
  return lines.join('\n');
}

const planContent = [
  '# Hardening Plan',
  '',
  'This plan groups regex patterns by risk to prioritize hardening work.',
  '',
  planSection('High Risk', high),
  '',
  planSection('Medium Risk', medium),
  '',
  planSection('Low Risk', low),
  '',
  `Total patterns: ${auditRows.length} (High: ${high.length}, Medium: ${medium.length}, Low: ${low.length})`
].join('\n');

fs.writeFileSync('HARDENING_PLAN.md', planContent);

console.log(`Wrote ${auditRows.length} patterns to REGEX_AUDIT.md`);
console.log(`High: ${high.length}, Medium: ${medium.length}, Low: ${low.length}`);
