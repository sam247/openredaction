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
    regex: /\b(?:SSN|social\s+security)\b[:\s#-]*([0-9]{3}[\s\u00A0.-]?[0-9]{2}[\s\u00A0.-]?[0-9]{4})\b/gi,
    priority: 100,
    validator: (match) => validateSSN(match),
    placeholder: '[SSN_{n}]',
    description: 'US Social Security Number',
    severity: 'high'
  },
  {
    type: 'PASSPORT_UK',
    regex: /\b(?:passport|pass)[:\s#-]*((?:\d{3}[\s\u00A0.-]?){2}\d{3})\b/gi,
    priority: 95,
    validator: (match) => validateUKPassport(match),
    placeholder: '[PASSPORT_{n}]',
    description: 'UK Passport number',
    severity: 'high'
  },
  {
    type: 'PASSPORT_US',
    regex: /\b(?:passport|pass)[:\s#-]*(([A-Z0-9][\s\u00A0.-]?){5,8}[A-Z0-9])\b/gi,
    priority: 95,
    placeholder: '[PASSPORT_{n}]',
    description: 'US Passport number',
    severity: 'high'
  },
  {
    type: 'NATIONAL_INSURANCE_UK',
    regex: /\b(?:NI\b|NINO|national\s+insurance)[:\s#-]*([A-CEGHJ-PR-TW-Z]{2}(?:[\s\u00A0.-]?\d{2}){3}[\s\u00A0.-]?[A-D])\b/gi,
    priority: 100,
    validator: (match) => validateNINO(match),
    placeholder: '[NINO_{n}]',
    description: 'UK National Insurance Number',
    severity: 'high'
  },
  {
    type: 'NHS_NUMBER',
    regex: /\b(?:NHS|nhs number)[:\s#-]*((?:\d{3}[\s\u00A0.-]?){2}\d{4})\b/gi,
    priority: 95,
    validator: (match) => validateNHS(match),
    placeholder: '[NHS_{n}]',
    description: 'UK NHS Number',
    severity: 'high'
  },
  {
    type: 'DRIVING_LICENSE_UK',
    regex: /\b(?:DL|DRIVING|DRIVER(?:'S)?|LICEN[SC]E)?[\s#:-]*(?:NO|NUM(?:BER)?|ID)?[\s#:-]*([A-Z]{5}[\s\u00A0.-]?\d{2}[\s\u00A0.-]?\d{2}[\s\u00A0.-]?\d{2}[\s\u00A0.-]?[A-Z]{2}[\s\u00A0.-]?\d[\s\u00A0.-]?[A-Z]{2})\b/gi,
    priority: 90,
    placeholder: '[DRIVING_LICENSE_{n}]',
    description: 'UK Driving License',
    severity: 'high',
    validator: (value: string) => {
      const normalized = value.replace(/[\s\u00A0.-]/g, '').toUpperCase();
      if (!/^[A-Z]{5}\d{6}[A-Z]{2}\d[A-Z]{2}$/.test(normalized)) {
        return false;
      }
      const dob = normalized.slice(5, 11);
      const month = parseInt(dob.slice(2, 4), 10);
      const day = parseInt(dob.slice(4, 6), 10);
      const validMonth = (month >= 1 && month <= 12) || (month >= 51 && month <= 62);
      const validDay = day >= 1 && day <= 31;
      return validMonth && validDay;
    }
  },
  {
    type: 'DRIVING_LICENSE_US',
    regex: /\b(?:DL|driver(?:'s)?\slicense)[:\s#-]*([A-Z0-9](?:[A-Z0-9][\s\u00A0.-]?){3,18}[A-Z0-9])\b/gi,
    priority: 90,
    placeholder: '[DRIVING_LICENSE_{n}]',
    description: 'US Driving License',
    severity: 'high'
  },
  {
    type: 'TAX_ID',
    regex: /\b(?:TIN|tax id|EIN)[:\s#-]*(\d{2}(?:[\s\u00A0.-]?\d){7})\b/gi,
    priority: 95,
    placeholder: '[TAX_ID_{n}]',
    description: 'Tax identification number',
    severity: 'high'
  },
  {
    type: 'PASSPORT_MRZ_TD3',
    regex: /P<[A-Z]{3}[A-Z<]{39}\r?\n[A-Z0-9<]{9}[0-9][A-Z]{3}[0-9]{6}[0-9][MF<][0-9]{6}[0-9][A-Z0-9<]{14}[0-9]/g,
    priority: 98,
    placeholder: '[PASSPORT_MRZ_{n}]',
    description: 'Passport Machine Readable Zone (TD3 - 2 lines x 44 chars)',
    severity: 'high'
  },
  {
    type: 'PASSPORT_MRZ_TD1',
    regex: /[A-Z]{1}[A-Z<][A-Z]{3}[A-Z0-9<]{9}[0-9][A-Z0-9<]{15}\r?\n[0-9]{6}[0-9][MF<][0-9]{6}[0-9][A-Z]{3}[A-Z0-9<]{11}[0-9]\r?\n[A-Z<]{30}/g,
    priority: 98,
    placeholder: '[ID_MRZ_{n}]',
    description: 'ID Card Machine Readable Zone (TD1 - 3 lines x 30 chars)',
    severity: 'high'
  },
  {
    type: 'VISA_MRZ',
    regex: /V<[A-Z]{3}[A-Z<]{39}\r?\n[A-Z0-9<]{9}[0-9][A-Z]{3}[0-9]{6}[0-9][MF<][0-9]{6}[0-9][A-Z0-9<]{14}[0-9]/g,
    priority: 98,
    placeholder: '[VISA_MRZ_{n}]',
    description: 'Visa Machine Readable Zone',
    severity: 'high'
  },
  {
    type: 'TRAVEL_DOCUMENT_NUMBER',
    regex: /\b(?:TRAVEL\s+DOC(?:UMENT)?|TD)[:\s#-]*([A-Z0-9](?:[A-Z0-9][\s\u00A0.-]?){4,13}[A-Z0-9])\b/gi,
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
    regex: /\b(?:VISA)[:\s#-]*([A-Z0-9](?:[A-Z0-9][\s\u00A0.-]?){6,10}[A-Z0-9])\b/gi,
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
    regex: /\b(?:IMMIGRATION|ALIEN|A-NUMBER|A#)[:\s#-]*([A-Z]?(?:\d[\s\u00A0.-]?){7,9})\b/gi,
    priority: 92,
    placeholder: '[IMMIGRATION_{n}]',
    description: 'Immigration and alien registration numbers',
    severity: 'high'
  },
  {
    type: 'BORDER_CROSSING_CARD',
    regex: /\b(?:BCC|BORDER\s+CROSSING)[:\s#-]*([A-Z0-9](?:[A-Z0-9\s\u00A0.-]?){8,13}[A-Z0-9])\b/gi,
    priority: 90,
    placeholder: '[BCC_{n}]',
    description: 'Border crossing card numbers',
    severity: 'high',
    validator: (_value: string, context: string) => {
      return /border|crossing|card|entry|bcc/i.test(context);
    }
  },
  {
    type: 'UTR_UK',
    regex: /\b(?:UTR|unique taxpayer reference)[:\s#-]*((?:\d[\s\u00A0.-]?){10})\b/gi,
    priority: 95,
    validator: (match) => {
      // UK UTR: 10 digits, typically issued in sequence
      const digits = match.replace(/\D/g, '');
      return digits.length === 10 && /^\d{10}$/.test(digits);
    },
    placeholder: '[UTR_{n}]',
    description: 'UK Unique Taxpayer Reference',
    severity: 'high'
  },
  {
    type: 'VAT_NUMBER',
    regex: /\b(?:VAT|vat number)[:\s#-]*([A-Z]{2}(?:[\s\u00A0.-]?[A-Z0-9]){7,12})\b/gi,
    priority: 90,
    validator: (match) => {
      // VAT format varies by country (GB: 9 digits, DE: 9 digits, FR: 11 chars, etc.)
      const cleaned = match.replace(/[\s\u00A0.-]/g, '');

      // Check for valid country codes
      const countryCode = cleaned.substring(0, 2).toUpperCase();
      const validCountries = ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PL', 'SE', 'DK', 'FI', 'IE', 'PT', 'CZ', 'HU', 'RO', 'BG', 'GR', 'HR', 'SK', 'SI', 'LT', 'LV', 'EE', 'CY', 'LU', 'MT'];

      if (!validCountries.includes(countryCode)) {
        return false;
      }

      const number = cleaned.substring(2);

      // Country-specific validation
      if (countryCode === 'GB') {
        // UK: 9 or 12 digits
        return /^\d{9}(\d{3})?$/.test(number);
      } else if (countryCode === 'DE') {
        // Germany: 9 digits
        return /^\d{9}$/.test(number);
      } else if (countryCode === 'FR') {
        // France: 11 characters (2 letters/digits + 9 digits)
        return /^[A-Z0-9]{2}\d{9}$/.test(number);
      }

      // Generic validation: must have digits
      return /\d{7,12}/.test(number);
    },
    placeholder: '[VAT_{n}]',
    description: 'VAT registration number',
    severity: 'medium'
  },
  {
    type: 'COMPANY_NUMBER_UK',
    regex: /\b(?:company number|reg(?:\.|istration)?\s+no(?:\.)?)[:\s#]*([A-Z]{2}\d{6}|\d{8})\b/gi,
    priority: 85,
    validator: (match) => {
      // UK company number: 8 digits or 2 letters + 6 digits
      const cleaned = match.replace(/\s/g, '');
      return /^(\d{8}|[A-Z]{2}\d{6})$/.test(cleaned);
    },
    placeholder: '[COMPANY_NUMBER_{n}]',
    description: 'UK Company registration number',
    severity: 'low'
  },
  {
    type: 'ITIN',
    regex: /\b(?:ITIN|individual taxpayer)[:\s#]*(9\d{2}[-\s]?[7-8]\d[-\s]?\d{4})\b/gi,
    priority: 100,
    validator: (match) => {
      // ITIN: 9XX-7X-XXXX or 9XX-8X-XXXX format
      const digits = match.replace(/\D/g, '');

      if (digits.length !== 9) return false;

      // Must start with 9
      if (digits[0] !== '9') return false;

      // Fourth and fifth digits must be 7 or 8
      const fourthDigit = parseInt(digits[3]);
      if (fourthDigit !== 7 && fourthDigit !== 8) return false;

      // Cannot be all same digit
      if (/^(\d)\1{8}$/.test(digits)) return false;

      return true;
    },
    placeholder: '[ITIN_{n}]',
    description: 'US Individual Taxpayer Identification Number',
    severity: 'high'
  },
  {
    type: 'SIN_CA',
    regex: /\b(?:SIN|social insurance)[:\s#]*(\d{3}[-\s]?\d{3}[-\s]?\d{3})\b/gi,
    priority: 100,
    validator: (match) => {
      // Canadian SIN: 9 digits using Luhn algorithm
      const digits = match.replace(/\D/g, '');

      if (digits.length !== 9) return false;

      // Luhn check (mod-10 algorithm)
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        let digit = parseInt(digits[i]);

        // Double every second digit
        if (i % 2 === 1) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }

        sum += digit;
      }

      return sum % 10 === 0;
    },
    placeholder: '[SIN_{n}]',
    description: 'Canadian Social Insurance Number',
    severity: 'high'
  }
];
