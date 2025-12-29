/**
 * Contact information patterns (phones, addresses, etc.)
 */

import { PIIPattern } from '../types';

export const contactPatterns: PIIPattern[] = [
  {
    type: 'PHONE_UK_MOBILE',
    regex: /\b(?:\+?44[\s\u00A0.-]?7\d{3}|0?7\d{3})[\s\u00A0.-]?\d{3}[\s\u00A0.-]?\d{3}\b/g,
    priority: 90,
    placeholder: '[PHONE_UK_MOBILE_{n}]',
    description: 'UK mobile phone',
    severity: 'medium',
    validator: (value: string, context: string) => {
      // Normalize separators
      const cleaned = value.replace(/[\s\u00A0().-]/g, '');
      
      // UK mobile: must start with 7 (or +447 or 07)
      const mobilePattern = /^(?:\+?44)?7\d{9}$/;
      if (!mobilePattern.test(cleaned)) {
        return false;
      }
      
      // Avoid matching version numbers or dates
      const versionContext = /\b(version|v\d+|release|build)\s*[:\s]*/i;
      if (versionContext.test(context)) return false;
      
      // Avoid matching dates (only if context suggests it's a date)
      const datePattern = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
      if (datePattern.test(value)) {
        const dateKeywords = /date|dob|birth|expir/i;
        if (dateKeywords.test(context)) return false;
      }
      
      // Reject only if context strongly suggests it's not a phone
      const strongRejectKeywords = /example\s+phone|test\s+number|sample\s+phone|demo\s+phone/i;
      if (strongRejectKeywords.test(context)) return false;
      
      return true;
    }
  },
  {
    type: 'PHONE_UK',
    regex: /\b(?:\+?44[\s\u00A0.-]?(?:0)?\s*)?(?:\(?0?[1-9]\d{1,3}\)?[\s\u00A0.-]?\d{3,4}[\s\u00A0.-]?\d{3,4})(?:\s?(?:ext\.?|x)\s?\d{1,5})?\b/g,
    priority: 85,
    placeholder: '[PHONE_UK_{n}]',
    description: 'UK phone number',
    severity: 'medium',
    validator: (value: string, context: string) => {
      // Normalize separators
      const cleaned = value.replace(/[\s\u00A0().-]/g, '').replace(/ext|x/i, '');
      
      // UK landline: must start with 0 or +44, then area code (1-4 digits starting with 1-9), then 6-7 digits
      const ukPattern = /^(?:\+?44)?0?[1-9]\d{1,3}\d{6,7}$/;
      if (!ukPattern.test(cleaned)) {
        return false;
      }
      
      // Avoid matching version numbers or dates
      const versionContext = /\b(version|v\d+|release|build)\s*[:\s]*/i;
      if (versionContext.test(context)) return false;
      
      // Avoid matching dates (only if context suggests it's a date)
      const datePattern = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
      if (datePattern.test(value)) {
        const dateKeywords = /date|dob|birth|expir/i;
        if (dateKeywords.test(context)) return false;
      }
      
      // Reject only if context strongly suggests it's not a phone
      const strongRejectKeywords = /example\s+phone|test\s+number|sample\s+phone|demo\s+phone/i;
      if (strongRejectKeywords.test(context)) return false;
      
      return true;
    }
  },
  {
    type: 'PHONE_US',
    regex: /\b(?:\+1[\s\u00A0.-]?)?(?:\(\d{3}\)|\d{3})[\s\u00A0.-]?\d{3}[\s\u00A0.-]?\d{4}(?:\s?(?:ext\.?|x)\s?\d{1,6})?\b/g,
    priority: 85,
    placeholder: '[PHONE_US_{n}]',
    description: 'US phone number',
    severity: 'medium',
    validator: (value: string, context: string) => {
      // Normalize separators
      const cleaned = value.replace(/[\s\u00A0().-]/g, '').replace(/ext|x/i, '');
      
      // US phone: must be 10 digits (with optional +1 prefix)
      const usPattern = /^(?:\+?1)?\d{10}$/;
      if (!usPattern.test(cleaned)) {
        return false;
      }
      
      // Avoid matching version numbers or dates
      const versionContext = /\b(version|v\d+|release|build)\s*[:\s]*/i;
      if (versionContext.test(context)) return false;
      
      // Avoid matching dates (only if context suggests it's a date)
      const datePattern = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
      if (datePattern.test(value)) {
        const dateKeywords = /date|dob|birth|expir/i;
        if (dateKeywords.test(context)) return false;
      }
      
      // Reject only if context strongly suggests it's not a phone
      const strongRejectKeywords = /example\s+phone|test\s+number|sample\s+phone|demo\s+phone/i;
      if (strongRejectKeywords.test(context)) return false;
      
      // Validate area code (first 3 digits cannot be 000, 111)
      const areaCode = cleaned.replace(/^\+?1?/, '').substring(0, 3);
      if (areaCode === '000' || areaCode === '111') {
        return false;
      }
      // 555 is reserved for fictional use, but allow it unless context explicitly says it's an example
      if (areaCode === '555') {
        const contextLower = context.toLowerCase();
        if (/example\s+phone|test\s+number|fictional\s+number|demo\s+phone/i.test(contextLower)) {
          return false;
        }
      }
      
      return true;
    }
  },
  {
    type: 'PHONE_INTERNATIONAL',
    regex: /\b\+(?:\d[\s\u00A0.\-()]?){6,14}\d(?:\s?(?:ext\.?|x)\s?\d{1,6})?\b/g,
    priority: 80,
    placeholder: '[PHONE_{n}]',
    description: 'International phone number',
    severity: 'medium',
    validator: (value: string, context: string) => {
      // Normalize separators
      const cleaned = value.replace(/[\s\u00A0().-]/g, '').replace(/ext|x/i, '');
      
      // International: must start with + and have 7-15 digits total
      if (!cleaned.startsWith('+')) return false;
      
      const digitsOnly = cleaned.substring(1); // Remove +
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return false;
      }
      
      // Must be all digits after +
      if (!/^\d+$/.test(digitsOnly)) return false;
      
      // Avoid matching version numbers or dates
      const versionContext = /\b(version|v\d+|release|build)\s*[:\s]*/i;
      if (versionContext.test(context)) return false;
      
      // Avoid matching dates (only if context suggests it's a date)
      const datePattern = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
      if (datePattern.test(value)) {
        const dateKeywords = /date|dob|birth|expir/i;
        if (dateKeywords.test(context)) return false;
      }
      
      // Reject only if context strongly suggests it's not a phone
      const strongRejectKeywords = /example\s+phone|test\s+number|sample\s+phone|demo\s+phone/i;
      if (strongRejectKeywords.test(context)) return false;
      
      // Exclude if it looks like a US/UK number that should be handled by specific patterns
      // US: +1 followed by 10 digits
      if (/^\+1\d{10}$/.test(cleaned)) {
        // Let PHONE_US handle it
        return false;
      }
      // UK: +44 followed by 10-11 digits
      if (/^\+44\d{10,11}$/.test(cleaned)) {
        // Let PHONE_UK or PHONE_UK_MOBILE handle it
        return false;
      }
      
      return true;
    }
  },
  {
    type: 'POSTCODE_UK',
    regex: /\b([A-Z]{1,2}\d{1,2}[A-Z]?[\s\u00A0.-]?\d[A-Z]{2})\b/g,
    priority: 75,
    placeholder: '[POSTCODE_{n}]',
    description: 'UK postcode',
    severity: 'low',
    validator: (value: string, context: string) => {
      // Normalize separators for validation
      const cleaned = value.replace(/[\s\u00A0.-]/g, '');
      
      // UK postcode format: 1-2 letters, 1-2 digits, optional letter, space/dash, digit, 2 letters
      // After normalization: 5-7 characters total
      if (cleaned.length < 5 || cleaned.length > 7) {
        return false;
      }
      
      // Must match pattern: letters + digits + optional letter + digit + letters
      if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/i.test(cleaned)) {
        return false;
      }
      
      return true;
    }
  },
  {
    type: 'ZIP_CODE_US',
    regex: /\b(\d{5}(?:[\s\u00A0.-]\d{4})?)\b/g,
    priority: 70,
    placeholder: '[ZIP_{n}]',
    description: 'US ZIP code',
    severity: 'low',
    validator: (value: string, context: string) => {
      // Normalize separators
      const cleaned = value.replace(/[\s\u00A0.-]/g, '');
      
      // Must be 5 digits (ZIP) or 9 digits (ZIP+4)
      if (!/^\d{5}$/.test(cleaned) && !/^\d{9}$/.test(cleaned)) {
        return false;
      }
      
      // Avoid matching phone numbers or other numeric patterns
      const contextLower = context.toLowerCase();
      if (/\b(phone|tel|call|contact)\b/i.test(contextLower) && cleaned.length === 9) {
        // 9 digits could be phone number without area code
        return false;
      }
      
      return true;
    }
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
