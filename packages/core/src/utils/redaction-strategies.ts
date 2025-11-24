/**
 * Redaction strategies for different modes
 */

import type { RedactionMode, PIIDetection } from '../types';

/**
 * Apply redaction based on mode
 */
export function applyRedactionMode(
  value: string,
  type: string,
  mode: RedactionMode,
  placeholder: string
): string {
  switch (mode) {
    case 'placeholder':
      return placeholder;

    case 'mask-middle':
      return maskMiddle(value, type);

    case 'mask-all':
      return '*'.repeat(value.length);

    case 'format-preserving':
      return formatPreserving(value, type);

    case 'token-replace':
      return tokenReplace(value, type);

    default:
      return placeholder;
  }
}

/**
 * Mask middle characters while preserving edges
 * Examples:
 * - Email: j***@example.com
 * - Phone: 555-**-1234
 * - SSN: ***-**-1234
 * - Credit Card: 4532-****-****-1234
 */
function maskMiddle(value: string, type: string): string {
  // Email: preserve first char of username and full domain
  if (type.includes('EMAIL')) {
    const atIndex = value.indexOf('@');
    if (atIndex > 0) {
      const username = value.substring(0, atIndex);
      const domain = value.substring(atIndex);
      const maskedUsername = username.length <= 2
        ? '*'.repeat(username.length)
        : username[0] + '*'.repeat(username.length - 1);
      return maskedUsername + domain;
    }
  }

  // Phone: preserve area code and last 4 digits
  if (type.includes('PHONE')) {
    // Extract digits
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 10) {
      // US/UK format: show first 3 and last 4
      const areaCode = digits.substring(0, 3);
      const lastFour = digits.substring(digits.length - 4);
      const middleCount = digits.length - 7;
      return `${areaCode}-${'*'.repeat(middleCount > 0 ? middleCount : 2)}-${lastFour}`;
    }
  }

  // SSN: mask first 5 digits, show last 4
  if (type === 'SSN') {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 9) {
      const lastFour = digits.substring(5);
      return `***-**-${lastFour}`;
    }
  }

  // Credit Card: show first 4 and last 4
  if (type === 'CREDIT_CARD') {
    const digits = value.replace(/\D/g, '');
    if (digits.length >= 13) {
      const first = digits.substring(0, 4);
      const last = digits.substring(digits.length - 4);
      const middleGroups = Math.floor((digits.length - 8) / 4);
      const middle = ('****-'.repeat(middleGroups) + '****').substring(0, (digits.length - 8));
      return `${first}-${middle}-${last}`;
    }
  }

  // Default: show first 2 and last 2 chars
  if (value.length <= 4) {
    return '*'.repeat(value.length);
  }
  const showCount = Math.min(2, Math.floor(value.length * 0.2));
  const first = value.substring(0, showCount);
  const last = value.substring(value.length - showCount);
  const maskCount = value.length - (showCount * 2);
  return `${first}${'*'.repeat(maskCount)}${last}`;
}

/**
 * Format-preserving redaction - maintains structure
 * Examples:
 * - SSN: XXX-XX-XXXX
 * - Phone: (XXX) XXX-XXXX
 * - Email: XXXXX@XXXXXX.XXX
 * - Date: XX/XX/XXXX
 */
function formatPreserving(value: string, type: string): string {
  let result = '';

  for (let i = 0; i < value.length; i++) {
    const char = value[i];

    // Preserve special characters and whitespace
    if (!/[a-zA-Z0-9]/.test(char)) {
      result += char;
    }
    // Replace letters with X
    else if (/[a-zA-Z]/.test(char)) {
      result += char === char.toUpperCase() ? 'X' : 'x';
    }
    // Replace digits with X
    else {
      result += 'X';
    }
  }

  return result;
}

/**
 * Token replacement - replace with realistic fake data
 * Uses deterministic generation based on hash
 */
function tokenReplace(value: string, type: string): string {
  // Simple hash for deterministic generation
  const hash = simpleHash(value);

  if (type.includes('EMAIL')) {
    const domains = ['example.com', 'test.com', 'sample.org', 'demo.net'];
    const usernames = ['user', 'john.doe', 'jane.smith', 'test.account'];
    return `${usernames[hash % usernames.length]}${hash % 100}@${domains[hash % domains.length]}`;
  }

  if (type.includes('PHONE')) {
    // Generate fake phone number
    const areaCode = 555;
    const exchange = (hash % 900) + 100;
    const line = (hash % 9000) + 1000;
    return `(${areaCode}) ${exchange}-${line}`;
  }

  if (type === 'SSN') {
    // Generate fake SSN (invalid range)
    const area = ((hash % 899) + 100);
    const group = ((hash % 99) + 1).toString().padStart(2, '0');
    const serial = ((hash % 9999) + 1).toString().padStart(4, '0');
    return `${area}-${group}-${serial}`;
  }

  if (type === 'CREDIT_CARD') {
    // Generate fake credit card (invalid Luhn)
    const first = '4532'; // Visa-like
    const segments = [
      ((hash % 9000) + 1000).toString(),
      ((hash % 9000) + 1000).toString(),
      ((hash % 9000) + 1000).toString()
    ];
    return `${first}-${segments.join('-')}`;
  }

  if (type.includes('NAME')) {
    const firstNames = ['John', 'Jane', 'Alex', 'Sam', 'Chris', 'Pat'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis'];
    return `${firstNames[hash % firstNames.length]} ${lastNames[(hash >> 4) % lastNames.length]}`;
  }

  // Default: generic replacement
  return `[REDACTED_${type}]`;
}

/**
 * Simple hash function for deterministic token generation
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
