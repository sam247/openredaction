/**
 * Export all pattern categories
 */

import { PIIPattern } from '../types';
import { personalPatterns } from './personal';
import { financialPatterns } from './financial';
import { governmentPatterns } from './government';
import { contactPatterns } from './contact';
import { networkPatterns } from './network';

/**
 * All default PII patterns
 */
export const allPatterns: PIIPattern[] = [
  ...personalPatterns,
  ...financialPatterns,
  ...governmentPatterns,
  ...contactPatterns,
  ...networkPatterns
];

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): PIIPattern[] {
  switch (category) {
    case 'personal':
      return personalPatterns;
    case 'financial':
      return financialPatterns;
    case 'government':
      return governmentPatterns;
    case 'contact':
      return contactPatterns;
    case 'network':
      return networkPatterns;
    default:
      return [];
  }
}

export {
  personalPatterns,
  financialPatterns,
  governmentPatterns,
  contactPatterns,
  networkPatterns
};
