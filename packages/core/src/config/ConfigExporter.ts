/**
 * Configuration export/import utilities
 * Share configurations between projects and version control
 */

import type { OpenRedactionOptions, PIIPattern } from '../types';

export interface ExportedConfig {
  version: string; // Config version for compatibility
  timestamp: string; // When exported
  options: {
    includeNames?: boolean;
    includeAddresses?: boolean;
    includePhones?: boolean;
    includeEmails?: boolean;
    patterns?: string[];
    categories?: string[];
    whitelist?: string[];
    deterministic?: boolean;
    redactionMode?: string;
    preset?: string;
    enableContextAnalysis?: boolean;
    confidenceThreshold?: number;
    enableFalsePositiveFilter?: boolean;
    falsePositiveThreshold?: number;
    enableMultiPass?: boolean;
    multiPassCount?: number;
    enableCache?: boolean;
    cacheSize?: number;
    maxInputSize?: number;
    regexTimeout?: number;
  };
  customPatterns?: Array<{
    type: string;
    regex: string;
    flags: string;
    priority: number;
    placeholder: string;
    description?: string;
    severity?: string;
  }>;
  metadata?: {
    description?: string;
    author?: string;
    tags?: string[];
  };
}

export class ConfigExporter {
  private static readonly CONFIG_VERSION = '1.0';

  /**
   * Export configuration to JSON
   */
  static exportConfig(
    options: OpenRedactionOptions & {
      categories?: string[];
      maxInputSize?: number;
      regexTimeout?: number;
    },
    metadata?: {
      description?: string;
      author?: string;
      tags?: string[];
    }
  ): ExportedConfig {
    const exported: ExportedConfig = {
      version: this.CONFIG_VERSION,
      timestamp: new Date().toISOString(),
      options: {
        includeNames: options.includeNames,
        includeAddresses: options.includeAddresses,
        includePhones: options.includePhones,
        includeEmails: options.includeEmails,
        patterns: options.patterns,
        categories: options.categories,
        whitelist: options.whitelist,
        deterministic: options.deterministic,
        redactionMode: options.redactionMode,
        preset: options.preset,
        enableContextAnalysis: options.enableContextAnalysis,
        confidenceThreshold: options.confidenceThreshold,
        enableFalsePositiveFilter: options.enableFalsePositiveFilter,
        falsePositiveThreshold: options.falsePositiveThreshold,
        enableMultiPass: options.enableMultiPass,
        multiPassCount: options.multiPassCount,
        enableCache: options.enableCache,
        cacheSize: options.cacheSize,
        maxInputSize: options.maxInputSize,
        regexTimeout: options.regexTimeout
      },
      metadata
    };

    // Export custom patterns if present
    if (options.customPatterns && options.customPatterns.length > 0) {
      exported.customPatterns = options.customPatterns.map(p => ({
        type: p.type,
        regex: p.regex.source,
        flags: p.regex.flags,
        priority: p.priority,
        placeholder: p.placeholder,
        description: p.description,
        severity: p.severity
      }));
    }

    // Remove undefined values for cleaner JSON
    return JSON.parse(JSON.stringify(exported));
  }

  /**
   * Import configuration from JSON
   */
  static importConfig(
    exported: ExportedConfig,
    options?: {
      mergeWithDefaults?: boolean;
      validatePatterns?: boolean;
    }
  ): OpenRedactionOptions & {
    categories?: string[];
    maxInputSize?: number;
    regexTimeout?: number;
  } {
    // Validate version compatibility
    if (!exported.version || exported.version !== this.CONFIG_VERSION) {
      console.warn(
        `[OpenRedaction] Config version mismatch. Expected ${this.CONFIG_VERSION}, got ${exported.version}`
      );
    }

    const config: any = { ...exported.options };

    // Reconstruct custom patterns
    if (exported.customPatterns) {
      config.customPatterns = exported.customPatterns.map(p => {
        const pattern: PIIPattern = {
          type: p.type,
          regex: new RegExp(p.regex, p.flags),
          priority: p.priority,
          placeholder: p.placeholder,
          description: p.description,
          severity: p.severity as any
        };
        return pattern;
      });
    }

    return config;
  }

