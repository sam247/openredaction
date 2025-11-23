import * as fs from 'fs';
import * as path from 'path';

export interface WhitelistEntry {
  pattern: string;
  confidence: number;
  occurrences: number;
  firstSeen: number;
  lastSeen: number;
  contexts: string[];
}

export interface PatternAdjustment {
  type: string;
  issue: string;
  suggestion: string;
  confidence: number;
  examples: string[];
  occurrences: number;
}

export interface LearningStats {
  totalDetections: number;
  falsePositives: number;
  falseNegatives: number;
  accuracy: number;
  lastUpdated: number;
}

export interface FeedbackEntry {
  text: string;
  type: string;
  context: string;
  isFalsePositive: boolean;
  timestamp: number;
}

export interface LearningData {
  version: string;
  whitelist: WhitelistEntry[];
  patternAdjustments: PatternAdjustment[];
  stats: LearningStats;
}

export class LocalLearningStore {
  private filePath: string;
  private data: LearningData;
  private autoSave: boolean;
  private confidenceThreshold: number;

  constructor(filePath: string = '.openredaction/learnings.json', options: {
    autoSave?: boolean;
    confidenceThreshold?: number;
  } = {}) {
    this.filePath = filePath;
    this.autoSave = options.autoSave ?? true;
    this.confidenceThreshold = options.confidenceThreshold ?? 0.85;
    this.data = this.load();
  }

  /**
   * Load learning data from file
   */
  private load(): LearningData {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      // File doesn't exist or invalid JSON, start fresh
    }

