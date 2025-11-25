/**
 * Lightweight NER (Named Entity Recognition) integration using compromise.js
 * Provides semantic detection to complement regex-based pattern matching
 */

import type { PIIMatch } from '../types';

/**
 * NER entity types supported
 */
export type NEREntityType = 'PERSON' | 'ORGANIZATION' | 'PLACE' | 'DATE' | 'MONEY' | 'PHONE' | 'EMAIL' | 'URL';

/**
 * NER detection result
 */
export interface NERMatch {
  /** Entity type */
  type: NEREntityType;
  /** Matched text */
  text: string;
  /** Start position in text */
  start: number;
  /** End position in text */
  end: number;
  /** Confidence from NER (0-1) */
  confidence: number;
  /** Additional context */
  context?: {
    sentence?: string;
    tags?: string[];
  };
}

/**
 * Hybrid detection result (regex + NER)
 */
export interface HybridMatch extends PIIMatch {
  /** Whether this match was confirmed by NER */
  nerConfirmed: boolean;
  /** NER confidence if confirmed */
  nerConfidence?: number;
}

/**
 * NER Detector using compromise.js
 * Lightweight NLP library (7KB) for English text analysis
 */
export class NERDetector {
  private nlp?: any;
  private available: boolean = false;

  constructor() {
    // Try to load compromise.js (optional peer dependency)
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.nlp = require('compromise');
      this.available = true;
    } catch {
      // compromise not installed - NER features disabled
      this.available = false;
    }
  }

  /**
   * Check if NER is available (compromise.js installed)
   */
  isAvailable(): boolean {
    return this.available;
  }

  /**
   * Detect named entities in text
   */
  detect(text: string): NERMatch[] {
    if (!this.available || !this.nlp) {
      return [];
    }

    const matches: NERMatch[] = [];

    try {
      const doc = this.nlp(text);

      // Extract person names
      const people = doc.people();
      people.forEach((person: any) => {
        const personText = person.text();
        const offset = text.indexOf(personText);

        if (offset !== -1) {
          matches.push({
            type: 'PERSON',
            text: personText,
            start: offset,
            end: offset + personText.length,
            confidence: 0.85, // Base confidence for NER detection
            context: {
              sentence: this.getSentence(text, offset),
              tags: person.tags()
            }
          });
        }
      });

      // Extract organizations
      const orgs = doc.organizations();
      orgs.forEach((org: any) => {
        const orgText = org.text();
        const offset = text.indexOf(orgText);

        if (offset !== -1) {
          matches.push({
            type: 'ORGANIZATION',
            text: orgText,
            start: offset,
            end: offset + orgText.length,
            confidence: 0.80,
            context: {
              sentence: this.getSentence(text, offset),
              tags: org.tags()
            }
          });
        }
      });

      // Extract places
      const places = doc.places();
      places.forEach((place: any) => {
        const placeText = place.text();
        const offset = text.indexOf(placeText);

        if (offset !== -1) {
          matches.push({
            type: 'PLACE',
            text: placeText,
            start: offset,
            end: offset + placeText.length,
            confidence: 0.75,
            context: {
              sentence: this.getSentence(text, offset),
              tags: place.tags()
            }
          });
        }
      });

      // Extract dates
      const dates = doc.dates();
      dates.forEach((date: any) => {
        const dateText = date.text();
        const offset = text.indexOf(dateText);

        if (offset !== -1) {
          matches.push({
            type: 'DATE',
            text: dateText,
            start: offset,
            end: offset + dateText.length,
            confidence: 0.90,
            context: {
              sentence: this.getSentence(text, offset),
              tags: date.tags()
            }
          });
        }
      });

      // Extract money/currency
      const money = doc.money();
      money.forEach((m: any) => {
        const moneyText = m.text();
        const offset = text.indexOf(moneyText);

        if (offset !== -1) {
          matches.push({
            type: 'MONEY',
            text: moneyText,
            start: offset,
            end: offset + moneyText.length,
            confidence: 0.85,
            context: {
              sentence: this.getSentence(text, offset),
              tags: m.tags()
            }
          });
        }
      });

      // Extract emails (compromise.js supports this)
      const emails = doc.match('#Email');
      emails.forEach((email: any) => {
        const emailText = email.text();
        const offset = text.indexOf(emailText);

        if (offset !== -1) {
          matches.push({
            type: 'EMAIL',
            text: emailText,
            start: offset,
            end: offset + emailText.length,
            confidence: 0.95,
            context: {
              sentence: this.getSentence(text, offset)
            }
          });
        }
      });

      // Extract phone numbers (compromise.js supports this)
      const phones = doc.match('#PhoneNumber');
      phones.forEach((phone: any) => {
        const phoneText = phone.text();
        const offset = text.indexOf(phoneText);

        if (offset !== -1) {
          matches.push({
            type: 'PHONE',
            text: phoneText,
            start: offset,
            end: offset + phoneText.length,
            confidence: 0.85,
            context: {
              sentence: this.getSentence(text, offset)
            }
          });
        }
      });

      // Extract URLs (compromise.js supports this)
      const urls = doc.match('#Url');
      urls.forEach((url: any) => {
        const urlText = url.text();
        const offset = text.indexOf(urlText);

        if (offset !== -1) {
          matches.push({
            type: 'URL',
            text: urlText,
            start: offset,
            end: offset + urlText.length,
            confidence: 0.90,
            context: {
              sentence: this.getSentence(text, offset)
            }
          });
        }
      });
    } catch (error) {
      // NER detection failed, return empty array
      console.warn('[NERDetector] Detection failed:', error);
      return [];
    }

    // Remove duplicates (same text at same position)
    return this.deduplicateMatches(matches);
  }

  /**
   * Check if a regex match is confirmed by NER
   */
  isConfirmedByNER(
    regexMatch: PIIMatch,
    nerMatches: NERMatch[]
  ): { confirmed: boolean; confidence?: number } {
    // Check if any NER match overlaps with regex match
    for (const nerMatch of nerMatches) {
      const overlap = this.calculateOverlap(
        regexMatch.start,
        regexMatch.end,
        nerMatch.start,
        nerMatch.end
      );

      // Consider confirmed if overlap > 50%
      if (overlap > 0.5) {
        return {
          confirmed: true,
          confidence: nerMatch.confidence
        };
      }
    }

    return { confirmed: false };
  }

  /**
   * Boost confidence of regex matches that are confirmed by NER
   */
  hybridDetection(
    regexMatches: PIIMatch[],
    text: string
  ): HybridMatch[] {
    if (!this.available) {
      // NER not available, return regex matches as-is with nerConfirmed: false
      return regexMatches.map(match => ({
        ...match,
        nerConfirmed: false
      }));
    }

    // Run NER detection
    const nerMatches = this.detect(text);

    // Check each regex match against NER
    return regexMatches.map(match => {
      const { confirmed, confidence: nerConfidence } = this.isConfirmedByNER(match, nerMatches);

      if (confirmed && nerConfidence) {
        // Boost confidence for NER-confirmed matches
        const boostedConfidence = Math.min(1.0, match.confidence * 1.3);

        return {
          ...match,
          confidence: boostedConfidence,
          nerConfirmed: true,
          nerConfidence
        };
      }

      return {
        ...match,
        nerConfirmed: false
      };
    });
  }

  /**
   * Calculate overlap between two ranges (0-1)
   */
  private calculateOverlap(
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ): number {
    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);

    if (overlapStart >= overlapEnd) {
      return 0; // No overlap
    }

    const overlapLength = overlapEnd - overlapStart;
    const minLength = Math.min(end1 - start1, end2 - start2);

    return overlapLength / minLength;
  }

  /**
   * Remove duplicate NER matches
   */
  private deduplicateMatches(matches: NERMatch[]): NERMatch[] {
    const seen = new Set<string>();
    const unique: NERMatch[] = [];

    for (const match of matches) {
      const key = `${match.type}:${match.start}:${match.end}:${match.text}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(match);
      }
    }

    return unique;
  }

  /**
   * Extract sentence containing the match
   */
  private getSentence(text: string, position: number): string {
    // Find sentence boundaries
    const start = this.findSentenceStart(text, position);
    const end = this.findSentenceEnd(text, position);

    return text.substring(start, end).trim();
  }

  /**
   * Find start of sentence
   */
  private findSentenceStart(text: string, pos: number): number {
    for (let i = pos - 1; i >= 0; i--) {
      const char = text[i];
      if (char === '.' || char === '!' || char === '?' || char === '\n') {
        return i + 1;
      }
    }
    return 0;
  }

  /**
   * Find end of sentence
   */
  private findSentenceEnd(text: string, pos: number): number {
    for (let i = pos; i < text.length; i++) {
      const char = text[i];
      if (char === '.' || char === '!' || char === '?' || char === '\n') {
        return i + 1;
      }
    }
    return text.length;
  }

  /**
   * Extract additional NER-only detections (entities not caught by regex)
   */
  extractNEROnly(
    nerMatches: NERMatch[],
    regexMatches: PIIMatch[]
  ): NERMatch[] {
    const nerOnly: NERMatch[] = [];

    for (const nerMatch of nerMatches) {
      // Check if this NER match overlaps with any regex match
      const hasOverlap = regexMatches.some(regexMatch => {
        const overlap = this.calculateOverlap(
          regexMatch.start,
          regexMatch.end,
          nerMatch.start,
          nerMatch.end
        );
        return overlap > 0.3; // Consider overlap if > 30%
      });

      if (!hasOverlap) {
        nerOnly.push(nerMatch);
      }
    }

    return nerOnly;
  }
}

/**
 * Create an NER detector instance
 */
export function createNERDetector(): NERDetector {
  return new NERDetector();
}
