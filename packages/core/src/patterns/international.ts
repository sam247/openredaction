/**
 * International PII Patterns
 * Government IDs and identification numbers for countries worldwide
 */

import { PIIPattern } from '../types';

// ==================== EUROPE ====================

/**
 * German Tax ID (Steueridentifikationsnummer)
 * Format: 11 digits with checksum
 */
export const GERMAN_TAX_ID: PIIPattern = {
  type: 'GERMAN_TAX_ID',
  regex: /\b(\d{11})\b/g,
  placeholder: '[DE_TAX_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'German Tax Identification Number (Steueridentifikationsnummer)',
  validator: (value: string, context: string) => {
    // Must be in German/tax context
    const relevantContext = /steuer|tax|german|deutschland|finanzamt/i.test(context);
    if (!relevantContext) return false;

    // Checksum validation (simplified - full validation is complex)
    const digits = value.split('').map(Number);

    // Basic rules: exactly 11 digits, one digit appears 2 or 3 times, others max once
    const digitCounts = new Map<number, number>();
    digits.forEach(d => digitCounts.set(d, (digitCounts.get(d) || 0) + 1));

    const counts = Array.from(digitCounts.values());
    const hasDoubleOrTriple = counts.some(c => c === 2 || c === 3);
    const noQuadruple = counts.every(c => c <= 3);

    return hasDoubleOrTriple && noQuadruple;
  }
};

/**
 * French Social Security Number (Numéro de Sécurité Sociale)
 * Format: 15 digits (1 sex + 2 year + 2 month + 2 dept + 3 commune + 3 order + 2 key)
 */
export const FRENCH_SOCIAL_SECURITY: PIIPattern = {
  type: 'FRENCH_SOCIAL_SECURITY',
  regex: /\b([12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2})\b/g,
  placeholder: '[FR_SSN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'French Social Security Number',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/\s/g, '');

    // Must start with 1 or 2 (sex)
    if (!/^[12]/.test(cleaned)) return false;

    // Year (positions 2-3) should be valid
    const year = parseInt(cleaned.substring(1, 3));
    if (year > 99) return false;

    // Month (positions 4-5) should be 01-12 or special codes
    const month = parseInt(cleaned.substring(3, 5));
    if (month < 1 || month > 20) return false; // 20 allows for special codes

    return true;
  }
};

/**
 * Spanish DNI/NIE (Documento Nacional de Identidad / Número de Identidad de Extranjero)
 * Format: 8 digits + 1 letter OR Letter + 7 digits + 1 letter
 */
export const SPANISH_DNI: PIIPattern = {
  type: 'SPANISH_DNI',
  regex: /\b([0-9]{8}[-\s]?[A-Z]|[XYZ][-\s]?[0-9]{7}[-\s]?[A-Z])\b/gi,
  placeholder: '[ES_DNI_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Spanish National ID (DNI) or Foreigner ID (NIE)',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/[-\s]/g, '').toUpperCase();
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';

    let numbers: string;
    let letter: string;

    if (/^[XYZ]/.test(cleaned)) {
      // NIE format
      numbers = cleaned.substring(1, 8);
      letter = cleaned[8];
      // Replace X, Y, Z with 0, 1, 2 for calculation
      const prefix = cleaned[0] === 'X' ? '0' : cleaned[0] === 'Y' ? '1' : '2';
      numbers = prefix + numbers;
    } else {
      // DNI format
      numbers = cleaned.substring(0, 8);
      letter = cleaned[8];
    }

    const num = parseInt(numbers);
    const expectedLetter = letters[num % 23];

    return letter === expectedLetter;
  }
};

/**
 * Italian Fiscal Code (Codice Fiscale)
 * Format: 16 characters (surname + name + birthdate + birthplace + checksum)
 */
export const ITALIAN_FISCAL_CODE: PIIPattern = {
  type: 'ITALIAN_FISCAL_CODE',
  regex: /\b([A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z])\b/gi,
  placeholder: '[IT_CF_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Italian Fiscal Code (Codice Fiscale)',
  validator: (value: string, context: string) => {
    const code = value.toUpperCase();

    // Month code must be valid (A-H = Jan-Aug, L-T = Sep-Dec, skipping I)
    const monthCode = code[8];
    const validMonths = 'ABCDEHLMPRST';
    if (!validMonths.includes(monthCode)) return false;

    // Day must be valid (01-31 for males, 41-71 for females)
    const day = parseInt(code.substring(9, 11));
    if ((day < 1 || day > 31) && (day < 41 || day > 71)) return false;

    // Checksum validation
    const oddMap: Record<string, number> = {
      '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
      'A': 1, 'B': 0, 'C': 5, 'D': 7, 'E': 9, 'F': 13, 'G': 15, 'H': 17, 'I': 19, 'J': 21,
      'K': 2, 'L': 4, 'M': 18, 'N': 20, 'O': 11, 'P': 3, 'Q': 6, 'R': 8, 'S': 12, 'T': 14,
      'U': 16, 'V': 10, 'W': 22, 'X': 25, 'Y': 24, 'Z': 23
    };

    const evenMap: Record<string, number> = {
      '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
      'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'I': 8, 'J': 9,
      'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15, 'Q': 16, 'R': 17, 'S': 18,
      'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23, 'Y': 24, 'Z': 25
    };

    let sum = 0;
    for (let i = 0; i < 15; i++) {
      const char = code[i];
      sum += i % 2 === 0 ? oddMap[char] : evenMap[char];
    }

    const checkChar = String.fromCharCode(65 + (sum % 26));
    return checkChar === code[15];
  }
};