    return {
      version: '1.0',
      whitelist: [],
      patternAdjustments: [],
      stats: {
        totalDetections: 0,
        falsePositives: 0,
        falseNegatives: 0,
        accuracy: 1.0,
        lastUpdated: Date.now()
      }
    };
  }

  /**
   * Save learning data to file
   */
  private save(): void {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.data.stats.lastUpdated = Date.now();
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Failed to save learning data:', error);
    }
  }

  /**
   * Record a false positive detection
   */
  recordFalsePositive(text: string, _type: string, context: string): void {
    this.data.stats.falsePositives++;
    this.data.stats.totalDetections++;
    this.updateAccuracy();

    // Find or create whitelist entry
    let entry = this.data.whitelist.find(e => e.pattern === text);

    if (entry) {
      entry.occurrences++;
      entry.lastSeen = Date.now();
      if (!entry.contexts.includes(context)) {
        entry.contexts.push(context);
      }
      // Increase confidence with each occurrence
      entry.confidence = Math.min(0.99, entry.confidence + 0.05);
    } else {
      entry = {
        pattern: text,
        confidence: 0.5, // Start with medium confidence
        occurrences: 1,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        contexts: [context]
      };
      this.data.whitelist.push(entry);
    }

    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Record a false negative (missed detection)
   */
  recordFalseNegative(text: string, type: string, _context: string): void {
    this.data.stats.falseNegatives++;
    this.data.stats.totalDetections++;
    this.updateAccuracy();

    // Find or create pattern adjustment
    let adjustment = this.data.patternAdjustments.find(
      a => a.type === type && a.examples.includes(text)
    );

    if (adjustment) {
      adjustment.occurrences++;
      adjustment.confidence = Math.min(0.99, adjustment.confidence + 0.05);
    } else {
      adjustment = {
        type,
        issue: `Pattern not detected`,
        suggestion: `Consider adding pattern for: ${text}`,
        confidence: 0.5,
        examples: [text],
        occurrences: 1
      };
      this.data.patternAdjustments.push(adjustment);
    }

    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Record a correct detection
   */
  recordCorrectDetection(): void {
    this.data.stats.totalDetections++;
    this.updateAccuracy();

    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Update accuracy calculation
   */
  private updateAccuracy(): void {
    const total = this.data.stats.totalDetections;
    if (total === 0) {
      this.data.stats.accuracy = 1.0;
      return;
    }

    const incorrect = this.data.stats.falsePositives + this.data.stats.falseNegatives;
    this.data.stats.accuracy = (total - incorrect) / total;
  }

  /**
   * Get whitelist entries above confidence threshold
   */
  getWhitelist(): string[] {
    return this.data.whitelist
      .filter(e => e.confidence >= this.confidenceThreshold)
      .map(e => e.pattern);
  }

  /**
   * Get all whitelist entries with metadata
   */
  getWhitelistEntries(): WhitelistEntry[] {
    return this.data.whitelist;
  }

  /**
   * Get pattern adjustments above confidence threshold
   */
  getPatternAdjustments(): PatternAdjustment[] {
    return this.data.patternAdjustments
      .filter(a => a.confidence >= this.confidenceThreshold)
      .sort((a, b) => b.occurrences - a.occurrences);
  }

  /**
   * Get all pattern adjustments
   */
  getAllPatternAdjustments(): PatternAdjustment[] {
    return this.data.patternAdjustments;
  }

  /**
   * Get learning statistics
   */
  getStats(): LearningStats {
    return { ...this.data.stats };
  }

  /**
   * Get confidence score for a specific pattern
   */
  getConfidence(pattern: string): number {
    const entry = this.data.whitelist.find(e => e.pattern === pattern);
    return entry?.confidence ?? 0;
  }

  /**
   * Get occurrences count for a specific pattern
   */
  getOccurrences(pattern: string): number {
    const entry = this.data.whitelist.find(e => e.pattern === pattern);
    return entry?.occurrences ?? 0;
  }

  /**
   * Manually add pattern to whitelist
   */
  addToWhitelist(pattern: string, confidence: number = 0.9): void {
    const existing = this.data.whitelist.find(e => e.pattern === pattern);

    if (existing) {
      existing.confidence = confidence;
      existing.occurrences++;
      existing.lastSeen = Date.now();
    } else {
      this.data.whitelist.push({
        pattern,
        confidence,
        occurrences: 1,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        contexts: []
      });
    }

    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Remove pattern from whitelist
   */
  removeFromWhitelist(pattern: string): void {
    this.data.whitelist = this.data.whitelist.filter(e => e.pattern !== pattern);

    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Clear all learning data
   */
  clear(): void {
    this.data = {
      version: '1.0',
      whitelist: [],
      patternAdjustments: [],
      stats: {
        totalDetections: 0,
        falsePositives: 0,
        falseNegatives: 0,
        accuracy: 1.0,
        lastUpdated: Date.now()
      }
    };

    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Export learning data (for sharing)
   */
  export(options: {
    includeContexts?: boolean;
    minConfidence?: number;
  } = {}): LearningData {
    const minConfidence = options.minConfidence ?? 0.7;
    const includeContexts = options.includeContexts ?? false;

    return {
      version: this.data.version,
      whitelist: this.data.whitelist
        .filter(e => e.confidence >= minConfidence)
        .map(e => ({
          ...e,
          contexts: includeContexts ? e.contexts : []
        })),
      patternAdjustments: this.data.patternAdjustments
        .filter(a => a.confidence >= minConfidence),
      stats: this.data.stats
    };
  }

  /**
   * Import learning data (merge with existing)
   */
  import(data: LearningData, merge: boolean = true): void {
    if (!merge) {
      this.data = data;
      this.save();
      return;
    }

    // Merge whitelist entries
    for (const entry of data.whitelist) {
      const existing = this.data.whitelist.find(e => e.pattern === entry.pattern);

      if (existing) {
        // Keep higher confidence and sum occurrences
        existing.confidence = Math.max(existing.confidence, entry.confidence);
        existing.occurrences += entry.occurrences;
        existing.lastSeen = Math.max(existing.lastSeen, entry.lastSeen);
        existing.contexts = [...new Set([...existing.contexts, ...entry.contexts])];
      } else {
        this.data.whitelist.push(entry);
      }
    }

    // Merge pattern adjustments
    for (const adjustment of data.patternAdjustments) {
      const existing = this.data.patternAdjustments.find(a =>
        a.type === adjustment.type && a.issue === adjustment.issue
      );

      if (existing) {
        existing.confidence = Math.max(existing.confidence, adjustment.confidence);
        existing.occurrences += adjustment.occurrences;
        existing.examples = [...new Set([...existing.examples, ...adjustment.examples])];
      } else {
        this.data.patternAdjustments.push(adjustment);
      }
    }

    // Merge stats
    this.data.stats.totalDetections += data.stats.totalDetections;
    this.data.stats.falsePositives += data.stats.falsePositives;
    this.data.stats.falseNegatives += data.stats.falseNegatives;
    this.updateAccuracy();

    if (this.autoSave) {
      this.save();
    }
  }

  /**
   * Manually save data
   */
  flush(): void {
    this.save();
  }
}
