/**
 * Procurement & Supply Chain Patterns
 * Detects identifiers commonly used in procurement, purchasing, and supply chain operations
 */

import { PIIPattern } from '../../types';

/**
 * Purchase Order (PO) Number
 * Format: PO-XXXXXX, PO#XXXXXX, POXXXXXX
 * Priority: 75
 */
export const PURCHASE_ORDER: PIIPattern = {
  type: 'PURCHASE_ORDER',
  regex: /\b(?:PO|Purchase\s+Order)[-#\s]?(\d{6,12})\b/gi,
  placeholder: '[PO_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Purchase order numbers',
  validator: (_value: string, context: string) => {
    return /purchase|order|procurement|buying/i.test(context);
  }
};

/**
 * Request for Quotation (RFQ) Number
 * Format: RFQ-XXXXXX, RFQ#XXXXXX
 * Priority: 70
 */
export const RFQ_NUMBER: PIIPattern = {
  type: 'RFQ_NUMBER',
  regex: /\b(?:RFQ|Request\s+for\s+Quotation)[-#\s]?(\d{6,12})\b/gi,
  placeholder: '[RFQ_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Request for Quotation reference numbers'
};

/**
 * Request for Proposal (RFP) Number
 * Format: RFP-XXXXXX, RFP#XXXXXX
 * Priority: 70
 */
export const RFP_NUMBER: PIIPattern = {
  type: 'RFP_NUMBER',
  regex: /\b(?:RFP|Request\s+for\s+Proposal)[-#\s]?(\d{6,12})\b/gi,
  placeholder: '[RFP_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Request for Proposal reference numbers'
};

/**
 * Tender Reference Number
 * Format: TN-XXXXXX, TENDER-XXXXXX, T-XXXXXX
 * Priority: 75
 */
export const TENDER_REFERENCE: PIIPattern = {
  type: 'TENDER_REFERENCE',
  regex: /\b(?:TENDER|TN|T)[-_]?\d{6,12}\b/gi,
  placeholder: '[TENDER_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Tender and bidding reference numbers',
  validator: (_value: string, context: string) => {
    return /tender|bid|bidding|procurement|competition/i.test(context);
  }
};

/**
 * Supplier/Vendor ID
 * Format: SUP-XXXXXX, VENDOR-XXXXXX, V-XXXXXX
 * Priority: 70
 */
export const SUPPLIER_ID: PIIPattern = {
  type: 'SUPPLIER_ID',
  regex: /\b(?:SUPPLIER|SUP|VENDOR|VEN)[-_]?\d{6,10}\b/gi,
  placeholder: '[SUPPLIER_ID_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Supplier and vendor identification numbers',
  validator: (_value: string, context: string) => {
    return /supplier|vendor|provider|contractor/i.test(context);
  }
};

/**
 * Contract Reference Number
 * Format: CON-XXXXXX, CONTRACT-XXXXXX, C-XXXXXX
 * Priority: 80
 */
export const CONTRACT_REFERENCE: PIIPattern = {
  type: 'CONTRACT_REFERENCE',
  regex: /\b(?:CONTRACT|CON|C)[-_]?\d{6,12}\b/gi,
  placeholder: '[CONTRACT_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Procurement contract reference numbers',
  validator: (_value: string, context: string) => {
    return /contract|agreement|procurement|supply/i.test(context);
  }
};

/**
 * Requisition Number
 * Format: REQ-XXXXXX, PR-XXXXXX (Purchase Requisition)
 * Priority: 70
 */
export const REQUISITION_NUMBER: PIIPattern = {
  type: 'REQUISITION_NUMBER',
  regex: /\b(?:REQ|REQUISITION|PR|Purchase\s+Requisition)[-#\s]?(\d{6,12})\b/gi,
  placeholder: '[REQ_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Purchase requisition numbers'
};

/**
 * Procurement Card Number (P-Card) - Last 4 digits only for security
 * Format: P-Card ending XXXX
 * Priority: 90
 */
export const PCARD_REFERENCE: PIIPattern = {
  type: 'PCARD_REFERENCE',
  regex: /\b(?:P[-\s]?Card|Procurement\s+Card).*?(?:ending|last\s+4|XXXX)[-\s]?(\d{4})\b/gi,
  placeholder: '[PCARD_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Procurement card references (partial numbers)'
};

/**
 * Catalog/Part Number
 * Format: CAT-XXXXXX, PN-XXXXXX, PART-XXXXXX
 * Priority: 60
 */
export const CATALOG_NUMBER: PIIPattern = {
  type: 'CATALOG_NUMBER',
  regex: /\b(?:CATALOG|CAT|PART|PN)[-#]?[A-Z0-9]{6,15}\b/gi,
  placeholder: '[CATALOG_{n}]',
  priority: 60,
  severity: 'low',
  description: 'Catalog and part numbers',
  validator: (_value: string, context: string) => {
    return /catalog|part|sku|item|product/i.test(context);
  }
};

/**
 * Quotation Reference
 * Format: QUO-XXXXXX, QUOTE-XXXXXX, Q-XXXXXX
 * Priority: 70
 */
export const QUOTATION_REFERENCE: PIIPattern = {
  type: 'QUOTATION_REFERENCE',
  regex: /\b(?:QUOTATION|QUOTE|QUO|Q)[-_]?\d{6,12}\b/gi,
  placeholder: '[QUOTE_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Quotation reference numbers',
  validator: (_value: string, context: string) => {
    return /quot|price|estimate|proposal/i.test(context);
  }
};

/**
 * Goods Receipt Note (GRN)
 * Format: GRN-XXXXXX, GR-XXXXXX
 * Priority: 65
 */
export const GOODS_RECEIPT: PIIPattern = {
  type: 'GOODS_RECEIPT',
  regex: /\b(?:GRN|Goods\s+Receipt)[-#\s]?(\d{6,12})\b/gi,
  placeholder: '[GRN_{n}]',
  priority: 65,
  severity: 'low',
  description: 'Goods receipt note numbers'
};

/**
 * Framework Agreement Reference
 * Format: FWK-XXXXXX, FRAMEWORK-XXXXXX
 * Priority: 75
 */
export const FRAMEWORK_AGREEMENT: PIIPattern = {
  type: 'FRAMEWORK_AGREEMENT',
  regex: /\b(?:FRAMEWORK|FWK|FA)[-_]?\d{6,12}\b/gi,
  placeholder: '[FRAMEWORK_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Framework agreement reference numbers',
  validator: (_value: string, context: string) => {
    return /framework|agreement|procurement/i.test(context);
  }
};

/**
 * Blanket Order Number
 * Format: BO-XXXXXX, BLANKET-XXXXXX
 * Priority: 70
 */
export const BLANKET_ORDER: PIIPattern = {
  type: 'BLANKET_ORDER',
  regex: /\b(?:BLANKET|BO|Blanket\s+Order)[-#\s]?(\d{6,12})\b/gi,
  placeholder: '[BLANKET_ORDER_{n}]',
  priority: 70,
  severity: 'medium',
  description: 'Blanket purchase order numbers'
};

/**
 * Export all procurement patterns
 */
export const procurementPatterns: PIIPattern[] = [
  PURCHASE_ORDER,
  RFQ_NUMBER,
  RFP_NUMBER,
  TENDER_REFERENCE,
  SUPPLIER_ID,
  CONTRACT_REFERENCE,
  REQUISITION_NUMBER,
  PCARD_REFERENCE,
  CATALOG_NUMBER,
  QUOTATION_REFERENCE,
  GOODS_RECEIPT,
  FRAMEWORK_AGREEMENT,
  BLANKET_ORDER
];