/**
 * Dutch BSN (Burgerservicenummer)
 * Format: 9 digits with checksum (11-proof)
 */
export const DUTCH_BSN: PIIPattern = {
  type: 'DUTCH_BSN',
  regex: /\b(\d{9})\b/g,
  placeholder: '[NL_BSN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Dutch Citizen Service Number (BSN)',
  validator: (value: string, context: string) => {
    // Must be in Dutch context
    const relevantContext = /bsn|dutch|netherlands|nederland|burger/i.test(context);
    if (!relevantContext) return false;

    // 11-proof checksum
    const digits = value.split('').map(Number);
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += digits[i] * (9 - i);
    }
    sum -= digits[8]; // Last digit is subtracted

    return sum % 11 === 0;
  }
};

/**
 * Polish PESEL
 * Format: 11 digits (birthdate + serial + sex + checksum)
 */
export const POLISH_PESEL: PIIPattern = {
  type: 'POLISH_PESEL',
  regex: /\b(\d{11})\b/g,
  placeholder: '[PL_PESEL_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Polish National Identification Number (PESEL)',
  validator: (value: string, context: string) => {
    // Must be in Polish context
    const relevantContext = /pesel|polish|poland|polska/i.test(context);
    if (!relevantContext) return false;

    // Checksum validation
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const digits = value.split('').map(Number);

    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[10];
  }
};

// ==================== ASIA-PACIFIC ====================

/**
 * Indian Aadhaar Number
 * Format: 12 digits with checksum (Verhoeff algorithm)
 */
export const INDIAN_AADHAAR: PIIPattern = {
  type: 'INDIAN_AADHAAR',
  regex: /\b(\d{4}\s?\d{4}\s?\d{4})\b/g,
  placeholder: '[IN_AADHAAR_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Indian Aadhaar Number',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/\s/g, '');

    // Must be in Indian context
    const relevantContext = /aadhaar|aadhar|india|indian|uid/i.test(context);
    if (!relevantContext) return false;

    // Verhoeff checksum validation (simplified)
    // Full implementation would require multiplication and permutation tables
    // For now, basic length and format check
    return cleaned.length === 12 && /^\d{12}$/.test(cleaned);
  }
};

/**
 * Australian Medicare Number
 * Format: 10 digits (9 digits + 1 check digit)
 */
export const AUSTRALIAN_MEDICARE: PIIPattern = {
  type: 'AUSTRALIAN_MEDICARE',
  regex: /\b([2-6]\d{3}\s?\d{5}\s?\d)\b/g,
  placeholder: '[AU_MEDICARE_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Australian Medicare Number',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/\s/g, '');

    // Must start with 2-6
    if (!/^[2-6]/.test(cleaned)) return false;

    // Checksum validation
    const weights = [1, 3, 7, 9, 1, 3, 7, 9];
    const digits = cleaned.split('').map(Number);

    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += digits[i] * weights[i];
    }

    const checkDigit = sum % 10;
    return checkDigit === digits[8];
  }
};

/**
 * Australian Tax File Number (TFN)
 * Format: 9 digits with checksum
 */
export const AUSTRALIAN_TFN: PIIPattern = {
  type: 'AUSTRALIAN_TFN',
  regex: /\b(\d{3}\s?\d{3}\s?\d{3})\b/g,
  placeholder: '[AU_TFN_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Australian Tax File Number',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/\s/g, '');

    // Must be in tax/Australian context
    const relevantContext = /tfn|tax.file|australian|australia/i.test(context);
    if (!relevantContext) return false;

    // Checksum validation
    const weights = [1, 4, 3, 7, 5, 8, 6, 9, 10];
    const digits = cleaned.split('').map(Number);

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * weights[i];
    }

    return sum % 11 === 0;
  }
};

/**
 * Singapore NRIC/FIN
 * Format: Letter + 7 digits + checksum letter
 */
