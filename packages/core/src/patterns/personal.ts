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
    // Keep pattern conservative; we handle casing variants during replacement, not here.
    regex: /\b(?:(?:Mr|Mrs|Ms|Miss|Dr|Prof|Professor|Sir|Madam|Lady|Lord|Rev|Father|Sister|Brother)\.?\s+)?([A-Z][a-z]+(?:-[A-Z][a-z]+)? (?:[A-Z][a-z]+(?:-[A-Z][a-z]+)? )?[A-Z][a-z]+(?:-[A-Z][a-z]+)?)(?:\s+(?:Jr|Sr|II|III|IV|PhD|MD|Esq|DDS|DVM|MBA|CPA)\.?)?\b/g,
    priority: 50,
    validator: validateName,
    placeholder: '[NAME_{n}]',
    description: 'Person name with salutations/suffixes',
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
    regex: /\b(?:DOB|date of birth|birth ?date)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})\b/gi,
    priority: 95,
    placeholder: '[DOB_{n}]',
    description: 'Date of birth',
    severity: 'high'
  }
];
