/**
 * Professional Certifications PII Patterns
 * For professional licenses, certifications, and credentials
 */

import { PIIPattern } from '../../types';

/**
 * PMP (Project Management Professional) Certification
 * Format: 7-9 digit number
 * Issued by PMI (Project Management Institute)
 */
export const PMP_CERTIFICATION: PIIPattern = {
  type: 'PMP_CERTIFICATION',
  regex: /\bPMP[-\s]?(?:ID|NO|NUM|NUMBER|CERT(?:IFICATION)?)?[-\s]?[:#]?\s*(\d{7,9})\b/gi,
  placeholder: '[PMP_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'PMP (Project Management Professional) certification number',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 7 || length > 9) return false;

    return /pmp|project[- ]?management|pmi|certification|certified/i.test(context);
  }
};

/**
 * CPA (Certified Public Accountant) License
 * Format: Varies by state (typically numeric)
 * Issued by state boards of accountancy
 */
export const CPA_LICENSE: PIIPattern = {
  type: 'CPA_LICENSE',
  regex: /\bCPA[-\s]?(?:LICENSE|LIC|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{5,10})\b/gi,
  placeholder: '[CPA_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'CPA (Certified Public Accountant) license number',
  validator: (_value: string, context: string) => {
    return /cpa|certified[- ]?public[- ]?accountant|accountancy|license|accounting/i.test(context);
  }
};

/**
 * PE (Professional Engineer) License
 * Format: Varies by state (typically numeric or alphanumeric)
 * Issued by state engineering boards
 */
export const PE_LICENSE: PIIPattern = {
  type: 'PE_LICENSE',
  regex: /\bPE[-\s]?(?:LICENSE|LIC|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{5,10})\b/gi,
  placeholder: '[PE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'PE (Professional Engineer) license number',
  validator: (_value: string, context: string) => {
    return /professional[- ]?engineer|engineering|pe[- ]?license|registered[- ]?engineer/i.test(context);
  }
};

/**
 * Nursing License (RN)
 * Format: Varies by state (typically numeric)
 * Issued by state boards of nursing
 */
export const NURSING_LICENSE: PIIPattern = {
  type: 'NURSING_LICENSE',
  regex: /\b(?:RN|LPN|NP|NURSING)[-\s]?(?:LICENSE|LIC|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[RN_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Nursing license number (RN, LPN, NP)',
  validator: (_value: string, context: string) => {
    return /nurse|nursing|rn|lpn|registered[- ]?nurse|license|practitioner/i.test(context);
  }
};

/**
 * Teaching Certificate/License
 * Format: Varies by state (typically numeric or alphanumeric)
 * Issued by state education departments
 */
export const TEACHING_LICENSE: PIIPattern = {
  type: 'TEACHING_LICENSE',
  regex: /\b(?:TEACHING|TEACHER|EDUCATOR)[-\s]?(?:LICENSE|LIC|CERT(?:IFICATE)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[TEACHER_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Teaching certificate/license number',
  validator: (_value: string, context: string) => {
    return /teacher|teaching|educator|education|certificate|license|certified/i.test(context);
  }
};

/**
 * AWS Certification ID
 * Format: Alphanumeric
 * Issued by Amazon Web Services for cloud certifications
 */
export const AWS_CERTIFICATION: PIIPattern = {
  type: 'AWS_CERTIFICATION',
  regex: /\bAWS[-\s]?(?:CERT(?:IFICATION)?|ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[AWS_CERT_{n}]',
  priority: 75,
  severity: 'low',
  description: 'AWS (Amazon Web Services) certification ID',
  validator: (_value: string, context: string) => {
    return /aws|amazon[- ]?web[- ]?services|cloud|certification|certified|solutions[- ]?architect/i.test(context);
  }
};

/**
 * Microsoft Certification ID (MCID)
 * Format: Alphanumeric
 * Issued by Microsoft for technical certifications
 */
export const MICROSOFT_CERTIFICATION: PIIPattern = {
  type: 'MICROSOFT_CERTIFICATION',
  regex: /\b(?:MICROSOFT|MCID|MS)[-\s]?(?:CERT(?:IFICATION)?|ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[MS_CERT_{n}]',
  priority: 75,
  severity: 'low',
  description: 'Microsoft certification ID (MCID)',
  validator: (_value: string, context: string) => {
    return /microsoft|mcid|azure|certification|certified|mcsa|mcse/i.test(context);
  }
};

/**
 * Cisco Certification ID (CSCO)
 * Format: Alphanumeric
 * Issued by Cisco for networking certifications
 */
export const CISCO_CERTIFICATION: PIIPattern = {
  type: 'CISCO_CERTIFICATION',
  regex: /\b(?:CISCO|CSCO)[-\s]?(?:CERT(?:IFICATION)?|ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[CISCO_CERT_{n}]',
  priority: 75,
  severity: 'low',
  description: 'Cisco certification ID',
  validator: (_value: string, context: string) => {
    return /cisco|ccna|ccnp|ccie|networking|certification|certified/i.test(context);
  }
};

/**
 * CompTIA Certification ID
 * Format: Alphanumeric
 * Issued by CompTIA for IT certifications
 */
export const COMPTIA_CERTIFICATION: PIIPattern = {
  type: 'COMPTIA_CERTIFICATION',
  regex: /\bCOMPTIA[-\s]?(?:CERT(?:IFICATION)?|ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[COMPTIA_{n}]',
  priority: 75,
  severity: 'low',
  description: 'CompTIA certification ID',
  validator: (_value: string, context: string) => {
    return /comptia|a\+|security\+|network\+|certification|certified/i.test(context);
  }
};

/**
 * Series Licenses (Financial)
 * Format: CRD number (typically numeric)
 * FINRA licenses (Series 7, 63, 65, etc.)
 */
export const FINRA_LICENSE: PIIPattern = {
  type: 'FINRA_LICENSE',
  regex: /\b(?:CRD|SERIES|FINRA)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{6,8})\b/gi,
  placeholder: '[FINRA_{n}]',
  priority: 85,
  severity: 'high',
  description: 'FINRA license number (CRD, Series licenses)',
  validator: (value: string, context: string) => {
    const length = value.length;
    if (length < 6 || length > 8) return false;

    return /finra|crd|series|broker|dealer|securities|license|registered/i.test(context);
  }
};

// Export all professional certification patterns
export const professionalCertificationPatterns: PIIPattern[] = [
  PMP_CERTIFICATION,
  CPA_LICENSE,
  PE_LICENSE,
  NURSING_LICENSE,
  TEACHING_LICENSE,
  AWS_CERTIFICATION,
  MICROSOFT_CERTIFICATION,
  CISCO_CERTIFICATION,
  COMPTIA_CERTIFICATION,
  FINRA_LICENSE
];
