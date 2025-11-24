/**
 * African National ID Patterns
 * Comprehensive coverage for major African economies
 */

import { PIIPattern } from '../../types';

/**
 * South Africa ID Number (RSA ID)
 * Format: 13 digits (YYMMDDSSSSCZZ)
 * YY: Birth year, MM: Month, DD: Day
 * SSSS: Sequence number (odd=male, even=female)
 * C: Citizenship (0=SA, 1=non-SA)
 * ZZ: Checksum (Luhn algorithm)
 */
export const SOUTH_AFRICA_ID: PIIPattern = {
  type: 'SOUTH_AFRICA_ID',
  regex: /\b(\d{13})\b/g,
  placeholder: '[ZA_ID_{n}]',
  priority: 95,
  severity: 'high',
  description: 'South African ID number (13 digits with date and checksum)',
  validator: (value: string, context: string) => {
    if (value.length !== 13) return false;

    // Context validation required
    if (!/south[- ]?africa|rsa|za|national[- ]?id|identity|id[- ]?number/i.test(context)) {
      return false;
    }

    // Basic date validation (YYMMDD)
    const month = parseInt(value.substring(2, 4));
    const day = parseInt(value.substring(4, 6));

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
  }
};

/**
 * Nigeria National Identification Number (NIN)
 * Format: 11 digits
 * Example: 12345678901
 */
export const NIGERIA_NIN: PIIPattern = {
  type: 'NIGERIA_NIN',
  regex: /\b(\d{11})\b/g,
  placeholder: '[NG_NIN_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Nigeria National Identification Number (11 digits)',
  validator: (value: string, context: string) => {
    if (value.length !== 11) return false;

    // Context validation required
    return /nigeria|nin|national[- ]?id|identity|nigerian/i.test(context);
  }
};

/**
 * Nigeria Bank Verification Number (BVN)
 * Format: 11 digits
 * Used by Nigerian banks for customer identification
 */
export const NIGERIA_BVN: PIIPattern = {
  type: 'NIGERIA_BVN',
  regex: /\bBVN[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{11})\b/gi,
  placeholder: '[NG_BVN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Nigeria Bank Verification Number',
  validator: (value: string, context: string) => {
    if (value.length !== 11) return false;

    // Context validation required
    return /bvn|bank[- ]?verification|nigeria|nigerian|banking/i.test(context);
  }
};

/**
 * Kenya National ID Number
 * Format: 7-8 digits
 * Example: 12345678
 */
export const KENYA_NATIONAL_ID: PIIPattern = {
  type: 'KENYA_NATIONAL_ID',
  regex: /\b(\d{7,8})\b/g,
  placeholder: '[KE_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Kenya National ID number (7-8 digits)',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 7 || length > 8) return false;

    // Context validation required
    return /kenya|kenyan|national[- ]?id|identity/i.test(context);
  }
};

/**
 * Kenya Revenue Authority PIN (KRA PIN)
 * Format: A000000000X (letter + 9 digits + letter)
 * Used for tax identification
 */
export const KENYA_KRA_PIN: PIIPattern = {
  type: 'KENYA_KRA_PIN',
  regex: /\b(A\d{9}[A-Z])\b/g,
  placeholder: '[KRA_PIN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Kenya Revenue Authority PIN (tax number)',
  validator: (value: string, context: string) => {
    if (value.length !== 11) return false;
    if (!value.startsWith('A')) return false;

    // Context validation required
    return /kra|kenya|revenue|authority|tax|pin|taxpayer/i.test(context);
  }
};

/**
 * Egypt National ID
 * Format: 14 digits (YYYYMMDDLLLCCG)
 * YYYY: Birth year, MM: Month, DD: Day
 * LLL: Location code, CC: Sequence, G: Gender
 */
export const EGYPT_NATIONAL_ID: PIIPattern = {
  type: 'EGYPT_NATIONAL_ID',
  regex: /\b([12]\d{13})\b/g,
  placeholder: '[EG_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Egypt National ID (14 digits)',
  validator: (value: string, context: string) => {
    if (value.length !== 14) return false;

    // Context validation required
    if (!/egypt|egyptian|national[- ]?id|identity/i.test(context)) {
      return false;
    }

    // Basic format validation - first digit should be 1 or 2 (century)
    const century = parseInt(value[0]);
    if (century !== 1 && century !== 2) return false;

    // Basic date validation (YYMMDD portion)
    const month = parseInt(value.substring(5, 7));
    const day = parseInt(value.substring(7, 9));

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
  }
};

/**
 * Ghana Card (National ID)
 * Format: GHA-XXXXXXXXX-X (15 characters)
 * Example: GHA-123456789-0
 */
export const GHANA_CARD: PIIPattern = {
  type: 'GHANA_CARD',
  regex: /\b(GHA-\d{9}-\d)\b/g,
  placeholder: '[GH_CARD_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Ghana Card national ID',
  validator: (value: string, context: string) => {
    if (value.length !== 15) return false;
    if (!value.startsWith('GHA-')) return false;

    // Context validation required
    return /ghana|ghanaian|ghana[- ]?card|national[- ]?id|identity/i.test(context);
  }
};

/**
 * Morocco National ID (CNIE)
 * Format: Alphanumeric (various formats)
 * Example: AB123456 or 12345678
 */
export const MOROCCO_NATIONAL_ID: PIIPattern = {
  type: 'MOROCCO_NATIONAL_ID',
  regex: /\b(?:CNIE|ID)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{1,2}\d{6,8}|\d{8})\b/gi,
  placeholder: '[MA_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Morocco National ID (CNIE)',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 6 || length > 10) return false;

    // Context validation required
    return /morocco|moroccan|cnie|national[- ]?id|identity/i.test(context);
  }
};

// Export all Africa patterns
export const africaPatterns: PIIPattern[] = [
  SOUTH_AFRICA_ID,
  NIGERIA_NIN,
  NIGERIA_BVN,
  KENYA_NATIONAL_ID,
  KENYA_KRA_PIN,
  EGYPT_NATIONAL_ID,
  GHANA_CARD,
  MOROCCO_NATIONAL_ID
];
