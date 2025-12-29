/**
 * Pattern hardening utilities
 * Provides helper functions for improving pattern detection robustness
 */

/**
 * Normalize separators in a value by removing common separator characters
 * Handles spaces, dots, dashes, non-breaking spaces, and other common separators
 * 
 * @param value - The value to normalize
 * @param preserveFormat - If true, preserves the original format for display purposes
 * @returns Normalized value with separators removed
 * 
 * @example
 * normalizeSeparators("123-456-7890") // "1234567890"
 * normalizeSeparators("123 456 7890") // "1234567890"
 * normalizeSeparators("123.456.7890") // "1234567890"
 */
export function normalizeSeparators(value: string, preserveFormat: boolean = false): string {
  if (preserveFormat) {
    // For display purposes, normalize but keep structure
    return value.replace(/[\s\u00A0]/g, ' ').replace(/[.\-]/g, '-');
  }
  
  // Remove all common separators: spaces, non-breaking spaces, dots, dashes, slashes
  return value.replace(/[\s\u00A0.\-\/]/g, '');
}

/**
 * Generic checksum validation helper
 * Supports various checksum algorithms commonly used in ID validation
 * 
 * @param value - The value to validate
 * @param algorithm - The checksum algorithm to use ('luhn', 'mod97', 'mod11', 'mod10', 'custom')
 * @param options - Algorithm-specific options
 * @returns True if checksum is valid
 * 
 * @example
 * validateChecksum("4532015112830366", "luhn") // true (valid credit card)
 * validateChecksum("GB82WEST12345698765432", "mod97") // true (valid IBAN)
 */
export function validateChecksum(
  value: string,
  algorithm: 'luhn' | 'mod97' | 'mod11' | 'mod10' | 'custom',
  options?: {
    weights?: number[];
    modulus?: number;
    customFn?: (value: string) => boolean;
  }
): boolean {
  const cleaned = normalizeSeparators(value);
  
  switch (algorithm) {
    case 'luhn':
      return validateLuhnChecksum(cleaned);
    
    case 'mod97':
      return validateMod97Checksum(cleaned);
    
    case 'mod11':
      return validateMod11Checksum(cleaned, options?.weights);
    
    case 'mod10':
      return validateMod10Checksum(cleaned, options?.weights);
    
    case 'custom':
      if (options?.customFn) {
        return options.customFn(cleaned);
      }
      return false;
    
    default:
      return false;
  }
}

/**
 * Luhn algorithm checksum validation
 * Used for credit cards, IMEI numbers, etc.
 */
function validateLuhnChecksum(value: string): boolean {
  if (!/^\d+$/.test(value) || value.length < 2) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = value.length - 1; i >= 0; i--) {
    let digit = parseInt(value[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

/**
 * MOD-97 checksum validation
 * Used for IBAN numbers
 */
function validateMod97Checksum(value: string): boolean {
  // IBAN format: 2 letters (country), 2 digits (check), rest (BBAN)
  // For MOD-97: move first 4 characters to end, then validate
  if (value.length < 4) {
    return false;
  }
  
  // Move first 4 characters to end
  const rearranged = value.substring(4) + value.substring(0, 4);
  
  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged.replace(/[A-Z]/gi, (char) =>
    (char.toUpperCase().charCodeAt(0) - 55).toString()
  );
  
  let remainder = 0;
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i], 10)) % 97;
  }
  
  return remainder === 1;
}

/**
 * MOD-11 checksum validation
 * Used for various ID numbers (UK NHS, etc.)
 */
function validateMod11Checksum(value: string, weights?: number[]): boolean {
  if (!/^\d+$/.test(value) || value.length < 2) {
    return false;
  }
  
  const digits = value.split('').map(Number);
  const checkDigit = digits.pop()!;
  
  // Default weights: descending from length (e.g., for 9 digits: 9,8,7,6,5,4,3,2,1)
  const defaultWeights = Array.from({ length: digits.length }, (_, i) => digits.length - i);
  const w = weights || defaultWeights;
  
  if (w.length !== digits.length) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    sum += digits[i] * w[i];
  }
  
  const remainder = sum % 11;
  const calculatedCheckDigit = remainder === 0 ? 0 : 11 - remainder;
  
  // MOD-11 can produce check digit of 10, which is usually represented as 'X' or invalid
  // For this implementation, we reject check digit of 10
  return calculatedCheckDigit === checkDigit && calculatedCheckDigit !== 10;
}

/**
 * MOD-10 checksum validation
 * Used for various ID numbers
 */
