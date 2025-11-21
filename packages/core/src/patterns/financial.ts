/**
 * Financial PII patterns (credit cards, bank accounts, etc.)
 */

import { PIIPattern } from '../types';
import { validateLuhn, validateIBAN, validateSortCode } from '../validators';

export const financialPatterns: PIIPattern[] = [
  {
    type: 'CREDIT_CARD',
    regex: /\b(?:(?:\d{4}[\s-]?){3}\d{4}|\d{4}[\s-]?\d{6}[\s-]?\d{5})\b/g,
    priority: 100,
    validator: (match) => validateLuhn(match),
    placeholder: '[CREDIT_CARD_{n}]',
    description: 'Credit card number',
    severity: 'high'
  },
  {
    type: 'IBAN',
    regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/g,
    priority: 95,
    validator: (match) => validateIBAN(match),
    placeholder: '[IBAN_{n}]',
    description: 'IBAN bank account',
    severity: 'high'
  },
  {
    type: 'BANK_ACCOUNT_UK',
    regex: /\b(?:account|acc)[:\s#]*([0-9]{8})\b/gi,
    priority: 90,
    placeholder: '[BANK_ACCOUNT_{n}]',
    description: 'UK bank account number',
    severity: 'high'
  },
  {
    type: 'SORT_CODE_UK',
    regex: /\b(?:sort[:\s]?code|SC)[:\s]*(\d{2}[-\s]?\d{2}[-\s]?\d{2})\b/gi,
    priority: 90,
    validator: (match) => validateSortCode(match),
    placeholder: '[SORT_CODE_{n}]',
    description: 'UK sort code',
    severity: 'high'
  },
  {
    type: 'ROUTING_NUMBER_US',
    regex: /\b(?:routing|RTN|ABA)[:\s#]*([0-9]{9})\b/gi,
    priority: 90,
    placeholder: '[ROUTING_NUMBER_{n}]',
    description: 'US routing number',
    severity: 'high'
  },
  {
    type: 'CVV',
    regex: /\b(?:CVV|CVC|CSC|CVN)[:\s]*(\d{3,4})\b/gi,
    priority: 95,
    placeholder: '[CVV_{n}]',
    description: 'Card security code',
    severity: 'high'
  }
];
