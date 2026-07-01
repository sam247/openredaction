import { analyzeFullContext } from "../context/ContextAnalyzer.js";
import {
  type ContextRulesConfig,
  ContextRulesEngine,
} from "../context/ContextRules.js";
import { isFalsePositive } from "../filters/FalsePositiveFilter.js";
import { NERDetector } from "../ml/NERDetector.js";
import {
  createSimpleMultiPass,
  type DetectionPass,
  groupPatternsByPass,
  mergePassDetections,
} from "../multipass/MultiPassDetector.js";
import type {
  DetectionResult,
  PIIDetection,
  PIIMatch,
  PIIPattern,
} from "../types";
import { RegexTimeoutError, safeExec } from "../utils/safe-regex.js";
import type { AuditManager } from "./AuditManager";
import type { CacheManager } from "./CacheManager";
import { PatternManager } from "./PatternManager";
import type { PlaceholderGenerator } from "./PlaceholderGenerator";
import { escapeRegex } from "./RedactionUtils";
import type { DetectorOptions } from "./types";

export class DetectionEngine {
  private multiPassConfig?: DetectionPass[];
  private nerDetector?: NERDetector;
  private contextRulesEngine?: ContextRulesEngine;

  constructor(
    private options: DetectorOptions,
    private patternManager: PatternManager,
    private placeholderGenerator: PlaceholderGenerator,
    private cacheManager: CacheManager,
    private auditManager: AuditManager,
  ) {
    if (options.enableMultiPass) {
      this.multiPassConfig = createSimpleMultiPass({
        numPasses: options.multiPassCount,
        prioritizeCredentials: true,
      });
    }
  }

  initNER(): void {
    this.nerDetector = new NERDetector();
    if (!this.nerDetector.isAvailable()) {
      console.warn(
        "[OpenRedaction] NER enabled but compromise.js not installed. Install with: npm install compromise",
      );
      console.warn("[OpenRedaction] Falling back to regex-only detection.");
      this.nerDetector = undefined;
    }
  }

  initContextRules(config?: ContextRulesConfig): void {
    this.contextRulesEngine = new ContextRulesEngine(config);
  }

  hasContextRules(): boolean {
    return this.contextRulesEngine !== undefined;
  }

  async detect(text: string): Promise<DetectionResult> {
    const startTime = performance.now();

    const textSize = new Blob([text]).size;
    if (textSize > this.options.maxInputSize) {
      throw new Error(
        `[OpenRedaction] Input size (${textSize} bytes) exceeds maximum allowed size (${this.options.maxInputSize} bytes). ` +
          `Set maxInputSize option to increase limit or use streaming/batch processing for large documents.`,
      );
    }

    if (textSize > this.options.maxInputSize * 0.8 && this.options.debug) {
      console.warn(
        `[OpenRedaction] Input size (${textSize} bytes) is approaching maximum limit (${this.options.maxInputSize} bytes)`,
      );
    }

    if (this.options.debug) {
      console.log(`[OpenRedaction] Detecting PII in ${textSize} byte text`);
      console.log(
        `[OpenRedaction] Active patterns: ${this.patternManager.getPatterns().length}`,
      );
      console.log(
        `[OpenRedaction] Multi-pass: ${this.options.enableMultiPass ? "enabled" : "disabled"}`,
      );
      console.log(
        `[OpenRedaction] Cache: ${this.cacheManager.isEnabled() ? "enabled" : "disabled"}`,
      );
    }

    const cached = this.cacheManager.get(text);
    if (cached) {
      if (this.options.debug) {
        console.log("[OpenRedaction] Cache hit, returning cached result");
      }
      return cached;
    }

    if (!this.options.deterministic) {
      this.placeholderGenerator.reset();
    }

    let detections: PIIDetection[];
    const processedRanges: Array<[number, number]> = [];

    if (this.options.enableMultiPass && this.multiPassConfig) {
      const patternGroups = groupPatternsByPass(
        this.patternManager.getPatterns(),
        this.multiPassConfig,
      );
      const passDetections = new Map<string, PIIDetection[]>();

      for (const pass of this.multiPassConfig) {
        const passPatterns = patternGroups.get(pass.name) || [];
        if (passPatterns.length === 0) continue;

        const currentDetections = this.processPatterns(
          text,
          passPatterns,
          processedRanges,
        );

        passDetections.set(pass.name, currentDetections);

        for (const detection of currentDetections) {
          processedRanges.push(detection.position);
        }
      }

      detections = mergePassDetections(passDetections, this.multiPassConfig);
    } else {
      detections = this.processPatterns(
        text,
        this.patternManager.getPatterns(),
        processedRanges,
      );
    }

    detections.sort((a, b) => b.position[0] - a.position[0]);

    let redacted = text;
    const redactionMap: Record<string, string> = {};

    for (const detection of detections) {
      if (!detection.value) continue;

      const escapedValue = escapeRegex(detection.value);
      const pattern = new RegExp(escapedValue, "gi");
      redacted = redacted.replace(pattern, detection.placeholder);

      redactionMap[detection.placeholder] = detection.value;
    }

    const endTime = performance.now();
    const processingTime = Math.round((endTime - startTime) * 100) / 100;

    const result: DetectionResult = {
      original: text,
      redacted,
      detections: detections.reverse(),
      redactionMap,
      stats: {
        processingTime,
        piiCount: detections.length,
      },
    };

    if (this.options.debug) {
      console.log(
        `[OpenRedaction] Detection complete: ${detections.length} PII found in ${processingTime}ms`,
      );
      if (detections.length > 0) {
        const typeCounts: Record<string, number> = {};
        for (const detection of detections) {
          typeCounts[detection.type] = (typeCounts[detection.type] || 0) + 1;
        }
        console.log(`[OpenRedaction] Detection breakdown:`, typeCounts);
      }
    }

    this.auditManager.logAudit(
      "redact",
      detections.length,
      [...new Set(detections.map((d) => d.type))],
      text.length,
      processingTime,
      this.options.redactionMode,
      this.options.debug,
    );

    this.auditManager.recordMetrics(
      result,
      processingTime,
      this.options.redactionMode,
      this.options.debug,
    );

    this.cacheManager.set(text, result);

    if (this.options.debug) {
      console.log("[OpenRedaction] Result cached");
    }

    return result;
  }

