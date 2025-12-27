/**
 * Telecommunications and Utilities Industry PII Patterns
 * For telecom providers, utilities, energy companies
 */

import { PIIPattern } from '../../types';

/**
 * Customer Account Number
 */
export const TELECOMS_ACCOUNT_NUMBER: PIIPattern = {
  type: 'TELECOMS_ACCOUNT_NUMBER',
  regex: /\bACC(?:OUNT)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{8,12})\b/gi,
  placeholder: '[ACCOUNT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Telecommunications customer account numbers',
  validator: (_value: string, context: string) => {
    return /account|customer|subscriber|service|utility|telecom/i.test(context);
  }
};

/**
 * Meter Serial Number
 */
export const METER_SERIAL_NUMBER: PIIPattern = {
  type: 'METER_SERIAL_NUMBER',
  regex: /\bMTR[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{8,12})\b/gi,
  placeholder: '[METER_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Utility meter serial numbers'
};

/**
 * SIM/IMSI Number
 */
export const IMSI_NUMBER: PIIPattern = {
  type: 'IMSI_NUMBER',
  regex: /\bIMSI[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{15})\b/gi,
  placeholder: '[IMSI_{n}]',
  priority: 90,
  severity: 'high',
  description: 'International Mobile Subscriber Identity numbers'
};

/**
 * IMEI (International Mobile Equipment Identity)
 */
export const IMEI_NUMBER: PIIPattern = {
  type: 'IMEI_NUMBER',
  regex: /\bIMEI[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{15})\b/gi,
  placeholder: '[IMEI_{n}]',
  priority: 90,
  severity: 'high',
  description: 'International Mobile Equipment Identity numbers'
};

/**
 * SIM Card Number
 */
export const SIM_CARD_NUMBER: PIIPattern = {
  type: 'SIM_CARD_NUMBER',
  regex: /\bSIM[-\s]?(?:CARD)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{19,20})\b/gi,
  placeholder: '[SIM_{n}]',
  priority: 85,
  severity: 'high',
  description: 'SIM card identification numbers',
  validator: (_value: string, context: string) => {
    return /sim|card|mobile|cellular|phone/i.test(context);
  }
};

/**
 * Service Request Number
 */
export const SERVICE_REQUEST_NUMBER: PIIPattern = {
  type: 'SERVICE_REQUEST_NUMBER',
  regex: /\b(?:SERVICE|SR)[-\s]?(?:REQUEST)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[SERVICE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Service request and ticket numbers',
  validator: (_value: string, context: string) => {
    return /service|request|ticket|support|maintenance|repair/i.test(context);
  }
};

/**
 * Utility Bill Account Number
 */
export const UTILITY_BILL_ACCOUNT: PIIPattern = {
  type: 'UTILITY_BILL_ACCOUNT',
  regex: /\b(?:BILL|BILLING)[-\s]?(?:ACCOUNT)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{8,14})\b/gi,
  placeholder: '[BILL_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Utility billing account numbers',
  validator: (_value: string, context: string) => {
    return /bill|billing|utility|electric|gas|water|energy/i.test(context);
  }
};

/**
 * Installation Reference Number
 */
export const INSTALLATION_REF: PIIPattern = {
  type: 'INSTALLATION_REF',
  regex: /\b(?:INSTALLATION|INSTALL)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[INSTALL_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Installation reference numbers',
  validator: (_value: string, context: string) => {
    return /installation|install|setup|deployment|activation/i.test(context);
  }
};

/**
 * Phone Line Number (masked format)
 */
export const PHONE_LINE_NUMBER: PIIPattern = {
  type: 'PHONE_LINE_NUMBER',
  regex: /\b(?:LINE|NUMBER)[-\s]?(?:NO)?[-\s]?[:#]?\s*(\d{3}[-\s]?\d{3}[-\s]?\d{4})\b/g,
  placeholder: '[PHONE_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Phone line numbers',
  validator: (_value: string, context: string) => {
    return /phone|line|number|mobile|landline|telephone/i.test(context);
  }
};

/**
 * Broadband/Internet Service ID
 */
export const BROADBAND_SERVICE_ID: PIIPattern = {
  type: 'BROADBAND_SERVICE_ID',
  regex: /\b(?:BROADBAND|INTERNET|ISP)[-\s]?(?:SERVICE)?[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[BROADBAND_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Broadband and internet service identifiers',
  validator: (_value: string, context: string) => {
    return /broadband|internet|isp|connection|service/i.test(context);
  }
};

/**
 * Equipment Serial Number (routers, modems, etc.)
 */
export const EQUIPMENT_SERIAL: PIIPattern = {
  type: 'EQUIPMENT_SERIAL',
  regex: /\b(?:EQUIPMENT|DEVICE|ROUTER|MODEM)[-\s]?(?:SERIAL)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{10,16})\b/gi,
  placeholder: '[EQUIPMENT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Equipment and device serial numbers',
  validator: (_value: string, context: string) => {
    return /equipment|device|router|modem|serial|hardware/i.test(context);
  }
};

/**
 * Smart Meter ID
 */
export const SMART_METER_ID: PIIPattern = {
  type: 'SMART_METER_ID',
  regex: /\b(?:SMART[-\s]?METER)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{10,16})\b/gi,
  placeholder: '[SMART_METER_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Smart meter identification numbers',
  validator: (_value: string, context: string) => {
    return /smart|meter|energy|electric|gas|monitoring/i.test(context);
  }
};

// Export all telecoms patterns
export const telecomsPatterns: PIIPattern[] = [
  TELECOMS_ACCOUNT_NUMBER,
  METER_SERIAL_NUMBER,
  IMSI_NUMBER,
  IMEI_NUMBER,
  SIM_CARD_NUMBER,
  SERVICE_REQUEST_NUMBER,
  UTILITY_BILL_ACCOUNT,
  INSTALLATION_REF,
  PHONE_LINE_NUMBER,
  BROADBAND_SERVICE_ID,
  EQUIPMENT_SERIAL,
  SMART_METER_ID
];
