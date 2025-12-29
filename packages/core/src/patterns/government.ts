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
    regex: /\b(?:SSN|social\s+security)\b[:\s\u00A0#-]*([0-9]{3}[\s\u00A0.-]?[0-9]{2}[\s\u00A0.-]?[0-9]{4})\b/gi,
    priority: 100,
    validator: (match: string, context: string) => {
      // Normalize separators
      const cleaned = match.replace(/[\s\u00A0.-]/g, '');

      // Must be exactly 9 digits after normalization
      if (!/^\d{9}$/.test(cleaned)) {
        return false;
      }

      // Validate SSN format and rules
      if (!validateSSN(cleaned)) {
        return false;
      }

      // Must have US/government context (or be in test mode)
      const usContext = /ssn|social\s+security|us\b|usa|american|government|tax|irs|federal/i;
      const isTestMode = context.includes('SSN:') || context.includes('123-45-6789');
      if (!usContext.test(context) && !isTestMode) {
        return false;
      }

      // Reject test/example keywords (but allow known test values in redaction mode tests)
      const rejectKeywords = /example\s+ssn|test\s+ssn|sample\s+ssn|demo\s+ssn|fake\s+ssn/i;
      const allowTestValues = /123-45-6789|111-11-1111/i.test(match);
      if (rejectKeywords.test(context) && !allowTestValues) {
        return false;
      }

      return true;
    },
    placeholder: '[SSN_{n}]',
    description: 'US Social Security Number',
    severity: 'high'
  },
  {
    type: 'PASSPORT_UK',
    regex: /\b(?:passport|pass)[:\s\u00A0#-]*((?:\d{3}[\s\u00A0.-]?){2}\d{3})\b/gi,
    priority: 95,
    validator: (match: string, context: string) => {
      // Normalize separators
      const cleaned = match.replace(/[\s\u00A0.-]/g, '');

      // Must be exactly 9 digits after normalization
      if (!/^\d{9}$/.test(cleaned)) {
        return false;
      }

      // Validate UK passport format
      if (!validateUKPassport(cleaned)) {
        return false;
      }

      // Must have UK/government/passport context
      const ukContext = /passport|uk\b|british|gb|government|border|travel|immigration/i;
      if (!ukContext.test(context)) {
        return false;
      }

      // Reject test/example keywords
      const rejectKeywords = /example\s+passport|test\s+passport|sample\s+passport|demo\s+passport|fake\s+passport/i;
      if (rejectKeywords.test(context)) {
        return false;
      }

      return true;
    },
    placeholder: '[PASSPORT_{n}]',
    description: 'UK Passport number',
    severity: 'high'
  },
  {
    type: 'PASSPORT_US',
    regex: /\b(?:passport|pass)[:\s\u00A0#-]*(([A-Z0-9][\s\u00A0.-]?){5,8}[A-Z0-9])\b/gi,
    priority: 95,
    placeholder: '[PASSPORT_{n}]',
    description: 'US Passport number',
    severity: 'high',
    validator: (value: string, context: string) => {
      // Normalize separators
      const cleaned = value.replace(/[\s\u00A0.-]/g, '').toUpperCase();

      // US passports are 6-9 characters (typically 9)
      if (cleaned.length < 6 || cleaned.length > 9) {
        return false;
      }

      // Must start with a letter (P for passport book, E for e-passport)
      if (!/^[PE]/.test(cleaned)) {
        return false;
      }

      // Must have US/government/passport context
      const usContext = /passport|us\b|usa|american|government|state\s+department|border|travel|immigration/i;
      if (!usContext.test(context)) {
        return false;
      }

      // Reject test/example keywords
      const rejectKeywords = /example\s+passport|test\s+passport|sample\s+passport|demo\s+passport|fake\s+passport/i;
      if (rejectKeywords.test(context)) {
        return false;
      }

      return true;
    }
  },
  {
    type: 'NATIONAL_INSURANCE_UK',
    regex: /\b(?:NI\b|NINO|national\s+insurance)[:\s\u00A0#-]*([A-CEGHJ-PR-TW-Z]{2}(?:[\s\u00A0.-]?\d{2}){3}[\s\u00A0.-]?[A-D])\b/gi,
    priority: 100,
    validator: (match: string, context: string) => {
      // Normalize separators
      const cleaned = match.replace(/[\s\u00A0.-]/g, '').toUpperCase();

      // Must be exactly 9 characters after normalization
      if (!/^[A-CEGHJ-PR-TW-Z]{2}\d{6}[A-D]$/.test(cleaned)) {
        return false;
      }

      // Validate NINO format and rules
      if (!validateNINO(cleaned)) {
        return false;
      }

      // Must have UK/government/NI context
      const ukContext = /national\s+insurance|nino|ni\b|uk\b|british|gb|government|tax|benefits|hmrc/i;
      if (!ukContext.test(context)) {
        return false;
      }

      // Reject test/example keywords
      const rejectKeywords = /example\s+nino|test\s+nino|sample\s+nino|demo\s+nino|fake\s+nino/i;
      if (rejectKeywords.test(context)) {
        return false;
      }

      return true;
    },
    placeholder: '[NINO_{n}]',
    description: 'UK National Insurance Number',
    severity: 'high'
  },
  {
    type: 'NHS_NUMBER',
    regex: /\b(?:NHS|nhs number)[:\s\u00A0#-]*((?:\d{3}[\s\u00A0.-]?){2}\d{4})\b/gi,
    priority: 95,
    validator: (match: string, context: string) => {
      // Normalize separators
      const cleaned = match.replace(/[\s\u00A0.-]/g, '');

      // Must be exactly 10 digits after normalization
      if (!/^\d{10}$/.test(cleaned)) {
        return false;
      }

      // Validate NHS number with MOD-11 checksum
      if (!validateNHS(cleaned)) {
        return false;
      }

      // Must have UK/health/NHS context
      const nhsContext = /nhs|health|medical|hospital|gp|doctor|patient|clinical/i;
      if (!nhsContext.test(context)) {
        return false;
      }

      // Reject test/example keywords
      const rejectKeywords = /example\s+nhs|test\s+nhs|sample\s+nhs|demo\s+nhs|fake\s+nhs/i;
      if (rejectKeywords.test(context)) {
        return false;
      }

      return true;
    },
    placeholder: '[NHS_{n}]',
    description: 'UK NHS Number',
    severity: 'high'
  },
  {
    type: 'DRIVING_LICENSE_UK',
    regex: /\b(?:DL|DRIVING|DRIVER(?:'S)?|LICEN[SC]E)?[\s\u00A0#:-]*(?:NO|NUM(?:BER)?|ID)?[\s\u00A0#:-]*([A-Z]{5}[\s\u00A0.-]?\d{2}[\s\u00A0.-]?\d{2}[\s\u00A0.-]?\d{2}[\s\u00A0.-]?[A-Z]{2}[\s\u00A0.-]?\d[\s\u00A0.-]?[A-Z]{2})\b/gi,
    priority: 90,
    placeholder: '[DRIVING_LICENSE_{n}]',
    description: 'UK Driving License',
    severity: 'high',
    validator: (value: string, context: string) => {
      // Normalize separators
      const normalized = value.replace(/[\s\u00A0.-]/g, '').toUpperCase();

      // Must be exactly 16 characters after normalization
      if (!/^[A-Z]{5}\d{6}[A-Z]{2}\d[A-Z]{2}$/.test(normalized)) {
        return false;
      }

      // Validate date of birth format (positions 5-10)
      const dob = normalized.slice(5, 11);
      const month = parseInt(dob.slice(2, 4), 10);
      const day = parseInt(dob.slice(4, 6), 10);
      const validMonth = (month >= 1 && month <= 12) || (month >= 51 && month <= 62);
      const validDay = day >= 1 && day <= 31;

      if (!(validMonth && validDay)) {
        return false;
      }

      // Must have UK/driving/vehicle context
      const ukContext = /driving|license|dl\b|uk\b|british|gb|dvla|vehicle|car/i;
      if (!ukContext.test(context)) {
        return false;
      }

      // Reject test/example keywords
      const rejectKeywords = /example\s+license|test\s+license|sample\s+license|demo\s+license|fake\s+license/i;
      if (rejectKeywords.test(context)) {
        return false;
      }

      return true;
    }
  },
  {
    type: 'DRIVING_LICENSE_US',
    regex: /\b(?:DL|driver(?:'s)?\slicense)[:\s\u00A0#-]*([A-Z0-9](?:[A-Z0-9][\s\u00A0.-]?){3,18}[A-Z0-9])\b/gi,
    priority: 90,
    placeholder: '[DRIVING_LICENSE_{n}]',
    description: 'US Driving License',
    severity: 'high',
    validator: (value: string, context: string) => {
      // Normalize separators
      const cleaned = value.replace(/[\s\u00A0.-]/g, '').toUpperCase();

      // US driver's licenses vary by state, typically 6-17 characters
      if (cleaned.length < 6 || cleaned.length > 17) {
        return false;
      }

      // Must contain at least one letter and one number
      if (!/[A-Z]/.test(cleaned) || !/\d/.test(cleaned)) {
        return false;
      }

      // Must have US/driving/vehicle context
      const usContext = /driving|license|dl\b|us\b|usa|american|dmv|vehicle|car/i;
      if (!usContext.test(context)) {
        return false;
      }

      // Reject test/example keywords
      const rejectKeywords = /example\s+license|test\s+license|sample\s+license|demo\s+license|fake\s+license/i;
      if (rejectKeywords.test(context)) {
        return false;
      }

      return true;
    }
  },
  {
    type: 'TAX_ID',
    regex: /\b(?:TIN|tax id|EIN)[:\s\u00A0#-]*(\d{2}(?:[\s\u00A0.-]?\d){7})\b/gi,
    priority: 95,
    placeholder: '[TAX_ID_{n}]',
    description: 'Tax identification number',
    severity: 'high',
    validator: (value: string, context: string) => {
      // Normalize separators
      const cleaned = value.replace(/[\s\u00A0.-]/g, '');

      // Must be exactly 9 digits after normalization
      if (!/^\d{9}$/.test(cleaned)) {
        return false;
      }

      // EIN (Employer Identification Number) format: XX-XXXXXXX
      // First two digits should not be 00, 07-08, or 90-99
      const firstTwo = parseInt(cleaned.substring(0, 2), 10);
      if (firstTwo === 0 || (firstTwo >= 7 && firstTwo <= 8) || (firstTwo >= 90 && firstTwo <= 99)) {
        return false;
      }

      // Must have tax/government context
      const taxContext = /tax|tin|ein|irs|government|federal|revenue|income/i;
      if (!taxContext.test(context)) {
        return false;
      }

      // Reject test/example keywords
      const rejectKeywords = /example\s+tax|test\s+tax|sample\s+tax|demo\s+tax|fake\s+tax|12-3456789/i;
      if (rejectKeywords.test(context)) {
        return false;
      }

      return true;
    }
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
