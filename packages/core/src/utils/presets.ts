/**
 * Compliance preset configurations
 */

import { PIIShieldOptions } from '../types';

/**
 * GDPR compliance preset - European Union data protection
 */
export const gdprPreset: Partial<PIIShieldOptions> = {
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
export const hipaaPreset: Partial<PIIShieldOptions> = {
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
export const ccpaPreset: Partial<PIIShieldOptions> = {
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
 * Get preset configuration by name
 */
export function getPreset(name: string): Partial<PIIShieldOptions> {
  switch (name.toLowerCase()) {
    case 'gdpr':
      return gdprPreset;
    case 'hipaa':
      return hipaaPreset;
    case 'ccpa':
      return ccpaPreset;
    default:
      return {};
  }
}
