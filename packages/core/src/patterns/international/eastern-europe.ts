/**
 * Eastern European National IDs
 * Government identification numbers for Eastern European countries
 */

import type { PIIPattern } from '../../types';

/**
 * Russian Passport Number
 * Format: 10 digits (XXXX XXXXXX - series + number)
 */
export const RUSSIAN_PASSPORT: PIIPattern = {
  type: 'RUSSIAN_PASSPORT',
  regex: /\b(\d{4}\s?\d{6})\b/g,
  placeholder: '[RU_PASSPORT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Russian Passport Number',
  validator: (value: string, context: string) => {
    const digits = value.replace(/\s/g, '');
    if (digits.length !== 10) return false;

    return /russia|russian|passport|паспорт|российский/i.test(context);
  }
};

/**
 * Russian SNILS (Pension Fund Number)
 * Format: XXX-XXX-XXX XX (11 digits with check digits)
 */
export const RUSSIAN_SNILS: PIIPattern = {
  type: 'RUSSIAN_SNILS',
  regex: /\b(\d{3}-\d{3}-\d{3}\s?\d{2})\b/g,
  placeholder: '[RU_SNILS_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Russian SNILS (Pension Fund Number)',
  validator: (value: string, context: string) => {
    const digits = value.replace(/[-\s]/g, '');
    if (digits.length !== 11) return false;

    return /russia|russian|snils|снилс|pension|пенсионный/i.test(context);
  }
};

/**
 * Ukrainian Passport Number
 * Format: 2 letters + 6 digits (e.g., AA123456)
 */
export const UKRAINIAN_PASSPORT: PIIPattern = {
  type: 'UKRAINIAN_PASSPORT',
  regex: /\b([A-Z]{2}\d{6})\b/g,
  placeholder: '[UA_PASSPORT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Ukrainian Passport Number',
  validator: (value: string, context: string) => {
    if (value.length !== 8) return false;

    return /ukrain|passport|паспорт|український/i.test(context);
  }
};

/**
 * Ukrainian Tax ID (INN)
 * Format: 10 digits
 */
export const UKRAINIAN_INN: PIIPattern = {
  type: 'UKRAINIAN_INN',
  regex: /\bINN[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{10})\b/gi,
  placeholder: '[UA_INN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Ukrainian Tax ID (INN)',
  validator: (value: string, context: string) => {
    if (value.length !== 10) return false;

    return /ukrain|inn|tax|податковий|інн/i.test(context);
  }
};

/**
 * Czech Republic National ID (Rodné číslo)
 * Format: YYMMDD/XXXX (10 digits with slash)
 */
export const CZECH_NATIONAL_ID: PIIPattern = {
  type: 'CZECH_NATIONAL_ID',
  regex: /\b(\d{6}\/\d{4})\b/g,
  placeholder: '[CZ_ID_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Czech Republic National ID (Rodné číslo)',
  validator: (value: string, context: string) => {
    const parts = value.split('/');
    if (parts.length !== 2) return false;

    const datepart = parts[0];
    const serial = parts[1];

    if (datepart.length !== 6 || serial.length !== 4) return false;

    // Basic date validation (YYMMDD)
    const month = parseInt(datepart.substring(2, 4));
    const day = parseInt(datepart.substring(4, 6));

    // Month can be 01-12 (males) or 51-62 (females - add 50)
    const adjustedMonth = month > 50 ? month - 50 : month;
    if (adjustedMonth < 1 || adjustedMonth > 12) return false;
    if (day < 1 || day > 31) return false;

    return /czech|czechia|republic|rodné|číslo|national\s?id/i.test(context);
  }
};

/**
 * Romanian Personal Numeric Code (CNP)
 * Format: 13 digits
 */
