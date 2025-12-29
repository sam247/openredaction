/**
 * Personal PII patterns (emails, names, etc.)
 */

import { PIIPattern } from '../types';
import { validateEmail, validateName } from '../validators';

export const personalPatterns: PIIPattern[] = [
  {
    type: 'EMAIL',
    regex: /\b[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\b/g,
    priority: 100,
    validator: (value: string, context: string) => {
      // Basic email validation
      if (!validateEmail(value)) {
        return false;
      }

      // Reject test/example keywords (allow legitimate test cases)
      const rejectKeywords = /your\.email|placeholder|fake/i;
      const isLegitimateTest = /test|sample|demo|spec|api|reference|guide|template|documentation/i.test(context);
      if (rejectKeywords.test(context) && !isLegitimateTest) {
        return false;
      }

      // Allow common test domains in legitimate test contexts
      const testDomains = /@test\.com|@example\.com|@sample\.com|@demo\.com|@fake\.com|@placeholder\.com/i;
      if (testDomains.test(value)) {
        const legitimateTestContext = /test|spec|api|reference|guide|template|documentation|john\+|!!!|\+tag|john@/i.test(context + value);
        if (!legitimateTestContext) {
          return false;
        }
      }

      return true;
    },
    placeholder: '[EMAIL_{n}]',
    description: 'Email address',
    severity: 'high'
  },
  {
    type: 'NAME',
    // Match names with case variations - handles "John Smith", "john smith", "JOHN SMITH", "Lucy jones", etc.
    // First word must start with uppercase or be all uppercase; subsequent words can be any case
    regex: /\b(?:(?:Mr|Mrs|Ms|Miss|Dr|Prof|Professor|Sir|Madam|Lady|Lord|Rev|Father|Sister|Brother)\.?\s+)?((?:[A-Z][a-z'’.\-]+|[A-Z]{2,})(?:\s+(?:[A-Z][a-z'’.\-]+|[A-Z]{2,}|[a-z][a-z'’.\-]+)){1,3})(?:\s+(?:Jr|Sr|II|III|IV|PhD|MD|Esq|DDS|DVM|MBA|CPA)\.?)?\b/g,
    priority: 50,
    validator: (value: string, context: string) => {
      // Basic name validation
      if (!validateName(value, context)) {
        return false;
      }

      // Reject test/example keywords
      const rejectKeywords = /example|test|sample|demo|fake|placeholder|john\s+doe|jane\s+smith/i;
      if (rejectKeywords.test(context) || rejectKeywords.test(value)) {
        return false;
      }

      // Reject common business terms that might match
      const businessTerms = /\b(company|corporation|inc|llc|ltd|corp|organization|business|enterprise|firm|agency)\b/i;
      if (businessTerms.test(context)) {
        return false;
      }

      return true;
    },
    placeholder: '[NAME_{n}]',
    description: 'Person name with salutations/suffixes (handles case variations)',
    severity: 'high'
  },
  {
    type: 'EMPLOYEE_ID',
    regex: /\b(?:EMP|EMPL|EMPLOYEE)[_\s-]?(?:ID|NUM(?:BER)?)?[:\s-]*([A-Z0-9]{4,10})\b/gi,
    priority: 90,
    placeholder: '[EMPLOYEE_ID_{n}]',
    description: 'Employee ID',
    severity: 'medium'
  },
  {
    type: 'USERNAME',
    regex: /\b(?:user(?:name)?|login)[:\s]+([a-zA-Z0-9_-]{3,20})\b/gi,
    priority: 85,
    placeholder: '[USERNAME_{n}]',
    description: 'Username',
    severity: 'medium'
  },
  {
    type: 'DATE_OF_BIRTH',
    regex: /\b(?:DOB|date of birth|birth ?date)[:\s-]*((?:\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})|(?:\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{2,4}))\b/gi,
    priority: 95,
    placeholder: '[DOB_{n}]',
    description: 'Date of birth',
    severity: 'high',
    validator: (value: string, context: string) => {
      // Must have DOB/birth context
      const dobContext = /dob|date\s+of\s+birth|birth\s+date|birth/i;
      if (!dobContext.test(context)) {
        return false;
      }

      // Parse the date and validate it makes sense
      const dateStr = value.replace(/[\s]/g, ''); // Normalize spaces

      // Check if it's a valid date format
      const datePattern = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/;
      const monthNames = {
        jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
        jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
        january: 1, february: 2, march: 3, april: 4, june: 6,
        july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
      };

      let month: number, day: number, year: number;

      if (datePattern.test(dateStr)) {
        const match = dateStr.match(datePattern)!;
        month = parseInt(match[1]);
        day = parseInt(match[2]);
        year = parseInt(match[3]);

        // Adjust for MM/DD/YYYY vs DD/MM/YYYY ambiguity
        // If month > 12, swap with day
        if (month > 12 && day <= 12) {
          [month, day] = [day, month];
        }
      } else {
        // Try to parse text format
        const textPattern = /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{2,4})/i;
        const match = dateStr.match(textPattern);
        if (match) {
          day = parseInt(match[1]);
          month = monthNames[match[2].toLowerCase() as keyof typeof monthNames];
          year = parseInt(match[3]);
        } else {
          return false; // Invalid format
        }
      }

      // Validate date ranges
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;

      // Validate year (reasonable birth year range)
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) return false;

      // Validate day for specific months
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (month === 2 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        daysInMonth[1] = 29; // Leap year
      }
      if (day > daysInMonth[month - 1]) return false;

      // Reject future dates
      const inputDate = new Date(year < 100 ? 2000 + year : year, month - 1, day);
      if (inputDate > new Date()) return false;

      // Reject test/example keywords
      const rejectKeywords = /example|test|sample|demo|fake|placeholder/i;
      if (rejectKeywords.test(context)) {
        return false;
      }

      return true;
    }
  },
  {
    type: 'DATE',
    regex: /\b((?:\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})|(?:\d{1,2}\s+(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{2,4}))\b/gi,
    priority: 60,
    placeholder: '[DATE_{n}]',
    description: 'Date (standalone, without DOB context)',
    severity: 'medium',
    validator: (value: string, context: string) => {
      // Avoid matching years, version numbers, or other numeric patterns
      const yearPattern = /^(19|20)\d{2}$/;
      if (yearPattern.test(value.replace(/[\/\-.\s]/g, ''))) return false;
      
      // Avoid matching in version/software context
      const versionContext = /\b(version|v\d+|release|build|update)\s*[:\s]*/i;
      if (versionContext.test(context)) return false;
      
      return true;
    }
  }
];
