/**
 * Custom error class for OpenRedaction with helpful messages and suggestions
 */

export interface ErrorSuggestion {
  message: string;
  code?: string;
  docs?: string;
}

export class OpenRedactionError extends Error {
  public code: string;
  public suggestion?: ErrorSuggestion;
  public context?: Record<string, unknown>;

  constructor(
    message: string,
    code: string = 'OPENREDACTION_ERROR',
    suggestion?: ErrorSuggestion,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'OpenRedactionError';
    this.code = code;
    this.suggestion = suggestion;
    this.context = context;

    // Maintain proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpenRedactionError);
    }
  }

  /**
   * Get formatted error message with suggestions
   */
  getFormattedMessage(): string {
    let formatted = `[${this.code}] ${this.message}`;

    if (this.suggestion) {
      formatted += `\n\nSuggestion: ${this.suggestion.message}`;

      if (this.suggestion.code) {
        formatted += `\n\nTry:\n${this.suggestion.code}`;
      }

      if (this.suggestion.docs) {
        formatted += `\n\nDocs: ${this.suggestion.docs}`;
      }
    }

    if (this.context && Object.keys(this.context).length > 0) {
      formatted += `\n\nContext: ${JSON.stringify(this.context, null, 2)}`;
    }

    return formatted;
  }
}

/**
 * Factory functions for common error scenarios
 */

export function createInvalidPatternError(patternType: string, reason: string): OpenRedactionError {
  return new OpenRedactionError(
    `Invalid pattern '${patternType}': ${reason}`,
    'INVALID_PATTERN',
    {
      message: 'Check your pattern regex and validator functions',
      code: `const pattern: PIIPattern = {
  type: '${patternType}',
  regex: /your-regex-here/g,
  placeholder: '[${patternType}_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Your description',
  validator: (value, context) => true
};`,
      docs: 'https://github.com/sam247/openredaction#custom-patterns'
    },
    { patternType, reason }
  );
}

export function createValidationError(value: string, patternType: string): OpenRedactionError {
  return new OpenRedactionError(
    `Value '${value}' failed validation for pattern type '${patternType}'`,
    'VALIDATION_FAILED',
    {
      message: 'The value matched the regex but failed custom validation. Consider whitelisting if this is expected.',
      code: `redactor.addToWhitelist('${value}', 0.9);`,
      docs: 'https://github.com/sam247/openredaction#whitelisting'
    },
    { value, patternType }
  );
}

export function createHighMemoryError(textSize: number): OpenRedactionError {
  const sizeMB = (textSize / 1024 / 1024).toFixed(2);

  return new OpenRedactionError(
    `Text size is ${sizeMB}MB. Consider using streaming API for large documents.`,
    'HIGH_MEMORY_USAGE',
    {
      message: 'Use StreamingDetector for memory-efficient processing of large documents',
      code: `import { createStreamingDetector } from 'openredaction';

const streaming = createStreamingDetector(redactor, {
  chunkSize: 2048,
  overlap: 100
});

for await (const chunk of streaming.processStream(largeText)) {
  console.log(chunk.detections);
}`,
      docs: 'https://github.com/sam247/openredaction#streaming-api'
    },
    { textSize, sizeMB }
  );
}

export function createConfigLoadError(path: string, reason: string): OpenRedactionError {
  return new OpenRedactionError(
    `Failed to load config from '${path}': ${reason}`,
    'CONFIG_LOAD_ERROR',
    {
      message: 'Check that your config file exists and is valid JSON',
      code: `{
  "patterns": ["EMAIL", "PHONE", "SSN"],
  "preset": "gdpr",
  "customPatterns": [],
  "whitelist": []
}`,
      docs: 'https://github.com/sam247/openredaction#configuration'
    },
    { path, reason }
  );
}

export function createLearningDisabledError(): OpenRedactionError {
  return new OpenRedactionError(
    'Learning system is disabled',
    'LEARNING_DISABLED',
    {
      message: 'Enable learning to use recordFalsePositive, recordFalseNegative, and other learning features',
      code: `const redactor = new OpenRedaction({
  enableLearning: true,
  learningStorePath: '.openredaction/learnings.json'
});`,
      docs: 'https://github.com/sam247/openredaction#learning-system'
    }
  );
}

export function createOptimizationDisabledError(): OpenRedactionError {
  return new OpenRedactionError(
    'Priority optimization is disabled',
    'OPTIMIZATION_DISABLED',
    {
      message: 'Enable priority optimization to use dynamic priority adjustment features',
      code: `const redactor = new OpenRedaction({
  enablePriorityOptimization: true,
  optimizerOptions: {
    learningWeight: 0.3,
    minSampleSize: 10,
    maxPriorityAdjustment: 15
  }
});`,
      docs: 'https://github.com/sam247/openredaction#priority-optimization'
    }
  );
}

export function createMultiPassDisabledError(): OpenRedactionError {
  return new OpenRedactionError(
    'Multi-pass detection is disabled',
    'MULTIPASS_DISABLED',
    {
      message: 'Enable multi-pass detection for improved accuracy with priority-based passes',
      code: `const redactor = new OpenRedaction({
  enableMultiPass: true,
  multiPassCount: 3
});`,
      docs: 'https://github.com/sam247/openredaction#multi-pass-detection'
    }
  );
}

export function createCacheDisabledError(): OpenRedactionError {
  return new OpenRedactionError(
    'Result caching is disabled',
    'CACHE_DISABLED',
    {
      message: 'Enable caching for high-volume usage and better performance',
      code: `const redactor = new OpenRedaction({
  enableCache: true,
  cacheSize: 100  // Cache last 100 results
});`,
      docs: 'https://github.com/sam247/openredaction#caching'
    }
  );
}
