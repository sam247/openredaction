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
  },
  {
    type: 'IFSC',
    regex: /\b[A-Z]{4}0[A-Z0-9]{6}\b/g,
    priority: 90,
    placeholder: '[IFSC_{n}]',
    description: 'Indian Financial System Code',
    severity: 'high'
  },
  {
    type: 'CLABE',
    regex: /\b\d{18}\b/g,
    priority: 85,
    validator: (match) => {
      // CLABE has 18 digits: 3 bank + 3 branch + 11 account + 1 check digit
      if (match.length !== 18) return false;

      // Validate check digit using weighted sum
      const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(match[i]) * weights[i];
      }
      const checkDigit = (10 - (sum % 10)) % 10;
      return checkDigit === parseInt(match[17]);
    },
    placeholder: '[CLABE_{n}]',
    description: 'Mexican CLABE bank account number',
    severity: 'high'
  },
  {
    type: 'BSB_AU',
    regex: /\b(?:BSB)[:\s]*(\d{3}[-\s]?\d{3})\b/gi,
    priority: 90,
    validator: (match) => {
      const digits = match.replace(/\D/g, '');
      return digits.length === 6;
    },
    placeholder: '[BSB_{n}]',
    description: 'Australian Bank State Branch number',
    severity: 'high'
  },
  {
    type: 'ISIN',
    regex: /\b[A-Z]{2}[A-Z0-9]{9}\d\b/g,
    priority: 85,
    validator: (match) => {
      // ISIN: 2 letter country code + 9 alphanumeric + 1 check digit
      if (match.length !== 12) return false;

      // Convert letters to numbers (A=10, B=11, etc.)
      let numStr = '';
      for (let i = 0; i < match.length - 1; i++) {
        const char = match[i];
        if (char >= 'A' && char <= 'Z') {
          numStr += (char.charCodeAt(0) - 55).toString();
        } else {
          numStr += char;
        }
      }

      // Luhn check
      let sum = 0;
      let alternate = false;
      for (let i = numStr.length - 1; i >= 0; i--) {
        let digit = parseInt(numStr[i]);
        if (alternate) {
          digit *= 2;
          if (digit > 9) digit -= 9;
        }
        sum += digit;
        alternate = !alternate;
      }

      const checkDigit = (10 - (sum % 10)) % 10;
      return checkDigit === parseInt(match[11]);
    },
    placeholder: '[ISIN_{n}]',
    description: 'International Securities Identification Number',
    severity: 'medium'
  },
  {
    type: 'CUSIP',
    regex: /\b[A-Z0-9]{9}\b/g,
    priority: 80,
    validator: (match) => {
      // CUSIP: 9 characters (8 alphanumeric + 1 check digit)
      if (match.length !== 9) return false;

      // Convert to numbers
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        let value: number;
        const char = match[i];
        if (char >= '0' && char <= '9') {
          value = parseInt(char);
        } else if (char >= 'A' && char <= 'Z') {
          value = char.charCodeAt(0) - 55; // A=10, B=11, etc.
        } else {
          return false;
        }

        // Double every second digit
        if (i % 2 !== 0) {
          value *= 2;
        }

        // Add digits
        sum += Math.floor(value / 10) + (value % 10);
      }

      const checkDigit = (10 - (sum % 10)) % 10;
      return checkDigit === parseInt(match[8]);
    },
    placeholder: '[CUSIP_{n}]',
    description: 'CUSIP securities identifier',
    severity: 'medium'
  },
  {
    type: 'SEDOL',
    regex: /\b[B-DF-HJ-NP-TV-Z0-9]{6}\d\b/g,
    priority: 80,
    validator: (match) => {
      // SEDOL: 6 alphanumeric + 1 check digit (excludes vowels and I)
      if (match.length !== 7) return false;

      const weights = [1, 3, 1, 7, 3, 9];
      let sum = 0;

      for (let i = 0; i < 6; i++) {
        const char = match[i];
        let value: number;
        if (char >= '0' && char <= '9') {
          value = parseInt(char);
        } else {
          value = char.charCodeAt(0) - 55; // A=10, B=11, etc.
        }
        sum += value * weights[i];
      }

      const checkDigit = (10 - (sum % 10)) % 10;
      return checkDigit === parseInt(match[6]);
    },
    placeholder: '[SEDOL_{n}]',
    description: 'Stock Exchange Daily Official List identifier',
    severity: 'medium'
  },
  {
    type: 'LEI',
    regex: /\b[A-Z0-9]{20}\b/g,
    priority: 75,
    validator: (match) => {
      // LEI: 20 alphanumeric characters
      if (match.length !== 20) return false;

      // Convert to numeric string
      let numStr = '';
      for (const char of match) {
        if (char >= '0' && char <= '9') {
          numStr += char;
        } else if (char >= 'A' && char <= 'Z') {
          numStr += (char.charCodeAt(0) - 55).toString();
        } else {
          return false;
        }
      }

      // ISO 17442 check digit validation (mod 97)
      const checkDigits = parseInt(numStr.slice(-2));
      const baseNumber = numStr.slice(0, -2);

      // Calculate mod 97
      let remainder = 0;
      for (const digit of baseNumber) {
        remainder = (remainder * 10 + parseInt(digit)) % 97;
      }

      const calculated = 98 - remainder;
      return calculated === checkDigits;
    },
    placeholder: '[LEI_{n}]',
    description: 'Legal Entity Identifier',
    severity: 'medium'
  }
];
