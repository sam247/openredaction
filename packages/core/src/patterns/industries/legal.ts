/**
 * Legal Industry PII Patterns
 * For law firms, courts, legal services - attorney-client privilege protection
 */

import { PIIPattern } from '../../types';

/**
 * Case Numbers (various court formats)
 */
export const CASE_NUMBER: PIIPattern = {
  type: 'CASE_NUMBER',
  regex: /\b(?:CASE|DOCKET|FILE)[-\s]?(?:NO|NUM(?:BER)?|REF)?[-\s]?[:#]?\s*([A-Z]{1,3}[-]?\d{2,4}[-]?[A-Z]{0,3}[-]?\d{4,8})\b/gi,
  placeholder: '[CASE_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Court case and docket numbers'
};

/**
 * Matter Numbers (law firm internal references)
 */
export const MATTER_NUMBER: PIIPattern = {
  type: 'MATTER_NUMBER',
  regex: /\b(?:MATTER|ENGAGEMENT|CLIENT[-\s]?MATTER)[-\s]?(?:NO|NUM(?:BER)?|REF|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[MATTER_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Law firm matter and engagement numbers',
  validator: (_value: string, context: string) => {
    return /legal|matter|client|engagement|firm|attorney|counsel/i.test(context);
  }
};

/**
 * Attorney Bar Numbers
 */
export const BAR_NUMBER: PIIPattern = {
  type: 'BAR_NUMBER',
  regex: /\b(?:BAR|ATTORNEY|LAWYER)[-\s]?(?:NO|NUM(?:BER)?|REG(?:ISTRATION)?|LIC(?:ENSE)?)?[-\s]?[:#]?\s*([A-Z0-9]{5,12})\b/gi,
  placeholder: '[BAR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Attorney bar registration numbers'
};

/**
 * Exhibit Numbers
 */
export const EXHIBIT_NUMBER: PIIPattern = {
  type: 'EXHIBIT_NUMBER',
  regex: /\bEXHIBIT[-\s]?([A-Z]{1,2}[-]?\d{1,4})\b/gi,
  placeholder: '[EXHIBIT_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Legal exhibit reference numbers',
  validator: (_value: string, context: string) => {
    return /exhibit|evidence|document|trial|hearing|deposition/i.test(context);
  }
};

/**
 * Deposition References
 */
export const DEPOSITION_REF: PIIPattern = {
  type: 'DEPOSITION_REF',
  regex: /\b(?:DEPOSITION|DEPO|DEP)[-\s]?(?:NO|NUM(?:BER)?|REF|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[DEPO_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Deposition reference numbers',
  validator: (_value: string, context: string) => {
    return /deposition|depo|testimony|transcript|witness/i.test(context);
  }
};

/**
 * Discovery Request Numbers
 */
export const DISCOVERY_NUMBER: PIIPattern = {
  type: 'DISCOVERY_NUMBER',
  regex: /\b(?:DISCOVERY|INTERROGATORY|REQUEST|RFP|RFA)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{1,4}[-]?\d{1,4})\b/gi,
  placeholder: '[DISCOVERY_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Discovery request, interrogatory, and production numbers'
};

/**
 * Court Reporter License
 */
export const COURT_REPORTER_LICENSE: PIIPattern = {
  type: 'COURT_REPORTER_LICENSE',
  regex: /\b(?:COURT[-\s]?REPORTER|CSR|RPR)[-\s]?(?:LIC(?:ENSE)?|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{2,3}[-]?\d{4,8})\b/gi,
  placeholder: '[CSR_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Court reporter license numbers'
};

/**
 * Subpoena Numbers
 */
export const SUBPOENA_NUMBER: PIIPattern = {
  type: 'SUBPOENA_NUMBER',
  regex: /\b(?:SUBPOENA|SUMMONS)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[SUBPOENA_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Subpoena and summons numbers'
};

/**
 * Judgment/Order Numbers
 */
export const JUDGMENT_NUMBER: PIIPattern = {
  type: 'JUDGMENT_NUMBER',
  regex: /\b(?:JUDGMENT|ORDER|DECREE)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[JUDGMENT_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Court judgment and order numbers',
  validator: (_value: string, context: string) => {
    return /judgment|order|decree|ruling|decision|court/i.test(context);
  }
};

/**
 * Patent/Trademark Application Numbers
 */
export const PATENT_NUMBER: PIIPattern = {
  type: 'PATENT_NUMBER',
  regex: /\b(?:(?:US|EP|WO|PCT)[-\s]?)?(?:PATENT|PAT)[-\s]?(?:NO|NUM(?:BER)?|APPL(?:ICATION)?)?[-\s]?[:#]?\s*([A-Z]{0,2}\d{6,10}[A-Z0-9]{0,3})\b/gi,
  placeholder: '[PATENT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Patent and trademark application numbers'
};

/**
 * Settlement Agreement IDs
 */
export const SETTLEMENT_ID: PIIPattern = {
  type: 'SETTLEMENT_ID',
  regex: /\b(?:SETTLEMENT|AGREEMENT)[-\s]?(?:ID|NO|NUM(?:BER)?|REF)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[SETTLEMENT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Settlement agreement identifiers',
  validator: (_value: string, context: string) => {
    return /settlement|agreement|resolution|mediation|arbitration/i.test(context);
  }
};

/**
 * Client Identifiers (confidential)
 */
export const CLIENT_ID: PIIPattern = {
  type: 'CLIENT_ID',
  regex: /\b(?:CLIENT)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[CLIENT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Law firm client identifiers',
  validator: (_value: string, context: string) => {
    return /client|legal|matter|billing|invoice|retainer/i.test(context);
  }
};

/**
 * Retainer Agreement Numbers
 */
export const RETAINER_NUMBER: PIIPattern = {
  type: 'RETAINER_NUMBER',
  regex: /\b(?:RETAINER)[-\s]?(?:NO|NUM(?:BER)?|AGREEMENT)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[RETAINER_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Retainer agreement numbers'
};

/**
 * Notary License Numbers
 */
export const NOTARY_LICENSE: PIIPattern = {
  type: 'NOTARY_LICENSE',
  regex: /\b(?:NOTARY|NOTARIAL)[-\s]?(?:LIC(?:ENSE)?|COMMISSION|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[NOTARY_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Notary public license and commission numbers'
};

/**
 * Bankruptcy Case Numbers
 */
export const BANKRUPTCY_CASE: PIIPattern = {
  type: 'BANKRUPTCY_CASE',
  regex: /\b(?:BK|BANKRUPTCY)[-\s]?(?:NO|NUM(?:BER)?|CASE)?[-\s]?[:#]?\s*(\d{2}[-]?\d{5}[-]?[A-Z]{0,3})\b/gi,
  placeholder: '[BK_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Bankruptcy case numbers'
};

/**
 * Probate Case Numbers
 */
export const PROBATE_CASE: PIIPattern = {
  type: 'PROBATE_CASE',
  regex: /\b(?:PROBATE|ESTATE)[-\s]?(?:NO|NUM(?:BER)?|CASE)?[-\s]?[:#]?\s*([A-Z]{1,2}\d{6,10})\b/gi,
  placeholder: '[PROBATE_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Probate and estate case numbers',
  validator: (_value: string, context: string) => {
    return /probate|estate|will|trust|inheritance|decedent/i.test(context);
  }
};

/**
 * Confidentiality Agreement IDs
 */
export const NDA_ID: PIIPattern = {
  type: 'NDA_ID',
  regex: /\b(?:NDA|CONFIDENTIALITY|NON[-\s]?DISCLOSURE)[-\s]?(?:AGREEMENT)?[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[NDA_{n}]',
  priority: 75,
  severity: 'high',
  description: 'Non-disclosure and confidentiality agreement numbers'
};

/**
 * Contract Reference Code
 */
export const CONTRACT_REFERENCE: PIIPattern = {
  type: 'CONTRACT_REFERENCE',
  regex: /\bCNTR[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{8})\b/gi,
  placeholder: '[CONTRACT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Contract reference codes'
};

// Export all legal patterns
export const legalPatterns: PIIPattern[] = [
  CASE_NUMBER,
  MATTER_NUMBER,
  BAR_NUMBER,
  EXHIBIT_NUMBER,
  DEPOSITION_REF,
  DISCOVERY_NUMBER,
  COURT_REPORTER_LICENSE,
  SUBPOENA_NUMBER,
  JUDGMENT_NUMBER,
  PATENT_NUMBER,
  SETTLEMENT_ID,
  CLIENT_ID,
  RETAINER_NUMBER,
  NOTARY_LICENSE,
  BANKRUPTCY_CASE,
  PROBATE_CASE,
  NDA_ID,
  CONTRACT_REFERENCE
];
