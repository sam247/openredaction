/**
 * Real Estate & Property Industry PII Patterns
 * For property transactions, mortgages, leases, and real estate operations
 */

import { PIIPattern } from '../../types';

/**
 * Property Assessor Parcel Number (APN)
 * Format: XXX-XXX-XXX or XXXXXXX (varies by jurisdiction)
 * Used by tax assessors to uniquely identify land parcels
 */
export const PROPERTY_PARCEL_NUMBER: PIIPattern = {
  type: 'PROPERTY_PARCEL_NUMBER',
  regex: /\b(?:APN|PARCEL|ASSESSOR)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{3}[-\s]?\d{3}[-\s]?\d{3}(?:[-\s]?\d{1,3})?)\b/gi,
  placeholder: '[APN_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Property assessor parcel numbers',
  validator: (_value: string, context: string) => {
    return /property|parcel|assessor|land|real[- ]?estate|apn|tax|deed/i.test(context);
  }
};

/**
 * Multiple Listing Service (MLS) Number
 * Format: Alphanumeric, varies by MLS region
 * Used by real estate brokers to list properties
 */
export const MLS_LISTING_NUMBER: PIIPattern = {
  type: 'MLS_LISTING_NUMBER',
  regex: /\bMLS[-\s]?(?:NO|NUM|NUMBER|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[MLS_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'MLS (Multiple Listing Service) property listing numbers',
  validator: (_value: string, context: string) => {
    return /mls|listing|real[- ]?estate|property|broker|agent|sale|for[- ]sale/i.test(context);
  }
};

/**
 * Mortgage Loan Number
 * Format: Various (typically 8-12 digits or alphanumeric)
 * Used by lenders to track mortgage accounts
 */
export const MORTGAGE_LOAN_NUMBER: PIIPattern = {
  type: 'MORTGAGE_LOAN_NUMBER',
  regex: /\b(?:MORTGAGE|LOAN|MTG)[-\s]?(?:NO|NUM|NUMBER|ID|ACCOUNT)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[MORTGAGE_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Mortgage and home loan account numbers',
  validator: (_value: string, context: string) => {
    return /mortgage|loan|lender|lending|home[- ]?loan|refinance|foreclosure|escrow/i.test(context);
  }
};

/**
 * Property Tax Account Number
 * Format: Varies by jurisdiction (typically numeric)
 * Used by municipalities for property tax billing
 */
export const PROPERTY_TAX_ACCOUNT: PIIPattern = {
  type: 'PROPERTY_TAX_ACCOUNT',
  regex: /\b(?:PROPERTY[- ]?TAX|TAX|MUNICIPAL)[-\s]?(?:ACCOUNT|ACCT|NO|NUMBER|ID)?[-\s]?[:#]?\s*(\d{6,12})\b/gi,
  placeholder: '[TAX_ACCT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Property tax account numbers',
  validator: (_value: string, context: string) => {
    return /property[- ]?tax|municipal|county|city|tax[- ]?bill|assessment|levy/i.test(context);
  }
};

/**
 * HOA (Homeowners Association) Account Number
 * Format: Numeric or alphanumeric
 * Used by HOAs to track member accounts
 */
export const HOA_ACCOUNT_NUMBER: PIIPattern = {
  type: 'HOA_ACCOUNT_NUMBER',
  regex: /\bHOA[-\s]?(?:ACCOUNT|ACCT|NO|NUMBER|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[HOA_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'HOA (Homeowners Association) account numbers',
  validator: (_value: string, context: string) => {
    return /hoa|homeowners|association|condo|dues|fee|community/i.test(context);
  }
};

/**
 * Title/Deed Number
 * Format: Alphanumeric (varies by recording office)
 * Used to identify property title documents
 */
export const TITLE_DEED_NUMBER: PIIPattern = {
  type: 'TITLE_DEED_NUMBER',
  regex: /\b(?:TITLE|DEED)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[DEED_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Property title and deed numbers',
  validator: (_value: string, context: string) => {
    return /title|deed|recording|recorder|registry|land[- ]?registry|conveyance/i.test(context);
  }
};

/**
 * Real Estate License Number
 * Format: State-specific (typically alphanumeric)
 * Used to identify licensed real estate agents and brokers
 */
export const REAL_ESTATE_LICENSE: PIIPattern = {
  type: 'REAL_ESTATE_LICENSE',
  regex: /\b(?:REAL[- ]?ESTATE|RE|BROKER)[-\s]?(?:LICENSE|LIC)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[RE_LIC_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Real estate agent/broker license numbers',
  validator: (_value: string, context: string) => {
    return /real[- ]?estate|broker|agent|license|realtor|certified/i.test(context);
  }
};

/**
 * Appraisal Reference Number
 * Format: Alphanumeric
 * Used by appraisers to track property valuations
 */
export const APPRAISAL_REFERENCE: PIIPattern = {
  type: 'APPRAISAL_REFERENCE',
  regex: /\b(?:APPRAISAL|APPR)[-\s]?(?:NO|NUM|NUMBER|REF|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[APPR_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Property appraisal reference numbers',
  validator: (_value: string, context: string) => {
    return /appraisal|appraiser|valuation|value|assessment|market[- ]?value/i.test(context);
  }
};

/**
 * Escrow Account Number
 * Format: Numeric or alphanumeric
 * Used by escrow companies for transaction accounts
 */
export const ESCROW_NUMBER: PIIPattern = {
  type: 'ESCROW_NUMBER',
  regex: /\bESCROW[-\s]?(?:NO|NUM|NUMBER|ACCOUNT|ACCT|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[ESCROW_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Escrow account numbers',
  validator: (_value: string, context: string) => {
    return /escrow|closing|settlement|title[- ]?company|transaction/i.test(context);
  }
};

/**
 * Lease Agreement Reference
 * Format: Alphanumeric
 * Used to identify rental lease contracts
 */
export const LEASE_AGREEMENT_NUMBER: PIIPattern = {
  type: 'LEASE_AGREEMENT_NUMBER',
  regex: /\b(?:LEASE|RENTAL)[-\s]?(?:AGREEMENT|CONTRACT|NO|NUM|NUMBER|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[LEASE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Lease and rental agreement numbers',
  validator: (_value: string, context: string) => {
    return /lease|rental|tenant|landlord|rent|renter|apartment|unit/i.test(context);
  }
};

// Export all real estate patterns
export const realEstatePatterns: PIIPattern[] = [
  PROPERTY_PARCEL_NUMBER,
  MLS_LISTING_NUMBER,
  MORTGAGE_LOAN_NUMBER,
  PROPERTY_TAX_ACCOUNT,
  HOA_ACCOUNT_NUMBER,
  TITLE_DEED_NUMBER,
  REAL_ESTATE_LICENSE,
  APPRAISAL_REFERENCE,
  ESCROW_NUMBER,
  LEASE_AGREEMENT_NUMBER
];
