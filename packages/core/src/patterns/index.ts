/**
 * Export all pattern categories
 */

import { PIIPattern } from '../types';
import { personalPatterns } from './personal';
import { financialPatterns } from './financial';
import { governmentPatterns } from './government';
import { contactPatterns } from './contact';
import { networkPatterns } from './network';
import { cryptoExtendedPatterns } from './financial/crypto-extended';

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
import { emergencyServicesPatterns } from './industries/emergency-services';
import { realEstatePatterns } from './industries/real-estate';
import { gigEconomyPatterns } from './industries/gig-economy';
import { hospitalityPatterns } from './industries/hospitality';
import { professionalCertificationPatterns } from './industries/professional-certifications';
import { gamingPatterns } from './industries/gaming';
import { vehiclePatterns } from './industries/vehicles';
import { logisticsPatterns } from './industries/logistics';
import { aviationPatterns } from './industries/aviation';
import { maritimePatterns } from './industries/maritime';
import { environmentalPatterns } from './industries/environmental';

// International patterns
import { internationalPatterns } from './international';

// Digital identity patterns
import { digitalIdentityPatterns } from './digital-identity';

/**
 * All default PII patterns
 */
export const allPatterns: PIIPattern[] = [
  ...personalPatterns,
  ...financialPatterns,
  ...cryptoExtendedPatterns,
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
  ...realEstatePatterns,
  ...gigEconomyPatterns,
  ...hospitalityPatterns,
  ...professionalCertificationPatterns,
  ...gamingPatterns,
  ...vehiclePatterns,
  ...logisticsPatterns,
  ...aviationPatterns,
  ...maritimePatterns,
  ...environmentalPatterns,
  ...telecomsPatterns,
  ...manufacturingPatterns,
  ...transportationPatterns,
  ...mediaPatterns,
  ...charitablePatterns,
  ...procurementPatterns,
  ...emergencyServicesPatterns,
  ...internationalPatterns,
  ...digitalIdentityPatterns
];

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): PIIPattern[] {
  switch (category) {
    case 'personal':
      return personalPatterns;
    case 'financial':
    case 'crypto':
    case 'cryptocurrency':
      return [...financialPatterns, ...cryptoExtendedPatterns, ...financeIndustryPatterns];
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
    case 'emergency':
    case 'emergency-services':
    case 'public-safety':
    case '911':
    case 'first-responders':
      return emergencyServicesPatterns;
    case 'digital-identity':
    case 'social-media':
    case 'gaming':
    case 'online-identity':
      return digitalIdentityPatterns;
    case 'real-estate':
    case 'property':
    case 'realestate':
      return realEstatePatterns;
    case 'gig-economy':
    case 'gig':
    case 'rideshare':
    case 'delivery':
    case 'freelance':
      return gigEconomyPatterns;
    case 'hospitality':
    case 'tourism':
    case 'travel':
    case 'hotel':
    case 'airline':
      return hospitalityPatterns;
    case 'certifications':
    case 'professional-certifications':
    case 'licenses':
      return professionalCertificationPatterns;
    case 'esports':
    case 'videogames':
    case 'gamers':
      return gamingPatterns;
    case 'vehicles':
    case 'license-plates':
    case 'vin':
      return vehiclePatterns;
    case 'logistics':
    case 'shipping':
    case 'tracking':
    case 'freight':
      return logisticsPatterns;
    case 'aviation':
    case 'flight':
    case 'aircraft':
      return aviationPatterns;
    case 'maritime':
    case 'vessel':
    case 'marine':
    case 'ship':
      return maritimePatterns;
    case 'environmental':
    case 'regulatory':
    case 'epa':
    case 'compliance':
    case 'permits':
      return environmentalPatterns;
    default:
      return [];
  }
}

export {
  personalPatterns,
  financialPatterns,
  cryptoExtendedPatterns,
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
  realEstatePatterns,
  gigEconomyPatterns,
  hospitalityPatterns,
  professionalCertificationPatterns,
  gamingPatterns,
  vehiclePatterns,
  logisticsPatterns,
  aviationPatterns,
  maritimePatterns,
  environmentalPatterns,
  telecomsPatterns,
  manufacturingPatterns,
  transportationPatterns,
  mediaPatterns,
  charitablePatterns,
  procurementPatterns,
  emergencyServicesPatterns,
  internationalPatterns,
  digitalIdentityPatterns
};
