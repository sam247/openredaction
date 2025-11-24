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
 * Illinois License Plate
 * Format: AB12345 (2 letters + 5 digits)
 */
export const ILLINOIS_LICENSE_PLATE: PIIPattern = {
  type: 'ILLINOIS_LICENSE_PLATE',
  regex: /\b([A-Z]{2}\d{5})\b/g,
  placeholder: '[IL_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Illinois License Plate',
  validator: (_value: string, context: string) => {
    return /illinois|il\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Pennsylvania License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const PENNSYLVANIA_LICENSE_PLATE: PIIPattern = {
  type: 'PENNSYLVANIA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[PA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Pennsylvania License Plate',
  validator: (_value: string, context: string) => {
    return /pennsylvania|pa\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Ohio License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const OHIO_LICENSE_PLATE: PIIPattern = {
  type: 'OHIO_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[OH_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Ohio License Plate',
  validator: (_value: string, context: string) => {
    return /ohio|oh\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Michigan License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const MICHIGAN_LICENSE_PLATE: PIIPattern = {
  type: 'MICHIGAN_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[MI_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Michigan License Plate',
  validator: (_value: string, context: string) => {
    return /michigan|mi\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Georgia License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const GEORGIA_LICENSE_PLATE: PIIPattern = {
  type: 'GEORGIA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[GA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Georgia License Plate',
  validator: (_value: string, context: string) => {
    return /georgia|ga\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * North Carolina License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const NORTH_CAROLINA_LICENSE_PLATE: PIIPattern = {
  type: 'NORTH_CAROLINA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[NC_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'North Carolina License Plate',
  validator: (_value: string, context: string) => {
    return /north\s?carolina|nc\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * New Jersey License Plate
 * Format: A12BCD (letter + 2 digits + 3 letters)
 */
export const NEW_JERSEY_LICENSE_PLATE: PIIPattern = {
  type: 'NEW_JERSEY_LICENSE_PLATE',
  regex: /\b([A-Z]\d{2}[A-Z]{3})\b/g,
  placeholder: '[NJ_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'New Jersey License Plate',
  validator: (_value: string, context: string) => {
    return /new\s?jersey|nj\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Virginia License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const VIRGINIA_LICENSE_PLATE: PIIPattern = {
  type: 'VIRGINIA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[VA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Virginia License Plate',
  validator: (_value: string, context: string) => {
    return /virginia|va\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Washington License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const WASHINGTON_LICENSE_PLATE: PIIPattern = {
  type: 'WASHINGTON_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[WA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Washington License Plate',
  validator: (_value: string, context: string) => {
    return /washington|wa\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Massachusetts License Plate
 * Format: 1ABC23 (digit + 3 letters + 2 digits)
 */
export const MASSACHUSETTS_LICENSE_PLATE: PIIPattern = {
  type: 'MASSACHUSETTS_LICENSE_PLATE',
  regex: /\b(\d[A-Z]{3}\d{2})\b/g,
  placeholder: '[MA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Massachusetts License Plate',
  validator: (_value: string, context: string) => {
    return /massachusetts|ma\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Arizona License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const ARIZONA_LICENSE_PLATE: PIIPattern = {
  type: 'ARIZONA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[AZ_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Arizona License Plate',
  validator: (_value: string, context: string) => {
    return /arizona|az\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Tennessee License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const TENNESSEE_LICENSE_PLATE: PIIPattern = {
  type: 'TENNESSEE_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[TN_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Tennessee License Plate',
  validator: (_value: string, context: string) => {
    return /tennessee|tn\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Indiana License Plate
 * Format: 123ABC (3 digits + 3 letters)
 */
export const INDIANA_LICENSE_PLATE: PIIPattern = {
  type: 'INDIANA_LICENSE_PLATE',
  regex: /\b(\d{3}[A-Z]{3})\b/g,
  placeholder: '[IN_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Indiana License Plate',
  validator: (_value: string, context: string) => {
    return /indiana|in\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Missouri License Plate
 * Format: AB1C2D (2 letters + digit + letter + digit + letter)
 */
export const MISSOURI_LICENSE_PLATE: PIIPattern = {
  type: 'MISSOURI_LICENSE_PLATE',
  regex: /\b([A-Z]{2}\d[A-Z]\d[A-Z])\b/g,
  placeholder: '[MO_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Missouri License Plate',
  validator: (_value: string, context: string) => {
    return /missouri|mo\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Maryland License Plate
 * Format: 1AB2345 (digit + 2 letters + 4 digits)
 */
export const MARYLAND_LICENSE_PLATE: PIIPattern = {
  type: 'MARYLAND_LICENSE_PLATE',
  regex: /\b(\d[A-Z]{2}\d{4})\b/g,
  placeholder: '[MD_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Maryland License Plate',
  validator: (_value: string, context: string) => {
    return /maryland|md\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Wisconsin License Plate
 * Format: ABC1234 (3 letters + 4 digits)
 */
export const WISCONSIN_LICENSE_PLATE: PIIPattern = {
  type: 'WISCONSIN_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{4})\b/g,
  placeholder: '[WI_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Wisconsin License Plate',
  validator: (_value: string, context: string) => {
    return /wisconsin|wi\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Colorado License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const COLORADO_LICENSE_PLATE: PIIPattern = {
  type: 'COLORADO_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[CO_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Colorado License Plate',
  validator: (_value: string, context: string) => {
    return /colorado|co\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Minnesota License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const MINNESOTA_LICENSE_PLATE: PIIPattern = {
  type: 'MINNESOTA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[MN_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Minnesota License Plate',
  validator: (_value: string, context: string) => {
    return /minnesota|mn\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * South Carolina License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const SOUTH_CAROLINA_LICENSE_PLATE: PIIPattern = {
  type: 'SOUTH_CAROLINA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[SC_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'South Carolina License Plate',
  validator: (_value: string, context: string) => {
    return /south\s?carolina|sc\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Alabama License Plate
 * Format: 12AB345 (2 digits + 2 letters + 3 digits)
 */
export const ALABAMA_LICENSE_PLATE: PIIPattern = {
  type: 'ALABAMA_LICENSE_PLATE',
  regex: /\b(\d{2}[A-Z]{2}\d{3})\b/g,
  placeholder: '[AL_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Alabama License Plate',
  validator: (_value: string, context: string) => {
    return /alabama|al\s|plate|license|dmv|vehicle/i.test(context);
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
  ILLINOIS_LICENSE_PLATE,
  PENNSYLVANIA_LICENSE_PLATE,
  OHIO_LICENSE_PLATE,
  MICHIGAN_LICENSE_PLATE,
  GEORGIA_LICENSE_PLATE,
  NORTH_CAROLINA_LICENSE_PLATE,
  NEW_JERSEY_LICENSE_PLATE,
  VIRGINIA_LICENSE_PLATE,
  WASHINGTON_LICENSE_PLATE,
  MASSACHUSETTS_LICENSE_PLATE,
  ARIZONA_LICENSE_PLATE,
  TENNESSEE_LICENSE_PLATE,
  INDIANA_LICENSE_PLATE,
  MISSOURI_LICENSE_PLATE,
  MARYLAND_LICENSE_PLATE,
  WISCONSIN_LICENSE_PLATE,
  COLORADO_LICENSE_PLATE,
  MINNESOTA_LICENSE_PLATE,
  SOUTH_CAROLINA_LICENSE_PLATE,
  ALABAMA_LICENSE_PLATE,
  UK_LICENSE_PLATE,
  GERMAN_LICENSE_PLATE,
  FRENCH_LICENSE_PLATE,
  CANADIAN_LICENSE_PLATE,
  AUSTRALIAN_LICENSE_PLATE,
  JAPANESE_LICENSE_PLATE,
  INTERNATIONAL_LICENSE_PLATE
];
