import * as fs from 'fs';
import * as path from 'path';
import { OpenRedactionOptions } from '../types.js';

export interface OpenRedactionConfig extends OpenRedactionOptions {
  extends?: string | string[];
  learnedPatterns?: string;
  learningOptions?: {
    autoSave?: boolean;
    confidenceThreshold?: number;
  };
}

/**
 * Load configuration from .openredaction.config.js
 */
export class ConfigLoader {
  private configPath: string;
  private searchPaths: string[];

  constructor(configPath?: string, cwd: string = process.cwd()) {
    this.configPath = configPath || '';
    this.searchPaths = [
      cwd,
      path.join(cwd, '.openredaction'),
      path.join(process.env.HOME || '~', '.openredaction')
    ];
  }

  /**
   * Find config file in search paths
   */
  private findConfigFile(): string | null {
    if (this.configPath && fs.existsSync(this.configPath)) {
      return this.configPath;
    }

    const configNames = [
      '.openredaction.config.js',
      '.openredaction.config.mjs',
      '.openredaction.config.json',
      'openredaction.config.js',
      'openredaction.config.mjs',
      'openredaction.config.json'
    ];

    for (const searchPath of this.searchPaths) {
      for (const configName of configNames) {
        const fullPath = path.join(searchPath, configName);
        if (fs.existsSync(fullPath)) {
          return fullPath;
        }
      }
    }

    return null;
  }

  /**
   * Load config file
   */
  async load(): Promise<OpenRedactionConfig | null> {
    const configFile = this.findConfigFile();

    if (!configFile) {
      return null;
    }

    try {
      if (configFile.endsWith('.json')) {
        const content = fs.readFileSync(configFile, 'utf-8');
        return JSON.parse(content);
      }

      // Load JS/MJS config
      const config = await import(configFile);
      return config.default || config;
    } catch (error) {
      console.error(`Failed to load config from ${configFile}:`, error);
      return null;
    }
  }

  /**
   * Resolve presets and extends
   */
  resolveConfig(config: OpenRedactionConfig): OpenRedactionOptions {
    const resolved: OpenRedactionOptions = { ...config };

    // Handle extends
    if (config.extends) {
      const presets = Array.isArray(config.extends) ? config.extends : [config.extends];

      for (const preset of presets) {
        const presetConfig = this.loadPreset(preset);
        if (presetConfig) {
          Object.assign(resolved, presetConfig, config); // Config overrides preset
        }
      }
    }

    return resolved;
  }

  /**
   * Load built-in preset
   */
  private loadPreset(preset: string): OpenRedactionOptions | null {
    // Handle built-in presets
    if (preset === 'openredaction:recommended') {
      return {
        includeNames: true,
        includeAddresses: true,
        includePhones: true,
        includeEmails: true,
        deterministic: true
      };
    }

    if (preset === 'openredaction:strict') {
      return {
        includeNames: true,
        includeAddresses: true,
        includePhones: true,
        includeEmails: true,
        deterministic: true,
        preset: 'gdpr'
      };
    }

    if (preset === 'openredaction:minimal') {
      return {
        includeNames: false,
        includeAddresses: false,
        includePhones: true,
        includeEmails: true,
        deterministic: true
      };
    }

    // Handle compliance presets
    if (preset.startsWith('openredaction:')) {
      const complianceType = preset.replace('openredaction:', '') as 'gdpr' | 'hipaa' | 'ccpa';
      if (['gdpr', 'hipaa', 'ccpa'].includes(complianceType)) {
        return { preset: complianceType };
      }
    }

    return null;
  }

  /**
   * Create a default config file
   */
  static createDefaultConfig(outputPath: string = '.openredaction.config.js'): void {
    const defaultConfig = `/**
 * OpenRedaction Configuration
 * @see https://github.com/openredact/openredact
 */
export default {
  // Extend built-in presets
  // Options: 'openredaction:recommended', 'openredaction:strict', 'openredaction:minimal'
  // Or compliance: 'openredaction:gdpr', 'openredaction:hipaa', 'openredaction:ccpa'
  extends: ['openredaction:recommended'],

  // Detection options
  includeNames: true,
  includeAddresses: true,
  includePhones: true,
  includeEmails: true,

  // Deterministic placeholders (same PII -> same placeholder)
  deterministic: true,

  // Whitelist - patterns to never redact
  whitelist: [
    'Example Corp',
    'Test User',
    'API'
  ],

  // Custom patterns
  customPatterns: [
    {
      name: 'INTERNAL_ID',
      regex: /INT-\\d{6}/g,
      category: 'personal',
      priority: 90,
      description: 'Internal employee ID'
    }
  ],

  // Learning options
  learnedPatterns: '.openredaction/learnings.json',
  learningOptions: {
    autoSave: true,
    confidenceThreshold: 0.85
  }
};
`;

    fs.writeFileSync(outputPath, defaultConfig);
    console.log(`Created config file: ${outputPath}`);
  }
}
