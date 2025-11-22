/**
 * OpenRedact - Production-ready PII detection and redaction library
 * @packageDocumentation
 */

export { OpenRedact } from './detector';

export type {
  PIIPattern,
  PIIDetection,
  DetectionResult,
  OpenRedactOptions,
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
