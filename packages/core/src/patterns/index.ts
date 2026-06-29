/**
 * Export all pattern categories
 */

import type { PIIPattern } from "../types";
import { contactPatterns } from "./contact";
// Digital identity patterns
import { digitalIdentityPatterns } from "./digital-identity";
import { financialPatterns } from "./financial";
import { cryptoExtendedPatterns } from "./financial/crypto-extended";
import { governmentPatterns } from "./government";
import { aviationPatterns } from "./industries/aviation";
import { charitablePatterns } from "./industries/charitable";
import { educationPatterns } from "./industries/education";
import { emergencyServicesPatterns } from "./industries/emergency-services";
import { environmentalPatterns } from "./industries/environmental";
import { financialPatterns as financeIndustryPatterns } from "./industries/financial";
import { gamingPatterns } from "./industries/gaming";
import { gigEconomyPatterns } from "./industries/gig-economy";
// Industry-specific patterns
import { healthcarePatterns } from "./industries/healthcare";
import { hospitalityPatterns } from "./industries/hospitality";
import { hrPatterns } from "./industries/hr";
import { insurancePatterns } from "./industries/insurance";
import { legalPatterns } from "./industries/legal";
import { logisticsPatterns } from "./industries/logistics";
import { manufacturingPatterns } from "./industries/manufacturing";
import { maritimePatterns } from "./industries/maritime";
import { mediaPatterns } from "./industries/media";
import { procurementPatterns } from "./industries/procurement";
import { professionalCertificationPatterns } from "./industries/professional-certifications";
import { realEstatePatterns } from "./industries/real-estate";
import { retailPatterns } from "./industries/retail";
import { technologyPatterns } from "./industries/technology";
import { telecomsPatterns } from "./industries/telecoms";
import { transportationPatterns } from "./industries/transportation";
import { vehiclePatterns } from "./industries/vehicles";
// International patterns
import { internationalPatterns } from "./international";
import { networkPatterns } from "./network";
import { personalPatterns } from "./personal";

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
  ...digitalIdentityPatterns,
];

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: string): PIIPattern[] {
  switch (category) {
    case "personal":
      return personalPatterns;
    case "financial":
    case "crypto":
    case "cryptocurrency":
      return [
        ...financialPatterns,
        ...cryptoExtendedPatterns,
        ...financeIndustryPatterns,
      ];
    case "government":
      return [...governmentPatterns, ...internationalPatterns];
    case "contact":
      return contactPatterns;
    case "network":
      return networkPatterns;
    case "healthcare":
      return healthcarePatterns;
    case "legal":
      return legalPatterns;
    case "education":
      return educationPatterns;
    case "hr":
    case "recruitment":
      return hrPatterns;
    case "credentials":
    case "technology":
      return technologyPatterns;
    case "insurance":
      return insurancePatterns;
    case "retail":
    case "ecommerce":
      return retailPatterns;
    case "telecoms":
    case "telecommunications":
    case "utilities":
      return telecomsPatterns;
    case "manufacturing":
      return manufacturingPatterns;
    case "transportation":
    case "automotive":
      return transportationPatterns;
    case "media":
    case "publishing":
      return mediaPatterns;
    case "charitable":
    case "charity":
    case "nonprofit":
    case "ngo":
      return charitablePatterns;
    case "procurement":
    case "purchasing":
    case "supply-chain":
      return procurementPatterns;
    case "emergency":
    case "emergency-services":
    case "public-safety":
    case "911":
    case "first-responders":
      return emergencyServicesPatterns;
    case "digital-identity":
    case "social-media":
    case "gaming":
    case "online-identity":
      return digitalIdentityPatterns;
    case "real-estate":
    case "property":
    case "realestate":
      return realEstatePatterns;
    case "gig-economy":
    case "gig":
    case "rideshare":
    case "delivery":
    case "freelance":
      return gigEconomyPatterns;
    case "hospitality":
    case "tourism":
    case "travel":
    case "hotel":
    case "airline":
      return hospitalityPatterns;
    case "certifications":
    case "professional-certifications":
    case "licenses":
      return professionalCertificationPatterns;
    case "esports":
    case "videogames":
    case "gamers":
      return gamingPatterns;
    case "vehicles":
    case "license-plates":
    case "vin":
      return vehiclePatterns;
    case "logistics":
    case "shipping":
    case "tracking":
    case "freight":
      return logisticsPatterns;
    case "aviation":
    case "flight":
    case "aircraft":
      return aviationPatterns;
    case "maritime":
    case "vessel":
    case "marine":
    case "ship":
      return maritimePatterns;
    case "environmental":
    case "regulatory":
    case "epa":
    case "compliance":
    case "permits":
      return environmentalPatterns;
    default:
      return [];
  }
}

export {
  aviationPatterns,
  charitablePatterns,
  contactPatterns,
  cryptoExtendedPatterns,
  digitalIdentityPatterns,
  educationPatterns,
  emergencyServicesPatterns,
  environmentalPatterns,
  financeIndustryPatterns,
  financialPatterns,
  gamingPatterns,
  gigEconomyPatterns,
  governmentPatterns,
  healthcarePatterns,
  hospitalityPatterns,
  hrPatterns,
  insurancePatterns,
  internationalPatterns,
  legalPatterns,
  logisticsPatterns,
  manufacturingPatterns,
  maritimePatterns,
  mediaPatterns,
  networkPatterns,
  personalPatterns,
  procurementPatterns,
  professionalCertificationPatterns,
  realEstatePatterns,
  retailPatterns,
  technologyPatterns,
  telecomsPatterns,
  transportationPatterns,
  vehiclePatterns,
};
