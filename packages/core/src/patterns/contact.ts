/**
 * Contact information patterns (phones, addresses, etc.)
 */

import { PIIPattern } from '../types';

export const contactPatterns: PIIPattern[] = [
  {
    type: 'PHONE_UK_MOBILE',
    regex: /\b(?:\+?44[\s.-]?7\d{3}|0?7\d{3})[\s.-]?\d{3}[\s.-]?\d{3}\b/g,
    priority: 90,
    placeholder: '[PHONE_UK_MOBILE_{n}]',
    description: 'UK mobile phone',
    severity: 'medium'
  },
  {
    type: 'PHONE_UK',
    regex: /\b(?:\+?44[\s.-]?(?:0)?\s*)?(?:\(?0?[1-9]\d{1,3}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4})(?:\s?(?:ext\.?|x)\s?\d{1,5})?\b/g,
    priority: 85,
    placeholder: '[PHONE_UK_{n}]',
    description: 'UK phone number',
    severity: 'medium'
  },
  {
    type: 'PHONE_US',
    regex: /\b(?:\+1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}(?:\s?(?:ext\.?|x)\s?\d{1,6})?\b/g,
    priority: 85,
    placeholder: '[PHONE_US_{n}]',
    description: 'US phone number',
    severity: 'medium'
  },
  {
    type: 'PHONE_INTERNATIONAL',
    regex: /\b\+(?:\d[\s.-()]?){6,14}\d(?:\s?(?:ext\.?|x)\s?\d{1,6})?\b/g,
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
    regex: /\b\d{1,5}\s+[A-Za-z0-9][A-Za-z0-9'’.\-]*(?:\s+[A-Za-z0-9][A-Za-z0-9'’.\-]*){0,4}\s+(?:Street|St\.?|Road|Rd\.?|Avenue|Ave\.?|Lane|Ln\.?|Drive|Dr\.?|Court|Ct\.?|Boulevard|Blvd\.?|Way|Terrace|Ter\.?|Place|Pl\.?|Trail|Trl\.?|Parkway|Pkwy\.?|Highway|Hwy\.)(?:\s+(?:Apt|Unit|Suite|Ste)\s*\d+)?\b/gi,
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
