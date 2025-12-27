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
  regex:
    /\b(?:MEDICAL|PHYSICIAN|DOCTOR|NURSE|PROVIDER)[-\s\u00A0]*(?:LICENSE|LICENCE|LIC)[-\s\u00A0]*(?:NO|NUM(?:BER)?)?[-\s\u00A0.:#]*((?:[A-Z0-9]{2,6}[\s\u00A0./-]?){1,3}[A-Z0-9]{2,6})\b/gi,
  placeholder: '[PROVIDER_LIC_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Healthcare provider license numbers',
  validator: (value: string) => {
    const normalized = value.replace(/[^A-Za-z0-9]/g, '');
    if (normalized.length < 6 || normalized.length > 18) return false;

    return /[A-Z]/i.test(normalized) && /\d/.test(normalized);
  }
};

/**
 * NPI (National Provider Identifier) - US
 * 10-digit number with checksum
 */
export const NPI_NUMBER: PIIPattern = {
  type: 'NPI_NUMBER',
  regex: /\b(?:NPI[-\s\u00A0]*(?:NO|NUM(?:BER)?)?[-\s\u00A0.:#]*)?((?:\d[\s\u00A0.-]?){10})\b/g,
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
    const digits = value.replace(/\D/g, '').split('').map(Number);
    if (digits.length !== 10) return false;

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
  regex: /\b(?:DEA[-\s\u00A0]*(?:NO|NUM(?:BER)?)?[-\s\u00A0.:#]*)?([A-Z]{2}(?:[\s\u00A0.-]?\d){7})\b/gi,
  placeholder: '[DEA_{n}]',
  priority: 90,
  severity: 'high',
  description: 'DEA registration number for controlled substances',
  validator: (value: string, _context: string) => {
    const normalized = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (normalized.length !== 9) return false;

    // Must start with valid registrant type
    const validFirstLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'P', 'R', 'S', 'T', 'U'];
    if (!validFirstLetters.includes(normalized[0])) {
      return false;
    }

    // Checksum validation
    const digits = normalized.substring(2).split('').map(Number);
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

/**
 * Biometric Identifier References
 * Detects mentions of biometric data (fingerprints, retinal scans, etc.)
 */
export const BIOMETRIC_ID: PIIPattern = {
  type: 'BIOMETRIC_ID',
  regex:
    /\b(?:FINGERPRINT|RETINAL?[-\s\u00A0]?SCAN|IRIS[-\s\u00A0]?SCAN|VOICE[-\s\u00A0]?PRINT|FACIAL[-\s\u00A0]?RECOGNITION|BIOMETRIC)[-\s\u00A0]?(?:ID|DATA|TEMPLATE|HASH)?[-\s\u00A0.:#]*([A-Z0-9][A-Z0-9._-]{7,39})\b/gi,
  placeholder: '[BIOMETRIC_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Biometric identifier references',
  validator: (value: string) => {
    const normalized = value.replace(/[^A-Za-z0-9]/g, '');
    if (normalized.length < 8 || normalized.length > 40) return false;

    return /[A-Z]/i.test(normalized) && /\d/.test(normalized);
  }
};

/**
 * DNA/Genetic Sequence Patterns
 * Short nucleotide sequences that might identify individuals
 */
export const DNA_SEQUENCE: PIIPattern = {
  type: 'DNA_SEQUENCE',
  regex: /\b([ATCG]{20,})\b/g,
  placeholder: '[DNA_{n}]',
  priority: 90,
  severity: 'high',
  description: 'DNA sequence patterns',
  validator: (value: string, context: string) => {
    // Must be in genetic context
    const geneticContext = /dna|genetic|sequence|genome|nucleotide|gene/i.test(context);
    // Must be long enough to be meaningful
    const longEnough = value.length >= 20;
    // Should be mostly ATCG (allow some ambiguity codes)
    const validChars = /^[ATCGRYSWKMBDHVN]+$/i.test(value);
    return geneticContext && longEnough && validChars;
  }
};

/**
 * Drug Names with Dosages
 * Common pattern: DrugName + dosage + unit
 */
export const DRUG_DOSAGE: PIIPattern = {
  type: 'DRUG_DOSAGE',
  regex: /\b([A-Z][a-z]+(?:ine|ol|azole|mycin|cillin|pril|olol|mab|pam|tab|pine|done|ide|tide|ase|statin))\s+(\d+(?:\.\d+)?)\s?(mg|mcg|g|ml|units?|IU)\b/gi,
  placeholder: '[DRUG_DOSAGE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Drug names with dosages',
  validator: (_value: string, context: string) => {
    return /medication|prescription|drug|dose|treatment|therapy/i.test(context);
  }
};

/**
 * Medical Image References
 * References to medical imaging files (X-rays, MRIs, etc.)
 */
export const MEDICAL_IMAGE_REF: PIIPattern = {
  type: 'MEDICAL_IMAGE_REF',
  regex:
    /\b(?:X[-\s\u00A0]?RAY|MRI|CT[-\s\u00A0]?SCAN|PET[-\s\u00A0]?SCAN|ULTRASOUND|MAMMOGRAM)[-\s\u00A0]?(?:IMAGE|FILE|ID)?[-\s\u00A0.:#]*([A-Z0-9][A-Z0-9_.-]{5,23})\b/gi,
  placeholder: '[IMAGE_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Medical imaging file references'
};

/**
 * Blood Type with Patient Context
 */
export const BLOOD_TYPE_PATIENT: PIIPattern = {
  type: 'BLOOD_TYPE',
  regex: /\b(?:blood\s+type|blood\s+group)[:\s]+(A|B|AB|O)[+-]?\b/gi,
  placeholder: '[BLOOD_TYPE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Patient blood type information'
};

/**
 * Allergy Information Pattern
 */
export const ALLERGY_INFO: PIIPattern = {
  type: 'ALLERGY_INFO',
  regex: /\b(?:allergic\s+to|allergy)[:\s]+([A-Za-z\s,]+(?:penicillin|peanuts|latex|aspirin|shellfish|eggs|dairy|soy|wheat))/gi,
  placeholder: '[ALLERGY_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Patient allergy information'
};

/**
 * Vaccination Record IDs
 */
export const VACCINATION_ID: PIIPattern = {
  type: 'VACCINATION_ID',
  regex: /\b(?:VACCINE|VACCINATION|IMMUNIZATION)[-\s]?(?:ID|RECORD|NO)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[VAX_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Vaccination record identifiers',
  validator: (_value: string, context: string) => {
    return /vaccine|vaccination|immunization|shot|dose/i.test(context);
  }
};

/**
 * CHI (Community Health Index) Number - Scotland
 * Format: DDMMYY-XXXX (10 digits with hyphen)
 */
export const CHI_NUMBER: PIIPattern = {
  type: 'CHI_NUMBER',
  regex: /\b(?:CHI|community health index)[-\s]?(?:number|no)?[-\s]?[:#]?\s*(\d{6}[-\s]?\d{4})\b/gi,
  placeholder: '[CHI_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Scottish Community Health Index number',
  validator: (match) => {
    const digits = match.replace(/\D/g, '');

    if (digits.length !== 10) return false;

    // First 6 digits should be a valid date (DDMMYY)
    const day = parseInt(digits.substring(0, 2));
    const month = parseInt(digits.substring(2, 4));
    const year = parseInt(digits.substring(4, 6));

    // Basic date validation
    if (day < 1 || day > 31) return false;
    if (month < 1 || month > 12) return false;

    // Check digit validation (simple mod-11)
    let sum = 0;
    const weights = [10, 9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < 9; i++) {
      sum += parseInt(digits[i]) * weights[i];
    }

    const checkDigit = 11 - (sum % 11);
    const expectedCheckDigit = checkDigit === 11 ? 0 : checkDigit === 10 ? 0 : checkDigit;

    return expectedCheckDigit === parseInt(digits[9]);
  }
};

/**
 * EHIC (European Health Insurance Card)
 * Format: Country code + 12-16 digits
 */
export const EHIC_NUMBER: PIIPattern = {
  type: 'EHIC_NUMBER',
  regex: /\b(?:EHIC|european health insurance|health card)[-\s]?(?:number|no)?[-\s]?[:#]?\s*([A-Z]{2}\s?\d{12,16})\b/gi,
  placeholder: '[EHIC_{n}]',
  priority: 90,
  severity: 'high',
  description: 'European Health Insurance Card number',
  validator: (match) => {
    // Remove spaces and extract parts
    const cleaned = match.replace(/\s/g, '');

    // Must start with valid EU country code
    const countryCode = cleaned.substring(0, 2).toUpperCase();
    const validCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
      'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU',
      'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'CH', 'GB'
    ];

    if (!validCountries.includes(countryCode)) {
      return false;
    }

    // Remaining part should be 12-16 digits
    const number = cleaned.substring(2);
    return /^\d{12,16}$/.test(number);
  }
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
  EMERGENCY_CONTACT_MARKER,
  BIOMETRIC_ID,
  DNA_SEQUENCE,
  DRUG_DOSAGE,
  MEDICAL_IMAGE_REF,
  BLOOD_TYPE_PATIENT,
  ALLERGY_INFO,
  VACCINATION_ID,
  CHI_NUMBER,
  EHIC_NUMBER
];
