/**
 * Environmental & Regulatory Identifiers
 * EPA IDs, permits, waste tracking, environmental compliance
 */

import type { PIIPattern } from '../../types';

/**
 * EPA ID Number
 * Format: 2-letter state code + 9 alphanumeric characters
 */
export const EPA_ID_NUMBER: PIIPattern = {
  type: 'EPA_ID_NUMBER',
  regex: /\bEPA[-\s]?(?:ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{2}[A-Z0-9]{9})\b/gi,
  placeholder: '[EPA_ID_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'EPA Identification Number',
  validator: (value: string, context: string) => {
    if (value.length !== 11) return false;

    // First 2 characters should be state code
    const stateCode = value.substring(0, 2);
    const validStateCodes = /^[A-Z]{2}$/;
    if (!validStateCodes.test(stateCode)) return false;

    return /epa|environmental|hazardous|waste|rcra|generator/i.test(context);
  }
};

/**
 * NPDES Permit Number (National Pollutant Discharge Elimination System)
 * Format: 2-letter state + 7-9 alphanumeric
 */
export const NPDES_PERMIT: PIIPattern = {
  type: 'NPDES_PERMIT',
  regex: /\bNPDES[-\s]?(?:PERMIT|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{2}[A-Z0-9]{7,9})\b/gi,
  placeholder: '[NPDES_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'NPDES Permit Number',
  validator: (_value: string, context: string) => {
    return /npdes|permit|discharge|wastewater|water\s?quality/i.test(context);
  }
};

/**
 * Hazardous Waste Manifest Number
 * Format: 9 digits
 */
export const HAZARDOUS_WASTE_MANIFEST: PIIPattern = {
  type: 'HAZARDOUS_WASTE_MANIFEST',
  regex: /\b(?:MANIFEST|WASTE)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{9})\b/gi,
  placeholder: '[MANIFEST_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Hazardous Waste Manifest Number',
  validator: (value: string, context: string) => {
    if (value.length !== 9) return false;

    return /manifest|hazardous|waste|rcra|generator|transporter/i.test(context);
  }
};

/**
 * Air Quality Permit Number
 * Format: Varies by state, typically alphanumeric
 */
export const AIR_QUALITY_PERMIT: PIIPattern = {
  type: 'AIR_QUALITY_PERMIT',
  regex: /\b(?:AIR|EMISSION)[-\s]?PERMIT[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[AIR_PERMIT_{n}]',
  priority: 80,
  severity: 'low',
  description: 'Air Quality Permit Number',
  validator: (_value: string, context: string) => {
    return /air|emission|permit|quality|pollution|stack/i.test(context);
  }
};

/**
 * Water Quality Certificate Number
 * Format: Varies, typically alphanumeric
 */
export const WATER_QUALITY_CERTIFICATE: PIIPattern = {
  type: 'WATER_QUALITY_CERTIFICATE',
  regex: /\bWATER[-\s]?(?:QUALITY|CERT(?:IFICATE)?)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[WATER_CERT_{n}]',
  priority: 80,
  severity: 'low',
  description: 'Water Quality Certificate Number',
  validator: (_value: string, context: string) => {
    return /water|quality|certificate|permit|discharge|wetland/i.test(context);
  }
};

/**
 * Storm Water Permit Number
 * Format: Varies, typically alphanumeric with state prefix
 */
export const STORM_WATER_PERMIT: PIIPattern = {
  type: 'STORM_WATER_PERMIT',
  regex: /\bSTORM\s?WATER[-\s]?PERMIT[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{2}[A-Z0-9]{6,10})\b/gi,
  placeholder: '[STORM_PERMIT_{n}]',
  priority: 80,
  severity: 'low',
  description: 'Storm Water Permit Number',
  validator: (_value: string, context: string) => {
    return /storm|water|runoff|permit|npdes|swppp/i.test(context);
  }
};

/**
 * Underground Storage Tank (UST) ID
 * Format: Varies by state, typically alphanumeric
 */
export const UST_ID: PIIPattern = {
  type: 'UST_ID',
  regex: /\bUST[-\s]?(?:ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[UST_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Underground Storage Tank ID',
  validator: (_value: string, context: string) => {
    return /ust|underground|storage|tank|petroleum|fuel/i.test(context);
  }
};

/**
 * Facility ID (for environmental reporting)
 * Format: Varies, typically alphanumeric
 */
export const FACILITY_ID: PIIPattern = {
  type: 'FACILITY_ID',
  regex: /\bFACILITY[-\s]?ID[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[FACILITY_{n}]',
  priority: 75,
  severity: 'low',
  description: 'Environmental Facility ID',
  validator: (_value: string, context: string) => {
    return /facility|plant|site|environmental|epa|compliance/i.test(context);
  }
};

/**
 * Toxic Release Inventory (TRI) Facility ID
 * Format: 11 characters (typically numeric)
 */
export const TRI_FACILITY_ID: PIIPattern = {
  type: 'TRI_FACILITY_ID',
  regex: /\bTRI[-\s]?(?:FACILITY|ID)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{11})\b/gi,
  placeholder: '[TRI_FAC_{n}]',
  priority: 85,
  severity: 'low',
  description: 'TRI Facility ID Number',
  validator: (value: string, context: string) => {
    if (value.length !== 11) return false;

    return /tri|toxic\s?release|inventory|facility|epa|emissions/i.test(context);
  }
};

/**
 * Spill Report Number
 * Format: Varies, typically alphanumeric
 */
export const SPILL_REPORT_NUMBER: PIIPattern = {
  type: 'SPILL_REPORT_NUMBER',
  regex: /\bSPILL[-\s]?(?:REPORT|NO|NUM|NUMBER)[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[SPILL_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Environmental Spill Report Number',
  validator: (_value: string, context: string) => {
    return /spill|release|incident|environmental|response|cleanup/i.test(context);
  }
};

/**
 * Remediation Site ID
 * Format: Varies, typically alphanumeric
 */
export const REMEDIATION_SITE_ID: PIIPattern = {
  type: 'REMEDIATION_SITE_ID',
  regex: /\b(?:REMEDIATION|CLEANUP)[-\s]?SITE[-\s]?(?:ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[REMEDIATION_{n}]',
  priority: 80,
  severity: 'low',
  description: 'Remediation Site ID',
  validator: (_value: string, context: string) => {
    return /remediation|cleanup|site|superfund|brownfield|contamination/i.test(context);
  }
};

/**
 * Environmental Compliance Certificate Number
 * Format: Varies, typically alphanumeric
 */
export const ENVIRONMENTAL_CERTIFICATE: PIIPattern = {
  type: 'ENVIRONMENTAL_CERTIFICATE',
  regex: /\bENVIRONMENTAL[-\s]?(?:CERT(?:IFICATE)?|COMPLIANCE)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[ENV_CERT_{n}]',
  priority: 75,
  severity: 'low',
  description: 'Environmental Compliance Certificate',
  validator: (_value: string, context: string) => {
    return /environmental|compliance|certificate|permit|authorization/i.test(context);
  }
};

export const environmentalPatterns: PIIPattern[] = [
  EPA_ID_NUMBER,
  NPDES_PERMIT,
  HAZARDOUS_WASTE_MANIFEST,
  AIR_QUALITY_PERMIT,
  WATER_QUALITY_CERTIFICATE,
  STORM_WATER_PERMIT,
  UST_ID,
  FACILITY_ID,
  TRI_FACILITY_ID,
  SPILL_REPORT_NUMBER,
  REMEDIATION_SITE_ID,
  ENVIRONMENTAL_CERTIFICATE
];