  /**
   * Export configuration to JSON string
   */
  static exportToString(
    options: OpenRedactionOptions & {
      categories?: string[];
      maxInputSize?: number;
      regexTimeout?: number;
    },
    metadata?: {
      description?: string;
      author?: string;
      tags?: string[];
    },
    pretty?: boolean
  ): string {
    const exported = this.exportConfig(options, metadata);
    return JSON.stringify(exported, null, pretty ? 2 : undefined);
  }

  /**
   * Import configuration from JSON string
   */
  static importFromString(json: string): OpenRedactionOptions & {
    categories?: string[];
    maxInputSize?: number;
    regexTimeout?: number;
  } {
    const exported: ExportedConfig = JSON.parse(json);
    return this.importConfig(exported);
  }

  /**
   * Export configuration to file (Node.js only)
   */
  static async exportToFile(
    filePath: string,
    options: OpenRedactionOptions & {
      categories?: string[];
      maxInputSize?: number;
      regexTimeout?: number;
    },
    metadata?: {
      description?: string;
      author?: string;
      tags?: string[];
    }
  ): Promise<void> {
    const fs = await import('fs/promises');
    const content = this.exportToString(options, metadata, true);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Import configuration from file (Node.js only)
   */
  static async importFromFile(filePath: string): Promise<OpenRedactionOptions & {
    categories?: string[];
    maxInputSize?: number;
    regexTimeout?: number;
  }> {
    const fs = await import('fs/promises');
    const content = await fs.readFile(filePath, 'utf-8');
    return this.importFromString(content);
  }

  /**
   * Validate exported config structure
   */
  static validateConfig(exported: ExportedConfig): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!exported.version) {
      errors.push('Missing version field');
    }

    if (!exported.timestamp) {
      errors.push('Missing timestamp field');
    }

    if (!exported.options) {
      errors.push('Missing options field');
    }

    // Validate custom patterns if present
    if (exported.customPatterns) {
      for (const pattern of exported.customPatterns) {
        if (!pattern.type || !pattern.regex || !pattern.placeholder) {
          errors.push(`Invalid custom pattern: ${pattern.type}`);
        }
        // Try to compile the regex
        try {
          new RegExp(pattern.regex, pattern.flags);
        } catch (e) {
          errors.push(`Invalid regex in pattern ${pattern.type}: ${(e as Error).message}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Merge two configurations (useful for extending base configs)
   */
  static mergeConfigs(
    base: ExportedConfig,
    override: ExportedConfig
  ): ExportedConfig {
    return {
      version: this.CONFIG_VERSION,
      timestamp: new Date().toISOString(),
      options: {
        ...base.options,
        ...override.options,
        // Special handling for arrays
        patterns: override.options.patterns || base.options.patterns,
        categories: override.options.categories || base.options.categories,
        whitelist: [
          ...(base.options.whitelist || []),
          ...(override.options.whitelist || [])
        ]
      },
      customPatterns: [
        ...(base.customPatterns || []),
        ...(override.customPatterns || [])
      ],
      metadata: {
        ...base.metadata,
        ...override.metadata
      }
    };
  }
}

/**
 * Convenience functions for common use cases
 */

/**
 * Create a shareable config preset
 */
export function createConfigPreset(
  name: string,
  description: string,
  options: OpenRedactionOptions & {
    categories?: string[];
    maxInputSize?: number;
    regexTimeout?: number;
  }
): string {
  return ConfigExporter.exportToString(options, {
    description: `${name}: ${description}`,
    tags: [name, 'preset']
  }, true);
}

/**
 * Quick export for version control
 */
export function exportForVersionControl(
  options: OpenRedactionOptions & {
    categories?: string[];
    maxInputSize?: number;
    regexTimeout?: number;
  }
): string {
  return ConfigExporter.exportToString(options, {
    description: 'OpenRedaction configuration',
    author: 'Generated automatically',
    tags: ['version-control']
  }, true);
}
