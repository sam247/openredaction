/**
 * Financial Services and Banking PII Patterns
 * For financial data protection and compliance
 */

import { PIIPattern } from '../../types';

/**
 * SWIFT/BIC Codes
 * Format: 4 letters (bank) + 2 letters (country) + 2 chars (location) + optional 3 chars (branch)
 */
export const SWIFT_BIC: PIIPattern = {
  type: 'SWIFT_BIC',
  regex: /\b([A-Z]{6}[A-Z0-9]{2}(?:[A-Z0-9]{3})?)\b/g,
  placeholder: '[SWIFT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'SWIFT/BIC codes for international transfers',
  validator: (value: string, context: string) => {
    // Must be in financial context
    const financialContext = /swift|bic|bank|transfer|wire|international|payment/i.test(context);
    // Validate format
    const validLength = value.length === 8 || value.length === 11;
    return financialContext && validLength;
  }
};

/**
 * Transaction IDs - Various formats
 */
export const TRANSACTION_ID: PIIPattern = {
  type: 'TRANSACTION_ID',
  regex: /\b(?:TXN|TX|TRANS(?:ACTION)?)[-\s]?(?:ID|NO|NUM(?:BER)?|REF)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[TXN_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Financial transaction identifiers'
};

/**
 * Investment Account Numbers
 */
export const INVESTMENT_ACCOUNT: PIIPattern = {
  type: 'INVESTMENT_ACCOUNT',
  regex: /\b(?:ISA|SIPP|INV(?:ESTMENT)?|PENSION|401K|IRA)[-\s]?(?:ACCOUNT|ACCT|A\/C)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[INV_ACCT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Investment and pension account numbers'
};

/**
 * Wire Transfer References
 */
export const WIRE_TRANSFER_REF: PIIPattern = {
  type: 'WIRE_TRANSFER_REF',
  regex: /\b(?:WIRE|TRANSFER|REMITTANCE)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[WIRE_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Wire transfer reference numbers'
};

/**
 * Direct Debit Mandate Numbers (UK)
 */
export const DD_MANDATE: PIIPattern = {
  type: 'DD_MANDATE',
  regex: /\b(?:DD|DIRECT[-\s]?DEBIT)[-\s]?(?:MANDATE|REF(?:ERENCE)?|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,18})\b/gi,
  placeholder: '[DD_MANDATE_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Direct Debit mandate reference numbers'
};

/**
 * Cheque Numbers
 */
export const CHEQUE_NUMBER: PIIPattern = {
  type: 'CHEQUE_NUMBER',
  regex: /\b(?:CHE(?:QUE|CK))[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*(\d{6,10})\b/gi,
  placeholder: '[CHEQUE_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Cheque/check numbers',
  validator: (_value: string, context: string) => {
    return /cheque|check|payment/i.test(context);
  }
};

/**
 * Stock/Share Trading Account Numbers
 */
export const TRADING_ACCOUNT: PIIPattern = {
  type: 'TRADING_ACCOUNT',
  regex: /\b(?:TRADING|BROKERAGE|STOCK)[-\s]?(?:ACCOUNT|ACCT|A\/C)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,14})\b/gi,
  placeholder: '[TRADE_ACCT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Stock trading and brokerage account numbers'
};

/**
 * Loan Account Numbers
 */
export const LOAN_ACCOUNT: PIIPattern = {
  type: 'LOAN_ACCOUNT',
  regex: /\b(?:LOAN|MORTGAGE|CREDIT)[-\s]?(?:ACCOUNT|ACCT|A\/C)?[-\s]?(?:NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[LOAN_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Loan and mortgage account numbers'
};

/**
 * Bitcoin Addresses
 * Legacy (P2PKH): 1 + 26-35 base58 chars
 * Script (P2SH): 3 + 26-35 base58 chars
 * SegWit (Bech32): bc1 + 39-59 chars
 */
export const BITCOIN_ADDRESS: PIIPattern = {
  type: 'BITCOIN_ADDRESS',
  regex: /\b([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})\b/g,
  placeholder: '[BTC_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Bitcoin cryptocurrency addresses',
  validator: (value: string, _context: string) => {
    // Basic format validation
    if (value.startsWith('bc1')) {
      // Bech32 format
      return value.length >= 42 && value.length <= 62;
    } else {
      // Base58 format - exclude common false positives
      const hasLowercase = /[a-km-z]/.test(value);
      const hasUppercase = /[A-HJ-NP-Z]/.test(value);
      // More likely to be real if mixed case
      return hasLowercase || hasUppercase;
    }
  }
};

/**
 * Ethereum Addresses
 * Format: 0x + 40 hex characters
 */
export const ETHEREUM_ADDRESS: PIIPattern = {
  type: 'ETHEREUM_ADDRESS',
  regex: /\b(0x[a-fA-F0-9]{40})\b/g,
  placeholder: '[ETH_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Ethereum cryptocurrency addresses'
};

/**
 * Crypto Transaction Hashes
 * Bitcoin/Ethereum: 64 hex characters
 */
export const CRYPTO_TX_HASH: PIIPattern = {
  type: 'CRYPTO_TX_HASH',
  regex: /\b(?:TX|TXID|TRANSACTION[-\s]?HASH)[:\s]+([a-fA-F0-9]{64})\b/gi,
  placeholder: '[CRYPTO_TX_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Cryptocurrency transaction hashes',
  validator: (_value: string, context: string) => {
    return /crypto|bitcoin|ethereum|blockchain|transaction|tx|txid/i.test(context);
  }
};

/**
 * Payment Card Token (from payment gateways)
 */
export const PAYMENT_TOKEN: PIIPattern = {
  type: 'PAYMENT_TOKEN',
  regex: /\b(?:tok|card|pm|src)_[a-zA-Z0-9]{24,}/g,
  placeholder: '[PAY_TOKEN_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Payment gateway tokens (Stripe, etc.)'
};

/**
 * Customer ID (from payment gateways)
 */
export const PAYMENT_CUSTOMER_ID: PIIPattern = {
  type: 'PAYMENT_CUSTOMER_ID',
  regex: /\b(cus_[a-zA-Z0-9]{14,})/g,
  placeholder: '[CUST_ID_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Payment gateway customer IDs'
};

/**
 * Subscription ID (from payment gateways)
 */
export const SUBSCRIPTION_ID: PIIPattern = {
  type: 'SUBSCRIPTION_ID',
  regex: /\b(sub_[a-zA-Z0-9]{14,})/g,
  placeholder: '[SUB_ID_{n}]',
  priority: 80,
  severity: 'medium',
  description: 'Payment subscription IDs'
};

/**
 * Account Statement References
 */
export const STATEMENT_REF: PIIPattern = {
  type: 'STATEMENT_REF',
  regex: /\b(?:STATEMENT|STMT)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[STMT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Account statement reference numbers'
};

/**
 * Standing Order References
 */
export const STANDING_ORDER_REF: PIIPattern = {
  type: 'STANDING_ORDER_REF',
  regex: /\b(?:STANDING[-\s]?ORDER|SO)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{6,15})\b/gi,
  placeholder: '[SO_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Standing order reference numbers'
};

/**
 * Payment Reference Numbers (generic)
 */
export const PAYMENT_REFERENCE: PIIPattern = {
  type: 'PAYMENT_REFERENCE',
  regex: /\b(?:PAYMENT|PAY)[-\s]?(?:REF(?:ERENCE)?|NO|NUM(?:BER)?|ID)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[PAY_REF_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Generic payment reference numbers'
};

/**
 * Card Authorization Codes
 */
export const CARD_AUTH_CODE: PIIPattern = {
  type: 'CARD_AUTH_CODE',
  regex: /\b(?:AUTH(?:ORIZATION)?|APPROVAL)[-\s]?(?:CODE|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,12})\b/gi,
  placeholder: '[AUTH_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Card authorization codes',
  validator: (_value: string, context: string) => {
    return /payment|card|transaction|auth|approval/i.test(context);
  }
};

/**
 * Merchant ID
 */
export const MERCHANT_ID: PIIPattern = {
  type: 'MERCHANT_ID',
  regex: /\b(?:MERCHANT|MID)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{8,20})\b/gi,
  placeholder: '[MERCHANT_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Merchant identification numbers',
  validator: (_value: string, context: string) => {
    return /merchant|terminal|pos|payment|processor/i.test(context);
  }
};

/**
 * Terminal ID (POS)
 */
export const TERMINAL_ID: PIIPattern = {
  type: 'TERMINAL_ID',
  regex: /\b(?:TERMINAL|TID|POS)[-\s]?(?:ID|NO|NUM(?:BER)?)?[-\s]?[:#]?\s*([A-Z0-9]{6,16})\b/gi,
  placeholder: '[TERMINAL_{n}]',
  priority: 75,
  severity: 'medium',
  description: 'Point of sale terminal IDs',
  validator: (_value: string, context: string) => {
    return /terminal|pos|point.of.sale|card.reader/i.test(context);
  }
};

// Export all financial patterns
export const financialPatterns: PIIPattern[] = [
  SWIFT_BIC,
  TRANSACTION_ID,
  INVESTMENT_ACCOUNT,
  WIRE_TRANSFER_REF,
  DD_MANDATE,
  CHEQUE_NUMBER,
  TRADING_ACCOUNT,
  LOAN_ACCOUNT,
  BITCOIN_ADDRESS,
  ETHEREUM_ADDRESS,
  CRYPTO_TX_HASH,
  PAYMENT_TOKEN,
  PAYMENT_CUSTOMER_ID,
  SUBSCRIPTION_ID,
  STATEMENT_REF,
  STANDING_ORDER_REF,
  PAYMENT_REFERENCE,
  CARD_AUTH_CODE,
  MERCHANT_ID,
  TERMINAL_ID
];
