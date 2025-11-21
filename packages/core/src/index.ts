/**
 * PII Shield - Production-ready PII detection and redaction library
 * @packageDocumentation
 */

export { PIIShield } from './detector';

export type {
  PIIPattern,
  PIIDetection,
  DetectionResult,
  PIIShieldOptions,
  Validator
} from './types';

export {
  allPatterns,
  personalPatterns,
  financialPatterns,
  governmentPatterns,
  contactPatterns,
  networkPatterns,
  getPatternsByCategory
} from './patterns';

export {
  validateLuhn,
  validateIBAN,
  validateNINO,
  validateNHS,
  validateUKPassport,
  validateSSN,
  validateSortCode,
  validateName,
  validateEmail
} from './validators';

export { gdprPreset, hipaaPreset, ccpaPreset, getPreset } from './utils/presets';
