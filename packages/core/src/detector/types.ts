import type { ContextRulesConfig } from "../context/ContextRules.js";
import type { OptimizerOptions } from "../optimizer/PriorityOptimizer.js";
import type { OpenRedactionOptions, PresetName, RedactionMode } from "../types";

export interface DetectorOptions {
  includeNames: boolean;
  includeAddresses: boolean;
  includePhones: boolean;
  includeEmails: boolean;
  patterns: string[];
  categories: string[];
  customPatterns: import("../types").PIIPattern[];
  whitelist: string[];
  deterministic: boolean;
  redactionMode: RedactionMode;
  preset?: PresetName;
  enableContextAnalysis: boolean;
  confidenceThreshold: number;
  enableFalsePositiveFilter: boolean;
  falsePositiveThreshold: number;
  enableMultiPass: boolean;
  multiPassCount: number;
  enableCache: boolean;
  cacheSize: number;
  enablePriorityOptimization: boolean;
  optimizerOptions: OptimizerOptions;
  debug: boolean;
  maxInputSize: number;
  regexTimeout: number;
}

export type OpenRedactionConstructorOptions = OpenRedactionOptions & {
  configPath?: string;
  enableLearning?: boolean;
  learningStorePath?: string;
  enablePriorityOptimization?: boolean;
  optimizerOptions?: Partial<OptimizerOptions>;
  enableNER?: boolean;
  enableContextRules?: boolean;
  contextRulesConfig?: ContextRulesConfig;
  maxInputSize?: number;
  regexTimeout?: number;
};

export function mergeOptions(
  options: OpenRedactionConstructorOptions,
  presetOptions: Partial<DetectorOptions>,
): DetectorOptions {
  const merged = {
    includeNames: true,
    includeAddresses: true,
    includePhones: true,
    includeEmails: true,
    patterns: [],
    categories: [],
    customPatterns: [],
    whitelist: [],
    deterministic: true,
    redactionMode: "placeholder" as RedactionMode,
    enableContextAnalysis: true,
    confidenceThreshold: 0.5,
    enableFalsePositiveFilter: true,
    falsePositiveThreshold: 0.7,
    enableMultiPass: false,
    multiPassCount: 3,
    enableCache: false,
    cacheSize: 100,
    enablePriorityOptimization: false,
    debug: false,
    maxInputSize: 10 * 1024 * 1024,
    regexTimeout: 100,
    ...presetOptions,
    ...options,
  };

  return {
    ...merged,
    optimizerOptions: {
      learningWeight: options.optimizerOptions?.learningWeight ?? 0.3,
      minSampleSize: options.optimizerOptions?.minSampleSize ?? 10,
      maxPriorityAdjustment:
        options.optimizerOptions?.maxPriorityAdjustment ?? 15,
    },
  };
}
