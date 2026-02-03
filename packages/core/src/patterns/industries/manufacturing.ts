/**
 * Manufacturing and Supply Chain Industry PII Patterns
 * For manufacturers, suppliers, logistics, inventory management
 */

import { PIIPattern } from '../../types';

/**
 * Supplier ID
 */
export const SUPPLIER_ID: PIIPattern = {
  type: 'SUPPLIER_ID',
  regex: /\bSUPP(?:LIER)?[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{2}\d{5,8})\b/gi,
  placeholder: '[SUPPLIER_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Supplier identification numbers'
};

/**
 * Part Number (with potentially sensitive pricing)
 */
export const PART_NUMBER: PIIPattern = {
  type: 'PART_NUMBER',
  regex: /\bP(?:ART)?N[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([0-9A-Z]{6,12})\b/gi,
  placeholder: '[PART_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Part numbers and component identifiers',
  validator: (_value: string, context: string) => {
    return /part|component|item|sku|product|inventory/i.test(context);
  }
};

/**
 * Purchase Order Number
 * Requires space/dash after PO prefix so "portable" etc. are not matched.
 */
export const PURCHASE_ORDER_NUMBER: PIIPattern = {
  type: 'PURCHASE_ORDER_NUMBER',
  regex: /\bP(?:URCHASE[-\s]?)?O(?:RDER)?[-\s]+(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[PO_{n}]',
  priority: 85,
  severity: 'medium',
  description: 'Purchase order numbers'
};

/**
 * Work Order Number
 */
export const WORK_ORDER_NUMBER: PIIPattern = {
  type: 'WORK_ORDER_NUMBER',
  regex: /\bW(?:ORK[-\s]?)?O(?:RDER)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[WO_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Work order numbers',
  validator: (_value: string, context: string) => {
    return /work|order|job|task|production/i.test(context);
  }
};

/**
 * Batch/Lot Number
 */
export const BATCH_LOT_NUMBER: PIIPattern = {
  type: 'BATCH_LOT_NUMBER',
  regex: /\b(?:BATCH|LOT)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[BATCH_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Batch and lot numbers for manufacturing traceability',
  validator: (_value: string, context: string) => {
    return /batch|lot|production|manufacturing|quality/i.test(context);
  }
};

/**
 * Serial Number (product/component)
 */
export const MANUFACTURING_SERIAL: PIIPattern = {
  type: 'MANUFACTURING_SERIAL',
  regex: /\b(?:SERIAL|SN)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,16})\b/gi,
  placeholder: '[SERIAL_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Product and component serial numbers',
  validator: (_value: string, context: string) => {
    return /serial|sn|product|device|unit|item/i.test(context);
  }
};

/**
 * Vendor Code
 */
export const VENDOR_CODE: PIIPattern = {
  type: 'VENDOR_CODE',
  regex: /\bVEND(?:OR)?[-\s]?(?:CODE)?[-\s]?[:#]?\s*([A-Z0-9]{4,10})\b/gi,
  placeholder: '[VENDOR_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Vendor codes and identifiers',
  validator: (_value: string, context: string) => {
    return /vendor|supplier|partner|contractor/i.test(context);
  }
};

/**
 * Bill of Materials (BOM) Number
 */
export const BOM_NUMBER: PIIPattern = {
  type: 'BOM_NUMBER',
  regex: /\bBOM[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[BOM_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Bill of materials numbers',
  validator: (_value: string, context: string) => {
    return /bom|bill|materials|assembly|component/i.test(context);
  }
};

/**
 * Quality Control Certificate Number
 */
export const QC_CERTIFICATE_NUMBER: PIIPattern = {
  type: 'QC_CERTIFICATE_NUMBER',
  regex: /\b(?:QC|QUALITY)[-\s]?(?:CERT(?:IFICATE)?)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,14})\b/gi,
  placeholder: '[QC_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Quality control certificate numbers',
  validator: (_value: string, context: string) => {
    return /quality|qc|certificate|inspection|test|compliance/i.test(context);
  }
};

/**
 * Shipping Container Number
 */
export const CONTAINER_NUMBER: PIIPattern = {
  type: 'CONTAINER_NUMBER',
  regex: /\b(?:CONTAINER|CNTR)[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z]{4}\d{7})\b/gi,
  placeholder: '[CONTAINER_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Shipping container numbers (ISO 6346 format)',
  validator: (value: string) => {
    // ISO 6346: 4 letters + 7 digits
    return /^[A-Z]{4}\d{7}$/.test(value);
  }
};

/**
 * Pallet ID
 */
export const PALLET_ID: PIIPattern = {
  type: 'PALLET_ID',
  regex: /\bPALLET[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[PALLET_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Pallet identification numbers',
  validator: (_value: string, context: string) => {
    return /pallet|shipping|warehouse|logistics/i.test(context);
  }
};

/**
 * Manufacturing Routing Number
 */
export const ROUTING_NUMBER_MFG: PIIPattern = {
  type: 'ROUTING_NUMBER_MFG',
  regex: /\bROUTING[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[ROUTING_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Manufacturing routing numbers',
  validator: (_value: string, context: string) => {
    return /routing|manufacturing|process|production|workflow/i.test(context);
  }
};

/**
 * RFQ (Request for Quote) Number
 */
export const RFQ_NUMBER: PIIPattern = {
  type: 'RFQ_NUMBER',
  regex: /\bRFQ[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[RFQ_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Request for quote numbers',
  validator: (_value: string, context: string) => {
    return /rfq|quote|quotation|request|procurement/i.test(context);
  }
};

/**
 * Project Code (internal)
 * Requires space/dash after PROJ(ECT) so "projector" etc. are not matched.
 */
export const PROJECT_CODE: PIIPattern = {
  type: 'PROJECT_CODE',
  regex: /\b(?:PROJECT|PROJ)[-\s]+(?:CODE)?[-\s]?[:#]?\s*([A-Z0-9]{4,10})\b/gi,
  placeholder: '[PROJECT_{n}]',
  priority: 70,
  severity: 'low',
  description: 'Internal project codes',
  validator: (_value: string, context: string) => {
    return /project|proj|initiative|program|code\s*[:#]/i.test(context);
  }
};

// Export all manufacturing patterns
export const manufacturingPatterns: PIIPattern[] = [
  SUPPLIER_ID,
  PART_NUMBER,
  PURCHASE_ORDER_NUMBER,
  WORK_ORDER_NUMBER,
  BATCH_LOT_NUMBER,
  MANUFACTURING_SERIAL,
  VENDOR_CODE,
  BOM_NUMBER,
  QC_CERTIFICATE_NUMBER,
  CONTAINER_NUMBER,
  PALLET_ID,
  ROUTING_NUMBER_MFG,
  RFQ_NUMBER,
  PROJECT_CODE
];
