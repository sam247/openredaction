/**
 * AI Assist utilities for enhanced PII detection
 * Calls the hosted OpenRedaction AI endpoint to get additional entities
 */

import type { PIIDetection } from '../types';

/**
 * AI endpoint response entity structure
 */
export interface AIEntity {
  type: string;
  value: string;
  start: number;
  end: number;
  confidence?: number;
}

/**
 * AI endpoint response structure
 */
export interface AIResponse {
  entities: AIEntity[];
  aiUsed: boolean;
}

/**
 * Get the AI endpoint URL from options or environment
 */
export function getAIEndpoint(aiOptions?: { enabled?: boolean; endpoint?: string }): string | null {
  if (!aiOptions?.enabled) {
    return null;
  }

  // Prefer explicit endpoint
  if (aiOptions.endpoint) {
    return aiOptions.endpoint;
  }

  // Fall back to environment variable (Node.js only)
  if (typeof process !== 'undefined' && process.env) {
    const envEndpoint = process.env.OPENREDACTION_AI_ENDPOINT;
    if (envEndpoint) {
      return envEndpoint;
    }
  }

  return null;
}

/**
 * Check if fetch is available in the current environment
 */
function isFetchAvailable(): boolean {
  return typeof fetch !== 'undefined';
}

/**
 * Call the AI endpoint to get additional PII entities
 * Returns null if AI is disabled, endpoint unavailable, or on error
 */
export async function callAIDetect(
  text: string,
  endpoint: string,
  debug?: boolean
): Promise<AIEntity[] | null> {
  if (!isFetchAvailable()) {
    if (debug) {
      console.warn('[OpenRedaction] AI assist requires fetch API. Not available in this environment.');
    }
    return null;
  }

  try {
    const url = endpoint.endsWith('/ai-detect') ? endpoint : `${endpoint}/ai-detect`;
    
    if (debug) {
      console.log(`[OpenRedaction] Calling AI endpoint: ${url}`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      if (debug) {
        console.warn(`[OpenRedaction] AI endpoint returned ${response.status}: ${response.statusText}`);
      }
      return null;
    }

    const data = await response.json() as AIResponse;

    if (!data.entities || !Array.isArray(data.entities)) {
      if (debug) {
        console.warn('[OpenRedaction] Invalid AI response format: missing entities array');
      }
      return null;
    }

    return data.entities;
  } catch (error) {
    // Silently fail - AI is optional enhancement
    if (debug) {
      console.warn(`[OpenRedaction] AI endpoint error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return null;
  }
}

/**
 * Validate an AI entity
 */
export function validateAIEntity(entity: AIEntity, textLength: number): boolean {
  // Must have required fields
  if (!entity.type || !entity.value || typeof entity.start !== 'number' || typeof entity.end !== 'number') {
    return false;
  }

  // Start and end must be valid
  if (entity.start < 0 || entity.end < 0 || entity.start >= entity.end) {
    return false;
  }

  // Must be within text bounds
  if (entity.start >= textLength || entity.end > textLength) {
    return false;
  }

  // Value must match the text at the specified position
  const actualValue = entity.value;
  if (actualValue.length !== entity.end - entity.start) {
    return false;
  }

  return true;
}

/**
 * Check if two detections overlap significantly
 * Returns true if they overlap by more than 50% of the shorter detection
 */
export function detectionsOverlap(det1: PIIDetection, det2: PIIDetection): boolean {
  const [start1, end1] = det1.position;
  const [start2, end2] = det2.position;

  // Calculate overlap
  const overlapStart = Math.max(start1, start2);
  const overlapEnd = Math.min(end1, end2);

  if (overlapStart >= overlapEnd) {
    return false; // No overlap
  }

  const overlapLength = overlapEnd - overlapStart;
  const length1 = end1 - start1;
  const length2 = end2 - start2;
  const minLength = Math.min(length1, length2);

  // Overlap if more than 50% of the shorter detection overlaps
  return overlapLength > minLength * 0.5;
}

/**
 * Convert AI entity to PIIDetection format
 */
export function convertAIEntityToDetection(
  entity: AIEntity,
  text: string
): PIIDetection | null {
  if (!validateAIEntity(entity, text.length)) {
    return null;
  }

  // Extract the actual value from text to ensure accuracy
  const actualValue = text.substring(entity.start, entity.end);

  // Map AI entity types to library types (basic mapping)
  let type = entity.type.toUpperCase();
  
  // Common mappings
  if (type.includes('EMAIL') || type === 'EMAIL_ADDRESS') {
    type = 'EMAIL';
  } else if (type.includes('PHONE') || type === 'PHONE_NUMBER') {
    type = 'PHONE_US'; // Default to US phone
  } else if (type.includes('NAME') || type === 'PERSON') {
    type = 'NAME';
  } else if (type.includes('SSN') || type === 'SOCIAL_SECURITY_NUMBER') {
    type = 'SSN';
  } else if (type.includes('ADDRESS')) {
    type = 'ADDRESS_STREET';
  }

  // Determine severity based on type
  let severity: 'critical' | 'high' | 'medium' | 'low' = 'medium';
  if (type === 'SSN' || type === 'CREDIT_CARD') {
    severity = 'critical';
  } else if (type === 'EMAIL' || type === 'PHONE_US' || type === 'NAME') {
    severity = 'high';
  }

  return {
    type,
    value: actualValue,
    placeholder: `[${type}_${Math.random().toString(36).substring(2, 9)}]`,
    position: [entity.start, entity.end],
    severity,
    confidence: entity.confidence ?? 0.7, // Default confidence for AI entities
  };
}

/**
 * Merge AI entities with regex detections
 * Prefers regex detections on conflicts
 */
export function mergeAIEntities(
  regexDetections: PIIDetection[],
  aiEntities: AIEntity[],
  text: string
): PIIDetection[] {
  const merged = [...regexDetections];
  const processedRanges: Array<[number, number]> = regexDetections.map(d => d.position);

  for (const aiEntity of aiEntities) {
    const detection = convertAIEntityToDetection(aiEntity, text);
    if (!detection) {
      continue; // Skip invalid entities
    }

    // Check for overlaps with existing regex detections
    let hasOverlap = false;
    for (const regexDet of regexDetections) {
      if (detectionsOverlap(regexDet, detection)) {
        hasOverlap = true;
        break; // Prefer regex detection, skip this AI entity
      }
    }

    if (!hasOverlap) {
      merged.push(detection);
      processedRanges.push(detection.position);
    }
  }

  return merged;
}

