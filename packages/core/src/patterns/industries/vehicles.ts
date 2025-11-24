/**
 * Vehicle and Transportation Identifiers
 * License plates, VINs, and vehicle-related identifiers
 */

import type { PIIPattern } from '../../types';

/**
 * Vehicle Identification Number (VIN)
 * Format: 17 characters (letters and digits, no I, O, Q)
 */
export const VIN_NUMBER: PIIPattern = {
  type: 'VIN_NUMBER',
  regex: /\bVIN[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-HJ-NPR-Z0-9]{17})\b/gi,
  placeholder: '[VIN_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Vehicle Identification Number (VIN)',
  validator: (value: string, context: string) => {
    // VINs don't use I, O, or Q to avoid confusion with 1, 0
    if (/[IOQ]/i.test(value)) return false;

    // Must be in vehicle context
    return /vin|vehicle|car|auto|motor|registration|title|insurance/i.test(context);
  }
};

/**
 * US License Plates - Generic Pattern
 * Matches most US state formats (3-8 alphanumeric characters)
 */
export const US_LICENSE_PLATE: PIIPattern = {
  type: 'US_LICENSE_PLATE',
  regex: /\b(?:PLATE|LICENSE|TAG)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{3,8})\b/gi,
  placeholder: '[PLATE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'US License Plate',
  validator: (value: string, context: string) => {
    // Must be in vehicle/license context
    if (!/plate|license|tag|vehicle|car|registration|dmv/i.test(context)) {
      return false;
    }

    // Exclude pure numbers (likely not a plate)
    if (/^\d+$/.test(value)) return false;

    // Exclude very short values
    if (value.length < 3) return false;

    return true;
  }
};

/**
 * California License Plate
 * Format: 1ABC234 (digit + 3 letters + 3 digits)
 */