function validateMod10Checksum(value: string, weights?: number[]): boolean {
  if (!/^\d+$/.test(value) || value.length < 2) {
    return false;
  }
  
  const digits = value.split('').map(Number);
  const checkDigit = digits.pop()!;
  const defaultWeights = Array.from({ length: digits.length }, (_, i) => (i % 2 === 0 ? 2 : 1));
  const w = weights || defaultWeights;
  
  if (w.length !== digits.length) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let product = digits[i] * w[i];
    if (product > 9) {
      product -= 9;
    }
    sum += product;
  }
  
  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return calculatedCheckDigit === checkDigit;
}

/**
 * Enhance an existing validator with additional context validation
 * Wraps a validator function to add context checks, separator normalization, etc.
 * 
 * @param baseValidator - The original validator function
 * @param enhancements - Enhancement options
 * @returns Enhanced validator function
 * 
 * @example
 * const enhanced = enhanceValidator(originalValidator, {
 *   normalizeSeparators: true,
 *   contextKeywords: ['account', 'customer'],
 *   rejectKeywords: ['example', 'test']
 * });
 */
export function enhanceValidator<T extends (value: string, context?: string) => boolean>(
  baseValidator: T,
  enhancements?: {
    normalizeSeparators?: boolean;
    contextKeywords?: string[];
    rejectKeywords?: string[];
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  }
): T {
  return ((value: string, context: string = '') => {
    // Normalize separators if requested
    let normalizedValue = value;
    if (enhancements?.normalizeSeparators) {
      normalizedValue = normalizeSeparators(value);
    }
    
    // Length checks
    if (enhancements?.minLength && normalizedValue.length < enhancements.minLength) {
      return false;
    }
    if (enhancements?.maxLength && normalizedValue.length > enhancements.maxLength) {
      return false;
    }
    
    // Pattern validation
    if (enhancements?.pattern && !enhancements.pattern.test(normalizedValue)) {
      return false;
    }
    
    // Context keyword checks
    const contextLower = context.toLowerCase();
    if (enhancements?.rejectKeywords) {
      for (const keyword of enhancements.rejectKeywords) {
        if (contextLower.includes(keyword.toLowerCase())) {
          return false;
        }
      }
    }
    
    if (enhancements?.contextKeywords && enhancements.contextKeywords.length > 0) {
      const hasContext = enhancements.contextKeywords.some(keyword =>
        contextLower.includes(keyword.toLowerCase())
      );
      if (!hasContext) {
        return false;
      }
    }
    
    // Call base validator with normalized value
    return baseValidator(normalizedValue, context);
  }) as T;
}

/**
 * Create a validator that handles separator variations
 * Automatically normalizes separators before validation
 * 
 * @param validator - The base validator function
 * @returns Validator that handles separator variations
 */
export function withSeparatorTolerance<T extends (value: string, context?: string) => boolean>(
  validator: T
): T {
  return enhanceValidator(validator, {
    normalizeSeparators: true
  }) as T;
}

/**
 * Check if a value matches common false positive patterns
 * Helps reduce false positives for numeric patterns
 * 
 * @param value - The value to check
 * @param context - Surrounding context
 * @returns True if value appears to be a false positive
 */
export function isFalsePositive(value: string, context: string = ''): boolean {
  const normalized = normalizeSeparators(value);
  const contextLower = context.toLowerCase();
  
  // Version numbers (v1.0, version 2.3.4, etc.)
  if (/\b(version|v\d+|release|build)\s*[:\s]*/i.test(context)) {
    return true;
  }
  
  // Dates (DD-MM-YYYY, MM-DD-YYYY) - only if context suggests it's a date
  // Check format AND context keywords
  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(value)) {
    const dateKeywords = ['date', 'dob', 'birth', 'expir', 'valid', 'expires'];
    if (dateKeywords.some(keyword => contextLower.includes(keyword))) {
      return true;
    }
    // If format matches date but context suggests something else (phone, account, etc.), don't flag
    const nonDateKeywords = ['phone', 'tel', 'account', 'id', 'number', 'code'];
    if (nonDateKeywords.some(keyword => contextLower.includes(keyword))) {
      return false;
    }
  }
  
  // All zeros or repeating digits
  if (/^0+$/.test(normalized) || /^(\d)\1+$/.test(normalized)) {
    return true;
  }
  
  // Sequential numbers (123456, 987654)
  if (/^(?:012345|123456|234567|345678|456789|567890|987654|876543|765432|654321|543210)$/.test(normalized)) {
    return true;
  }
  
  // Test/example keywords in context
  const testKeywords = ['test', 'example', 'sample', 'demo', 'fake', 'dummy', 'placeholder'];
  if (testKeywords.some(keyword => contextLower.includes(keyword))) {
    return true;
  }
  
  return false;
}

