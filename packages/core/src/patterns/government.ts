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
  }
];