export const CALIFORNIA_LICENSE_PLATE: PIIPattern = {
  type: 'CALIFORNIA_LICENSE_PLATE',
  regex: /\b(\d[A-Z]{3}\d{3})\b/g,
  placeholder: '[CA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'California License Plate',
  validator: (_value: string, context: string) => {
    return /california|ca\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * New York License Plate
 * Format: ABC1234 or ABC-1234
 */
export const NEW_YORK_LICENSE_PLATE: PIIPattern = {
  type: 'NEW_YORK_LICENSE_PLATE',
  regex: /\b([A-Z]{3}-?\d{4})\b/g,
  placeholder: '[NY_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'New York License Plate',
  validator: (_value: string, context: string) => {
    return /new\s?york|ny\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Texas License Plate
 * Format: ABC1234 or AB1-C234
 */
export const TEXAS_LICENSE_PLATE: PIIPattern = {
  type: 'TEXAS_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4}|[A-Z]{2}\d-[A-Z]\d{3})\b/g,
  placeholder: '[TX_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Texas License Plate',
  validator: (_value: string, context: string) => {
    return /texas|tx\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Florida License Plate
 * Format: ABC D12 or ABCD 12
 */
export const FLORIDA_LICENSE_PLATE: PIIPattern = {
  type: 'FLORIDA_LICENSE_PLATE',
  regex: /\b([A-Z]{3,4}\s[A-Z]?\d{2})\b/g,
  placeholder: '[FL_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Florida License Plate',
  validator: (_value: string, context: string) => {
    return /florida|fl\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * UK Vehicle Registration (License Plate)
 * Format: AB12 CDE or AB12CDE
 */
export const UK_LICENSE_PLATE: PIIPattern = {
  type: 'UK_LICENSE_PLATE',
  regex: /\b([A-Z]{2}\d{2}\s?[A-Z]{3})\b/g,
  placeholder: '[UK_PLATE_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'UK Vehicle Registration Plate',
  validator: (_value: string, context: string) => {
    return /uk|british|britain|registration|number\s?plate|vehicle|dvla/i.test(context);
  }
};

/**
 * German License Plate
 * Format: AB-CD 1234 (city code + letters + numbers)
 */
export const GERMAN_LICENSE_PLATE: PIIPattern = {
  type: 'GERMAN_LICENSE_PLATE',
  regex: /\b([A-ZÄÖÜ]{1,3}[-\s][A-ZÄÖÜ]{1,2}\s?\d{1,4})\b/gi,
  placeholder: '[DE_PLATE_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'German License Plate (Kennzeichen)',
  validator: (_value: string, context: string) => {
    return /german|deutschland|kennzeichen|license|plate|vehicle|kfz/i.test(context);
  }
};

/**
 * French License Plate
 * Format: AB-123-CD
 */
export const FRENCH_LICENSE_PLATE: PIIPattern = {
  type: 'FRENCH_LICENSE_PLATE',
  regex: /\b([A-Z]{2}-\d{3}-[A-Z]{2})\b/gi,
  placeholder: '[FR_PLATE_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'French License Plate (Plaque d\'immatriculation)',
  validator: (_value: string, context: string) => {
    return /french|france|immatriculation|license|plate|vehicle/i.test(context);
  }
};

/**
 * Canadian License Plate
 * Format: ABCD 123 (varies by province)
 */
export const CANADIAN_LICENSE_PLATE: PIIPattern = {
  type: 'CANADIAN_LICENSE_PLATE',
  regex: /\b([A-Z]{3,4}[-\s]?\d{3,4})\b/g,
  placeholder: '[CA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Canadian License Plate',
  validator: (_value: string, context: string) => {
    return /canad|ontario|quebec|british\s?columbia|alberta|plate|license|vehicle/i.test(context);
  }
};

/**
 * Australian License Plate
 * Format: ABC123 or ABC-123 (varies by state)
 */
export const AUSTRALIAN_LICENSE_PLATE: PIIPattern = {
  type: 'AUSTRALIAN_LICENSE_PLATE',
  regex: /\b([A-Z]{2,3}[-\s]?\d{2,4})\b/g,
  placeholder: '[AU_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Australian License Plate',
  validator: (_value: string, context: string) => {
    return /australia|nsw|victoria|queensland|south\s?australia|plate|license|rego|registration/i.test(context);
  }
};

/**
 * Japanese License Plate
 * Format: XX 12-34 or Region 123 あ 12-34
 */
export const JAPANESE_LICENSE_PLATE: PIIPattern = {
  type: 'JAPANESE_LICENSE_PLATE',
  regex: /\b([あ-ん]{1}\s?\d{2}-\d{2}|\d{2,3}\s?[あ-ん]\s?\d{2}-\d{2})\b/g,
  placeholder: '[JP_PLATE_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Japanese License Plate (ナンバープレート)',
  validator: (_value: string, context: string) => {
    return /japan|japanese|ナンバー|車両|plate|license|vehicle/i.test(context);
  }
};

/**
 * Generic International License Plate
 * Fallback pattern for other countries
 */
export const INTERNATIONAL_LICENSE_PLATE: PIIPattern = {
  type: 'INTERNATIONAL_LICENSE_PLATE',
  regex: /\b(?:PLATE|REGISTRATION|TAG)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{4,10})\b/gi,
  placeholder: '[PLATE_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'International License Plate',
  validator: (_value: string, context: string) => {
    return /plate|registration|license|vehicle|car|motor/i.test(context);
  }
};

export const vehiclePatterns: PIIPattern[] = [
  VIN_NUMBER,
  US_LICENSE_PLATE,
  CALIFORNIA_LICENSE_PLATE,
  NEW_YORK_LICENSE_PLATE,
  TEXAS_LICENSE_PLATE,
  FLORIDA_LICENSE_PLATE,
  UK_LICENSE_PLATE,
  GERMAN_LICENSE_PLATE,
  FRENCH_LICENSE_PLATE,
  CANADIAN_LICENSE_PLATE,
  AUSTRALIAN_LICENSE_PLATE,
  JAPANESE_LICENSE_PLATE,
  INTERNATIONAL_LICENSE_PLATE
];