export const ROMANIAN_CNP: PIIPattern = {
  type: 'ROMANIAN_CNP',
  regex: /\bCNP[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{13})\b/gi,
  placeholder: '[RO_CNP_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Romanian Personal Numeric Code (CNP)',
  validator: (value: string, context: string) => {
    if (value.length !== 13) return false;

    // First digit: 1-2 (born 1900-1999), 3-4 (born 1800-1899), 5-6 (born 2000-2099), 7-8 (residents), 9 (foreign)
    const firstDigit = parseInt(value[0]);
    if (firstDigit < 1 || firstDigit > 9) return false;

    // Date part (positions 2-7): YYMMDD
    const month = parseInt(value.substring(3, 5));
    const day = parseInt(value.substring(5, 7));

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return /romania|romanian|cnp|cod\s?numeric|personal/i.test(context);
  }
};

/**
 * Hungarian Personal ID (Személyi igazolvány szám)
 * Format: 6 digits + 2 letters (e.g., 123456AB)
 */
export const HUNGARIAN_PERSONAL_ID: PIIPattern = {
  type: 'HUNGARIAN_PERSONAL_ID',
  regex: /\b(\d{6}[A-Z]{2})\b/g,
  placeholder: '[HU_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Hungarian Personal ID',
  validator: (value: string, context: string) => {
    if (value.length !== 8) return false;

    return /hungar|magyar|személyi|igazolvány|personal\s?id/i.test(context);
  }
};

/**
 * Hungarian Tax ID (Adóazonosító jel)
 * Format: 10 digits
 */
export const HUNGARIAN_TAX_ID: PIIPattern = {
  type: 'HUNGARIAN_TAX_ID',
  regex: /\b(\d{10})\b/g,
  placeholder: '[HU_TAX_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Hungarian Tax ID (Adóazonosító jel)',
  validator: (value: string, context: string) => {
    if (value.length !== 10) return false;

    return /hungar|magyar|adó|tax|adóazonosító/i.test(context);
  }
};

/**
 * Bulgarian Personal Number (ЕГН - Единен граждански номер)
 * Format: 10 digits (YYMMDDXXXX)
 */
export const BULGARIAN_PERSONAL_NUMBER: PIIPattern = {
  type: 'BULGARIAN_PERSONAL_NUMBER',
  regex: /\b(\d{10})\b/g,
  placeholder: '[BG_EGN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Bulgarian Personal Number (EGN)',
  validator: (value: string, context: string) => {
    if (value.length !== 10) return false;

    // Date validation (YYMMDD)
    const month = parseInt(value.substring(2, 4));
    const day = parseInt(value.substring(4, 6));

    // Month can be 01-12 or 21-32 (born before 1900) or 41-52 (born after 2000)
    const adjustedMonth = month > 40 ? month - 40 : month > 20 ? month - 20 : month;
    if (adjustedMonth < 1 || adjustedMonth > 12) return false;
    if (day < 1 || day > 31) return false;

    return /bulgaria|bulgarian|егн|personal\s?number|единен/i.test(context);
  }
};

/**
 * Serbian Personal ID (JMBG - Jedinstveni matični broj građana)
 * Format: 13 digits (DDMMYYYRRSSSC)
 */
export const SERBIAN_JMBG: PIIPattern = {
  type: 'SERBIAN_JMBG',
  regex: /\b(\d{13})\b/g,
  placeholder: '[RS_JMBG_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Serbian Personal ID (JMBG)',
  validator: (value: string, context: string) => {
    if (value.length !== 13) return false;

    // Date validation (DDMMYYY)
    const day = parseInt(value.substring(0, 2));
    const month = parseInt(value.substring(2, 4));

    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;

    return /serb|serbia|jmbg|jedinstveni|matični|personal/i.test(context);
  }
};

export const easternEuropePatterns: PIIPattern[] = [
  RUSSIAN_PASSPORT,
  RUSSIAN_SNILS,
  UKRAINIAN_PASSPORT,
  UKRAINIAN_INN,
  CZECH_NATIONAL_ID,
  ROMANIAN_CNP,
  HUNGARIAN_PERSONAL_ID,
  HUNGARIAN_TAX_ID,
  BULGARIAN_PERSONAL_NUMBER,
  SERBIAN_JMBG
];
