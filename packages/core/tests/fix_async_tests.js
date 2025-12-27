const fs = require('fs');
const path = require('path');

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
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${file} - not found`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix it() functions to be async
  content = content.replace(/it\((['"`])([^'"`]+)\1,\s*\(\)\s*=>\s*{/g, (match, quote, desc) => {
    // Skip if already async
    if (content.indexOf(`it(${quote}${desc}${quote}, async () => {`) !== -1) {
      return match;
    }
    return `it(${quote}${desc}${quote}, async () => {`;
  });
  
  // Fix detect() calls - but be careful not to double-await
  content = content.replace(/(\w+)\.detect\(/g, (match, varName) => {
    // Check if already has await
    const before = content.substring(0, content.indexOf(match));
    const lastLine = before.split('\n').pop();
    if (lastLine.includes('await')) {
      return match;
    }
    // Check if it's in an async context (it function, forEach callback, etc.)
    const context = before.substring(Math.max(0, before.length - 200));
    if (context.includes('async') || context.includes('await')) {
      return `await ${varName}.detect(`;
    }
    return match;
  });
  
  // Fix forEach to handle async
  content = content.replace(/(\w+)\.forEach\((\w+)\s*=>\s*{/g, (match, arrayName, param) => {
    const context = content.substring(0, content.indexOf(match));
    const lastLine = context.split('\n').pop();
    if (lastLine.includes('async')) {
      return match;
    }
    // Check if the forEach contains await
    const forEachBlock = content.substring(content.indexOf(match), content.indexOf(match) + 500);
    if (forEachBlock.includes('await')) {
      return `${arrayName}.forEach(async ${param} => {`;
    }
    return match;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${file}`);
});