  private processPatterns(
    text: string,
    patterns: PIIPattern[],
    processedRanges: Array<[number, number]>,
  ): PIIDetection[] {
    let detections: PIIDetection[] = [];

    for (const pattern of patterns) {
      const regex = this.patternManager.getCompiledRegex(pattern);
      if (!regex) {
        if (this.options.debug) {
          console.warn(
            `[OpenRedaction] Pattern '${pattern.type}' not found in compiled cache, skipping`,
          );
        }
        continue;
      }

      if (
        this.options.debug &&
        (pattern.type === "NINTENDO_FRIEND_CODE" ||
          pattern.type === "TELECOMS_ACCOUNT_NUMBER")
      ) {
        console.log(
          `[OpenRedaction] Processing pattern '${pattern.type}' with regex: ${regex}`,
        );
      }

      let match: RegExpExecArray | null;
      let matchCount = 0;
      const maxMatches = 10000;

      regex.lastIndex = 0;

      try {
        while (
          // biome-ignore lint/suspicious/noAssignInExpressions: tolerable
          (match = safeExec(regex, text, {
            timeout: this.options.regexTimeout,
          })) !== null
        ) {
          if (
            this.options.debug &&
            (pattern.type === "NINTENDO_FRIEND_CODE" ||
              pattern.type === "TELECOMS_ACCOUNT_NUMBER")
          ) {
            console.log(
              `[OpenRedaction] Pattern '${pattern.type}' regex match found: '${match[0]}' at position ${match.index}`,
            );
          }
          matchCount++;

          if (matchCount >= maxMatches) {
            if (this.options.debug) {
              console.warn(
                `[OpenRedaction] Pattern '${pattern.type}' exceeded ${maxMatches} matches, stopping`,
              );
            }
            break;
          }
          const value = match[1] !== undefined ? match[1] : match[0];
          const fullMatch = match[0];

          let startPos: number;
          let endPos: number;

          if (match[1] !== undefined) {
            const captureIndex = fullMatch.indexOf(value);
            startPos = match.index + captureIndex;
            endPos = startPos + value.length;
          } else {
            startPos = match.index;
            endPos = startPos + value.length;
          }

          if (
            PatternManager.overlapsWithExisting(
              startPos,
              endPos,
              processedRanges,
            )
          ) {
            if (this.options.debug) {
              console.log(
                `[OpenRedaction] Pattern '${pattern.type}' skipped due to overlap at ${startPos}-${endPos}`,
              );
            }
            continue;
          }

          const contextStart = Math.max(0, startPos - 50);
          const contextEnd = Math.min(text.length, endPos + 50);
          const context = text.substring(contextStart, contextEnd);

          if (pattern.validator && !pattern.validator(value, context)) {
            if (this.options.debug) {
              console.log(
                `[OpenRedaction] Pattern '${pattern.type}' validation failed for value: '${value}' with context: '${context.substring(0, 100)}...'`,
              );
            }
            continue;
          }

          if (this.options.enableFalsePositiveFilter) {
            const fpResult = isFalsePositive(value, pattern.type, context);
            if (
              fpResult.isFalsePositive &&
              fpResult.confidence >= this.options.falsePositiveThreshold
            ) {
              continue;
            }
          }

          let confidence = 1.0;
          if (this.options.enableContextAnalysis) {
            const contextAnalysis = analyzeFullContext(
              text,
              value,
              pattern.type,
              startPos,
              endPos,
            );
            confidence = contextAnalysis.confidence;
            if (
              this.options.debug &&
              confidence < this.options.confidenceThreshold
            ) {
              console.log(
                `[OpenRedaction] Pattern '${pattern.type}' failed context analysis. Value: '${value}', Confidence: ${confidence} < ${this.options.confidenceThreshold}`,
              );
            }
          }

          if (this.contextRulesEngine) {
            const piiMatch: PIIMatch = {
              type: pattern.type,
              value,
              start: startPos,
              end: endPos,
              confidence,
              context: {
                before: text.substring(Math.max(0, startPos - 250), startPos),
                after: text.substring(
                  endPos,
                  Math.min(text.length, endPos + 250),
                ),
              },
            };

            const adjusted = this.contextRulesEngine.applyProximityRules(
              piiMatch,
              text,
            );
            confidence = adjusted.confidence;
          }

          if (confidence < this.options.confidenceThreshold) {
            continue;
          }

          if (
            this.options.whitelist.some((term) =>
              value.toLowerCase().includes(term.toLowerCase()),
            )
          ) {
            continue;
          }

          const placeholder = this.placeholderGenerator.generate(
            value,
            pattern,
          );

          if (this.options.debug) {
            console.log(
              `[OpenRedaction] Pattern '${pattern.type}' detected: '${value}' at position ${startPos}-${endPos}, confidence: ${confidence}`,
            );
          }
          detections.push({
            type: pattern.type,
            value,
            placeholder,
            position: [startPos, endPos],
            severity: pattern.severity || "medium",
            confidence,
          });

          processedRanges.push([startPos, endPos]);
        }
      } catch (error) {
        if (error instanceof RegexTimeoutError) {
          if (this.options.debug) {
            console.warn(`[OpenRedaction] ${error.message}`);
          }
          continue;
        }
        throw error;
      }
    }

    if (this.nerDetector?.isAvailable()) {
      const nerMatches = this.nerDetector.detect(text);
      let piiMatches: PIIMatch[] = detections.map((det) => ({
        type: det.type,
        value: det.value,
        start: det.position[0],
        end: det.position[1],
        confidence: det.confidence || 1.0,
        context: {
          before: text.substring(
            Math.max(0, det.position[0] - 50),
            det.position[0],
          ),
          after: text.substring(
            det.position[1],
            Math.min(text.length, det.position[1] + 50),
          ),
        },
      }));

      if (detections.length > 0) {
        const hybridMatches = this.nerDetector.hybridDetection(
          piiMatches,
          text,
        );
        detections = detections.map((det, index) => ({
          ...det,
          confidence: hybridMatches[index].confidence,
        }));
        piiMatches = detections.map((det) => ({
          type: det.type,
          value: det.value,
          start: det.position[0],
          end: det.position[1],
          confidence: det.confidence || 1.0,
          context: {
            before: text.substring(
              Math.max(0, det.position[0] - 50),
              det.position[0],
            ),
            after: text.substring(
              det.position[1],
              Math.min(text.length, det.position[1] + 50),
            ),
          },
        }));
      }

      const nerOnly = this.nerDetector.extractNEROnly(nerMatches, piiMatches);
      for (const ner of nerOnly) {
        const syntheticPattern: PIIPattern = {
          type: `NER_${ner.type}`,
          regex: /.^/,
          priority: 1,
          placeholder: `[NER_${ner.type}_{n}]`,
          severity: "medium",
        };
        const placeholder = this.placeholderGenerator.generate(
          ner.text,
          syntheticPattern,
        );
        detections.push({
          type: syntheticPattern.type,
          value: ner.text,
          placeholder,
          position: [ner.start, ner.end],
          severity: "medium",
          confidence: ner.confidence,
        });
      }
    }

    if (this.contextRulesEngine && detections.length > 0) {
      const piiMatches: PIIMatch[] = detections.map((det) => ({
        type: det.type,
        value: det.value,
        start: det.position[0],
        end: det.position[1],
        confidence: det.confidence || 1.0,
        context: {
          before: text.substring(
            Math.max(0, det.position[0] - 50),
            det.position[0],
          ),
          after: text.substring(
            det.position[1],
            Math.min(text.length, det.position[1] + 50),
          ),
        },
      }));

      const boostedMatches = this.contextRulesEngine.applyDomainBoosting(
        piiMatches,
        text,
      );

      detections = detections.map((det, index) => ({
        ...det,
        confidence: boostedMatches[index].confidence,
      }));
    }

    return detections;
  }
}
