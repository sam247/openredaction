/**
 * Charitable Sector & Non-Profit Organization Patterns
 * Detects identifiers commonly used in charities, NGOs, and non-profit organizations
 */

import { PIIPattern } from '../../types';

/**
 * Donor ID - Unique identifier for charitable donors
 * Format: DONOR-XXXXXX, D-XXXXXX, DON-XXXXXX
 * Priority: 85 (High - donor privacy is critical)
 */
export const DONOR_ID: PIIPattern = {
  type: 'DONOR_ID',
  regex: /\b(?:DONOR|DON|D)[-_]?\d{6,10}\b/gi,
  placeholder: '[DONOR_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Charitable donor identification numbers',
  validator: (_value: string, context: string) => {
    return /donor|donation|charitable|contribution|gift|philanthrop/i.test(context);
  }
};

/**
 * Donation Reference Number
 * Format: DN-XXXXXX, DONATION-XXXXXX, GIFT-XXXXXX
 * Priority: 80
 */
export const DONATION_REFERENCE: PIIPattern = {
  type: 'DONATION_REFERENCE',
  regex: /\b(?:DONATION|DN|GIFT|CONTRIB)[-_]?\d{6,12}\b/gi,
  placeholder: '[DONATION_REF_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Donation and contribution reference numbers'
};

/**
 * UK Charity Registration Number
 * Format: XXXXXXX (7 digits) or XXXXXXX-X (7 digits + check digit)
 * Priority: 75
 */
export const UK_CHARITY_NUMBER: PIIPattern = {
  type: 'UK_CHARITY_NUMBER',
  regex: /\b(?:Charity\s+(?:No|Number|Registration|Reg)\.?\s*:?\s*)?(\d{6,7}(?:-\d)?)\b/gi,
  placeholder: '[UK_CHARITY_{n}]',
  priority: 75,
  severity: 'low',
  description: 'UK charity registration numbers',
  validator: (value: string, context: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 6 && digits.length <= 8 && /charity|charitable|commission/i.test(context);
  }
};

/**
 * US EIN (Employer Identification Number) - Used by US charities/non-profits
 * Format: XX-XXXXXXX
 * Priority: 90
 */
export const US_EIN: PIIPattern = {
  type: 'US_EIN',
  regex: /\b(?:EIN|Tax\s+ID|Federal\s+Tax\s+ID)\.?\s*:?\s*(\d{2}-\d{7})\b/gi,
  placeholder: '[EIN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'US Employer Identification Numbers (nonprofit tax IDs)',
  validator: (value: string, context: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 9 && /nonprofit|charity|501\(c\)|tax[-\s]exempt|foundation/i.test(context);
  }
};

/**
 * Grant Reference Number
 * Format: GR-XXXXXX, GRANT-XXXXXX, G-XXXXXX
 * Priority: 75
 */
export const GRANT_REFERENCE: PIIPattern = {
  type: 'GRANT_REFERENCE',
  regex: /\b(?:GRANT|GR|G)[-_]?\d{6,12}\b/gi,
  placeholder: '[GRANT_REF_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Grant and funding reference numbers',
  validator: (_value: string, context: string) => {
    return /grant|funding|award|endowment|foundation/i.test(context);
  }
};

/**
 * Beneficiary ID - Identifier for aid/service recipients
 * Format: BEN-XXXXXX, BENEF-XXXXXX, B-XXXXXX
 * Priority: 90 (High - beneficiary privacy is critical)
 */
export const BENEFICIARY_ID: PIIPattern = {
  type: 'BENEFICIARY_ID',
  regex: /\b(?:BENEFICIARY|BENEF|BEN|B)[-_]?\d{6,10}\b/gi,
  placeholder: '[BENEFICIARY_ID_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Charitable beneficiary identification numbers',
  validator: (_value: string, context: string) => {
    return /beneficiary|recipient|aid|assistance|service\s+user/i.test(context);
  }
};

/**
 * Fundraising Campaign Code
 * Format: CAMP-XXXX, FC-XXXX, CAMPAIGN-XXXX
 * Priority: 60
 */
export const CAMPAIGN_CODE: PIIPattern = {
  type: 'CAMPAIGN_CODE',
  regex: /\b(?:CAMPAIGN|CAMP|FC)[-_]?[A-Z0-9]{4,12}\b/gi,
  placeholder: '[CAMPAIGN_{n}]',
  priority: 60,
  severity: 'low',
  description: 'Fundraising campaign reference codes'
};

/**
 * UK Gift Aid Declaration Reference
 * Format: GA-XXXXXX, GIFTAID-XXXXXX
 * Priority: 80
 */
export const GIFT_AID_REFERENCE: PIIPattern = {
  type: 'GIFT_AID_REFERENCE',
  regex: /\b(?:GIFT\s*AID|GA)[-_]?\d{6,10}\b/gi,
  placeholder: '[GIFT_AID_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'UK Gift Aid declaration reference numbers',
  validator: (_value: string, context: string) => {
    return /gift\s*aid|tax\s+relief|declaration/i.test(context);
  }
};

/**
 * Volunteer ID
 * Format: VOL-XXXXXX, V-XXXXXX
 * Priority: 75
 */
export const VOLUNTEER_ID: PIIPattern = {
  type: 'VOLUNTEER_ID',
  regex: /\b(?:VOLUNTEER|VOL|V)[-_]?\d{6,10}\b/gi,
  placeholder: '[VOLUNTEER_ID_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Volunteer identification numbers',
  validator: (_value: string, context: string) => {
    return /volunteer|volunteering|community\s+service/i.test(context);
  }
};

/**
 * Membership Number (Charity/Association)
 * Format: MEM-XXXXXX, MEMBER-XXXXXX, M-XXXXXX
 * Priority: 70
 */
export const MEMBERSHIP_NUMBER: PIIPattern = {
  type: 'MEMBERSHIP_NUMBER',
  regex: /\b(?:MEMBER(?:SHIP)?|MEM|M)[-_]?\d{6,10}\b/gi,
  placeholder: '[MEMBER_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Charity and association membership numbers',
  validator: (_value: string, context: string) => {
    return /member|membership|association|society|club/i.test(context);
  }
};

/**
 * Legacy/Bequest Reference
 * Format: LEG-XXXXXX, LEGACY-XXXXXX, BEQUEST-XXXXXX
 * Priority: 85
 */
export const LEGACY_REFERENCE: PIIPattern = {
  type: 'LEGACY_REFERENCE',
  regex: /\b(?:LEGACY|LEG|BEQUEST|BEQ)[-_]?\d{6,10}\b/gi,
  placeholder: '[LEGACY_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Legacy and bequest reference numbers',
  validator: (_value: string, context: string) => {
    return /legacy|bequest|will|estate|inheritance|in\s+memory/i.test(context);
  }
};

/**
 * Export all charitable patterns
 */
export const charitablePatterns: PIIPattern[] = [
  DONOR_ID,
  DONATION_REFERENCE,
  UK_CHARITY_NUMBER,
  US_EIN,
  GRANT_REFERENCE,
  BENEFICIARY_ID,
  CAMPAIGN_CODE,
  GIFT_AID_REFERENCE,
  VOLUNTEER_ID,
  MEMBERSHIP_NUMBER,
  LEGACY_REFERENCE
];
