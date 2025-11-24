/**
 * Logistics and Shipping Identifiers
 * Tracking numbers, container numbers, bill of lading
 */

import type { PIIPattern } from '../../types';

/**
 * FedEx Tracking Number
 * Format: 12 digits or 15 digits, or 20 digits (SmartPost)
 */
export const FEDEX_TRACKING: PIIPattern = {
  type: 'FEDEX_TRACKING',
  regex: /\b(?:FEDEX|FDX)[-\s]?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{12}|\d{15}|\d{20})\b/gi,
  placeholder: '[FEDEX_TRACK_{n}]',
  priority: 85,
  severity: 'low',
  description: 'FedEx tracking number',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 12 && len !== 15 && len !== 20) return false;

    return /fedex|fed\s?ex|fdx|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * UPS Tracking Number
 * Format: 1Z + 16 characters
 */
export const UPS_TRACKING: PIIPattern = {
  type: 'UPS_TRACKING',
  regex: /\b(?:UPS[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*(1Z[A-Z0-9]{16})\b/gi,
  placeholder: '[UPS_TRACK_{n}]',
  priority: 90,
  severity: 'low',
  description: 'UPS tracking number',
  validator: (value: string, context: string) => {
    if (!value.startsWith('1Z')) return false;
    if (value.length !== 18) return false;

    return /ups|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * USPS Tracking Number
 * Format: Various formats (20-22 digits)
 */
export const USPS_TRACKING: PIIPattern = {
  type: 'USPS_TRACKING',
  regex: /\b(?:USPS|US\s?MAIL)[-\s]?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{20,22}|[A-Z]{2}\d{9}US)\b/gi,
  placeholder: '[USPS_TRACK_{n}]',
  priority: 85,
  severity: 'low',
  description: 'USPS tracking number',
  validator: (value: string, context: string) => {
    // USPS Priority Mail: starts with 9 and 20-22 digits
    // USPS Certified Mail: 20 digits
    // USPS International: 13 chars with US suffix
    if (value.includes('US')) {
      return value.length === 13 && /^[A-Z]{2}\d{9}US$/.test(value);
    }

    const len = value.length;
    if (len < 20 || len > 22) return false;

    return /usps|us\s?mail|postal|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * DHL Tracking Number
 * Format: 10-11 digits
 */
export const DHL_TRACKING: PIIPattern = {
  type: 'DHL_TRACKING',
  regex: /\b(?:DHL[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{10,11})\b/gi,
  placeholder: '[DHL_TRACK_{n}]',
  priority: 85,
  severity: 'low',
  description: 'DHL tracking number',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 10 && len !== 11) return false;

    return /dhl|tracking|shipment|package|delivery|express/i.test(context);
  }
};

/**
 * Amazon Tracking (TBA)
 * Format: TBA + 12 digits
 */
export const AMAZON_TRACKING: PIIPattern = {
  type: 'AMAZON_TRACKING',
  regex: /\b(TBA\d{12})\b/gi,
  placeholder: '[AMAZON_TRACK_{n}]',
  priority: 90,
  severity: 'low',
  description: 'Amazon tracking number',
  validator: (value: string, _context: string) => {
    return value.startsWith('TBA') && value.length === 15;
  }
};

/**
 * TNT Express Tracking Number
 * Format: 9 digits or 13 alphanumeric
 */
export const TNT_TRACKING: PIIPattern = {
  type: 'TNT_TRACKING',
  regex: /\b(?:TNT[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{9}|[A-Z0-9]{13})\b/gi,
  placeholder: '[TNT_TRACK_{n}]',
  priority: 85,
  severity: 'low',
  description: 'TNT Express tracking number',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 9 && len !== 13) return false;

    return /tnt|tracking|shipment|package|delivery|express/i.test(context);
  }
};

/**
 * China Post Tracking Number
 * Format: 13 characters (starts with R or C, ends with CN)
 */
export const CHINA_POST_TRACKING: PIIPattern = {
  type: 'CHINA_POST_TRACKING',
  regex: /\b(?:CHINA\s?POST[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([RC][A-Z]\d{9}CN)\b/gi,
  placeholder: '[CHINA_POST_{n}]',
  priority: 85,
  severity: 'low',
  description: 'China Post tracking number',
  validator: (value: string, context: string) => {
    if (value.length !== 13) return false;
    if (!value.endsWith('CN')) return false;
    if (!/^[RC]/.test(value)) return false;

    return /china\s?post|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * Japan Post Tracking Number
 * Format: 13 characters (2 letters + 9 digits + JP)
 */
export const JAPAN_POST_TRACKING: PIIPattern = {
  type: 'JAPAN_POST_TRACKING',
  regex: /\b(?:JAPAN\s?POST[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{2}\d{9}JP)\b/gi,
  placeholder: '[JAPAN_POST_{n}]',
  priority: 85,
  severity: 'low',
  description: 'Japan Post tracking number',
  validator: (value: string, context: string) => {
    if (value.length !== 13) return false;
    if (!value.endsWith('JP')) return false;

    return /japan\s?post|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * Royal Mail Tracking Number (UK)
 * Format: 13 characters (2 letters + 9 digits + GB)
 */
export const ROYAL_MAIL_TRACKING: PIIPattern = {
  type: 'ROYAL_MAIL_TRACKING',
  regex: /\b(?:ROYAL\s?MAIL[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{2}\d{9}GB)\b/gi,
  placeholder: '[ROYAL_MAIL_{n}]',
  priority: 85,
  severity: 'low',
  description: 'Royal Mail tracking number',
  validator: (value: string, context: string) => {
    if (value.length !== 13) return false;
    if (!value.endsWith('GB')) return false;

    return /royal\s?mail|tracking|shipment|package|delivery|post\s?office/i.test(context);
  }
};

/**
 * Canada Post Tracking Number
 * Format: 16 digits
 */
export const CANADA_POST_TRACKING: PIIPattern = {
  type: 'CANADA_POST_TRACKING',
  regex: /\b(?:CANADA\s?POST[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{16})\b/gi,
  placeholder: '[CANADA_POST_{n}]',
  priority: 85,
  severity: 'low',
  description: 'Canada Post tracking number',
  validator: (value: string, context: string) => {
    if (value.length !== 16) return false;

    return /canada\s?post|tracking|shipment|package|delivery|postes|canada/i.test(context);
  }
};

/**
 * Australia Post Tracking Number
 * Format: 13 characters (2 letters + 9 digits + AU)
 */
export const AUSTRALIA_POST_TRACKING: PIIPattern = {
  type: 'AUSTRALIA_POST_TRACKING',
  regex: /\b(?:AUSTRALIA\s?POST[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z]{2}\d{9}AU)\b/gi,
  placeholder: '[AUSTRALIA_POST_{n}]',
  priority: 85,
  severity: 'low',
  description: 'Australia Post tracking number',
  validator: (value: string, context: string) => {
    if (value.length !== 13) return false;
    if (!value.endsWith('AU')) return false;

    return /australia\s?post|aus\s?post|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * Purolator Tracking Number (Canada)
 * Format: 12 digits or PIN format
 */
export const PUROLATOR_TRACKING: PIIPattern = {
  type: 'PUROLATOR_TRACKING',
  regex: /\b(?:PUROLATOR[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER|PIN)?[-\s]?[:#]?\s*(\d{12}|P\d{10})\b/gi,
  placeholder: '[PUROLATOR_{n}]',
  priority: 85,
  severity: 'low',
  description: 'Purolator tracking number',
  validator: (value: string, context: string) => {
    if (value.startsWith('P')) {
      return value.length === 11;
    }
    if (value.length !== 12) return false;

    return /purolator|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * OnTrac Tracking Number
 * Format: C + 14 digits
 */
export const ONTRAC_TRACKING: PIIPattern = {
  type: 'ONTRAC_TRACKING',
  regex: /\b(?:ONTRAC|ON\s?TRAC|LASERSHIP)[-\s]?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*(C\d{14})\b/gi,
  placeholder: '[ONTRAC_{n}]',
  priority: 85,
  severity: 'low',
  description: 'OnTrac/LaserShip tracking number',
  validator: (value: string, context: string) => {
    if (!value.startsWith('C')) return false;
    if (value.length !== 15) return false;

    return /ontrac|on\s?trac|lasership|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * GLS Tracking Number (Europe)
 * Format: Various formats, typically 11-13 digits
 */
export const GLS_TRACKING: PIIPattern = {
  type: 'GLS_TRACKING',
  regex: /\b(?:GLS[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{11,13})\b/gi,
  placeholder: '[GLS_{n}]',
  priority: 80,
  severity: 'low',
  description: 'GLS tracking number (Europe)',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len < 11 || len > 13) return false;

    return /gls|general\s?logistics|tracking|shipment|package|delivery/i.test(context);
  }
};

/**
 * Aramex Tracking Number (Middle East)
 * Format: 11-12 digits
 */
export const ARAMEX_TRACKING: PIIPattern = {
  type: 'ARAMEX_TRACKING',
  regex: /\b(?:ARAMEX[-\s]?)?(?:TRACK(?:ING)?|NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{11,12})\b/gi,
  placeholder: '[ARAMEX_{n}]',
  priority: 85,
  severity: 'low',
  description: 'Aramex tracking number',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 11 && len !== 12) return false;

    return /aramex|tracking|shipment|package|delivery|express/i.test(context);
  }
};

/**
 * Generic Tracking Number
 * Fallback for other carriers
 */
export const GENERIC_TRACKING_NUMBER: PIIPattern = {
  type: 'GENERIC_TRACKING_NUMBER',
  regex: /\b(?:TRACK(?:ING)?|SHIPMENT|PACKAGE)[-\s]?(?:ID|NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{10,25})\b/gi,
  placeholder: '[TRACKING_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Generic tracking number',
  validator: (value: string, context: string) => {
    // Must be in shipping context
    if (!/track|ship|package|delivery|carrier|freight/i.test(context)) {
      return false;
    }

    // Reasonable length for tracking numbers
    const len = value.length;
    return len >= 10 && len <= 25;
  }
};

/**
 * Bill of Lading (BOL)
 * Format: Varies, typically alphanumeric
 */
export const BILL_OF_LADING: PIIPattern = {
  type: 'BILL_OF_LADING',
  regex: /\b(?:BOL|B\/L|BILL\s?OF\s?LADING)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*([A-Z0-9]{6,20})\b/gi,
  placeholder: '[BOL_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Bill of Lading number',
  validator: (_value: string, context: string) => {
    return /bill\s?of\s?lading|bol|b\/l|shipping|freight|cargo|shipment/i.test(context);
  }
};

/**
 * Container Number (Shipping Container)
 * Format: 4 letters + 7 digits (ISO 6346)
 */
export const SHIPPING_CONTAINER_NUMBER: PIIPattern = {
  type: 'SHIPPING_CONTAINER_NUMBER',
  regex: /\b([A-Z]{4}\d{7})\b/g,
  placeholder: '[CONTAINER_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Shipping container number (ISO 6346)',
  validator: (value: string, context: string) => {
    // ISO 6346 format: 3 letters (owner) + U/J/Z + 6 digits + check digit
    if (!/^[A-Z]{3}[UJZ]\d{7}$/.test(value)) return false;

    return /container|shipping|freight|cargo|iso\s?6346/i.test(context);
  }
};

/**
 * Air Waybill (AWB) Number
 * Format: 3 digits (airline code) + 8 digits
 */
export const AIR_WAYBILL_NUMBER: PIIPattern = {
  type: 'AIR_WAYBILL_NUMBER',
  regex: /\b(?:AWB|AIR\s?WAYBILL)[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{3}[-\s]?\d{8})\b/gi,
  placeholder: '[AWB_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Air Waybill number',
  validator: (value: string, context: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) return false;

    return /awb|air\s?waybill|air\s?freight|cargo|shipment/i.test(context);
  }
};

/**
 * Pro Number (Freight)
 * Format: Varies, typically 9-10 digits
 */
export const PRO_NUMBER: PIIPattern = {
  type: 'PRO_NUMBER',
  regex: /\bPRO[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{9,10})\b/gi,
  placeholder: '[PRO_{n}]',
  priority: 85,
  severity: 'low',
  description: 'PRO number (freight)',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 9 && len !== 10) return false;

    return /pro\s?number|freight|ltl|shipment|carrier/i.test(context);
  }
};

/**
 * Master Airway Bill (MAWB)
 * Format: 3 digits + 8 digits
 */
export const MASTER_AIRWAY_BILL: PIIPattern = {
  type: 'MASTER_AIRWAY_BILL',
  regex: /\bMAWB[-\s]?(?:NO|NUM|NUMBER)?[-\s]?[:#]?\s*(\d{3}[-\s]?\d{8})\b/gi,
  placeholder: '[MAWB_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Master Airway Bill',
  validator: (value: string, context: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 11) return false;

    return /mawb|master\s?airway|consolidation|freight|cargo/i.test(context);
  }
};

export const logisticsPatterns: PIIPattern[] = [
  FEDEX_TRACKING,
  UPS_TRACKING,
  USPS_TRACKING,
  DHL_TRACKING,
  AMAZON_TRACKING,
  TNT_TRACKING,
  CHINA_POST_TRACKING,
  JAPAN_POST_TRACKING,
  ROYAL_MAIL_TRACKING,
  CANADA_POST_TRACKING,
  AUSTRALIA_POST_TRACKING,
  PUROLATOR_TRACKING,
  ONTRAC_TRACKING,
  GLS_TRACKING,
  ARAMEX_TRACKING,
  GENERIC_TRACKING_NUMBER,
  BILL_OF_LADING,
  SHIPPING_CONTAINER_NUMBER,
  AIR_WAYBILL_NUMBER,
  PRO_NUMBER,
  MASTER_AIRWAY_BILL
];