export const SINGAPORE_NRIC: PIIPattern = {
  type: 'SINGAPORE_NRIC',
  regex: /\b([STFGM]\d{7}[A-Z])\b/gi,
  placeholder: '[SG_NRIC_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Singapore NRIC/FIN',
  validator: (value: string, context: string) => {
    const code = value.toUpperCase();
    const prefix = code[0];
    const digits = code.substring(1, 8).split('').map(Number);
    const checkLetter = code[8];

    // Weight factors
    const weights = [2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      sum += digits[i] * weights[i];
    }

    // Different check letter tables for different prefixes
    const stLetters = 'JZIHGFEDCBA';
    const fgLetters = 'XWUTRQPNMLK';
    const mLetters = 'KMLKJIHGFEDCBA';

    let expectedLetter: string;
    if (prefix === 'S' || prefix === 'T') {
      expectedLetter = stLetters[sum % 11];
    } else if (prefix === 'F' || prefix === 'G') {
      expectedLetter = fgLetters[sum % 11];
    } else { // M
      expectedLetter = mLetters[sum % 11];
    }

    return checkLetter === expectedLetter;
  }
};

/**
 * Japanese My Number
 * Format: 12 digits with checksum
 */
export const JAPANESE_MY_NUMBER: PIIPattern = {
  type: 'JAPANESE_MY_NUMBER',
  regex: /\b(\d{4}\s?\d{4}\s?\d{4})\b/g,
  placeholder: '[JP_MY_NUMBER_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Japanese My Number',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/\s/g, '');

    // Must be in Japanese context
    const relevantContext = /my.number|japan|japanese|マイナンバー/i.test(context);
    if (!relevantContext) return false;

    // Checksum validation (Luhn-like)
    const digits = cleaned.split('').map(Number);
    const weights = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];

    let sum = 0;
    for (let i = 0; i < 11; i++) {
      let product = digits[i] * weights[i];
      sum += Math.floor(product / 10) + (product % 10);
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[11];
  }
};

// ==================== AMERICAS ====================

/**
 * Canadian Social Insurance Number (SIN)
 * Format: 9 digits with Luhn checksum
 */
export const CANADIAN_SIN: PIIPattern = {
  type: 'CANADIAN_SIN',
  regex: /\b(\d{3}[-\s]?\d{3}[-\s]?\d{3})\b/g,
  placeholder: '[CA_SIN_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Canadian Social Insurance Number',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/[-\s]/g, '');

    // Must be in Canadian context
    const relevantContext = /sin|social.insurance|canadian|canada/i.test(context);
    if (!relevantContext) return false;

    // Luhn checksum validation
    const digits = cleaned.split('').map(Number);
    let sum = 0;

    for (let i = 0; i < 9; i++) {
      let digit = digits[i];
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }

    return sum % 10 === 0;
  }
};

/**
 * Brazilian CPF (Cadastro de Pessoas Físicas)
 * Format: 11 digits with checksum
 */
export const BRAZILIAN_CPF: PIIPattern = {
  type: 'BRAZILIAN_CPF',
  regex: /\b(\d{3}\.?\d{3}\.?\d{3}-?\d{2})\b/g,
  placeholder: '[BR_CPF_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Brazilian CPF (Individual Taxpayer ID)',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/[.\-]/g, '');
    const digits = cleaned.split('').map(Number);

    // Check for all same digits (invalid)
    if (new Set(digits).size === 1) return false;

    // First check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    let check1 = 11 - (sum % 11);
    if (check1 >= 10) check1 = 0;

    if (check1 !== digits[9]) return false;

    // Second check digit
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * (11 - i);
    }
    let check2 = 11 - (sum % 11);
    if (check2 >= 10) check2 = 0;

    return check2 === digits[10];
  }
};

/**
 * Brazilian CNPJ (Company ID)
 * Format: 14 digits with checksum
 */
export const BRAZILIAN_CNPJ: PIIPattern = {
  type: 'BRAZILIAN_CNPJ',
  regex: /\b(\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})\b/g,
  placeholder: '[BR_CNPJ_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Brazilian CNPJ (Company Tax ID)',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/[.\-\/]/g, '');
    const digits = cleaned.split('').map(Number);

    // First check digit
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights1[i];
    }
    let check1 = sum % 11;
    check1 = check1 < 2 ? 0 : 11 - check1;

    if (check1 !== digits[12]) return false;

    // Second check digit
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += digits[i] * weights2[i];
    }
    let check2 = sum % 11;
    check2 = check2 < 2 ? 0 : 11 - check2;

    return check2 === digits[13];
  }
};

// Export all international patterns
export const internationalPatterns: PIIPattern[] = [
  // Europe
  GERMAN_TAX_ID,
  FRENCH_SOCIAL_SECURITY,
  SPANISH_DNI,
  ITALIAN_FISCAL_CODE,
  DUTCH_BSN,
  POLISH_PESEL,

  // Asia-Pacific
  INDIAN_AADHAAR,
  AUSTRALIAN_MEDICARE,
  AUSTRALIAN_TFN,
  SINGAPORE_NRIC,
  JAPANESE_MY_NUMBER,

  // Americas
  CANADIAN_SIN,
  BRAZILIAN_CPF,
  BRAZILIAN_CNPJ
];
