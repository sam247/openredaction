import { allPatterns, getPatternsByCategory } from "../patterns";
import type { PIIPattern } from "../types";
import { validatePattern } from "../utils/safe-regex.js";
import type { DetectorOptions } from "./types";

export class PatternManager {
  private patterns: PIIPattern[];
  private compiledPatterns: Map<PIIPattern, RegExp> = new Map();

  constructor(
    private options: DetectorOptions,
    patterns: PIIPattern[],
  ) {
    this.patterns = patterns;
    this.validatePatterns();
    this.precompilePatterns();
  }

  getPatterns(): PIIPattern[] {
    return [...this.patterns];
  }

  getCompiledRegex(pattern: PIIPattern): RegExp | undefined {
    return this.compiledPatterns.get(pattern);
  }

  getCompiledPatterns(): Map<PIIPattern, RegExp> {
    return this.compiledPatterns;
  }

  setPatterns(patterns: PIIPattern[]): void {
    this.patterns = patterns;
    this.precompilePatterns();
  }

  static buildPatternList(options: DetectorOptions): PIIPattern[] {
    let patterns: PIIPattern[];

    if (options.patterns && options.patterns.length > 0) {
      patterns = allPatterns.filter((p) => options.patterns?.includes(p.type));
    } else if (options.categories && options.categories.length > 0) {
      patterns = [];
      for (const category of options.categories) {
        const categoryPatterns = getPatternsByCategory(category);
        patterns.push(...categoryPatterns);
      }
      patterns = Array.from(new Map(patterns.map((p) => [p.type, p])).values());

      if (options.debug) {
        console.log(
          `[OpenRedaction] Loaded ${patterns.length} patterns from categories: ${options.categories.join(", ")}`,
        );
      }
    } else {
      patterns = allPatterns.filter((pattern) => {
        if (pattern.type === "NAME" && !options.includeNames) return false;
        if (pattern.type.startsWith("EMAIL") && !options.includeEmails)
          return false;
        if (pattern.type.startsWith("PHONE") && !options.includePhones)
          return false;
        if (pattern.type.startsWith("ADDRESS") && !options.includeAddresses)
          return false;
        if (pattern.type.startsWith("POSTCODE") && !options.includeAddresses)
          return false;
        if (pattern.type.startsWith("ZIP") && !options.includeAddresses)
          return false;

        return true;
      });
    }

    if (options.customPatterns && options.customPatterns.length > 0) {
      patterns.push(...options.customPatterns);
    }

    return patterns;
  }

  private validatePatterns(): void {
    if (
      !this.options.customPatterns ||
      this.options.customPatterns.length === 0
    ) {
      if (this.options.debug) {
        console.log(
          `[OpenRedaction] No custom patterns to validate. ${this.patterns.length} built-in patterns loaded.`,
        );
      }
      return;
    }

    for (const customPattern of this.options.customPatterns) {
      try {
        validatePattern(customPattern.regex);
      } catch (error) {
        const errorMsg = `[OpenRedaction] Invalid custom pattern '${customPattern.type}': ${(error as Error).message}`;
        throw new Error(errorMsg);
      }
    }

    if (this.options.debug) {
      console.log(
        `[OpenRedaction] Validated ${this.options.customPatterns.length} custom patterns. Total patterns: ${this.patterns.length}`,
      );
    }
  }

  private precompilePatterns(): void {
    this.compiledPatterns.clear();

    for (const pattern of this.patterns) {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      this.compiledPatterns.set(pattern, regex);
      if (
        this.options.debug &&
        (pattern.type === "NINTENDO_FRIEND_CODE" ||
          pattern.type === "TELECOMS_ACCOUNT_NUMBER")
      ) {
        console.log(
          `[OpenRedaction] Compiled pattern '${pattern.type}': ${regex}`,
        );
      }
    }

    if (this.options.debug) {
      console.log(
        `[OpenRedaction] Pre-compiled ${this.compiledPatterns.size} regex patterns`,
      );
    }
  }

  static overlapsWithExisting(
    start: number,
    end: number,
    ranges: Array<[number, number]>,
  ): boolean {
    return ranges.some(
      ([existingStart, existingEnd]) =>
        (start >= existingStart && start < existingEnd) ||
        (end > existingStart && end <= existingEnd) ||
        (start <= existingStart && end >= existingEnd),
    );
  }
}
