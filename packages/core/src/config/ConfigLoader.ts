import * as fs from 'fs';
import * as path from 'path';
import { OpenRedactOptions } from '../types.js';

export interface OpenRedactConfig extends OpenRedactOptions {
  extends?: string | string[];
  learnedPatterns?: string;
  learningOptions?: {
    autoSave?: boolean;
    confidenceThreshold?: number;
  };
}

/**
 * Load configuration from .openredact.config.js
 */
export class ConfigLoader {
  private configPath: string;
  private searchPaths: string[];

  constructor(configPath?: string, cwd: string = process.cwd()) {
    this.configPath = configPath || '';
    this.searchPaths = [
      cwd,
      path.join(cwd, '.openredact'),
      path.join(process.env.HOME || '~', '.openredact')
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
      '.openredact.config.js',
      '.openredact.config.mjs',
      '.openredact.config.json',
      'openredact.config.js',
      'openredact.config.mjs',
      'openredact.config.json'
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
  async load(): Promise<OpenRedactConfig | null> {
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
  resolveConfig(config: OpenRedactConfig): OpenRedactOptions {
    const resolved: OpenRedactOptions = { ...config };

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
  private loadPreset(preset: string): OpenRedactOptions | null {
    // Handle built-in presets
    if (preset === 'openredact:recommended') {
      return {
        includeNames: true,
        includeAddresses: true,
        includePhones: true,
        includeEmails: true,
        deterministic: true
      };
    }

    if (preset === 'openredact:strict') {
      return {
        includeNames: true,
        includeAddresses: true,
        includePhones: true,
        includeEmails: true,
        deterministic: true,
        preset: 'gdpr'
      };
    }

    if (preset === 'openredact:minimal') {
      return {
        includeNames: false,
        includeAddresses: false,
        includePhones: true,
        includeEmails: true,
        deterministic: true
      };
    }

    // Handle compliance presets
    if (preset.startsWith('openredact:')) {
      const complianceType = preset.replace('openredact:', '') as 'gdpr' | 'hipaa' | 'ccpa';
      if (['gdpr', 'hipaa', 'ccpa'].includes(complianceType)) {
        return { preset: complianceType };
      }
    }

    return null;
  }

  /**
   * Create a default config file
   */
  static createDefaultConfig(outputPath: string = '.openredact.config.js'): void {
    const defaultConfig = `/**
 * OpenRedact Configuration
 * @see https://github.com/openredact/openredact
 */
export default {
  // Extend built-in presets
  // Options: 'openredact:recommended', 'openredact:strict', 'openredact:minimal'
  // Or compliance: 'openredact:gdpr', 'openredact:hipaa', 'openredact:ccpa'
  extends: ['openredact:recommended'],

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
  learnedPatterns: '.openredact/learnings.json',
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
