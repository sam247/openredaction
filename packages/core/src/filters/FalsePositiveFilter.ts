/**
 * False Positive Detection and Filtering
 * Identifies and filters out common false positives
 */

export interface FalsePositiveRule {
  /** Pattern type this rule applies to */
  patternType: string | string[];
  /** Matching function */
  matcher: (value: string, context: string) => boolean;
  /** Description of the false positive */
  description: string;
  /** Severity of the false positive (how confident we are it's not PII) */
  severity: 'high' | 'medium' | 'low';
}

/**
 * Common false positive rules
 */
export const commonFalsePositives: FalsePositiveRule[] = [
  // Version numbers that look like phone numbers
  {
    patternType: ['PHONE', 'PHONE_UK', 'PHONE_US'],
    matcher: (value: string, context: string) => {
      // Version number patterns: v1.2.3, version 2.0.1, etc.
      const versionContext = /\b(version|v|ver|release|build)\s*[:\s]*/i;
      if (versionContext.test(context)) return true;

      // Semver-like patterns
      const semverPattern = /^\d{1,2}\.\d{1,2}\.\d{1,4}$/;
      if (semverPattern.test(value.replace(/[\s()-]/g, ''))) return true;

      return false;
    },
    description: 'Version number mistaken for phone number',
    severity: 'high'
  },

  // Dates that look like phone numbers
  {
    patternType: ['PHONE', 'PHONE_UK', 'PHONE_US'],
    matcher: (value: string, context: string) => {
      // Date context indicators
      const dateContext = /\b(date|born|birth|dob|created|updated|on|since|until|before|after)\s*[:\s]*/i;
      if (dateContext.test(context)) return true;

      // Common date formats that might match phone patterns
      const datePatterns = [
        /^\d{2}[-/]\d{2}[-/]\d{4}$/, // DD-MM-YYYY or MM-DD-YYYY
        /^\d{4}[-/]\d{2}[-/]\d{2}$/, // YYYY-MM-DD
        /^\d{2}[-/]\d{2}[-/]\d{2}$/  // DD-MM-YY or MM-DD-YY
      ];

      const cleaned = value.replace(/[\s()]/g, '');
      return datePatterns.some(pattern => pattern.test(cleaned));
    },
    description: 'Date mistaken for phone number',
    severity: 'high'
  },

  // IP addresses that might match certain patterns
  {
    patternType: ['PHONE', 'ACCOUNT', 'ID'],
    matcher: (value: string, context: string) => {
      // IP address pattern
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(value)) return true;

      // IP context
      const ipContext = /\b(ip|address|server|host|network|subnet)\s*[:\s]*/i;
      return ipContext.test(context);
    },
    description: 'IP address mistaken for PII',
    severity: 'high'
  },

  // Measurements and dimensions
  {
    patternType: ['PHONE', 'NUMBER'],
    matcher: (value: string, context: string) => {
      // Unit indicators
      const unitContext = /\b(cm|mm|km|m|ft|in|inch|meter|mile|kg|lb|oz|gram|litre|liter|ml|gb|mb|kb)\s*$/i;
      const hasUnit = unitContext.test(context + ' ' + value);

      // Measurement context
      const measureContext = /\b(size|width|height|length|weight|distance|volume|capacity|dimension)\s*[:\s]*/i;

      return hasUnit || measureContext.test(context);
    },
    description: 'Measurement mistaken for PII',
    severity: 'medium'
  },

  // Years that might match ID patterns
  {
    patternType: ['PHONE', 'ID', 'NUMBER'],
    matcher: (value: string) => {
      // Year range 1900-2099
      const yearPattern = /^(19|20)\d{2}$/;
      const cleaned = value.replace(/[\s()-]/g, '');
      return yearPattern.test(cleaned);
    },
    description: 'Year mistaken for PII',
    severity: 'medium'
  },

  // Prices and monetary amounts
  {
    patternType: ['PHONE', 'ACCOUNT', 'NUMBER'],
    matcher: (value: string, context: string) => {
      // Currency symbols or context
      const currencyContext = /\b(price|cost|amount|total|subtotal|fee|charge|payment|\$|£|€|¥|USD|GBP|EUR)\s*[:\s]*/i;
      if (currencyContext.test(context)) return true;

      // Price pattern with decimals
      const pricePattern = /^\d{1,6}\.\d{2}$/;
      return pricePattern.test(value.replace(/[\s,]/g, ''));
    },
    description: 'Price mistaken for PII',
    severity: 'medium'
  },

  // Port numbers
  {
    patternType: ['PHONE', 'ID', 'NUMBER'],
    matcher: (value: string, context: string) => {
      const portContext = /\bport[:\s]*$/i;
      const portPattern = /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;

      return portContext.test(context) && portPattern.test(value);
    },
    description: 'Port number mistaken for PII',
    severity: 'high'
  },

  // Percentages
  {
    patternType: ['PHONE', 'NUMBER'],
    matcher: (value: string, context: string) => {
      // Check if percent/% appears after the value
      const fullContext = context + ' ' + value;
      const percentAfter = /\d+(\.\d+)?\s*(percent|percentage|%)/i;
      return percentAfter.test(fullContext);
    },
    description: 'Percentage mistaken for PII',
    severity: 'high'
  },

  // Codes and identifiers in technical documentation
  {
    patternType: ['NAME', 'EMAIL'],
    matcher: (value: string, context: string) => {
      // Technical placeholders
      const techPlaceholders = /\b(foo|bar|baz|qux|example|test|demo|sample|placeholder|dummy|mock)\b/i;
      if (techPlaceholders.test(value.toLowerCase())) return true;

      // Code comment context
      const codeCommentContext = /(\/\/|\/\*|\*|#|--|<!--|;)/;
      return codeCommentContext.test(context);
    },
    description: 'Technical placeholder mistaken for PII',
    severity: 'high'
  },

  // Generic test data
  {
    patternType: ['EMAIL', 'NAME', 'PHONE', 'ADDRESS'],
    matcher: (value: string) => {
      const testPatterns = [
        /test\d*@/i,
        /example\.com$/i,
        /foo@/i,
        /bar@/i,
        /johndoe/i,
        /janedoe/i,
        /^xxx+$/i,
        /^000[-\s]*000[-\s]*000/i
      ];

      return testPatterns.some(pattern => pattern.test(value));
    },
    description: 'Test data mistaken for PII',
    severity: 'high'
  },

  // Article and determiners before names
  {
    patternType: ['NAME'],
    matcher: (_value: string, context: string) => {
      // Articles right before the match
      const articlePattern = /\b(the|a|an)\s*$/i;
      return articlePattern.test(context);
    },
    description: 'Common word after article, not a name',
    severity: 'medium'
  },

  // Programming keywords
  {
    patternType: ['NAME'],
    matcher: (value: string, context: string) => {
      const keywords = [
        'function', 'const', 'let', 'var', 'class', 'interface', 'type', 'enum',
        'public', 'private', 'protected', 'static', 'async', 'await', 'return',
        'import', 'export', 'from', 'default', 'extends', 'implements'
      ];

      const valueLower = value.toLowerCase();
      if (keywords.includes(valueLower)) return true;

      // Code context
      const codeContext = /\b(def|fn|func|method|prop|attr)\s*[:\s]*/i;
      return codeContext.test(context);
    },
    description: 'Programming keyword mistaken for name',
    severity: 'high'
  },

  // Email domains that are common false positives
  {
    patternType: ['EMAIL'],
    matcher: (value: string) => {
      const commonDomains = [
        'localhost',
        'example.com',
        'example.org',
        'example.net',
        'test.com',
        'demo.com',
        'sample.com',
        'invalid.com',
        'domain.com'
      ];

      const domain = value.split('@')[1]?.toLowerCase();
      return commonDomains.includes(domain);
    },
    description: 'Example email domain',
    severity: 'high'
  },

  // Common non-PII numbers in financial context
  {
    patternType: ['ACCOUNT', 'CARD'],
    matcher: (value: string, _context: string) => {
      // Zero-filled test numbers
      if (/^0+$/.test(value.replace(/[\s-]/g, ''))) return true;

      // Repeating digits
      const cleaned = value.replace(/[\s-]/g, '');
      if (/^(\d)\1+$/.test(cleaned)) return true;

      // Sequential numbers
      if (/^(0123456789|1234567890|9876543210)/.test(cleaned)) return true;

      return false;
    },
    description: 'Test account/card number',
    severity: 'high'
  },

  // Timestamps
  {
    patternType: ['PHONE', 'ID', 'NUMBER'],
    matcher: (_value: string, context: string) => {
      const timestampContext = /\b(timestamp|time|epoch|unix|millis|seconds|created.at|updated.at)\s*[:\s]*/i;
      return timestampContext.test(context);
    },
    description: 'Timestamp mistaken for PII',
    severity: 'medium'
  }
];

