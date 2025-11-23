/**
 * Government ID patterns (passports, SSN, national IDs, etc.)
 */

import { PIIPattern } from '../types';
import {
  validateSSN,
  validateNINO,
  validateNHS,
  validateUKPassport
} from '../validators';

export const governmentPatterns: PIIPattern[] = [
  {
    type: 'SSN',
    regex: /\b(?:SSN|social security)[:\s#]*(\d{3}[-\s]?\d{2}[-\s]?\d{4})\b/gi,
    priority: 100,
    validator: (match) => validateSSN(match),
    placeholder: '[SSN_{n}]',
    description: 'US Social Security Number',
    severity: 'high'
  },
  {
    type: 'PASSPORT_UK',
    regex: /\b(?:passport|pass)[:\s#]*([0-9]{9})\b/gi,
    priority: 95,
    validator: (match) => validateUKPassport(match),
    placeholder: '[PASSPORT_{n}]',
    description: 'UK Passport number',
    severity: 'high'
  },
  {
    type: 'PASSPORT_US',
    regex: /\b(?:passport|pass)[:\s#]*([A-Z0-9]{6,9})\b/gi,
    priority: 95,
    placeholder: '[PASSPORT_{n}]',
    description: 'US Passport number',
    severity: 'high'
  },
  {
    type: 'NATIONAL_INSURANCE_UK',
    regex: /\b(?:NI|NINO|national insurance)[:\s#]*([A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D])\b/gi,
    priority: 100,
    validator: (match) => validateNINO(match),
    placeholder: '[NINO_{n}]',
    description: 'UK National Insurance Number',
    severity: 'high'
  },
  {
    type: 'NHS_NUMBER',
    regex: /\b(?:NHS|nhs number)[:\s#]*(\d{3}[\s-]?\d{3}[\s-]?\d{4})\b/gi,
    priority: 95,
    validator: (match) => validateNHS(match),
    placeholder: '[NHS_{n}]',
    description: 'UK NHS Number',
    severity: 'high'
  },
  {
    type: 'DRIVING_LICENSE_UK',
    regex: /\b([A-Z]{5}\d{6}[A-Z]{2}\d[A-Z]{2})\b/g,
    priority: 90,
    placeholder: '[DRIVING_LICENSE_{n}]',
    description: 'UK Driving License',
    severity: 'high'
  },
  {
    type: 'DRIVING_LICENSE_US',
    regex: /\b(?:DL|driver(?:'s)?\slicense)[:\s#]*([A-Z0-9]{5,20})\b/gi,
    priority: 90,
    placeholder: '[DRIVING_LICENSE_{n}]',
    description: 'US Driving License',
    severity: 'high'
  },
  {
    type: 'TAX_ID',
    regex: /\b(?:TIN|tax id|EIN)[:\s#]*(\d{2}[-\s]?\d{7})\b/gi,
    priority: 95,
    placeholder: '[TAX_ID_{n}]',
    description: 'Tax identification number',
    severity: 'high'
  },
  {
    type: 'PASSPORT_MRZ_TD3',
    regex: /P<[A-Z]{3}[A-Z<]{39}\n[A-Z0-9<]{9}[0-9][A-Z]{3}[0-9]{6}[0-9][MF<][0-9]{6}[0-9][A-Z0-9<]{14}[0-9]/g,
    priority: 98,
    placeholder: '[PASSPORT_MRZ_{n}]',
    description: 'Passport Machine Readable Zone (TD3 - 2 lines x 44 chars)',
    severity: 'high'
  },
  {
    type: 'PASSPORT_MRZ_TD1',
    regex: /[A-Z]{1}[A-Z<][A-Z]{3}[A-Z0-9<]{9}[0-9][A-Z0-9<]{15}\n[0-9]{6}[0-9][MF<][0-9]{6}[0-9][A-Z]{3}[A-Z0-9<]{11}[0-9]\n[A-Z<]{30}/g,
    priority: 98,
    placeholder: '[ID_MRZ_{n}]',
    description: 'ID Card Machine Readable Zone (TD1 - 3 lines x 30 chars)',
    severity: 'high'
  },
  {
    type: 'VISA_MRZ',
    regex: /V<[A-Z]{3}[A-Z<]{39}\n[A-Z0-9<]{9}[0-9][A-Z]{3}[0-9]{6}[0-9][MF<][0-9]{6}[0-9][A-Z0-9<]{14}[0-9]/g,
    priority: 98,
    placeholder: '[VISA_MRZ_{n}]',
    description: 'Visa Machine Readable Zone',
    severity: 'high'
  },
  {
    type: 'TRAVEL_DOCUMENT_NUMBER',
    regex: /\b(?:TRAVEL\s+DOC(?:UMENT)?|TD)[:\s#]*([A-Z0-9]{6,15})\b/gi,
    priority: 92,
    placeholder: '[TRAVEL_DOC_{n}]',
    description: 'Travel document numbers',
    severity: 'high',
    validator: (_value: string, context: string) => {
      return /travel|document|visa|passport|border|immigration/i.test(context);
    }
  },
  {
    type: 'VISA_NUMBER',
    regex: /\b(?:VISA)[:\s#]*([A-Z0-9]{8,12})\b/gi,
    priority: 92,
    placeholder: '[VISA_{n}]',
    description: 'Visa numbers',
    severity: 'high',
    validator: (_value: string, context: string) => {
      return /visa|travel|entry|immigration|consulate|embassy/i.test(context);
    }
  },
  {
    type: 'IMMIGRATION_NUMBER',
    regex: /\b(?:IMMIGRATION|ALIEN|A-NUMBER|A#)[:\s#]*([A-Z]?\d{8,10})\b/gi,
    priority: 92,
    placeholder: '[IMMIGRATION_{n}]',
    description: 'Immigration and alien registration numbers',
    severity: 'high'
  },
  {
    type: 'BORDER_CROSSING_CARD',
    regex: /\b(?:BCC|BORDER\s+CROSSING)[:\s#]*([A-Z0-9]{10,15})\b/gi,
    priority: 90,
    placeholder: '[BCC_{n}]',
    description: 'Border crossing card numbers',
    severity: 'high',
    validator: (_value: string, context: string) => {
      return /border|crossing|card|entry|bcc/i.test(context);
    }
  }
];
