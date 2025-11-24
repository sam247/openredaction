/**
 * Maritime Industry Identifiers
 * Ship registration, IMO numbers, MMSI, maritime radio callsigns
 */

import type { PIIPattern } from '../../types';

/**
 * IMO Ship Identification Number
 * Format: IMO followed by 7 digits
 */
export const IMO_NUMBER: PIIPattern = {
  type: 'IMO_NUMBER',
  regex: /\bIMO[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{7})\b/gi,
  placeholder: '[IMO_{n}]',
  priority: 90,
  severity: 'medium',
  description: 'IMO Ship Identification Number',
  validator: (value: string, context: string) => {
    if (value.length !== 7) return false;

    // IMO number checksum validation
    const digits = value.split('').map(Number);
    let sum = 0;
    for (let i = 0; i < 6; i++) {
      sum += digits[i] * (7 - i);
    }
    const checkDigit = sum % 10;

    if (checkDigit !== digits[6]) return false;

    return /imo|ship|vessel|maritime|shipping|marine/i.test(context);
  }
};

/**
 * MMSI (Maritime Mobile Service Identity)
 * Format: 9 digits
 */
export const MMSI_NUMBER: PIIPattern = {
  type: 'MMSI_NUMBER',
  regex: /\bMMSI[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{9})\b/gi,
  placeholder: '[MMSI_{n}]',
  priority: 90,
  severity: 'medium',
  description: 'MMSI (Maritime Mobile Service Identity)',
  validator: (value: string, context: string) => {
    if (value.length !== 9) return false;

    // MMSI first 3 digits are MID (Maritime Identification Digits)
    // Valid range: 200-799
    const mid = parseInt(value.substring(0, 3));
    if (mid < 200 || mid > 799) return false;

    return /mmsi|maritime|ship|vessel|ais|vhf|radio/i.test(context);
  }
};

/**
 * Maritime Radio Callsign
 * Format: Varies by country, typically 3-7 alphanumeric
 */
export const MARITIME_CALLSIGN: PIIPattern = {
  type: 'MARITIME_CALLSIGN',
  regex: /\b(?:CALLSIGN|CALL\s?SIGN)[-\s]?[:#]?\s*([A-Z0-9]{3,7})\b/gi,
  placeholder: '[CALLSIGN_{n}]',
  priority: 85,
  severity: 'low',
  description: 'Maritime Radio Callsign',
  validator: (_value: string, context: string) => {
    return /callsign|call\s?sign|radio|maritime|vessel|ship|vhf/i.test(context);
  }
};

/**
 * Official Ship Number
 * Format: Varies by country registry
 */
export const OFFICIAL_SHIP_NUMBER: PIIPattern = {
  type: 'OFFICIAL_SHIP_NUMBER',
  regex: /\b(?:OFFICIAL|SHIP)[-\s]?(?:NO|NUM|NUMBER)[-\s]?[:#]?\s*([A-Z0-9]{5,12})\b/gi,
  placeholder: '[SHIP_NUM_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Official Ship Number',
  validator: (_value: string, context: string) => {
    return /official|ship|vessel|registration|registry|flag\s?state/i.test(context);
  }
};

/**
 * Port State Control Inspection ID
 * Format: Varies, typically alphanumeric
 */
export const PSC_INSPECTION_ID: PIIPattern = {
  type: 'PSC_INSPECTION_ID',
  regex: /\b(?:PSC|INSPECTION)[-\s]?(?:ID|NO|NUM|NUMBER)[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[PSC_{n}]',
  priority: 80,
  severity: 'low',
  description: 'Port State Control Inspection ID',
  validator: (_value: string, context: string) => {
    return /psc|port\s?state|inspection|maritime|vessel|ship|compliance/i.test(context);
  }
};

/**
 * Seafarer Identification Number (SID)
 * Format: Country code + 9 alphanumeric (varies by issuing country)
 */
export const SEAFARER_ID: PIIPattern = {
  type: 'SEAFARER_ID',
  regex: /\b(?:SEAFARER|MARINER|SID)[-\s]?(?:ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{2,3}[A-Z0-9]{9})\b/gi,
  placeholder: '[SEAFARER_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Seafarer Identification Number',
  validator: (value: string, context: string) => {
    if (value.length < 11 || value.length > 12) return false;

    return /seafarer|mariner|sid|maritime|crew|seaman|sailor/i.test(context);
  }
};

/**
 * Lloyd's Register Number (LR Number)
 * Format: Alphanumeric, typically 7 characters
 */
export const LLOYDS_REGISTER_NUMBER: PIIPattern = {
  type: 'LLOYDS_REGISTER_NUMBER',
  regex: /\b(?:LLOYD'?S?|LR)[-\s]?(?:REG(?:ISTER)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{7})\b/gi,
  placeholder: '[LR_NUM_{n}]',
  priority: 85,
  severity: 'low',
  description: 'Lloyd\'s Register Number',
  validator: (_value: string, context: string) => {
    return /lloyd|lr|register|classification|ship|vessel|maritime/i.test(context);
  }
};

export const maritimePatterns: PIIPattern[] = [
  IMO_NUMBER,
  MMSI_NUMBER,
  MARITIME_CALLSIGN,
  OFFICIAL_SHIP_NUMBER,
  PSC_INSPECTION_ID,
  SEAFARER_ID,
  LLOYDS_REGISTER_NUMBER
];
