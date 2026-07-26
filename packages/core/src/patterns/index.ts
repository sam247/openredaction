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
import { registerPatternCategory } from "./registry";

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
 * Default detection set: core PII categories plus credentials.
 * Industry verticals and international ID patterns are opt-in via
 * `categories` / `patterns` options.
 */
export const defaultPatterns: PIIPattern[] = [
  ...personalPatterns,
  ...financialPatterns,
  ...cryptoExtendedPatterns,
  ...governmentPatterns,
  ...contactPatterns,
  ...networkPatterns,
  ...digitalIdentityPatterns,
  ...technologyPatterns,
];

registerPatternCategory("personal", () => personalPatterns);
registerPatternCategory(
  "financial",
  () => [
    ...financialPatterns,
    ...cryptoExtendedPatterns,
    ...financeIndustryPatterns,
  ],
  ["crypto", "cryptocurrency"],
);
registerPatternCategory("government", () => [
  ...governmentPatterns,
  ...internationalPatterns,
]);
registerPatternCategory("contact", () => contactPatterns);
registerPatternCategory("network", () => networkPatterns);
registerPatternCategory("healthcare", () => healthcarePatterns);
registerPatternCategory("legal", () => legalPatterns);
registerPatternCategory("education", () => educationPatterns);
registerPatternCategory("hr", () => hrPatterns, ["recruitment"]);
registerPatternCategory("technology", () => technologyPatterns, [
  "credentials",
]);
registerPatternCategory("insurance", () => insurancePatterns);
registerPatternCategory("retail", () => retailPatterns, ["ecommerce"]);
registerPatternCategory("telecoms", () => telecomsPatterns, [
  "telecommunications",
  "utilities",
]);
registerPatternCategory("manufacturing", () => manufacturingPatterns);
registerPatternCategory("transportation", () => transportationPatterns, [
  "automotive",
]);
registerPatternCategory("media", () => mediaPatterns, ["publishing"]);
registerPatternCategory("charitable", () => charitablePatterns, [
  "charity",
  "nonprofit",
  "ngo",
]);
registerPatternCategory("procurement", () => procurementPatterns, [
  "purchasing",
  "supply-chain",
]);
registerPatternCategory("emergency-services", () => emergencyServicesPatterns, [
  "emergency",
  "public-safety",
  "911",
  "first-responders",
]);
registerPatternCategory("digital-identity", () => digitalIdentityPatterns, [
  "social-media",
  "gaming",
  "online-identity",
]);
registerPatternCategory("real-estate", () => realEstatePatterns, [
  "property",
  "realestate",
]);
registerPatternCategory("gig-economy", () => gigEconomyPatterns, [
  "gig",
  "rideshare",
  "delivery",
  "freelance",
]);
registerPatternCategory("hospitality", () => hospitalityPatterns, [
  "tourism",
  "travel",
  "hotel",
  "airline",
]);
registerPatternCategory(
  "professional-certifications",
  () => professionalCertificationPatterns,
  ["certifications", "licenses"],
);
registerPatternCategory("esports", () => gamingPatterns, [
  "videogames",
  "gamers",
]);
registerPatternCategory("vehicles", () => vehiclePatterns, [
  "license-plates",
  "vin",
]);
registerPatternCategory("logistics", () => logisticsPatterns, [
  "shipping",
  "tracking",
  "freight",
]);
registerPatternCategory("aviation", () => aviationPatterns, [
  "flight",
  "aircraft",
]);
registerPatternCategory("maritime", () => maritimePatterns, [
  "vessel",
  "marine",
  "ship",
]);
registerPatternCategory("environmental", () => environmentalPatterns, [
  "regulatory",
  "epa",
  "compliance",
  "permits",
]);

export {
  getPatternsByCategory,
  getRegisteredCategories,
  type PatternSource,
  registerPatternCategory,
} from "./registry";

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
