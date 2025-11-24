/**
 * Middle East National ID Patterns
 * Comprehensive coverage for Gulf Cooperation Council (GCC) and regional countries
 */

import { PIIPattern } from '../../types';

/**
 * UAE Emirates ID
 * Format: 784-YYYY-NNNNNNN-C (15 digits)
 * Example: 784-1990-1234567-1
 */
export const UAE_EMIRATES_ID: PIIPattern = {
  type: 'UAE_EMIRATES_ID',
  regex: /\b(784[-\s]?\d{4}[-\s]?\d{7}[-\s]?\d)\b/g,
  placeholder: '[UAE_ID_{n}]',
  priority: 95,
  severity: 'high',
  description: 'UAE Emirates ID (15 digits starting with 784)',
  validator: (value: string, context: string) => {
    const digits = value.replace(/\D/g, '');

    // Must be exactly 15 digits and start with 784
    if (digits.length !== 15 || !digits.startsWith('784')) {
      return false;
    }

    // Context validation for better accuracy
    return /uae|emirates|dubai|abu[- ]?dhabi|national[- ]?id|emirates[- ]?id/i.test(context);
  }
};

/**
 * Saudi Arabia National ID
 * Format: 1NNNNNNNNN or 2NNNNNNNNN (10 digits)
 * First digit: 1 for Saudi nationals, 2 for residents (Iqama)
 * Example: 1234567890
 */
export const SAUDI_NATIONAL_ID: PIIPattern = {
  type: 'SAUDI_NATIONAL_ID',
  regex: /\b([12]\d{9})\b/g,
  placeholder: '[SA_ID_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Saudi Arabia National ID or Iqama (10 digits)',
  validator: (value: string, context: string) => {
    // Must be 10 digits starting with 1 or 2
    if (value.length !== 10) return false;
    if (!/^[12]/.test(value)) return false;

    // Context validation
    return /saudi|ksa|kingdom|iqama|national[- ]?id|muqeem/i.test(context);
  }
};

/**
 * Israel Teudat Zehut (ID Number)
 * Format: 9 digits with Luhn checksum
 * Example: 123456782
 */
export const ISRAEL_ID: PIIPattern = {
  type: 'ISRAEL_ID',
  regex: /\b(\d{9})\b/g,
  placeholder: '[IL_ID_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Israel Teudat Zehut ID number (9 digits with checksum)',
  validator: (value: string, context: string) => {
    if (value.length !== 9) return false;

    // Context validation for better accuracy
    return /israel|teudat|zehut|israeli|national[- ]?id/i.test(context);
  }
};

/**
 * Turkey TC Kimlik No (Turkish ID Number)
 * Format: 11 digits with checksum algorithm
 * First digit cannot be 0
 * Example: 12345678901
 */
export const TURKEY_ID: PIIPattern = {
  type: 'TURKEY_ID',
  regex: /\b([1-9]\d{10})\b/g,
  placeholder: '[TR_ID_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Turkey TC Kimlik No (11 digits with checksum)',
  validator: (value: string, context: string) => {
    if (value.length !== 11) return false;
    if (value[0] === '0') return false;

    // Context validation for better accuracy
    return /turkey|turkish|tc|kimlik|national[- ]?id/i.test(context);
  }
};

/**
 * Qatar ID (QID)
 * Format: 11 digits
 * Example: 12345678901
 */
export const QATAR_ID: PIIPattern = {
  type: 'QATAR_ID',
  regex: /\b(\d{11})\b/g,
  placeholder: '[QA_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Qatar ID (QID) - 11 digits',
  validator: (value: string, context: string) => {
    if (value.length !== 11) return false;

    // Context validation required to avoid false positives
    return /qatar|qid|doha|national[- ]?id|resident[- ]?permit/i.test(context);
  }
};

/**
 * Kuwait Civil ID
 * Format: 12 digits (YYMMDDSSSSC)
 * YY: Birth year, MM: Month, DD: Day, SSSS: Serial, C: Check digit
 * Example: 290010112345
 */
export const KUWAIT_CIVIL_ID: PIIPattern = {
  type: 'KUWAIT_CIVIL_ID',
  regex: /\b(\d{12})\b/g,
  placeholder: '[KW_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Kuwait Civil ID (12 digits)',
  validator: (value: string, context: string) => {
    if (value.length !== 12) return false;

    // Context validation required
    if (!/kuwait|civil[- ]?id|national[- ]?id/i.test(context)) {
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
 * Bahrain CPR (Central Population Register)
 * Format: 9 digits (YYMMDDXXX)
 * YY: Birth year (e.g., 85 for 1985), MM: Month, DD: Day, XXX: Serial
 * Example: 850101123
 */
export const BAHRAIN_CPR: PIIPattern = {
  type: 'BAHRAIN_CPR',
  regex: /\b(\d{9})\b/g,
  placeholder: '[BH_CPR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Bahrain CPR (Central Population Register) - 9 digits',
  validator: (value: string, context: string) => {
    if (value.length !== 9) return false;

    // Context validation required
    if (!/bahrain|cpr|central[- ]?population|national[- ]?id/i.test(context)) {
      return false;
    }

    // Date validation (YYMMDD)
    const month = parseInt(value.substring(2, 4));
    const day = parseInt(value.substring(4, 6));

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
  }
};

/**
 * Oman Civil ID
 * Format: 8 digits
 * Example: 12345678
 */
export const OMAN_CIVIL_ID: PIIPattern = {
  type: 'OMAN_CIVIL_ID',
  regex: /\b(\d{8})\b/g,
  placeholder: '[OM_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Oman Civil ID (8 digits)',
  validator: (value: string, context: string) => {
    if (value.length !== 8) return false;

    // Context validation required for 8-digit number
    return /oman|muscat|civil[- ]?id|national[- ]?id/i.test(context);
  }
};

/**
 * Jordan National ID
 * Format: 10 digits
 * Example: 1234567890
 */
export const JORDAN_NATIONAL_ID: PIIPattern = {
  type: 'JORDAN_NATIONAL_ID',
  regex: /\b(\d{10})\b/g,
  placeholder: '[JO_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Jordan National ID (10 digits)',
  validator: (value: string, context: string) => {
    if (value.length !== 10) return false;

    // Context validation required
    return /jordan|amman|national[- ]?id|jordanian/i.test(context);
  }
};

/**
 * Lebanon National ID
 * Format: 7-8 digits
 * Example: 1234567
 */
export const LEBANON_NATIONAL_ID: PIIPattern = {
  type: 'LEBANON_NATIONAL_ID',
  regex: /\b(\d{7,8})\b/g,
  placeholder: '[LB_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Lebanon National ID (7-8 digits)',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length !== 7 && length !== 8) return false;

    // Context validation required
    return /lebanon|lebanese|beirut|national[- ]?id/i.test(context);
  }
};

// Export all Middle East patterns
export const middleEastPatterns: PIIPattern[] = [
  UAE_EMIRATES_ID,
  SAUDI_NATIONAL_ID,
  ISRAEL_ID,
  TURKEY_ID,
  QATAR_ID,
  KUWAIT_CIVIL_ID,
  BAHRAIN_CPR,
  OMAN_CIVIL_ID,
  JORDAN_NATIONAL_ID,
  LEBANON_NATIONAL_ID
];
