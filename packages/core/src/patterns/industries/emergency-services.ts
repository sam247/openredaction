/**
 * Emergency Services Industry PII Patterns
 * For emergency response, public safety, disaster management
 *
 * CRITICAL: These patterns handle highly sensitive emergency response data
 */

import { PIIPattern } from '../../types';

/**
 * Emergency Call Reference Number
 * Formats: Various (CAD-NNNNNN, EMG-YYYY-NNNNNN, INCIDENT-NNNNN, etc.)
 * Used by 911, 999, 112, and other emergency dispatch systems
 */
export const EMERGENCY_CALL_REF: PIIPattern = {
  type: 'EMERGENCY_CALL_REF',
  regex: /\b(?:EMERGENCY|INCIDENT|CALL|CAD|DISPATCH|EVENT)[-\s]?(?:REF|NO|NUM|NUMBER|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[EMERGENCY_REF_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Emergency services call reference numbers',
  validator: (_value: string, context: string) => {
    return /emergency|911|999|112|ambulance|fire|police|dispatch|incident|call[- ]?center/i.test(context);
  }
};

/**
 * Police Report Number
 * Format: Department-specific (PR-YYYY-NNNNNNN, RPT-NNNNNN, etc.)
 */
export const POLICE_REPORT_NUMBER: PIIPattern = {
  type: 'POLICE_REPORT_NUMBER',
  regex: /\b(?:POLICE|PR|RPT|REPORT|CASE)[-\s\u00A0]*(?:NO|NUM|NUMBER|ID)?[-\s\u00A0.:#]*((?:[A-Z]{2,4}[\s\u00A0./-]?\d{2,4}[\s\u00A0./-]?\d{4,10})|\d{4}[\s\u00A0./-]?\d{5,10})\b/gi,
  placeholder: '[POLICE_RPT_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Police report and case numbers',
  validator: (_value: string, context: string) => {
    return /police|officer|citation|arrest|detective|sheriff|trooper|constable|case[- ]?number/i.test(context);
  }
};

/**
 * Fire Incident Number
 * Format: Department-specific (FI-YYYY-NNNNN, FIRE-NNNNNN, etc.)
 */
export const FIRE_INCIDENT_NUMBER: PIIPattern = {
  type: 'FIRE_INCIDENT_NUMBER',
  regex: /\b(?:FIRE|FI|FD)[-\s\u00A0]*(?:INCIDENT|INC|NO|NUM|NUMBER|ID)?[-\s\u00A0.:#]*((?:[A-Z]{2,4}[\s\u00A0./-]?\d{2,4}[\s\u00A0./-]?\d{4,10})|\d{4}[\s\u00A0./-]?\d{4,8})\b/gi,
  placeholder: '[FIRE_INC_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Fire department incident numbers',
  validator: (_value: string, context: string) => {
    return /fire|firefighter|dept|department|incident|response|station|alarm/i.test(context);
  }
};

/**
 * Ambulance Service Call ID
 * Format: Service-specific (AMB-NNNNNN, EMS-YYYY-NNNNN, etc.)
 */
export const AMBULANCE_CALL_ID: PIIPattern = {
  type: 'AMBULANCE_CALL_ID',
  regex: /\b(?:AMBULANCE|AMB|EMS|PARAMEDIC)[-\s]?(?:CALL|ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[AMB_CALL_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Ambulance and EMS call identifiers',
  validator: (_value: string, context: string) => {
    return /ambulance|ems|paramedic|emergency[- ]?medical|transport|patient[- ]?care/i.test(context);
  }
};

/**
 * Paramedic Certification Number
 * Format: State/country-specific (NREMT-P-NNNNNN, EMT-STATE-NNNNN, etc.)
 */
export const PARAMEDIC_CERTIFICATION: PIIPattern = {
  type: 'PARAMEDIC_CERTIFICATION',
  regex: /\b(?:NREMT|EMT|PARAMEDIC)[-\s]?(?:P|B|A|I)?[-\s]?(?:CERT|LICENSE|LIC)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[PARAMEDIC_CERT_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Paramedic and EMT certification numbers',
  validator: (_value: string, context: string) => {
    return /paramedic|emt|nremt|emergency[- ]?medical[- ]?tech|certification|license|certified|medic/i.test(context);
  }
};

/**
 * Emergency Shelter Registration
 * Format: Shelter-specific (SHELTER-A-NNNNN, REG-NNNNNN, etc.)
 * Used during disasters and emergency evacuations
 */
export const EMERGENCY_SHELTER_ID: PIIPattern = {
  type: 'EMERGENCY_SHELTER_ID',
  regex: /\b(?:SHELTER|EVACUATION|REFUGE)[-\s]?(?:REG|ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{5,12})\b/gi,
  placeholder: '[SHELTER_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Emergency shelter registration identifiers',
  validator: (_value: string, context: string) => {
    return /shelter|evacuation|refuge|displaced|disaster|emergency[- ]?housing/i.test(context);
  }
};

/**
 * Disaster Victim Identification (DVI)
 * Format: International standard (DVI-YYYY-NNNNN)
 * Used in mass casualty incidents
 */
export const DISASTER_VICTIM_ID: PIIPattern = {
  type: 'DISASTER_VICTIM_ID',
  regex: /\b(?:DVI|VICTIM)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*(\d{4}[-\s]?\d{4,8})\b/gi,
  placeholder: '[DVI_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Disaster victim identification numbers',
  validator: (_value: string, context: string) => {
    return /disaster|victim|dvi|casualty|identification|mass[- ]?casualty|morgue/i.test(context);
  }
};

/**
 * Search and Rescue Mission ID
 * Format: SAR-YYYY-NNNNN, RESCUE-NNNNNN
 */
export const SEARCH_RESCUE_MISSION_ID: PIIPattern = {
  type: 'SEARCH_RESCUE_MISSION_ID',
  regex: /\b(?:SAR|SEARCH|RESCUE|MISSION)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[SAR_MISSION_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Search and rescue mission identifiers',
  validator: (_value: string, context: string) => {
    return /search|rescue|sar|mission|lost|missing|coast[- ]?guard/i.test(context);
  }
};

/**
 * Emergency Medical Incident Number
 * Format: Various (MED-NNNNNN, MI-YYYY-NNNNN)
 */
export const EMERGENCY_MEDICAL_INCIDENT: PIIPattern = {
  type: 'EMERGENCY_MEDICAL_INCIDENT',
  regex: /\b(?:MEDICAL|MED|MI)[-\s]?(?:INCIDENT|INC|EMERGENCY|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[MED_INC_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Emergency medical incident numbers',
  validator: (_value: string, context: string) => {
    return /medical|emergency|incident|patient|treatment|hospital|trauma/i.test(context);
  }
};

/**
 * Firefighter Badge Number
 * Format: Department-specific (BADGE-NNNN, FF-NNNNN)
 */
export const FIREFIGHTER_BADGE: PIIPattern = {
  type: 'FIREFIGHTER_BADGE',
  regex: /\b(?:BADGE|FF|FIREFIGHTER)[-\s]?(?:NO|NUM|NUMBER|ID)?[-\s]?[:#]?\s*(\d{3,6})\b/gi,
  placeholder: '[FF_BADGE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Firefighter badge numbers',
  validator: (_value: string, context: string) => {
    return /firefighter|fire[- ]?dept|badge|ff|station|apparatus/i.test(context);
  }
};

/**
 * Police Officer Badge Number
 * Format: Department-specific (BADGE-NNNN, SHIELD-NNNNN)
 */
export const POLICE_BADGE: PIIPattern = {
  type: 'POLICE_BADGE',
  regex: /\b(?:BADGE|SHIELD|OFFICER)[-\s]?(?:NO|NUM|NUMBER|ID)?[-\s]?[:#]?\s*(\d{3,6})\b/gi,
  placeholder: '[POLICE_BADGE_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Police officer badge numbers',
  validator: (_value: string, context: string) => {
    return /police|officer|badge|shield|dept|department|patrol/i.test(context);
  }
};

/**
 * Missing Person Case Number
 * Format: MP-YYYY-NNNNN, MISSING-NNNNNN
 */
export const MISSING_PERSON_CASE: PIIPattern = {
  type: 'MISSING_PERSON_CASE',
  regex: /\b(?:MISSING|MP|AMBER)[-\s]?(?:PERSON|CASE|ALERT)?[-\s]?(?:NO|NUMBER|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[MISSING_CASE_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Missing person case numbers',
  validator: (_value: string, context: string) => {
    return /missing|amber|alert|person|child|endangered|located|found/i.test(context);
  }
};

/**
 * 911/Emergency Dispatcher ID
 * Format: DISPATCHER-NNNNN, DISP-NNN
 */
export const DISPATCHER_ID: PIIPattern = {
  type: 'DISPATCHER_ID',
  regex: /\b(?:DISPATCHER|DISP)[-\s]?(?:ID|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{3,8})\b/gi,
  placeholder: '[DISPATCHER_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Emergency dispatcher identification numbers',
  validator: (_value: string, context: string) => {
    return /dispatcher|911|999|112|emergency|operator|call[- ]?center/i.test(context);
  }
};

/**
 * Hazmat Incident Number
 * Format: HAZMAT-YYYY-NNNNN, HM-NNNNNN
 */
export const HAZMAT_INCIDENT: PIIPattern = {
  type: 'HAZMAT_INCIDENT',
  regex: /\b(?:HAZMAT|HM)[-\s]?(?:INCIDENT|INC|NO|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[HAZMAT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Hazardous materials incident numbers',
  validator: (_value: string, context: string) => {
    return /hazmat|hazardous|material|chemical|spill|containment|decontamination/i.test(context);
  }
};

// Export all emergency services patterns
export const emergencyServicesPatterns: PIIPattern[] = [
  EMERGENCY_CALL_REF,
  POLICE_REPORT_NUMBER,
  FIRE_INCIDENT_NUMBER,
  AMBULANCE_CALL_ID,
  PARAMEDIC_CERTIFICATION,
  EMERGENCY_SHELTER_ID,
  DISASTER_VICTIM_ID,
  SEARCH_RESCUE_MISSION_ID,
  EMERGENCY_MEDICAL_INCIDENT,
  FIREFIGHTER_BADGE,
  POLICE_BADGE,
  MISSING_PERSON_CASE,
  DISPATCHER_ID,
  HAZMAT_INCIDENT
];
