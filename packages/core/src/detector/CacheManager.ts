import type { DetectionResult } from "../types";
import { hashString, LRUCache } from "../utils/cache.js";
import type { DetectorOptions } from "./types";

export class CacheManager {
  private cache?: LRUCache<string, DetectionResult>;

  constructor(private options: DetectorOptions) {
    if (options.enableCache) {
      this.cache = new LRUCache<string, DetectionResult>(options.cacheSize);
    }
  }

  get(text: string): DetectionResult | undefined {
    if (!this.cache) return undefined;
    return this.cache.get(hashString(text));
  }

  set(text: string, result: DetectionResult): void {
    if (!this.cache) return;
    this.cache.set(hashString(text), result);
  }

  clear(): void {
    this.cache?.clear();
  }

  getStats(): { size: number; maxSize: number; enabled: boolean } {
    return {
      size: this.cache?.size || 0,
      maxSize: this.options.cacheSize,
      enabled: this.options.enableCache,
    };
  }

  isEnabled(): boolean {
    return this.options.enableCache;
  }
}
