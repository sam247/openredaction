/**
 * Central Asian National IDs
 * Government identification numbers for Central Asian countries
 */

import type { PIIPattern } from '../../types';

/**
 * Kazakhstan Individual Identification Number (IIN)
 * Format: 12 digits (YYMMDDXXXXXX)
 */
export const KAZAKHSTAN_IIN: PIIPattern = {
  type: 'KAZAKHSTAN_IIN',
  regex: /\bIIN[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{12})\b/gi,
  placeholder: '[KZ_IIN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Kazakhstan Individual Identification Number (IIN)',
  validator: (value: string, context: string) => {
    if (value.length !== 12) return false;

    // Basic date validation (first 6 digits: YYMMDD)
    const year = parseInt(value.substring(0, 2));
    const month = parseInt(value.substring(2, 4));
    const day = parseInt(value.substring(4, 6));

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return /kazakh|kazakhstan|iin|жсн|individual\s?identification/i.test(context);
  }
};

/**
 * Uzbekistan Passport Number
 * Format: 2 letters + 7 digits (e.g., AA1234567)
 */
export const UZBEKISTAN_PASSPORT: PIIPattern = {
  type: 'UZBEKISTAN_PASSPORT',
  regex: /\b([A-Z]{2}\d{7})\b/g,
  placeholder: '[UZ_PASSPORT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Uzbekistan Passport Number',
  validator: (value: string, context: string) => {
    if (value.length !== 9) return false;

    return /uzbek|uzbekistan|passport|pasport/i.test(context);
  }
};

/**
 * Uzbekistan Tax ID (STIR)
 * Format: 9 digits
 */
export const UZBEKISTAN_STIR: PIIPattern = {
  type: 'UZBEKISTAN_STIR',
  regex: /\bSTIR[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{9})\b/gi,
  placeholder: '[UZ_STIR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Uzbekistan Tax ID (STIR)',
  validator: (value: string, context: string) => {
    if (value.length !== 9) return false;

    return /uzbek|uzbekistan|stir|tax|inn|soliq/i.test(context);
  }
};

/**
 * Kyrgyzstan Personal ID Number (PIN)
 * Format: 14 digits
 */
export const KYRGYZSTAN_PIN: PIIPattern = {
  type: 'KYRGYZSTAN_PIN',
  regex: /\bPIN[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{14})\b/gi,
  placeholder: '[KG_PIN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Kyrgyzstan Personal ID Number (PIN)',
  validator: (value: string, context: string) => {
    if (value.length !== 14) return false;

    return /kyrgyz|kyrgyzstan|pin|личный|номер/i.test(context);
  }
};

/**
 * Tajikistan National ID
 * Format: Varies, typically 9-10 digits
 */
export const TAJIKISTAN_NATIONAL_ID: PIIPattern = {
  type: 'TAJIKISTAN_NATIONAL_ID',
  regex: /\b(?:TAJIK|TJ)[-\s]?(?:ID|NATIONAL\s?ID)[-\s]?[:#]?\s*(\d{9,10})\b/gi,
  placeholder: '[TJ_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Tajikistan National ID',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 9 && len !== 10) return false;

    return /tajik|tajikistan|national\s?id|identity/i.test(context);
  }
};

/**
 * Turkmenistan Passport Number
 * Format: 1 letter + 7 digits (e.g., A1234567)
 */
export const TURKMENISTAN_PASSPORT: PIIPattern = {
  type: 'TURKMENISTAN_PASSPORT',
  regex: /\b([A-Z]\d{7})\b/g,
  placeholder: '[TM_PASSPORT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Turkmenistan Passport Number',
  validator: (value: string, context: string) => {
    if (value.length !== 8) return false;

    return /turkmen|turkmenistan|passport|pasport/i.test(context);
  }
};

export const centralAsiaPatterns: PIIPattern[] = [
  KAZAKHSTAN_IIN,
  UZBEKISTAN_PASSPORT,
  UZBEKISTAN_STIR,
  KYRGYZSTAN_PIN,
  TAJIKISTAN_NATIONAL_ID,
  TURKMENISTAN_PASSPORT
];
