import { describe, expect, it } from "vitest";
import {
  allPatterns,
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
  getPatternsByCategory,
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
} from "../src/patterns";

const compositeFinancial = [
  ...financialPatterns,
  ...cryptoExtendedPatterns,
  ...financeIndustryPatterns,
];

const compositeGovernment = [...governmentPatterns, ...internationalPatterns];

// Characterization: every alias must resolve exactly as the legacy switch did.
const aliasMatrix: Array<[string, ReturnType<typeof getPatternsByCategory>]> = [
  ["personal", personalPatterns],
  ["financial", compositeFinancial],
  ["crypto", compositeFinancial],
  ["cryptocurrency", compositeFinancial],
  ["government", compositeGovernment],
  ["contact", contactPatterns],
  ["network", networkPatterns],
  ["healthcare", healthcarePatterns],
  ["legal", legalPatterns],
  ["education", educationPatterns],
  ["hr", hrPatterns],
  ["recruitment", hrPatterns],
  ["credentials", technologyPatterns],
  ["technology", technologyPatterns],
  ["insurance", insurancePatterns],
  ["retail", retailPatterns],
  ["ecommerce", retailPatterns],
  ["telecoms", telecomsPatterns],
  ["telecommunications", telecomsPatterns],
  ["utilities", telecomsPatterns],
  ["manufacturing", manufacturingPatterns],
  ["transportation", transportationPatterns],
  ["automotive", transportationPatterns],
  ["media", mediaPatterns],
  ["publishing", mediaPatterns],
  ["charitable", charitablePatterns],
  ["charity", charitablePatterns],
  ["nonprofit", charitablePatterns],
  ["ngo", charitablePatterns],
  ["procurement", procurementPatterns],
  ["purchasing", procurementPatterns],
  ["supply-chain", procurementPatterns],
  ["emergency", emergencyServicesPatterns],
  ["emergency-services", emergencyServicesPatterns],
  ["public-safety", emergencyServicesPatterns],
  ["911", emergencyServicesPatterns],
  ["first-responders", emergencyServicesPatterns],
  ["digital-identity", digitalIdentityPatterns],
  ["social-media", digitalIdentityPatterns],
  ["gaming", digitalIdentityPatterns],
  ["online-identity", digitalIdentityPatterns],
  ["real-estate", realEstatePatterns],
  ["property", realEstatePatterns],
  ["realestate", realEstatePatterns],
  ["gig-economy", gigEconomyPatterns],
  ["gig", gigEconomyPatterns],
  ["rideshare", gigEconomyPatterns],
  ["delivery", gigEconomyPatterns],
  ["freelance", gigEconomyPatterns],
  ["hospitality", hospitalityPatterns],
  ["tourism", hospitalityPatterns],
  ["travel", hospitalityPatterns],
  ["hotel", hospitalityPatterns],
  ["airline", hospitalityPatterns],
  ["certifications", professionalCertificationPatterns],
  ["professional-certifications", professionalCertificationPatterns],
  ["licenses", professionalCertificationPatterns],
  ["esports", gamingPatterns],
  ["videogames", gamingPatterns],
  ["gamers", gamingPatterns],
  ["vehicles", vehiclePatterns],
  ["license-plates", vehiclePatterns],
  ["vin", vehiclePatterns],
  ["logistics", logisticsPatterns],
  ["shipping", logisticsPatterns],
  ["tracking", logisticsPatterns],
  ["freight", logisticsPatterns],
  ["aviation", aviationPatterns],
  ["flight", aviationPatterns],
  ["aircraft", aviationPatterns],
  ["maritime", maritimePatterns],
  ["vessel", maritimePatterns],
  ["marine", maritimePatterns],
  ["ship", maritimePatterns],
  ["environmental", environmentalPatterns],
  ["regulatory", environmentalPatterns],
  ["epa", environmentalPatterns],
  ["compliance", environmentalPatterns],
  ["permits", environmentalPatterns],
];

describe("getPatternsByCategory characterization", () => {
  it.each(aliasMatrix)("resolves %s", (alias, expected) => {
    expect(getPatternsByCategory(alias)).toEqual(expected);
  });

  it("returns empty array for unknown category", () => {
    expect(getPatternsByCategory("does-not-exist")).toEqual([]);
  });
});

describe("allPatterns characterization", () => {
  it("includes every category, industries and international included", () => {
    const all = new Set(allPatterns.map((p) => p.type));

    for (const patterns of [
      personalPatterns,
      financialPatterns,
      cryptoExtendedPatterns,
      governmentPatterns,
      contactPatterns,
      networkPatterns,
      healthcarePatterns,
      internationalPatterns,
      digitalIdentityPatterns,
      maritimePatterns,
      gamingPatterns,
    ]) {
      for (const p of patterns) {
        expect(all.has(p.type)).toBe(true);
      }
    }
  });
});
