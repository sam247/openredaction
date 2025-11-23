/**
 * Insurance and Claims Industry PII Patterns
 * For insurance companies, claims processing, policy management
 */

import { PIIPattern } from '../../types';

/**
 * Insurance Claim ID
 */
export const CLAIM_ID: PIIPattern = {
  type: 'CLAIM_ID',
  regex: /\bCLAIM[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{8,12})\b/gi,
  placeholder: '[CLAIM_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Insurance claim identification numbers',
  validator: (_value: string, context: string) => {
    return /claim|insurance|policy|accident|loss|damage|settlement/i.test(context);
  }
};

/**
 * Insurance Policy Number
 */
export const POLICY_NUMBER: PIIPattern = {
  type: 'POLICY_NUMBER',
  regex: /\bPOLICY[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{2,4}\d{6,10})\b/gi,
  placeholder: '[POLICY_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Insurance policy numbers'
};

/**
 * Policy Holder ID
 */
export const POLICY_HOLDER_ID: PIIPattern = {
  type: 'POLICY_HOLDER_ID',
  regex: /\b(?:POLICY[-\s]?HOLDER|INSURED|POLICYHOLDER)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[HOLDER_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Policy holder identification numbers'
};

/**
 * Insurance Quote Reference
 */
export const QUOTE_REFERENCE: PIIPattern = {
  type: 'QUOTE_REFERENCE',
  regex: /\b(?:QUOTE|QTE)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[QUOTE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Insurance quote reference numbers',
  validator: (_value: string, context: string) => {
    return /quote|quotation|estimate|premium|insurance/i.test(context);
  }
};

/**
 * Insurance Certificate Number
 */
export const INSURANCE_CERTIFICATE: PIIPattern = {
  type: 'INSURANCE_CERTIFICATE',
  regex: /\b(?:CERTIFICATE|CERT)[-\s]?(?:OF[-\s]?INSURANCE)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[CERT_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Insurance certificate numbers',
  validator: (_value: string, context: string) => {
    return /certificate|insurance|coverage|proof/i.test(context);
  }
};

/**
 * Adjuster ID
 */
export const ADJUSTER_ID: PIIPattern = {
  type: 'ADJUSTER_ID',
  regex: /\b(?:ADJUSTER|ADJ)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[ADJUSTER_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Insurance adjuster identification numbers',
  validator: (_value: string, context: string) => {
    return /adjuster|claims|inspector|evaluator/i.test(context);
  }
};

/**
 * Underwriter ID
 */
export const UNDERWRITER_ID: PIIPattern = {
  type: 'UNDERWRITER_ID',
  regex: /\b(?:UNDERWRITER|UW)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[UW_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Insurance underwriter identification numbers',
  validator: (_value: string, context: string) => {
    return /underwriter|underwriting|policy|risk|assessment/i.test(context);
  }
};

/**
 * Incident Report Number
 */
export const INCIDENT_REPORT_NUMBER: PIIPattern = {
  type: 'INCIDENT_REPORT_NUMBER',
  regex: /\b(?:INCIDENT|ACCIDENT)[-\s]?(?:REPORT)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[INCIDENT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Incident and accident report numbers',
  validator: (_value: string, context: string) => {
    return /incident|accident|report|event|occurrence|loss/i.test(context);
  }
};

/**
 * Premium Payment Reference
 */
export const PREMIUM_PAYMENT_REF: PIIPattern = {
  type: 'PREMIUM_PAYMENT_REF',
  regex: /\b(?:PREMIUM)[-\s]?(?:PAYMENT)?[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[PREMIUM_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Premium payment reference numbers'
};

/**
 * Reinsurance Treaty Number
 */
export const REINSURANCE_TREATY: PIIPattern = {
  type: 'REINSURANCE_TREATY',
  regex: /\b(?:REINSURANCE|TREATY)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[TREATY_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Reinsurance treaty numbers',
  validator: (_value: string, context: string) => {
    return /reinsurance|treaty|cession|facultative/i.test(context);
  }
};

// Export all insurance patterns
export const insurancePatterns: PIIPattern[] = [
  CLAIM_ID,
  POLICY_NUMBER,
  POLICY_HOLDER_ID,
  QUOTE_REFERENCE,
  INSURANCE_CERTIFICATE,
  ADJUSTER_ID,
  UNDERWRITER_ID,
  INCIDENT_REPORT_NUMBER,
  PREMIUM_PAYMENT_REF,
  REINSURANCE_TREATY
];
