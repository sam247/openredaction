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
    validator: validateEmail,
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
    validator: validateName,
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
    severity: 'high'
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