/**
 * Check if a detection is a false positive
 */
export function isFalsePositive(
  value: string,
  patternType: string,
  context: string,
  rules: FalsePositiveRule[] = commonFalsePositives
): {
  isFalsePositive: boolean;
  matchedRule?: FalsePositiveRule;
  confidence: number; // 0-1, how confident we are it's a false positive
} {
  for (const rule of rules) {
    // Check if rule applies to this pattern type
    const applies = Array.isArray(rule.patternType)
      ? rule.patternType.some(t => patternType.includes(t))
      : patternType.includes(rule.patternType);

    if (!applies) continue;

    // Check if the matcher identifies this as a false positive
    if (rule.matcher(value, context)) {
      const confidence = rule.severity === 'high' ? 0.9 : rule.severity === 'medium' ? 0.7 : 0.5;
      return {
        isFalsePositive: true,
        matchedRule: rule,
        confidence
      };
    }
  }

  return {
    isFalsePositive: false,
    confidence: 0
  };
}

/**
 * Filter out false positives from detections
 */
export function filterFalsePositives<T extends { value: string; type: string }>(
  detections: T[],
  getText: (detection: T) => { value: string; context: string },
  threshold: number = 0.7
): T[] {
  return detections.filter(detection => {
    const { value, context } = getText(detection);
    const result = isFalsePositive(value, detection.type, context);

    // Only filter if confidence is above threshold
    return !(result.isFalsePositive && result.confidence >= threshold);
  });
}
