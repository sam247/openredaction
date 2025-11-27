/**
 * Compliance preset configurations
 */

import { OpenRedactionOptions } from '../types';

/**
 * GDPR compliance preset - European Union data protection
 */
export const gdprPreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  patterns: [
    'EMAIL',
    'NAME',
    'PHONE_UK',
    'PHONE_UK_MOBILE',
    'PHONE_INTERNATIONAL',
    'IPV4',
    'IPV6',
    'POSTCODE_UK',
    'ADDRESS_STREET',
    'NATIONAL_INSURANCE_UK',
    'NHS_NUMBER',
    'PASSPORT_UK',
    'DRIVING_LICENSE_UK',
    'IBAN',
    'CREDIT_CARD'
  ]
};

/**
 * HIPAA compliance preset - US healthcare data protection
 */
export const hipaaPreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  patterns: [
    'EMAIL',
    'NAME',
    'SSN',
    'PHONE_US',
    'ZIP_CODE_US',
    'ADDRESS_STREET',
    'DATE_OF_BIRTH',
    'PASSPORT_US',
    'DRIVING_LICENSE_US',
    'CREDIT_CARD',
    'BANK_ACCOUNT_UK',
    'IPV4',
    'IPV6',
    'EMPLOYEE_ID'
  ]
};

/**
 * CCPA compliance preset - California consumer privacy
 */
export const ccpaPreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  patterns: [
    'EMAIL',
    'NAME',
    'SSN',
    'PHONE_US',
    'ZIP_CODE_US',
    'ADDRESS_STREET',
    'IPV4',
    'IPV6',
    'CREDIT_CARD',
    'PASSPORT_US',
    'DRIVING_LICENSE_US',
    'USERNAME'
  ]
};

/**
 * Personal information preset
 * Core personal data: names, emails, phones, addresses
 */
export const personalPreset: Partial<OpenRedactionOptions> = {
  patterns: [
    'EMAIL',
    'NAME',
    'PHONE_INTERNATIONAL',
    'PHONE_UK',
    'PHONE_UK_MOBILE',
    'PHONE_US',
    'ADDRESS_STREET',
    'DATE_OF_BIRTH'
  ]
};

/**
 * Financial information preset
 * Banking, payments, crypto
 */
export const financialPreset: Partial<OpenRedactionOptions> = {
  patterns: [
    'CREDIT_CARD',
    'IBAN',
    'BANK_ACCOUNT_UK',
    'BANK_ACCOUNT_US',
    'SORT_CODE_UK',
    'ROUTING_NUMBER_US',
    'CRYPTO_WALLET_BTC',
    'CRYPTO_WALLET_ETH',
    'SWIFT_CODE'
  ]
};

/**
 * Tech/security preset
 * API keys, tokens, IP addresses
 */
export const techPreset: Partial<OpenRedactionOptions> = {
  patterns: [
    'IPV4',
    'IPV6',
    'GENERIC_API_KEY',
    'JWT_TOKEN',
    'OAUTH_TOKEN',
    'AWS_ACCESS_KEY',
    'AWS_SECRET_KEY',
    'GITHUB_TOKEN',
    'PRIVATE_KEY',
    'SSH_PRIVATE_KEY',
    'BEARER_TOKEN'
  ]
};

/**
 * Healthcare preset
 * Medical and patient identifiers
 */
export const healthcarePreset: Partial<OpenRedactionOptions> = {
  patterns: [
    'MEDICAL_RECORD_NUMBER',
    'PATIENT_ID',
    'DEA_NUMBER',
    'NPI_NUMBER',
    'MEDICARE_NUMBER',
    'MEDICAID_NUMBER'
  ]
};

/**
 * Get preset configuration by name
 */
export function getPreset(name: string): Partial<OpenRedactionOptions> {
  switch (name.toLowerCase()) {
    case 'gdpr':
      return gdprPreset;
    case 'hipaa':
      return hipaaPreset;
    case 'ccpa':
      return ccpaPreset;
    case 'personal':
      return personalPreset;
    case 'financial':
      return financialPreset;
    case 'tech':
      return techPreset;
    case 'healthcare':
      return healthcarePreset;
    default:
      return {};
  }
}

/**
 * Get multiple presets and merge them
 * Allows composable presets like: presets: ['gdpr', 'financial', 'personal']
 */
export function getPresets(names: string[]): Partial<OpenRedactionOptions> {
  const allPresets = names.map(name => getPreset(name));

  // Merge all patterns arrays
  const mergedPatterns = new Set<string>();

  for (const preset of allPresets) {
    if (preset.patterns) {
      preset.patterns.forEach(p => mergedPatterns.add(p));
    }
  }

  return {
    patterns: Array.from(mergedPatterns)
  };
}
