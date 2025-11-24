/**
 * Extended Cryptocurrency Address Patterns
 * Additional Layer-1 blockchain addresses beyond BTC, ETH, LTC
 */

import { PIIPattern } from '../../types';

/**
 * Solana (SOL) Address
 * Format: Base58, 32-44 characters
 * Starts with 1-9 or A-H
 */
export const SOLANA_ADDRESS: PIIPattern = {
  type: 'SOLANA_ADDRESS',
  regex: /\b([1-9A-HJ-NP-Za-km-z]{32,44})\b/g,
  placeholder: '[SOL_ADDR_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Solana (SOL) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Length validation
    if (value.length < 32 || value.length > 44) return false;

    // Must have crypto/Solana context
    if (!/solana|sol|crypto|wallet|blockchain|address/i.test(context)) {
      return false;
    }

    // Exclude other crypto formats
    if (/^(bc1|1|3|0x|L|M|D|X|r|cosmos|tz|addr)/.test(value)) {
      return false;
    }

    return true;
  }
};

/**
 * Polkadot (DOT) Address
 * Format: SS58 format, starts with 1
 * 47-48 characters
 */
export const POLKADOT_ADDRESS: PIIPattern = {
  type: 'POLKADOT_ADDRESS',
  regex: /\b(1[1-9A-HJ-NP-Za-km-z]{46,47})\b/g,
  placeholder: '[DOT_ADDR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Polkadot (DOT) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Length validation
    if (value.length < 47 || value.length > 48) return false;

    // Must start with 1
    if (!value.startsWith('1')) return false;

    // Must have crypto/Polkadot context
    return /polkadot|dot|crypto|wallet|blockchain|substrate|address/i.test(context);
  }
};

/**
 * Avalanche (AVAX) Address
 * Format: 43 characters, prefixed with X-, P-, or C-
 * Example: X-avax1... or P-avax1... or C-0x...
 */
export const AVALANCHE_ADDRESS: PIIPattern = {
  type: 'AVALANCHE_ADDRESS',
  regex: /\b([XPC]-(?:avax)?[a-z0-9]{38,43})\b/gi,
  placeholder: '[AVAX_ADDR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Avalanche (AVAX) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Must start with X-, P-, or C-
    if (!/^[XPC]-/.test(value)) return false;

    // Length validation (with prefix)
    if (value.length < 40 || value.length > 46) return false;

    // Must have crypto/Avalanche context
    return /avalanche|avax|crypto|wallet|blockchain|address/i.test(context);
  }
};

/**
 * Cosmos (ATOM) Address
 * Format: Bech32 format, starts with "cosmos1"
 * 39-45 characters total
 */
export const COSMOS_ADDRESS: PIIPattern = {
  type: 'COSMOS_ADDRESS',
  regex: /\b(cosmos1[a-z0-9]{38,44})\b/g,
  placeholder: '[ATOM_ADDR_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Cosmos (ATOM) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Must start with cosmos1
    if (!value.startsWith('cosmos1')) return false;

    // Length validation
    if (value.length < 39 || value.length > 45) return false;

    // Must have crypto/Cosmos context
    return /cosmos|atom|crypto|wallet|blockchain|ibc|address/i.test(context);
  }
};

/**
 * Algorand (ALGO) Address
 * Format: Base32, 58 characters
 * Uppercase letters and numbers
 */
export const ALGORAND_ADDRESS: PIIPattern = {
  type: 'ALGORAND_ADDRESS',
  regex: /\b([A-Z2-7]{58})\b/g,
  placeholder: '[ALGO_ADDR_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Algorand (ALGO) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Must be exactly 58 characters
    if (value.length !== 58) return false;

    // Must be all uppercase Base32 (A-Z, 2-7)
    if (!/^[A-Z2-7]+$/.test(value)) return false;

    // Must have crypto/Algorand context
    return /algorand|algo|crypto|wallet|blockchain|address/i.test(context);
  }
};

/**
 * Tezos (XTZ) Address
 * Format: Base58check, starts with "tz"
 * 36 characters total (tz1/tz2/tz3 + 33 chars)
 */
export const TEZOS_ADDRESS: PIIPattern = {
  type: 'TEZOS_ADDRESS',
  regex: /\b(tz[123][1-9A-HJ-NP-Za-km-z]{33})\b/g,
  placeholder: '[XTZ_ADDR_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Tezos (XTZ) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Must start with tz1, tz2, or tz3
    if (!/^tz[123]/.test(value)) return false;

    // Must be exactly 36 characters
    if (value.length !== 36) return false;

    // Must have crypto/Tezos context
    return /tezos|xtz|crypto|wallet|blockchain|address/i.test(context);
  }
};

/**
 * Polygon (MATIC) Address
 * Format: Ethereum-compatible (0x + 40 hex chars)
 * Note: Same format as Ethereum, requires Polygon context
 */
export const POLYGON_ADDRESS: PIIPattern = {
  type: 'POLYGON_ADDRESS',
  regex: /\b(0x[a-fA-F0-9]{40})\b/g,
  placeholder: '[MATIC_ADDR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Polygon (MATIC) cryptocurrency address',
  validator: (value: string, context: string) => {
    // Must start with 0x and be 42 chars total
    if (!value.startsWith('0x') || value.length !== 42) return false;

    // MUST have Polygon/MATIC context to differentiate from ETH
    return /polygon|matic|crypto|wallet|blockchain|address/i.test(context);
  }
};

/**
 * Binance Smart Chain (BNB) Address
 * Format: Ethereum-compatible (0x + 40 hex chars)
 * Note: Same format as Ethereum, requires BSC context
 */
export const BINANCE_CHAIN_ADDRESS: PIIPattern = {
  type: 'BINANCE_CHAIN_ADDRESS',
  regex: /\b(0x[a-fA-F0-9]{40})\b/g,
  placeholder: '[BNB_ADDR_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Binance Smart Chain (BNB) address',
  validator: (value: string, context: string) => {
    // Must start with 0x and be 42 chars total
    if (!value.startsWith('0x') || value.length !== 42) return false;

    // MUST have Binance/BNB/BSC context to differentiate from ETH
    return /binance|bnb|bsc|smart[- ]?chain|crypto|wallet|blockchain|address/i.test(context);
  }
};

/**
 * Near Protocol (NEAR) Address
 * Format: account.near (human-readable) or hex (64 chars)
 * Example: user.near or abc123...
 */
export const NEAR_ADDRESS: PIIPattern = {
  type: 'NEAR_ADDRESS',
  regex: /\b([a-z0-9_-]{2,64}\.near)\b/gi,
  placeholder: '[NEAR_ADDR_{n}]',
  priority: 80,
  severity: 'high',
  description: 'Near Protocol (NEAR) address',
  validator: (value: string, context: string) => {
    // Must end with .near
    if (!value.toLowerCase().endsWith('.near')) return false;

    // Must have crypto/Near context
    return /near|protocol|crypto|wallet|blockchain|address/i.test(context);
  }
};

// Export all extended crypto patterns
export const cryptoExtendedPatterns: PIIPattern[] = [
  SOLANA_ADDRESS,
  POLKADOT_ADDRESS,
  AVALANCHE_ADDRESS,
  COSMOS_ADDRESS,
  ALGORAND_ADDRESS,
  TEZOS_ADDRESS,
  POLYGON_ADDRESS,
  BINANCE_CHAIN_ADDRESS,
  NEAR_ADDRESS
];
