import type { PIIPattern } from "../types";
import { generateDeterministicId } from "../utils/hash";
import { applyRedactionMode } from "../utils/redaction-strategies";
import type { DetectorOptions } from "./types";

export class PlaceholderGenerator {
  private valueToPlaceholder: Map<string, string> = new Map();
  private placeholderCounter: Map<string, number> = new Map();

  constructor(private options: DetectorOptions) {}

  generate(value: string, pattern: PIIPattern): string {
    if (this.options.deterministic && this.valueToPlaceholder.has(value)) {
      return this.valueToPlaceholder.get(value) as string;
    }

    let placeholder: string;

    if (this.options.redactionMode !== "placeholder") {
      placeholder = applyRedactionMode(
        value,
        pattern.type,
        this.options.redactionMode,
        pattern.placeholder,
      );
      this.valueToPlaceholder.set(value, placeholder);
      return placeholder;
    }

    if (this.options.deterministic) {
      const id = generateDeterministicId(value, pattern.type);
      placeholder = pattern.placeholder.replace("{n}", id);
    } else {
      const count = (this.placeholderCounter.get(pattern.type) || 0) + 1;
      this.placeholderCounter.set(pattern.type, count);
      placeholder = pattern.placeholder.replace("{n}", count.toString());
    }

    this.valueToPlaceholder.set(value, placeholder);
    return placeholder;
  }

  reset(): void {
    this.placeholderCounter.clear();
    this.valueToPlaceholder.clear();
  }
}
