# Security Guide

OpenRedaction includes enterprise-grade security hardening to protect against common attack vectors. This guide covers all security features and best practices.

## Table of Contents

- [ReDoS Protection](#redos-protection)
- [Input Size Limits](#input-size-limits)
- [Custom Pattern Validation](#custom-pattern-validation)
- [Safe Regex Execution](#safe-regex-execution)
- [Security Best Practices](#security-best-practices)
- [Security Audit](#security-audit)

---

## ReDoS Protection

Regular Expression Denial of Service (ReDoS) attacks exploit catastrophic backtracking in regex engines. OpenRedaction includes comprehensive protection.

### How It Works

```typescript
const detector = new OpenRedaction({
  regexTimeout: 100  // 100ms timeout per pattern (default)
});

// Malicious input that would cause catastrophic backtracking
const maliciousInput = 'a'.repeat(100000) + '!';
const result = detector.detect(maliciousInput);

// Timeout triggers gracefully
// - Skips problematic pattern
// - Continues with remaining patterns
// - No crash or hang
```

### Features

✅ **100ms timeout** per pattern execution (configurable)
✅ **Graceful degradation** - skips problematic patterns, continues detection
✅ **10,000 match limit** per pattern to prevent infinite loops
✅ **Zero-overhead** - uses native performance timers

### Configuration

```typescript
const detector = new OpenRedaction({
  regexTimeout: 50  // Stricter 50ms timeout
});
```

### Monitoring

```typescript
const detector = new OpenRedaction({
  debug: true,  // Enable debug logging
  regexTimeout: 100
});

// Logs timeout warnings
// "[OpenRedaction] Pattern PATTERN_NAME exceeded timeout (100ms)"
```

---

## Input Size Limits

Hard limits prevent memory exhaustion attacks from processing extremely large inputs.

### Default Limits

```typescript
const detector = new OpenRedaction({
  maxInputSize: 10 * 1024 * 1024  // 10MB limit (default)
});

// Throws error if input exceeds limit
try {
  const result = detector.detect(veryLargeText);
} catch (error) {
  console.error(error.message);
  // "Input size (15728640 bytes) exceeds maximum allowed size (10485760 bytes)"
}
```

### Features

✅ **10MB default limit** (configurable)
✅ **Hard enforcement** - throws error, not just warning
✅ **80% threshold warning** in debug mode
✅ **Accurate size calculation** - uses Blob API for byte-accurate measurement

### Custom Limits

```typescript
// Stricter limit for public endpoints
const publicDetector = new OpenRedaction({
  maxInputSize: 1 * 1024 * 1024  // 1MB
});

// Relaxed limit for trusted internal use
const internalDetector = new OpenRedaction({
  maxInputSize: 50 * 1024 * 1024  // 50MB
});
```

### Debug Warnings

```typescript
const detector = new OpenRedaction({
  debug: true,
  maxInputSize: 10 * 1024 * 1024
});

detector.detect('x'.repeat(9 * 1024 * 1024));
// Logs: "[OpenRedaction] Input size (9437184 bytes) is approaching maximum limit (10485760 bytes)"
```

---

## Custom Pattern Validation

Custom patterns are validated before use to prevent security issues.

### Automatic Validation

```typescript
try {
  const detector = new OpenRedaction({
    customPatterns: [{
      type: 'DANGEROUS_PATTERN',
      regex: /(a+)+b/,  // Catastrophic backtracking pattern
      priority: 10,
      placeholder: '[DANGER]'
    }]
  });
} catch (error) {
  console.error(error.message);
  // "Custom pattern DANGEROUS_PATTERN failed validation: potentially unsafe pattern"
}
```

### Validation Checks

✅ **Nested quantifiers** - Detects `(a+)+` patterns
✅ **Alternation with quantifiers** - Detects `(a|a)+` patterns
✅ **Overlapping alternatives** - Detects `(a|ab)+` patterns
✅ **Regex compilation** - Ensures pattern compiles successfully

### Manual Testing

Use the pattern testing CLI to validate custom patterns:

```bash
npx openredaction test-pattern "(a+)+b" "aaaaaaaaab"
```

Output:
```
Testing pattern: (a+)+b
Input: aaaaaaaaab
Result: ⚠️  Pattern potentially unsafe (catastrophic backtracking possible)
```

### Safe Pattern Design

**Bad (Unsafe):**
```typescript
/^(a+)+$/     // Nested quantifiers
/(a|a)+b/     // Overlapping alternatives
/(a|ab)+/     // Alternation with overlap
```

**Good (Safe):**
```typescript
/^a+$/        // Simple quantifier
/(abc)+/      // Non-overlapping
/a+b/         // Linear matching
```

---

## Safe Regex Execution

All regex execution uses safe wrappers with timeout protection.

### Safe Exec

```typescript
import { safeExec } from 'openredaction';

const pattern = /sensitive-pattern/g;
const text = 'text to search...';

try {
  const match = safeExec(pattern, text, {
    timeout: 100,        // 100ms timeout
    maxMatches: 10000    // Max 10,000 matches
  });

  if (match) {
    console.log('Match found:', match[0]);
  }
} catch (error) {
  if (error instanceof RegexTimeoutError) {
    console.error('Regex timeout exceeded');
  } else if (error instanceof RegexMaxMatchesError) {
    console.error('Too many matches');
  }
}
```

### Safe Exec All

```typescript
import { safeExecAll } from 'openredaction';

const matches = safeExecAll(pattern, text, {
  timeout: 100,
  maxMatches: 10000
});

console.log(`Found ${matches.length} matches`);
```

### Pattern Validation Utility

```typescript
import { validatePattern, isUnsafePattern } from 'openredaction';

// Check if pattern is safe
if (isUnsafePattern(/(a+)+b/)) {
  console.error('Unsafe pattern detected');
}

// Validate and get details
const validation = validatePattern(/(a+)+b/);
if (!validation.safe) {
  console.error('Validation failed:', validation.reason);
}
```

---

## Security Best Practices

### 1. Set Appropriate Limits

```typescript
// Public-facing API
const publicDetector = new OpenRedaction({
  maxInputSize: 1 * 1024 * 1024,  // 1MB
  regexTimeout: 50,                // 50ms
  enableCache: false               // Don't cache user data
});

// Internal trusted use
const internalDetector = new OpenRedaction({
  maxInputSize: 50 * 1024 * 1024,  // 50MB
  regexTimeout: 200,                // 200ms
  enableCache: true                 // OK to cache
});
```

### 2. Validate Custom Patterns

Always test custom patterns before production:

```bash
# Test pattern for safety
npx openredaction test-pattern "your-pattern" "sample-text"

# Test against malicious input
npx openredaction test-pattern "your-pattern" "$(python -c 'print(\"a\" * 100000)')"
```

### 3. Enable Debug Mode in Development

```typescript
const detector = new OpenRedaction({
  debug: true  // Logs warnings about timeouts, large inputs, etc.
});
```

### 4. Monitor Performance

```typescript
const result = detector.detect(text);

if (result.stats?.processingTime > 100) {
  console.warn(`Slow detection: ${result.stats.processingTime}ms`);
}
```

### 5. Use Category Filtering

Reduce attack surface by only enabling needed patterns:

```typescript
const detector = new OpenRedaction({
  categories: ['contact']  // Only emails and phones
});
```

### 6. Sanitize User Input

```typescript
// Validate input size before processing
function detectSafely(text: string) {
  const sizeBytes = new Blob([text]).size;

  if (sizeBytes > 1024 * 1024) {
    throw new Error('Input too large');
  }

  return detector.detect(text);
}
```

### 7. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // Limit each IP to 100 requests per window
});

app.use('/api/detect', limiter);
```

### 8. Don't Log Sensitive Data

```typescript
const result = detector.detect(text);

// ❌ Don't log actual values
console.log('Detected:', result.detections.map(d => d.value));

// ✅ Log metadata only
console.log('Detected:', result.detections.map(d => ({
  type: d.type,
  severity: d.severity,
  position: d.position
})));
```

---

## Security Audit

### Pattern Security Audit

Run a security audit on all active patterns:

```typescript
import { validatePattern } from 'openredaction';

const detector = new OpenRedaction();
const patterns = detector.getPatterns();

const unsafe = patterns.filter(p => {
  const validation = validatePattern(p.regex);
  return !validation.safe;
});

if (unsafe.length > 0) {
  console.error(`Found ${unsafe.length} potentially unsafe patterns:`);
  unsafe.forEach(p => {
    console.error(`- ${p.type}: ${validatePattern(p.regex).reason}`);
  });
}
```

### Performance Audit

Test detection performance with various input sizes:

```typescript
function auditPerformance() {
  const detector = new OpenRedaction();
  const sizes = [1024, 10240, 102400, 1024000];  // 1KB to 1MB

  sizes.forEach(size => {
    const text = 'a'.repeat(size);
    const start = performance.now();
    detector.detect(text);
    const duration = performance.now() - start;

    console.log(`${size} bytes: ${duration.toFixed(2)}ms`);

    if (duration > 100) {
      console.warn(`⚠️  Slow for ${size} bytes`);
    }
  });
}
```

---

## Reporting Security Issues

If you discover a security vulnerability, please email security@[domain] or report via [GitHub Security Advisories](https://github.com/sam247/openredaction/security/advisories).

**Please do NOT open a public issue for security vulnerabilities.**

---

## Security Checklist

Use this checklist when deploying OpenRedaction in production:

- [ ] Set appropriate `maxInputSize` for your use case
- [ ] Configure `regexTimeout` based on performance requirements
- [ ] Validate all custom patterns before production
- [ ] Enable rate limiting on public endpoints
- [ ] Don't log sensitive detected values
- [ ] Use category filtering to reduce attack surface
- [ ] Enable `debug` mode in development
- [ ] Monitor detection performance metrics
- [ ] Keep library updated to latest version
- [ ] Review security advisories regularly

---

## Additional Resources

- [OWASP Regular Expression DoS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Regular_Expression_Denial_of_Service_Prevention_Cheat_Sheet.html)
- [OWASP Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [OpenRedaction Security Policy](../SECURITY_POLICY.md)
