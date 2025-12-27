const fs = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix it() to async - but be careful
  content = content.replace(/it\((['"`])([^'"`]+)\1,\s*\(\)\s*=>\s*{/g, (match, quote, desc) => {
    // Skip if already async
    if (match.includes('async')) return match;
    return `it(${quote}${desc}${quote}, async () => {`;
  });
  
  // Fix detect() calls - add await before them (but not if already has await)
  // Match: variable.detect( or shield.detect( or detector.detect( etc.
  content = content.replace(/(\b\w+)\.detect\(/g, (match, varName) => {
    // Find the line this is on
    const before = content.substring(0, content.indexOf(match));
    const lines = before.split('\n');
    const currentLine = lines[lines.length - 1];
    
    // Check if already has await on this line
    if (currentLine.includes('await')) return match;
    
    // Check if we're in an async context
    const context = before.substring(Math.max(0, before.length - 500));
    const hasAsync = context.includes('async () =>') || context.includes('async function');
    
    if (hasAsync) {
      return `await ${varName}.detect(`;
    }
    return match;
  });
  
  // Fix forEach to for...of for async
  // Match: array.forEach(param => { ... await ... })
  const forEachRegex = /(\w+)\.forEach\((\w+)\s*=>\s*{([^}]*await[^}]*)}/gs;
  content = content.replace(forEachRegex, (match, arrayName, param, body) => {
    return `for (const ${param} of ${arrayName}) {${body}}`;
  });
  
  // More general forEach fix - if body has await, convert to for...of
  content = content.replace(/(\w+)\.forEach\((\w+)\s*=>\s*{/g, (match, arrayName, param, offset) => {
    // Check if the forEach body contains await
    const afterMatch = content.substring(content.indexOf(match) + match.length);
    const bodyEnd = findMatchingBrace(afterMatch);
    const body = afterMatch.substring(0, bodyEnd);
    
    if (body.includes('await')) {
      return `for (const ${param} of ${arrayName}) {`;
    }
    return match;
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function findMatchingBrace(str) {
  let depth = 1;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '{') depth++;
    if (str[i] === '}') depth--;
    if (depth === 0) return i;
  }
  return str.length;
}

const testFiles = [
  'patterns.test.ts',
  'reports.test.ts',
  'redaction-modes.test.ts',
  'industry-patterns.test.ts',
  'middle-east-patterns.test.ts',
  'multipass-detection.test.ts',
  'false-positive-filter.test.ts',
  'pattern-categories.test.ts',
  'streaming.test.ts'
];

testFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    if (fixFile(filePath)) {
      console.log(`Fixed ${file}`);
    } else {
      console.log(`No changes needed for ${file}`);
    }
  }
});
