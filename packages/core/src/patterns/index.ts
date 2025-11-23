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
import { insurancePatterns } from './industries/insurance';
import { retailPatterns } from './industries/retail';
import { telecomsPatterns } from './industries/telecoms';
import { manufacturingPatterns } from './industries/manufacturing';
import { transportationPatterns } from './industries/transportation';
import { mediaPatterns } from './industries/media';
import { charitablePatterns } from './industries/charitable';
import { procurementPatterns } from './industries/procurement';

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
  ...insurancePatterns,
  ...retailPatterns,
  ...telecomsPatterns,
  ...manufacturingPatterns,
  ...transportationPatterns,
  ...mediaPatterns,
  ...charitablePatterns,
  ...procurementPatterns,
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
    case 'insurance':
      return insurancePatterns;
    case 'retail':
    case 'ecommerce':
      return retailPatterns;
    case 'telecoms':
    case 'telecommunications':
    case 'utilities':
      return telecomsPatterns;
    case 'manufacturing':
      return manufacturingPatterns;
    case 'transportation':
    case 'automotive':
      return transportationPatterns;
    case 'media':
    case 'publishing':
      return mediaPatterns;
    case 'charitable':
    case 'charity':
    case 'nonprofit':
    case 'ngo':
      return charitablePatterns;
    case 'procurement':
    case 'purchasing':
    case 'supply-chain':
      return procurementPatterns;
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
  insurancePatterns,
  retailPatterns,
  telecomsPatterns,
  manufacturingPatterns,
  transportationPatterns,
  mediaPatterns,
  charitablePatterns,
  procurementPatterns,
  internationalPatterns
};
