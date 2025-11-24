/**
 * Southeast Asian National ID Patterns
 * Coverage for ASEAN countries
 */

import { PIIPattern } from '../../types';

/**
 * Indonesia NIK (Nomor Induk Kependudukan)
 * Format: 16 digits (DDMMYY location codes)
 * Example: 1234567890123456
 */
export const INDONESIA_NIK: PIIPattern = {
  type: 'INDONESIA_NIK',
  regex: /\b(\d{16})\b/g,
  placeholder: '[ID_NIK_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Indonesia NIK (National ID number, 16 digits)',
  validator: (value: string, context: string) => {
    if (value.length !== 16) return false;

    // Context validation required
    return /indonesia|indonesian|nik|nomor[- ]?induk|ktp|national[- ]?id/i.test(context);
  }
};

/**
 * Indonesia NPWP (Tax ID)
 * Format: 15 digits (XX.XXX.XXX.X-XXX.XXX)
 * Example: 12.345.678.9-012.345
 */
export const INDONESIA_NPWP: PIIPattern = {
  type: 'INDONESIA_NPWP',
  regex: /\b(\d{2}\.?\d{3}\.?\d{3}\.?\d[-\.]?\d{3}\.?\d{3})\b/g,
  placeholder: '[ID_NPWP_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Indonesia NPWP (Tax ID number)',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/[.\-]/g, '');
    if (cleaned.length !== 15) return false;

    // Context validation required
    return /indonesia|npwp|tax|pajak|wajib[- ]?pajak/i.test(context);
  }
};

/**
 * Thailand National ID
 * Format: 13 digits with checksum
 * Example: 1234567890123
 */
export const THAILAND_NATIONAL_ID: PIIPattern = {
  type: 'THAILAND_NATIONAL_ID',
  regex: /\b(\d{13})\b/g,
  placeholder: '[TH_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Thailand National ID (13 digits with checksum)',
  validator: (value: string, context: string) => {
    if (value.length !== 13) return false;

    // Context validation required
    if (!/thailand|thai|national[- ]?id|บัตร|ประชาชน/i.test(context)) {
      return false;
    }

    // Basic checksum validation (MOD 11)
    const digits = value.split('').map(Number);
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * (13 - i);
    }
    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === digits[12];
  }
};

/**
 * Malaysia MyKad (IC Number)
 * Format: 12 digits (YYMMDD-PB-####)
 * YY: Year, MM: Month, DD: Day, PB: Place of birth, ####: Serial
 */
export const MALAYSIA_MYKAD: PIIPattern = {
  type: 'MALAYSIA_MYKAD',
  regex: /\b(\d{6}[-\s]?\d{2}[-\s]?\d{4})\b/g,
  placeholder: '[MY_IC_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Malaysia MyKad/IC number (12 digits)',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/[-\s]/g, '');
    if (cleaned.length !== 12) return false;

    // Context validation required
    if (!/malaysia|malaysian|mykad|ic[- ]?number|kad[- ]?pengenalan/i.test(context)) {
      return false;
    }

    // Basic date validation (YYMMDD)
    const month = parseInt(cleaned.substring(2, 4));
    const day = parseInt(cleaned.substring(4, 6));

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    return true;
  }
};

/**
 * Philippines UMID (Unified Multi-Purpose ID)
 * Format: 12 digits (XXXX-XXXXXXX-X)
 * Example: 1234-5678901-2
 */
export const PHILIPPINES_UMID: PIIPattern = {
  type: 'PHILIPPINES_UMID',
  regex: /\b(\d{4}[-\s]?\d{7}[-\s]?\d)\b/g,
  placeholder: '[PH_UMID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Philippines UMID number (12 digits)',
  validator: (value: string, context: string) => {
    const cleaned = value.replace(/[-\s]/g, '');
    if (cleaned.length !== 12) return false;

    // Context validation required
    return /philippines|filipino|umid|unified|multipurpose|national[- ]?id/i.test(context);
  }
};

/**
 * Vietnam CCCD (Citizen Identity Card)
 * Format: 12 digits
 * Example: 001234567890
 */
export const VIETNAM_CCCD: PIIPattern = {
  type: 'VIETNAM_CCCD',
  regex: /\b(\d{12})\b/g,
  placeholder: '[VN_CCCD_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Vietnam CCCD (Citizen Identity Card, 12 digits)',
  validator: (value: string, context: string) => {
    if (value.length !== 12) return false;

    // Context validation required
    return /vietnam|vietnamese|cccd|citizen[- ]?identity|cmnd|national[- ]?id/i.test(context);
  }
};

/**
 * Myanmar NRC (National Registration Card)
 * Format: X/XXX(N)XXXXXX
 * Example: 12/OuKaMa(N)123456
 */
export const MYANMAR_NRC: PIIPattern = {
  type: 'MYANMAR_NRC',
  regex: /\b(\d{1,2}\/[A-Z][a-z]+\([NC]\)\d{6})\b/g,
  placeholder: '[MM_NRC_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Myanmar NRC (National Registration Card)',
  validator: (value: string, context: string) => {
    // Must contain (N) or (C) indicator
    if (!/\([NC]\)/.test(value)) return false;

    // Context validation required
    return /myanmar|burmese|nrc|national[- ]?registration|identity/i.test(context);
  }
};

// Export all Southeast Asia patterns
export const southeastAsiaPatterns: PIIPattern[] = [
  INDONESIA_NIK,
  INDONESIA_NPWP,
  THAILAND_NATIONAL_ID,
  MALAYSIA_MYKAD,
  PHILIPPINES_UMID,
  VIETNAM_CCCD,
  MYANMAR_NRC
];
