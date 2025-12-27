const fs = require('fs');
const path = require('path');

function fixAsyncInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Step 1: Make all it() functions async
  content = content.replace(/it\((['"`])([^'"`]+)\1,\s*\(\)\s*=>\s*{/g, (match) => {
    if (match.includes('async')) return match;
    return match.replace('() =>', 'async () =>');
  });
  
  // Step 2: Add await before all .detect( calls, but only if:
  // - We're in an async function (it's async)
  // - The line doesn't already have await
  const lines = content.split('\n');
  const fixedLines = [];
  let inAsyncFunction = false;
  let asyncDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Track async function entry
    if (line.match(/it\([^)]+,\s*async\s*\(\)\s*=>/)) {
      inAsyncFunction = true;
      asyncDepth = 0;
    }
    
    // Track function depth
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    asyncDepth += openBraces - closeBraces;
    
    // If we close all braces, we're out of the async function
    if (asyncDepth <= 0 && inAsyncFunction) {
      inAsyncFunction = false;
    }
    
    // Fix detect() calls
    if (inAsyncFunction && line.includes('.detect(') && !line.includes('await')) {
      // Don't double-await
      if (!line.trim().startsWith('await')) {
        line = line.replace(/(\w+)\.detect\(/g, 'await $1.detect(');
      }
    }
    
    fixedLines.push(line);
  }
  
  content = fixedLines.join('\n');
  
  // Step 3: Convert forEach with await to for...of
  // This is trickier - we need to find forEach blocks that contain await
  const forEachPattern = /(\w+)\.forEach\((\w+)\s*=>\s*{/g;
  let match;
  const replacements = [];
  
  while ((match = forEachPattern.exec(content)) !== null) {
    const arrayName = match[1];
    const param = match[2];
    const startPos = match.index;
    const afterMatch = content.substring(startPos + match[0].length);
    
    // Find matching closing brace
    let depth = 1;
    let endPos = startPos + match[0].length;
    for (let i = 0; i < afterMatch.length && depth > 0; i++) {
      if (afterMatch[i] === '{') depth++;
      if (afterMatch[i] === '}') depth--;
      endPos++;
    }
    
    const forEachBlock = content.substring(startPos, endPos);
    
    // If block contains await, convert to for...of
    if (forEachBlock.includes('await')) {
      const newBlock = forEachBlock
        .replace(/(\w+)\.forEach\((\w+)\s*=>\s*{/, `for (const $2 of $1) {`)
        .replace(/}\);?\s*$/, '}');
      replacements.push({ start: startPos, end: endPos, new: newBlock });
    }
  }
  
  // Apply replacements in reverse order to maintain positions
  replacements.reverse().forEach(({ start, end, new: newText }) => {
    content = content.substring(0, start) + newText + content.substring(end);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
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
    try {
      if (fixAsyncInFile(filePath)) {
        console.log(`✓ Fixed ${file}`);
      } else {
        console.log(`- No changes for ${file}`);
      }
    } catch (error) {
      console.error(`✗ Error fixing ${file}:`, error.message);
    }
  } else {
    console.log(`✗ File not found: ${file}`);
  }
});

