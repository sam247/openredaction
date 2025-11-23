/**
 * Export all pattern categories
 */

import { PIIPattern } from '../types';
import { personalPatterns } from './personal';
import { financialPatterns } from './financial';
import { governmentPatterns } from './government';
import { contactPatterns } from './contact';
import { networkPatterns } from './network';

// Industry-specific patterns
import { healthcarePatterns } from './industries/healthcare';
import { financialPatterns as financeIndustryPatterns } from './industries/financial';
import { technologyPatterns } from './industries/technology';
import { legalPatterns } from './industries/legal';
import { educationPatterns } from './industries/education';
import { hrPatterns } from './industries/hr';

// International patterns
import { internationalPatterns } from './international';

/**
 * All default PII patterns
 */
export const allPatterns: PIIPattern[] = [
  ...personalPatterns,
  ...financialPatterns,
  ...governmentPatterns,
  ...contactPatterns,
  ...networkPatterns,
  ...healthcarePatterns,
  ...financeIndustryPatterns,
  ...technologyPatterns,
  ...legalPatterns,
  ...educationPatterns,
  ...hrPatterns,
  ...internationalPatterns
];

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): PIIPattern[] {
  switch (category) {
    case 'personal':
      return personalPatterns;
    case 'financial':
      return [...financialPatterns, ...financeIndustryPatterns];
    case 'government':
      return [...governmentPatterns, ...internationalPatterns];
    case 'contact':
      return contactPatterns;
    case 'network':
      return networkPatterns;
    case 'healthcare':
      return healthcarePatterns;
    case 'legal':
      return legalPatterns;
    case 'education':
      return educationPatterns;
    case 'hr':
    case 'recruitment':
      return hrPatterns;
    case 'credentials':
    case 'technology':
      return technologyPatterns;
    default:
      return [];
  }
}

export {
  personalPatterns,
  financialPatterns,
  governmentPatterns,
  contactPatterns,
  networkPatterns,
  healthcarePatterns,
  financeIndustryPatterns,
  technologyPatterns,
  legalPatterns,
  educationPatterns,
  hrPatterns,
  internationalPatterns
};
