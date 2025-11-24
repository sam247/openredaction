/**
 * Oceania & Pacific Island National IDs
 * Government identification numbers for Oceania and Pacific Island nations
 */

import type { PIIPattern } from '../../types';

/**
 * New Zealand Driver License Number
 * Format: 2 letters + 6 digits (e.g., AB123456)
 */
export const NEW_ZEALAND_DRIVER_LICENSE: PIIPattern = {
  type: 'NEW_ZEALAND_DRIVER_LICENSE',
  regex: /\b([A-Z]{2}\d{6})\b/g,
  placeholder: '[NZ_DL_{n}]',
  priority: 90,
  severity: 'high',
  description: 'New Zealand Driver License Number',
  validator: (value: string, context: string) => {
    if (value.length !== 8) return false;

    return /new\s?zealand|nz|kiwi|driver|license|licence/i.test(context);
  }
};

/**
 * New Zealand IRD Number (Tax ID)
 * Format: 8-9 digits with check digit
 */
export const NEW_ZEALAND_IRD: PIIPattern = {
  type: 'NEW_ZEALAND_IRD',
  regex: /\bIRD[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{8,9})\b/gi,
  placeholder: '[NZ_IRD_{n}]',
  priority: 90,
  severity: 'high',
  description: 'New Zealand IRD Number (Tax ID)',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 8 && len !== 9) return false;

    return /new\s?zealand|nz|ird|tax|inland\s?revenue/i.test(context);
  }
};

/**
 * New Zealand Passport Number
 * Format: 2 letters + 6 digits (e.g., LA123456)
 */
export const NEW_ZEALAND_PASSPORT: PIIPattern = {
  type: 'NEW_ZEALAND_PASSPORT',
  regex: /\b([A-Z]{2}\d{6})\b/g,
  placeholder: '[NZ_PASSPORT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'New Zealand Passport Number',
  validator: (value: string, context: string) => {
    if (value.length !== 8) return false;

    return /new\s?zealand|nz|passport|travel\s?document/i.test(context);
  }
};

/**
 * Fiji National ID
 * Format: Varies, typically 8-10 alphanumeric
 */
export const FIJI_NATIONAL_ID: PIIPattern = {
  type: 'FIJI_NATIONAL_ID',
  regex: /\b(?:FIJI|FJ)[-\s]?(?:ID|NATIONAL\s?ID)[-\s]?[:#]?\s*([A-Z0-9]{8,10})\b/gi,
  placeholder: '[FJ_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Fiji National ID',
  validator: (_value: string, context: string) => {
    return /fiji|fijian|national\s?id|identity/i.test(context);
  }
};

/**
 * Papua New Guinea National ID
 * Format: Varies, typically alphanumeric
 */
export const PNG_NATIONAL_ID: PIIPattern = {
  type: 'PNG_NATIONAL_ID',
  regex: /\b(?:PNG|PAPUA)[-\s]?(?:ID|NATIONAL\s?ID)[-\s]?[:#]?\s*([A-Z0-9]{8,12})\b/gi,
  placeholder: '[PNG_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Papua New Guinea National ID',
  validator: (_value: string, context: string) => {
    return /papua|png|new\s?guinea|national\s?id|identity/i.test(context);
  }
};

/**
 * Samoa National ID
 * Format: Varies, typically numeric
 */
export const SAMOA_NATIONAL_ID: PIIPattern = {
  type: 'SAMOA_NATIONAL_ID',
  regex: /\b(?:SAMOA|WS)[-\s]?(?:ID|NATIONAL\s?ID)[-\s]?[:#]?\s*(\d{8,10})\b/gi,
  placeholder: '[WS_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Samoa National ID',
  validator: (_value: string, context: string) => {
    return /samoa|samoan|national\s?id|identity/i.test(context);
  }
};

/**
 * Tonga National ID
 * Format: Varies, typically alphanumeric
 */
export const TONGA_NATIONAL_ID: PIIPattern = {
  type: 'TONGA_NATIONAL_ID',
  regex: /\b(?:TONGA|TO)[-\s]?(?:ID|NATIONAL\s?ID)[-\s]?[:#]?\s*([A-Z0-9]{8,10})\b/gi,
  placeholder: '[TO_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Tonga National ID',
  validator: (_value: string, context: string) => {
    return /tonga|tongan|national\s?id|identity/i.test(context);
  }
};

export const oceaniaPatterns: PIIPattern[] = [
  NEW_ZEALAND_DRIVER_LICENSE,
  NEW_ZEALAND_IRD,
  NEW_ZEALAND_PASSPORT,
  FIJI_NATIONAL_ID,
  PNG_NATIONAL_ID,
  SAMOA_NATIONAL_ID,
  TONGA_NATIONAL_ID
];
