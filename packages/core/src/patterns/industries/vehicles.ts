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
 * Louisiana License Plate
 * Format: 123ABC (3 digits + 3 letters)
 */
export const LOUISIANA_LICENSE_PLATE: PIIPattern = {
  type: 'LOUISIANA_LICENSE_PLATE',
  regex: /\b(\d{3}[A-Z]{3})\b/g,
  placeholder: '[LA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Louisiana License Plate',
  validator: (_value: string, context: string) => {
    return /louisiana|la\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Kentucky License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const KENTUCKY_LICENSE_PLATE: PIIPattern = {
  type: 'KENTUCKY_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[KY_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Kentucky License Plate',
  validator: (_value: string, context: string) => {
    return /kentucky|ky\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Oregon License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const OREGON_LICENSE_PLATE: PIIPattern = {
  type: 'OREGON_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[OR_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Oregon License Plate',
  validator: (_value: string, context: string) => {
    return /oregon|or\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Oklahoma License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const OKLAHOMA_LICENSE_PLATE: PIIPattern = {
  type: 'OKLAHOMA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[OK_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Oklahoma License Plate',
  validator: (_value: string, context: string) => {
    return /oklahoma|ok\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Connecticut License Plate
 * Format: 123ABC or ABC123
 */
export const CONNECTICUT_LICENSE_PLATE: PIIPattern = {
  type: 'CONNECTICUT_LICENSE_PLATE',
  regex: /\b(\d{3}[A-Z]{3}|[A-Z]{3}\d{3})\b/g,
  placeholder: '[CT_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Connecticut License Plate',
  validator: (_value: string, context: string) => {
    return /connecticut|ct\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Utah License Plate
 * Format: A12BCD (letter + 2 digits + 3 letters)
 */
export const UTAH_LICENSE_PLATE: PIIPattern = {
  type: 'UTAH_LICENSE_PLATE',
  regex: /\b([A-Z]\d{2}[A-Z]{3})\b/g,
  placeholder: '[UT_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Utah License Plate',
  validator: (_value: string, context: string) => {
    return /utah|ut\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Iowa License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const IOWA_LICENSE_PLATE: PIIPattern = {
  type: 'IOWA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[IA_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Iowa License Plate',
  validator: (_value: string, context: string) => {
    return /iowa|ia\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Nevada License Plate
 * Format: 12A345 (2 digits + letter + 3 digits)
 */
export const NEVADA_LICENSE_PLATE: PIIPattern = {
  type: 'NEVADA_LICENSE_PLATE',
  regex: /\b(\d{2}[A-Z]\d{3})\b/g,
  placeholder: '[NV_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Nevada License Plate',
  validator: (_value: string, context: string) => {
    return /nevada|nv\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Arkansas License Plate
 * Format: 123ABC (3 digits + 3 letters)
 */
export const ARKANSAS_LICENSE_PLATE: PIIPattern = {
  type: 'ARKANSAS_LICENSE_PLATE',
  regex: /\b(\d{3}[A-Z]{3})\b/g,
  placeholder: '[AR_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Arkansas License Plate',
  validator: (_value: string, context: string) => {
    return /arkansas|ar\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Mississippi License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const MISSISSIPPI_LICENSE_PLATE: PIIPattern = {
  type: 'MISSISSIPPI_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[MS_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Mississippi License Plate',
  validator: (_value: string, context: string) => {
    return /mississippi|ms\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Kansas License Plate
 * Format: 123ABC (3 digits + 3 letters)
 */
export const KANSAS_LICENSE_PLATE: PIIPattern = {
  type: 'KANSAS_LICENSE_PLATE',
  regex: /\b(\d{3}[A-Z]{3})\b/g,
  placeholder: '[KS_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Kansas License Plate',
  validator: (_value: string, context: string) => {
    return /kansas|ks\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * New Mexico License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const NEW_MEXICO_LICENSE_PLATE: PIIPattern = {
  type: 'NEW_MEXICO_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[NM_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'New Mexico License Plate',
  validator: (_value: string, context: string) => {
    return /new\s?mexico|nm\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Nebraska License Plate
 * Format: A12345 (letter + 5 digits)
 */
export const NEBRASKA_LICENSE_PLATE: PIIPattern = {
  type: 'NEBRASKA_LICENSE_PLATE',
  regex: /\b([A-Z]\d{5})\b/g,
  placeholder: '[NE_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Nebraska License Plate',
  validator: (_value: string, context: string) => {
    return /nebraska|ne\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * West Virginia License Plate
 * Format: 1AB234 (digit + 2 letters + 3 digits)
 */
export const WEST_VIRGINIA_LICENSE_PLATE: PIIPattern = {
  type: 'WEST_VIRGINIA_LICENSE_PLATE',
  regex: /\b(\d[A-Z]{2}\d{3})\b/g,
  placeholder: '[WV_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'West Virginia License Plate',
  validator: (_value: string, context: string) => {
    return /west\s?virginia|wv\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Idaho License Plate
 * Format: 1A12345 (digit + letter + 5 digits)
 */
export const IDAHO_LICENSE_PLATE: PIIPattern = {
  type: 'IDAHO_LICENSE_PLATE',
  regex: /\b(\d[A-Z]\d{5})\b/g,
  placeholder: '[ID_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Idaho License Plate',
  validator: (_value: string, context: string) => {
    return /idaho|id\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Hawaii License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const HAWAII_LICENSE_PLATE: PIIPattern = {
  type: 'HAWAII_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[HI_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Hawaii License Plate',
  validator: (_value: string, context: string) => {
    return /hawaii|hi\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * New Hampshire License Plate
 * Format: 123AB or 1234AB
 */
export const NEW_HAMPSHIRE_LICENSE_PLATE: PIIPattern = {
  type: 'NEW_HAMPSHIRE_LICENSE_PLATE',
  regex: /\b(\d{3,4}[A-Z]{2})\b/g,
  placeholder: '[NH_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'New Hampshire License Plate',
  validator: (_value: string, context: string) => {
    return /new\s?hampshire|nh\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Maine License Plate
 * Format: 1234AB (4 digits + 2 letters)
 */
export const MAINE_LICENSE_PLATE: PIIPattern = {
  type: 'MAINE_LICENSE_PLATE',
  regex: /\b(\d{4}[A-Z]{2})\b/g,
  placeholder: '[ME_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Maine License Plate',
  validator: (_value: string, context: string) => {
    return /maine|me\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Montana License Plate
 * Format: 1-12345A (digit dash 5 digits letter)
 */
export const MONTANA_LICENSE_PLATE: PIIPattern = {
  type: 'MONTANA_LICENSE_PLATE',
  regex: /\b(\d-\d{5}[A-Z])\b/g,
  placeholder: '[MT_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Montana License Plate',
  validator: (_value: string, context: string) => {
    return /montana|mt\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Rhode Island License Plate
 * Format: 123456 (6 digits)
 */
export const RHODE_ISLAND_LICENSE_PLATE: PIIPattern = {
  type: 'RHODE_ISLAND_LICENSE_PLATE',
  regex: /\b(\d{6})\b/g,
  placeholder: '[RI_PLATE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Rhode Island License Plate',
  validator: (_value: string, context: string) => {
    return /rhode\s?island|ri\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Delaware License Plate
 * Format: 123456 (6 digits)
 */
export const DELAWARE_LICENSE_PLATE: PIIPattern = {
  type: 'DELAWARE_LICENSE_PLATE',
  regex: /\b(\d{6})\b/g,
  placeholder: '[DE_PLATE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Delaware License Plate',
  validator: (_value: string, context: string) => {
    return /delaware|de\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * South Dakota License Plate
 * Format: 12A345 (2 digits + letter + 3 digits)
 */
export const SOUTH_DAKOTA_LICENSE_PLATE: PIIPattern = {
  type: 'SOUTH_DAKOTA_LICENSE_PLATE',
  regex: /\b(\d{2}[A-Z]\d{3})\b/g,
  placeholder: '[SD_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'South Dakota License Plate',
  validator: (_value: string, context: string) => {
    return /south\s?dakota|sd\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * North Dakota License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const NORTH_DAKOTA_LICENSE_PLATE: PIIPattern = {
  type: 'NORTH_DAKOTA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[ND_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'North Dakota License Plate',
  validator: (_value: string, context: string) => {
    return /north\s?dakota|nd\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Alaska License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const ALASKA_LICENSE_PLATE: PIIPattern = {
  type: 'ALASKA_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[AK_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Alaska License Plate',
  validator: (_value: string, context: string) => {
    return /alaska|ak\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Vermont License Plate
 * Format: ABC123 (3 letters + 3 digits)
 */
export const VERMONT_LICENSE_PLATE: PIIPattern = {
  type: 'VERMONT_LICENSE_PLATE',
  regex: /\b([A-Z]{3}\d{3})\b/g,
  placeholder: '[VT_PLATE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Vermont License Plate',
  validator: (_value: string, context: string) => {
    return /vermont|vt\s|plate|license|dmv|vehicle/i.test(context);
  }
};

/**
 * Wyoming License Plate
 * Format: 12345 (5 digits)
 */
export const WYOMING_LICENSE_PLATE: PIIPattern = {
  type: 'WYOMING_LICENSE_PLATE',
  regex: /\b(\d{5})\b/g,
  placeholder: '[WY_PLATE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Wyoming License Plate',
  validator: (_value: string, context: string) => {
    return /wyoming|wy\s|plate|license|dmv|vehicle/i.test(context);
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
  LOUISIANA_LICENSE_PLATE,
  KENTUCKY_LICENSE_PLATE,
  OREGON_LICENSE_PLATE,
  OKLAHOMA_LICENSE_PLATE,
  CONNECTICUT_LICENSE_PLATE,
  UTAH_LICENSE_PLATE,
  IOWA_LICENSE_PLATE,
  NEVADA_LICENSE_PLATE,
  ARKANSAS_LICENSE_PLATE,
  MISSISSIPPI_LICENSE_PLATE,
  KANSAS_LICENSE_PLATE,
  NEW_MEXICO_LICENSE_PLATE,
  NEBRASKA_LICENSE_PLATE,
  WEST_VIRGINIA_LICENSE_PLATE,
  IDAHO_LICENSE_PLATE,
  HAWAII_LICENSE_PLATE,
  NEW_HAMPSHIRE_LICENSE_PLATE,
  MAINE_LICENSE_PLATE,
  MONTANA_LICENSE_PLATE,
  RHODE_ISLAND_LICENSE_PLATE,
  DELAWARE_LICENSE_PLATE,
  SOUTH_DAKOTA_LICENSE_PLATE,
  NORTH_DAKOTA_LICENSE_PLATE,
  ALASKA_LICENSE_PLATE,
  VERMONT_LICENSE_PLATE,
  WYOMING_LICENSE_PLATE,
  UK_LICENSE_PLATE,
  GERMAN_LICENSE_PLATE,
  FRENCH_LICENSE_PLATE,
  CANADIAN_LICENSE_PLATE,
  AUSTRALIAN_LICENSE_PLATE,
  JAPANESE_LICENSE_PLATE,
  INTERNATIONAL_LICENSE_PLATE
];
