/**
 * Contact information patterns (phones, addresses, etc.)
 */

import { PIIPattern } from '../types';

export const contactPatterns: PIIPattern[] = [
  {
    type: 'PHONE_UK_MOBILE',
    regex: /\b07\d{3}[\s-]?\d{3}[\s-]?\d{3}\b/g,
    priority: 90,
    placeholder: '[PHONE_UK_MOBILE_{n}]',
    description: 'UK mobile phone',
    severity: 'medium'
  },
  {
    type: 'PHONE_UK',
    regex: /\b(?:0[1-9]\d{1,2}[\s-]?\d{3,4}[\s-]?\d{4}|\+44[\s-]?[1-9]\d{1,2}[\s-]?\d{3,4}[\s-]?\d{4})\b/g,
    priority: 85,
    placeholder: '[PHONE_UK_{n}]',
    description: 'UK phone number',
    severity: 'medium'
  },
  {
    type: 'PHONE_US',
    regex: /(?<=^|[^\d])(?:\+1[\s-]?)?(?:\(\d{3}\)\s?|\d{3}[\s-]?)\d{3}[\s-]?\d{4}(?=[^\d]|$)/g,
    priority: 85,
    placeholder: '[PHONE_US_{n}]',
    description: 'US phone number',
    severity: 'medium'
  },
  {
    type: 'PHONE_INTERNATIONAL',
    regex: /\b\+\d{1,3}[\s-]?\d{1,4}[\s-]?\d{1,4}[\s-]?\d{1,9}\b/g,
    priority: 80,
    placeholder: '[PHONE_{n}]',
    description: 'International phone number',
    severity: 'medium'
  },
  {
    type: 'POSTCODE_UK',
    regex: /\b([A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2})\b/g,
    priority: 75,
    placeholder: '[POSTCODE_{n}]',
    description: 'UK postcode',
    severity: 'low'
  },
  {
    type: 'ZIP_CODE_US',
    regex: /\b(\d{5}(?:-\d{4})?)\b/g,
    priority: 70,
    placeholder: '[ZIP_{n}]',
    description: 'US ZIP code',
    severity: 'low'
  },
  {
    type: 'ADDRESS_STREET',
    regex: /\b(\d{1,5}\s[A-Z][a-z]+(?:\s[A-Z][a-z]+){0,3}\s(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Court|Ct|Boulevard|Blvd))\b/g,
    priority: 70,
    placeholder: '[ADDRESS_{n}]',
    description: 'Street address',
    severity: 'medium'
  },
  {
    type: 'ADDRESS_PO_BOX',
    regex: /\b(P\.?O\.?\s?Box\s\d+)\b/gi,
    priority: 75,
    placeholder: '[PO_BOX_{n}]',
    description: 'PO Box address',
    severity: 'medium'
  }
];
