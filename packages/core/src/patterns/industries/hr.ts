/**
 * HR and Recruitment Industry PII Patterns
 * For human resources, recruiting, talent acquisition - employee privacy protection
 */

import { PIIPattern } from '../../types';

/**
 * Employee ID Numbers
 */
export const EMPLOYEE_ID: PIIPattern = {
  type: 'EMPLOYEE_ID',
  regex: /\b(?:EMPLOYEE|EMP|STAFF|PERSONNEL|WORKER)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{0,2}\d{4,10})\b/gi,
  placeholder: '[EMP_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Employee identification numbers'
};

/**
 * Payroll Numbers
 */
export const PAYROLL_NUMBER: PIIPattern = {
  type: 'PAYROLL_NUMBER',
  regex: /\b(?:PAYROLL|PAY)[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[PAYROLL_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Payroll identification numbers',
  validator: (_value: string, context: string) => {
    return /payroll|salary|compensation|pay|wage|earning/i.test(context);
  }
};

/**
 * Salary Information (with currency)
 */
export const SALARY_AMOUNT: PIIPattern = {
  type: 'SALARY_AMOUNT',
  regex: /\b(?:SALARY|COMPENSATION|PAY|WAGE|EARNING)[-\s]?[:#]?\s*(?:[$£€¥]\s?)?(\d{1,3}(?:[,\s]\d{3})*(?:\.\d{2})?)\b/gi,
  placeholder: '[SALARY_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Salary and compensation amounts',
  validator: (value: string, context: string) => {
    // Only in compensation context
    const compContext = /salary|compensation|pay|wage|earning|income|annual|hourly/i.test(context);
    // Value should be reasonable (1000+)
    const numValue = parseInt(value.replace(/[,\s]/g, ''));
    return compContext && numValue >= 1000;
  }
};

/**
 * Performance Review IDs
 */
export const PERFORMANCE_REVIEW_ID: PIIPattern = {
  type: 'PERFORMANCE_REVIEW_ID',
  regex: /\b(?:PERFORMANCE|REVIEW|APPRAISAL|EVALUATION)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[REVIEW_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Performance review and appraisal identifiers',
  validator: (_value: string, context: string) => {
    return /performance|review|appraisal|evaluation|rating|assessment/i.test(context);
  }
};

/**
 * Job Application IDs
 */
export const JOB_APPLICATION_ID: PIIPattern = {
  type: 'JOB_APPLICATION_ID',
  regex: /\b(?:APPLICATION|CANDIDATE|APPLICANT)[-\s]?(?:ID|NO|NUM(?:BER)?|REF)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[APPLICATION_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Job application and candidate identifiers',
  validator: (_value: string, context: string) => {
    return /application|candidate|applicant|job|position|recruit|hiring/i.test(context);
  }
};

/**
 * Resume/CV References
 */
export const RESUME_ID: PIIPattern = {
  type: 'RESUME_ID',
  regex: /\b(?:RESUME|CV|CURRICULUM[-\s]?VITAE)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[RESUME_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Resume and CV identifiers'
};

/**
 * Benefits Plan Numbers
 */
export const BENEFITS_PLAN_NUMBER: PIIPattern = {
  type: 'BENEFITS_PLAN_NUMBER',
  regex: /\b(?:BENEFITS?|INSURANCE|HEALTH[-\s]?PLAN)[-\s]?(?:PLAN)?[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[BENEFITS_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Employee benefits and insurance plan numbers',
  validator: (_value: string, context: string) => {
    return /benefit|insurance|health|dental|vision|plan|policy|enrollment/i.test(context);
  }
};

/**
 * 401(k) / Retirement Account Numbers
 */
export const RETIREMENT_ACCOUNT: PIIPattern = {
  type: 'RETIREMENT_ACCOUNT',
  regex: /\b(?:401K|403B|IRA|RETIREMENT|PENSION)[-\s]?(?:ACCOUNT)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[RETIREMENT_{n}]',
  priority: 90,
  severity: 'high',
  description: '401(k), IRA, and retirement account numbers',
  validator: (_value: string, context: string) => {
    return /401k|403b|ira|retirement|pension|fund|invest|contribution/i.test(context);
  }
};

/**
 * Direct Deposit Account References
 */
export const DIRECT_DEPOSIT_REF: PIIPattern = {
  type: 'DIRECT_DEPOSIT_REF',
  regex: /\b(?:DIRECT[-\s]?DEPOSIT|DD|ROUTING)[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*(\d{9})\b/g,
  placeholder: '[DD_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Direct deposit and routing numbers',
  validator: (_value: string, context: string) => {
    return /direct[-\s]?deposit|routing|bank|account|payroll|pay/i.test(context);
  }
};

/**
 * Background Check IDs
 */
export const BACKGROUND_CHECK_ID: PIIPattern = {
  type: 'BACKGROUND_CHECK_ID',
  regex: /\b(?:BACKGROUND[-\s]?CHECK|BGC|SCREENING)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[BGC_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Background check and screening identifiers'
};

/**
 * Drug Test IDs
 */
export const DRUG_TEST_ID: PIIPattern = {
  type: 'DRUG_TEST_ID',
  regex: /\b(?:DRUG[-\s]?TEST|SCREENING|URINALYSIS)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[DRUG_TEST_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Drug test and screening identifiers',
  validator: (_value: string, context: string) => {
    return /drug|test|screening|urinalysis|specimen|sample/i.test(context);
  }
};

/**
 * Timesheet/Timecard Numbers
 */
export const TIMESHEET_NUMBER: PIIPattern = {
  type: 'TIMESHEET_NUMBER',
  regex: /\b(?:TIMESHEET|TIMECARD|TIME[-\s]?ENTRY)[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[TIMESHEET_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Timesheet and timecard numbers'
};

/**
 * Training Certification IDs
 */
export const TRAINING_CERT_ID: PIIPattern = {
  type: 'TRAINING_CERT_ID',
  regex: /\b(?:TRAINING|CERTIFICATION|CERT)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[TRAINING_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Training and certification identifiers',
  validator: (_value: string, context: string) => {
    return /training|certification|cert|course|completion|credential/i.test(context);
  }
};

/**
 * Expense Report Numbers
 */
export const EXPENSE_REPORT_NUMBER: PIIPattern = {
  type: 'EXPENSE_REPORT_NUMBER',
  regex: /\b(?:EXPENSE|REIMBURSEMENT)[-\s]?(?:REPORT)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[EXPENSE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Expense report and reimbursement numbers',
  validator: (_value: string, context: string) => {
    return /expense|reimbursement|travel|claim|receipt/i.test(context);
  }
};

/**
 * PTO/Leave Request IDs
 */
export const LEAVE_REQUEST_ID: PIIPattern = {
  type: 'LEAVE_REQUEST_ID',
  regex: /\b(?:PTO|LEAVE|VACATION|TIME[-\s]?OFF)[-\s]?(?:REQUEST)?[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[LEAVE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Leave request and time-off identifiers',
  validator: (_value: string, context: string) => {
    return /pto|leave|vacation|time[-\s]?off|absence|sick|personal/i.test(context);
  }
};

/**
 * Termination/Exit Interview IDs
 */
export const EXIT_INTERVIEW_ID: PIIPattern = {
  type: 'EXIT_INTERVIEW_ID',
  regex: /\b(?:EXIT|TERMINATION|SEPARATION)[-\s]?(?:INTERVIEW)?[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[EXIT_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Exit interview and termination identifiers',
  validator: (_value: string, context: string) => {
    return /exit|termination|separation|offboard|departure|resign/i.test(context);
  }
};

/**
 * Disciplinary Action IDs
 */
export const DISCIPLINARY_ACTION_ID: PIIPattern = {
  type: 'DISCIPLINARY_ACTION_ID',
  regex: /\b(?:DISCIPLINARY|INCIDENT|WARNING|VIOLATION)[-\s]?(?:ACTION)?[-\s]?(?:NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[DISCIPLINE_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Disciplinary action and incident identifiers',
  validator: (_value: string, context: string) => {
    return /disciplinary|incident|warning|violation|misconduct|investigation/i.test(context);
  }
};

/**
 * Emergency Contact References
 */
export const EMERGENCY_CONTACT_REF: PIIPattern = {
  type: 'EMERGENCY_CONTACT_REF',
  regex: /\b(?:EMERGENCY[-\s]?CONTACT|ICE)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[EMERGENCY_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Emergency contact reference numbers',
  validator: (_value: string, context: string) => {
    return /emergency|contact|ice|next[-\s]?of[-\s]?kin/i.test(context);
  }
};

/**
 * Work Permit/Visa Numbers
 */
export const WORK_PERMIT: PIIPattern = {
  type: 'WORK_PERMIT',
  regex: /\b(?:WORK[-\s]?PERMIT|VISA|H1B|GREEN[-\s]?CARD|EAD)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,15})\b/gi,
  placeholder: '[WORK_PERMIT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Work permits, visas, and immigration documents'
};

/**
 * Security Clearance Levels
 */
export const SECURITY_CLEARANCE: PIIPattern = {
  type: 'SECURITY_CLEARANCE',
  regex: /\b(?:CLEARANCE|SECURITY[-\s]?LEVEL)[-\s]?[:#]?\s*(TOP[-\s]?SECRET|SECRET|CONFIDENTIAL|[A-Z]{2,3}\/SCI)\b/gi,
  placeholder: '[CLEARANCE_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Security clearance levels and classifications'
};

/**
 * Recruitment Agency References
 */
export const RECRUITER_REF: PIIPattern = {
  type: 'RECRUITER_REF',
  regex: /\b(?:RECRUITER|AGENCY)[-\s]?(?:REF|ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[RECRUITER_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Recruitment agency reference numbers',
  validator: (_value: string, context: string) => {
    return /recruiter|agency|headhunter|placement|referral/i.test(context);
  }
};

// Export all HR patterns
export const hrPatterns: PIIPattern[] = [
  EMPLOYEE_ID,
  PAYROLL_NUMBER,
  SALARY_AMOUNT,
  PERFORMANCE_REVIEW_ID,
  JOB_APPLICATION_ID,
  RESUME_ID,
  BENEFITS_PLAN_NUMBER,
  RETIREMENT_ACCOUNT,
  DIRECT_DEPOSIT_REF,
  BACKGROUND_CHECK_ID,
  DRUG_TEST_ID,
  TIMESHEET_NUMBER,
  TRAINING_CERT_ID,
  EXPENSE_REPORT_NUMBER,
  LEAVE_REQUEST_ID,
  EXIT_INTERVIEW_ID,
  DISCIPLINARY_ACTION_ID,
  EMERGENCY_CONTACT_REF,
  WORK_PERMIT,
  SECURITY_CLEARANCE,
  RECRUITER_REF
];
