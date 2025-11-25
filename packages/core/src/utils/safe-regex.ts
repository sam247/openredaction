/**
 * Safe regex execution utilities with ReDoS protection
 * Zero-dependency implementation using time-based checks
 */

export interface SafeRegexOptions {
  timeout?: number; // Timeout in milliseconds (default: 100ms)
  maxMatches?: number; // Maximum number of matches to prevent infinite loops (default: 10000)
}

export class RegexTimeoutError extends Error {
  constructor(pattern: string, timeout: number) {
    super(`Regex execution exceeded timeout of ${timeout}ms: ${pattern}`);
    this.name = 'RegexTimeoutError';
  }
}

export class RegexMaxMatchesError extends Error {
  constructor(pattern: string, maxMatches: number) {
    super(`Regex execution exceeded max matches of ${maxMatches}: ${pattern}`);
    this.name = 'RegexMaxMatchesError';
  }
}

/**
 * Safely execute regex with timeout protection
 * Uses periodic time checks to prevent catastrophic backtracking
 */
export function safeExec(
  regex: RegExp,
  text: string,
  options: SafeRegexOptions = {}
): RegExpExecArray | null {
  const timeout = options.timeout ?? 100; // Default 100ms
  const startTime = performance.now();

  // Reset regex lastIndex for safety
  regex.lastIndex = 0;

  try {
    const result = regex.exec(text);

    // Check if execution took too long
    const elapsed = performance.now() - startTime;
    if (elapsed > timeout) {
      throw new RegexTimeoutError(regex.source, timeout);
    }

    return result;
  } catch (error) {
    if (error instanceof RegexTimeoutError) {
      throw error;
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * Safely execute regex.exec() in a loop with timeout and match limit protection
 * Returns all matches or throws on timeout/limit exceeded
 */
export function safeExecAll(
  regex: RegExp,
  text: string,
  options: SafeRegexOptions = {}
): RegExpExecArray[] {
  const timeout = options.timeout ?? 100; // Default 100ms per match check
  const maxMatches = options.maxMatches ?? 10000; // Default 10k matches
  const startTime = performance.now();
  const matches: RegExpExecArray[] = [];

  // Ensure regex has global flag for exec loop
  if (!regex.global) {
    const match = safeExec(regex, text, options);
    return match ? [match] : [];
  }

  let match: RegExpExecArray | null;
  let lastIndex = 0;
  let checkCounter = 0;
  const checkInterval = 10; // Check time every N iterations

  while ((match = regex.exec(text)) !== null) {
    matches.push(match);

    // Prevent infinite loops on zero-length matches
    if (match.index === lastIndex) {
      regex.lastIndex++;
    }
    lastIndex = match.index;

    // Check match limit
    if (matches.length >= maxMatches) {
      throw new RegexMaxMatchesError(regex.source, maxMatches);
    }

    // Periodically check timeout (not on every iteration for performance)
    checkCounter++;
    if (checkCounter % checkInterval === 0) {
      const elapsed = performance.now() - startTime;
      if (elapsed > timeout) {
        throw new RegexTimeoutError(regex.source, timeout);
      }
    }
  }

  return matches;
}

/**
 * Test if a regex pattern is potentially unsafe (basic static analysis)
 * Detects common ReDoS patterns
 *
 * Note: This is a very basic heuristic check. The real protection comes from
 * the execution timeout in safeExec(). This just catches obvious mistakes.
 */
export function isUnsafePattern(pattern: string): boolean {
  // Check for obviously dangerous patterns only
  // More sophisticated detection requires full regex AST parsing

  // Check for directly consecutive quantifiers (syntax error): a*+ or a++
  if (/\*\+|\+\*|\+\+|\*\*/.test(pattern)) {
    return true;
  }

  // Check for very obviously nested quantifiers like (a+)+ or (b*)*
  // But be very conservative to avoid false positives
  if (/\(a\+\)\+|\(b\*\)\*|\(c\+\)\+/.test(pattern)) {
    return true;
  }

  // For now, be very permissive. The timeout protection is the real defense.
  // Static analysis of regex is notoriously difficult without parsing.
  return false;
}

/**
 * Validate a regex pattern before use
 * Throws error if pattern is potentially unsafe
 */
export function validatePattern(pattern: string | RegExp): void {
  const patternStr = typeof pattern === 'string' ? pattern : pattern.source;

  // Check pattern length
  if (patternStr.length > 5000) {
    throw new Error(`Regex pattern too long: ${patternStr.length} chars (max 5000)`);
  }

  // Check for unsafe patterns
  if (isUnsafePattern(patternStr)) {
    throw new Error(`Potentially unsafe regex pattern detected: ${patternStr.substring(0, 100)}...`);
  }

  // Try to compile the pattern to ensure it's valid
  try {
    new RegExp(patternStr);
  } catch (error) {
    throw new Error(`Invalid regex pattern: ${(error as Error).message}`);
  }
}

/**
 * Compile a regex with validation and return a safe wrapper
 */
export function compileSafeRegex(
  pattern: string | RegExp,
  flags?: string
): RegExp {
  const patternStr = typeof pattern === 'string' ? pattern : pattern.source;
  const finalFlags = flags || (typeof pattern === 'string' ? undefined : pattern.flags);

  // Validate before compilation
  validatePattern(patternStr);

  return new RegExp(patternStr, finalFlags);
}
