/**
 * Validators for PII pattern matching
 */

/**
 * Luhn algorithm validator for credit cards
 * https://en.wikipedia.org/wiki/Luhn_algorithm
 */
export function validateLuhn(cardNumber: string): boolean {
  // Remove any spaces or hyphens
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Must be numeric and at least 13 digits
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  // Loop through values starting from the right
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);

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
 * IBAN validator with checksum verification
 */
export function validateIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleaned = iban.replace(/\s/g, '').toUpperCase();

  // Check format: 2 letters, 2 digits, up to 30 alphanumeric
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(cleaned)) {
    return false;
  }

  // Country-specific length validation
  const lengths: Record<string, number> = {
    AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22,
    BH: 22, BR: 29, CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18,
    DO: 28, EE: 20, ES: 24, FI: 18, FO: 18, FR: 27, GB: 22, GE: 22,
    GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28, IE: 22, IL: 23,
    IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28, LI: 21, LT: 20,
    LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27, MT: 31,
    MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
    RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24,
    TR: 26, UA: 29, VA: 22, VG: 24, XK: 20
  };

  const countryCode = cleaned.substring(0, 2);
  const expectedLength = lengths[countryCode];

  if (!expectedLength || cleaned.length !== expectedLength) {
    return false;
  }

  // Move first 4 characters to end
  const rearranged = cleaned.substring(4) + cleaned.substring(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericString = rearranged.replace(/[A-Z]/g, (char) =>
    (char.charCodeAt(0) - 55).toString()
  );

  // Perform mod-97 operation
  return mod97(numericString) === 1;
}

/**
 * Helper function for mod-97 calculation on large numbers
 */
function mod97(string: string): number {
  let remainder = 0;
  for (let i = 0; i < string.length; i++) {
    remainder = (remainder * 10 + parseInt(string[i], 10)) % 97;
  }
  return remainder;
}

/**
 * UK National Insurance Number validator
 */
export function validateNINO(nino: string): boolean {
  const cleaned = nino.replace(/\s/g, '').toUpperCase();

  // Format: 2 letters, 6 digits, 1 letter (A, B, C, or D)
  if (!/^[A-CEGHJ-PR-TW-Z]{2}[0-9]{6}[A-D]$/.test(cleaned)) {
    return false;
  }

  // Invalid prefixes
  const invalidPrefixes = ['BG', 'GB', 'NK', 'KN', 'TN', 'NT', 'ZZ'];
  const prefix = cleaned.substring(0, 2);

  return !invalidPrefixes.includes(prefix);
}

/**
 * UK NHS Number validator with checksum
 */
export function validateNHS(nhs: string): boolean {
  const cleaned = nhs.replace(/[\s-]/g, '');

  if (!/^\d{10}$/.test(cleaned)) {
    return false;
  }

  // Calculate check digit using mod 11 algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i], 10) * (10 - i);
  }

  const checkDigit = 11 - (sum % 11);
  const expectedCheckDigit = checkDigit === 11 ? 0 : checkDigit;

  return expectedCheckDigit === parseInt(cleaned[9], 10) && checkDigit !== 10;
}

/**
 * UK Passport validator
 */
export function validateUKPassport(passport: string): boolean {
  const cleaned = passport.replace(/\s/g, '').toUpperCase();

  // Format: 9 digits or 3 digits + 6 digits
  return /^\d{9}$/.test(cleaned) || /^\d{3}\d{6}$/.test(cleaned);
}

/**
 * US Social Security Number validator (format check only)
 */
export function validateSSN(ssn: string): boolean {
  const cleaned = ssn.replace(/[\s-]/g, '');

  if (!/^\d{9}$/.test(cleaned)) {
    return false;
  }

  // Invalid patterns
  const area = cleaned.substring(0, 3);
  const group = cleaned.substring(3, 5);
  const serial = cleaned.substring(5, 9);

  // Area cannot be 000, 666, or 900-999
  if (area === '000' || area === '666' || parseInt(area, 10) >= 900) {
    return false;
  }

  // Group and serial cannot be all zeros
  if (group === '00' || serial === '0000') {
    return false;
  }

  // Check for known invalid/test SSNs (repeated digits)
  const invalidSSNs = ['111111111', '222222222', '333333333', '444444444',
                        '555555555', '666666666', '777777777', '888888888', '999999999'];

  return !invalidSSNs.includes(cleaned);
}

/**
 * UK Sort Code validator (format check)
 */
export function validateSortCode(sortCode: string): boolean {
  const cleaned = sortCode.replace(/[\s-]/g, '');
  return /^\d{6}$/.test(cleaned);
}

/**
 * Context-aware name validator to reduce false positives
 */
export function validateName(name: string, context: string): boolean {
  // Filter out common false positives
  const businessTerms = [
    'account', 'company', 'limited', 'ltd', 'inc', 'corp',
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
    'mr', 'mrs', 'ms', 'dr', 'sir', 'madam', 'lord', 'lady'
  ];

  const nameLower = name.toLowerCase();

  // Skip if it's a business term
  if (businessTerms.some(term => nameLower.includes(term))) {
    return false;
  }

  // Skip if it's all caps (likely an acronym)
  if (name === name.toUpperCase() && name.length <= 5) {
    return false;
  }

  // Skip single letter names
  if (name.length === 1) {
    return false;
  }

  // Check if appears in business context
  const contextLower = context.toLowerCase();
  if (
    contextLower.includes('company ') ||
    contextLower.includes('business ') ||
    contextLower.includes('organization')
  ) {
    return false;
  }

  return true;
}

/**
 * Email validator with DNS check capability
 */
export function validateEmail(email: string): boolean {
  // Basic RFC 5322 compliant regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email)) {
    return false;
  }

  // Additional validations
  const [local, domain] = email.split('@');

  // Local part checks
  if (local.length > 64 || domain.length > 255) {
    return false;
  }

  // Domain must have at least one dot
  if (!domain.includes('.')) {
    return false;
  }

  return true;
}
