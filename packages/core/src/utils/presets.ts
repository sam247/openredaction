/**
 * Compliance preset configurations
 */

import type { OpenRedactionOptions, PresetName } from "../types";

/**
 * GDPR compliance preset - European Union data protection
 */
export const gdprPreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  patterns: [
    "EMAIL",
    "NAME",
    "PHONE_UK",
    "PHONE_UK_MOBILE",
    "PHONE_INTERNATIONAL",
    "IPV4",
    "IPV6",
    "POSTCODE_UK",
    "ADDRESS_STREET",
    "NATIONAL_INSURANCE_UK",
    "NHS_NUMBER",
    "PASSPORT_UK",
    "DRIVING_LICENSE_UK",
    "IBAN",
    "CREDIT_CARD",
  ],
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
    "EMAIL",
    "NAME",
    "SSN",
    "PHONE_US",
    "ZIP_CODE_US",
    "ADDRESS_STREET",
    "DATE_OF_BIRTH",
    "PASSPORT_US",
    "DRIVING_LICENSE_US",
    "CREDIT_CARD",
    "BANK_ACCOUNT_UK",
    "IPV4",
    "IPV6",
    "EMPLOYEE_ID",
  ],
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
    "EMAIL",
    "NAME",
    "SSN",
    "PHONE_US",
    "ZIP_CODE_US",
    "ADDRESS_STREET",
    "IPV4",
    "IPV6",
    "CREDIT_CARD",
    "PASSPORT_US",
    "DRIVING_LICENSE_US",
    "USERNAME",
  ],
};

/**
 * Healthcare operations preset - provider-centric coverage
 */
export const healthcarePreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  categories: ["personal", "contact", "healthcare", "insurance", "government"],
};

/**
 * Healthcare research preset - clinical research and trials
 */
export const healthcareResearchPreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  categories: ["personal", "contact", "healthcare", "insurance", "government"],
};

/**
 * Financial services preset - banking, trading, and payments
 */
export const financePreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  categories: ["personal", "contact", "financial", "government", "network"],
};

/**
 * Education preset - FERPA-style coverage for schools and universities
 */
export const educationPreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  categories: ["personal", "contact", "education", "government", "network"],
};

/**
 * Transportation and logistics preset - fleet, shipping, and mobility
 */
export const transportLogisticsPreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  categories: [
    "personal",
    "contact",
    "transportation",
    "logistics",
    "vehicles",
    "network",
  ],
};

/**
 * PCI-DSS oriented preset — cardholder data and common payment identifiers
 */
export const pciDssPreset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  categories: ["personal", "contact", "financial", "network"],
};

/**
 * SOC 2 oriented preset — broad PII and credentials for trust services contexts
 */
export const soc2Preset: Partial<OpenRedactionOptions> = {
  includeNames: true,
  includeEmails: true,
  includePhones: true,
  includeAddresses: true,
  categories: [
    "personal",
    "contact",
    "financial",
    "government",
    "network",
    "digital-identity",
  ],
};

/**
 * Get preset configuration by name
 */
export function getPreset(name: string): Partial<OpenRedactionOptions> {
  const presetName = name.toLowerCase() as PresetName | string;

  switch (presetName) {
    case "gdpr":
      return gdprPreset;
    case "hipaa":
      return hipaaPreset;
    case "ccpa":
      return ccpaPreset;
    case "healthcare":
    case "healthcare-provider":
      return healthcarePreset;
    case "healthcare-research":
      return healthcareResearchPreset;
    case "finance":
    case "financial-services":
      return financePreset;
    case "education":
      return educationPreset;
    case "transport-logistics":
    case "transportation":
    case "logistics":
      return transportLogisticsPreset;
    case "pci-dss":
    case "pci_dss":
      return pciDssPreset;
    case "soc2":
    case "soc-2":
      return soc2Preset;
    default:
      return {};
  }
}
