/**
 * Healthcare and Medical PII Patterns
 * For HIPAA compliance and medical data protection
 */

import { PIIPattern } from '../../types';

/**
 * Medical Record Number (MRN) - Various hospital formats
 */
export const MEDICAL_RECORD_NUMBER: PIIPattern = {
  type: 'MEDICAL_RECORD_NUMBER',
  regex: /\b(?:MR[N]?[-\s]?|MEDICAL[-\s]?REC(?:ORD)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*)([A-Z0-9]{6,12})\b/gi,
  placeholder: '[MRN_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Medical Record Numbers in various hospital formats'
};

/**
 * Patient ID - Generic patient identifier
 */
export const PATIENT_ID: PIIPattern = {
  type: 'PATIENT_ID',
  regex: /\b(?:PATIENT[-\s]?(?:ID|NUM(?:BER)?|REF(?:ERENCE)?)[-\s]?[:#]?\s*)([A-Z0-9]{6,12})\b/gi,
  placeholder: '[PATIENT_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Patient identification numbers'
};

/**
 * Appointment Reference Numbers
 */
export const APPOINTMENT_REF: PIIPattern = {
  type: 'APPOINTMENT_REF',
  regex: /\b(?:APT|APPT|APPOINTMENT)[-\s]?(?:REF|ID|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,10})\b/gi,
  placeholder: '[APT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Medical appointment reference numbers'
};

/**
 * ICD-10 Diagnosis Codes
 * Format: Letter + 2 digits, optionally followed by decimal and 1-2 more digits
 */
export const ICD10_CODE: PIIPattern = {
  type: 'ICD10_CODE',
  regex: /\b([A-Z]\d{2}(?:\.\d{1,2})?)\b/g,
  placeholder: '[ICD10_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'ICD-10 diagnosis codes',
  validator: (value: string, context: string) => {
    // Only flag if in medical context
    const medicalContext = /diagnos|condition|disease|disorder|icd|code/i.test(context);
    // First char must be letter, not digit
    const validFormat = /^[A-TV-Z]/.test(value); // Excludes U (unused) except for special cases
    return medicalContext && validFormat;
  }
};

/**
 * CPT Procedure Codes
 * 5-digit codes (Category I: 00100-99499)
 */
export const CPT_CODE: PIIPattern = {
  type: 'CPT_CODE',
  regex: /\b(?:CPT[-\s]?(?:CODE)?[-\s]?[:#]?\s*)?([0-9]{5})\b/g,
  placeholder: '[CPT_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'CPT medical procedure codes',
  validator: (value: string, context: string) => {
    const code = parseInt(value);
    // Valid CPT range
    const validRange = (code >= 100 && code <= 99499);
    // Only flag in medical context
    const medicalContext = /procedure|cpt|billing|treatment|service/i.test(context);
    return validRange && medicalContext;
  }
};

/**
 * Prescription/RX Numbers
 */
export const PRESCRIPTION_NUMBER: PIIPattern = {
  type: 'PRESCRIPTION_NUMBER',
  regex: /\b(?:RX|PRESC(?:RIPTION)?|SCRIPT)[-\s]?(?:NO|NUM(?:BER)?|REF|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[RX_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Prescription reference numbers'
};

/**
 * Health Insurance Claim Numbers
 */
export const HEALTH_INSURANCE_CLAIM: PIIPattern = {
  type: 'HEALTH_INSURANCE_CLAIM',
  regex: /\b(?:CLAIM|CLM)[-\s]?(?:NO|NUM(?:BER)?|REF|ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[CLAIM_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Health insurance claim numbers',
  validator: (_value: string, context: string) => {
    // Only in insurance/medical context
    return /insurance|claim|medical|health|policy/i.test(context);
  }
};

/**
 * Health Plan Beneficiary Numbers
 */
export const HEALTH_PLAN_NUMBER: PIIPattern = {
  type: 'HEALTH_PLAN_NUMBER',
  regex: /\b(?:HEALTH[-\s]?PLAN|BENEFICIARY|MEMBER)[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,15})\b/gi,
  placeholder: '[HEALTH_PLAN_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Health plan beneficiary/member numbers'
};

/**
 * Medical Device Serial Numbers
 */
export const MEDICAL_DEVICE_SERIAL: PIIPattern = {
  type: 'MEDICAL_DEVICE_SERIAL',
  regex: /\b(?:DEVICE|IMPLANT|PACEMAKER|DEFIBRILLATOR)[-\s]?(?:SERIAL|SN|S\/N)[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[DEVICE_{n}]',
  priority: 75,
  severity: 'high',
  description: 'Medical device serial numbers'
};

/**
 * Lab Result/Test IDs
 */
export const LAB_TEST_ID: PIIPattern = {
  type: 'LAB_TEST_ID',
  regex: /\b(?:LAB|TEST|SAMPLE)[-\s]?(?:ID|NUM(?:BER)?|REF)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[LAB_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Laboratory test and sample IDs',
  validator: (_value: string, context: string) => {
    return /lab|test|sample|specimen|pathology/i.test(context);
  }
};

/**
 * Clinical Trial Participant IDs
 */
export const TRIAL_PARTICIPANT_ID: PIIPattern = {
  type: 'TRIAL_PARTICIPANT_ID',
  regex: /\b(?:PARTICIPANT|SUBJECT|TRIAL)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{1,2}[-]?\d{4,6})\b/gi,
  placeholder: '[TRIAL_PART_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Clinical trial participant identifiers'
};

/**
 * Protocol Numbers (Clinical Trials)
 */
export const PROTOCOL_NUMBER: PIIPattern = {
  type: 'PROTOCOL_NUMBER',
  regex: /\b(?:PROTOCOL|STUDY)[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[PROTOCOL_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Clinical trial protocol numbers',
  validator: (_value: string, context: string) => {
    return /trial|study|protocol|research|clinical/i.test(context);
  }
};

/**
 * Genetic Markers (dbSNP rs numbers)
 */
export const GENETIC_MARKER: PIIPattern = {
  type: 'GENETIC_MARKER',
  regex: /\b(rs\d{6,10})\b/gi,
  placeholder: '[SNP_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Genetic markers (dbSNP rs numbers)',
  validator: (_value: string, context: string) => {
    return /genetic|gene|snp|marker|genome|dna|variant|allele/i.test(context);
  }
};

/**
 * Biobank Sample IDs
 */
export const BIOBANK_SAMPLE_ID: PIIPattern = {
  type: 'BIOBANK_SAMPLE_ID',
  regex: /\b(?:BIOBANK|SAMPLE|SPECIMEN)[-\s]?(?:ID|NO)?[-\s]?[:#]?\s*([A-Z0-9]{8,15})\b/gi,
  placeholder: '[BIOBANK_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Biobank sample identifiers',
  validator: (_value: string, context: string) => {
    return /biobank|specimen|sample|tissue|blood|genetic/i.test(context);
  }
};

/**
 * Healthcare Provider License Numbers
 */
export const PROVIDER_LICENSE: PIIPattern = {
  type: 'PROVIDER_LICENSE',
  regex: /\b(?:MEDICAL|PHYSICIAN|DOCTOR|NURSE|PROVIDER)[-\s]?(?:LICENSE|LICENCE|LIC)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[PROVIDER_LIC_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Healthcare provider license numbers'
};

/**
 * NPI (National Provider Identifier) - US
 * 10-digit number with checksum
 */
export const NPI_NUMBER: PIIPattern = {
  type: 'NPI_NUMBER',
  regex: /\b(?:NPI[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*)?(\d{10})\b/g,
  placeholder: '[NPI_{n}]',
  priority: 85,
  severity: 'high',
  description: 'US National Provider Identifier',
  validator: (value: string, context: string) => {
    // Must be in healthcare context
    if (!/provider|npi|physician|doctor|clinic|hospital|practice/i.test(context)) {
      return false;
    }

    // Luhn checksum validation
    const digits = value.split('').map(Number);
    let sum = 0;
    for (let i = digits.length - 2; i >= 0; i--) {
      let digit = digits[i];
      if ((digits.length - i) % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[digits.length - 1];
  }
};

/**
 * DEA Number (Drug Enforcement Administration) - US
 * Format: 2 letters + 7 digits with checksum
 */
export const DEA_NUMBER: PIIPattern = {
  type: 'DEA_NUMBER',
  regex: /\b(?:DEA[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*)?([A-Z]{2}\d{7})\b/gi,
  placeholder: '[DEA_{n}]',
  priority: 90,
  severity: 'high',
  description: 'DEA registration number for controlled substances',
  validator: (value: string, _context: string) => {
    // Must start with valid registrant type
    const validFirstLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'P', 'R', 'S', 'T', 'U'];
    if (!validFirstLetters.includes(value[0].toUpperCase())) {
      return false;
    }

    // Checksum validation
    const digits = value.substring(2).split('').map(Number);
    const sum1 = digits[0] + digits[2] + digits[4];
    const sum2 = (digits[1] + digits[3] + digits[5]) * 2;
    const checkDigit = (sum1 + sum2) % 10;

    return checkDigit === digits[6];
  }
};

/**
 * Hospital Account Numbers
 */
export const HOSPITAL_ACCOUNT: PIIPattern = {
  type: 'HOSPITAL_ACCOUNT',
  regex: /\b(?:HOSPITAL|H|HAR)[-\s]?(?:ACCOUNT|ACCT|A\/C)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[H_ACCT_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Hospital account numbers'
};

/**
 * Emergency Contact Information Pattern
 * Detects when emergency contact details are mentioned
 */
export const EMERGENCY_CONTACT_MARKER: PIIPattern = {
  type: 'EMERGENCY_CONTACT',
  regex: /(?:emergency\s+contact|next\s+of\s+kin|ice|in\s+case\s+of\s+emergency)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/gi,
  placeholder: '[EMERGENCY_CONTACT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Emergency contact person names'
};

// Export all healthcare patterns
export const healthcarePatterns: PIIPattern[] = [
  MEDICAL_RECORD_NUMBER,
  PATIENT_ID,
  APPOINTMENT_REF,
  ICD10_CODE,
  CPT_CODE,
  PRESCRIPTION_NUMBER,
  HEALTH_INSURANCE_CLAIM,
  HEALTH_PLAN_NUMBER,
  MEDICAL_DEVICE_SERIAL,
  LAB_TEST_ID,
  TRIAL_PARTICIPANT_ID,
  PROTOCOL_NUMBER,
  GENETIC_MARKER,
  BIOBANK_SAMPLE_ID,
  PROVIDER_LICENSE,
  NPI_NUMBER,
  DEA_NUMBER,
  HOSPITAL_ACCOUNT,
  EMERGENCY_CONTACT_MARKER
];
