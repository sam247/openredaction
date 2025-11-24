/**
 * Latin American National IDs
 * Government identification numbers for Latin American countries
 */

import type { PIIPattern } from '../../types';

/**
 * Argentina DNI (Documento Nacional de Identidad)
 * Format: 7-8 digits
 */
export const ARGENTINA_DNI: PIIPattern = {
  type: 'ARGENTINA_DNI',
  regex: /\b(\d{7,8})\b/g,
  placeholder: '[AR_DNI_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Argentina National ID (DNI)',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len !== 7 && len !== 8) return false;

    return /argentina|argentin|dni|documento\s?nacional|identidad/i.test(context);
  }
};

/**
 * Argentina CUIT/CUIL (Tax ID)
 * Format: XX-XXXXXXXX-X (11 digits with check digit)
 */
export const ARGENTINA_CUIT: PIIPattern = {
  type: 'ARGENTINA_CUIT',
  regex: /\b(\d{2}-\d{8}-\d{1})\b/g,
  placeholder: '[AR_CUIT_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Argentina CUIT/CUIL (Tax ID)',
  validator: (value: string, context: string) => {
    const digits = value.replace(/-/g, '');
    if (digits.length !== 11) return false;

    return /argentina|cuit|cuil|tax|impuesto|tributario/i.test(context);
  }
};

/**
 * Chile RUT (Rol Único Tributario)
 * Format: XX.XXX.XXX-X (8-9 digits + check digit K or 0-9)
 */
export const CHILE_RUT: PIIPattern = {
  type: 'CHILE_RUT',
  regex: /\b(\d{1,2}\.\d{3}\.\d{3}-[\dKk])\b/g,
  placeholder: '[CL_RUT_{n}]',
  priority: 95,
  severity: 'high',
  description: 'Chile RUT (National ID/Tax ID)',
  validator: (value: string, context: string) => {
    // Remove formatting
    const clean = value.replace(/[.\-]/g, '');

    // Must be 8-9 digits + check digit
    if (clean.length < 8 || clean.length > 9) return false;

    // Check digit validation (Modulo 11)
    const body = clean.slice(0, -1);
    const checkDigit = clean.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const remainder = sum % 11;
    const expectedCheck = remainder === 0 ? '0' : remainder === 1 ? 'K' : String(11 - remainder);

    if (checkDigit !== expectedCheck) return false;

    return /chile|chilean|rut|rol\s?único|tributario|cédula/i.test(context);
  }
};

/**
 * Colombia Cédula de Ciudadanía
 * Format: 6-10 digits
 */
export const COLOMBIA_CEDULA: PIIPattern = {
  type: 'COLOMBIA_CEDULA',
  regex: /\b(?:CC|CÉDULA|CEDULA)[-\s]?(?:NO|NUM)?[-\s]?[:#]?\s*(\d{6,10})\b/gi,
  placeholder: '[CO_CC_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Colombia Cédula de Ciudadanía',
  validator: (value: string, context: string) => {
    const len = value.length;
    if (len < 6 || len > 10) return false;

    return /colombia|colombian|cédula|cedula|ciudadanía|cc\s/i.test(context);
  }
};

/**
 * Colombia NIT (Tax ID for companies)
 * Format: 9 digits + check digit
 */
export const COLOMBIA_NIT: PIIPattern = {
  type: 'COLOMBIA_NIT',
  regex: /\bNIT[-\s]?(?:NO|NUM)?[-\s]?[:#]?\s*(\d{9}-\d{1})\b/gi,
  placeholder: '[CO_NIT_{n}]',
  priority: 85,
  severity: 'high',
  description: 'Colombia NIT (Tax ID)',
  validator: (value: string, context: string) => {
    const digits = value.replace(/-/g, '');
    if (digits.length !== 10) return false;

    return /colombia|nit|tax|impuesto|tributario|empresa/i.test(context);
  }
};

/**
 * Peru DNI (Documento Nacional de Identidad)
 * Format: 8 digits
 */
export const PERU_DNI: PIIPattern = {
  type: 'PERU_DNI',
  regex: /\b(\d{8})\b/g,
  placeholder: '[PE_DNI_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Peru National ID (DNI)',
  validator: (value: string, context: string) => {
    if (value.length !== 8) return false;

    return /peru|peruvian|perú|peruano|dni|documento\s?nacional|identidad|reniec/i.test(context);
  }
};

/**
 * Peru RUC (Tax ID)
 * Format: 11 digits
 */
export const PERU_RUC: PIIPattern = {
  type: 'PERU_RUC',
  regex: /\bRUC[-\s]?(?:NO|NUM)?[-\s]?[:#]?\s*(\d{11})\b/gi,
  placeholder: '[PE_RUC_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Peru RUC (Tax ID)',
  validator: (value: string, context: string) => {
    if (value.length !== 11) return false;

    // RUC starts with 10, 15, 17, or 20
    const prefix = value.substring(0, 2);
    if (!['10', '15', '17', '20'].includes(prefix)) return false;

    return /peru|perú|ruc|tax|sunat|tributario/i.test(context);
  }
};

/**
 * Venezuela Cédula de Identidad
 * Format: V-XXXXXXXX or E-XXXXXXXX (1-8 digits)
 */
export const VENEZUELA_CEDULA: PIIPattern = {
  type: 'VENEZUELA_CEDULA',
  regex: /\b([VE]-\d{1,8})\b/gi,
  placeholder: '[VE_CI_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Venezuela Cédula de Identidad',
  validator: (value: string, context: string) => {
    // V = Venezuelan, E = Foreign resident
    if (!value.toUpperCase().startsWith('V-') && !value.toUpperCase().startsWith('E-')) {
      return false;
    }

    return /venezuela|venezuelan|cédula|cedula|identidad|ci\s/i.test(context);
  }
};

/**
 * Venezuela RIF (Tax ID)
 * Format: J-XXXXXXXX-X or V-XXXXXXXX-X
 */
export const VENEZUELA_RIF: PIIPattern = {
  type: 'VENEZUELA_RIF',
  regex: /\b([VEJG]-\d{8,9}-\d{1})\b/gi,
  placeholder: '[VE_RIF_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Venezuela RIF (Tax ID)',
  validator: (value: string, context: string) => {
    const prefix = value[0].toUpperCase();
    // V=Person, E=Foreign, J=Legal entity, G=Government
    if (!['V', 'E', 'J', 'G'].includes(prefix)) return false;

    return /venezuela|rif|tax|seniat|tributario/i.test(context);
  }
};

/**
 * Ecuador Cédula de Identidad
 * Format: 10 digits
 */
export const ECUADOR_CEDULA: PIIPattern = {
  type: 'ECUADOR_CEDULA',
  regex: /\b(\d{10})\b/g,
  placeholder: '[EC_CI_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Ecuador Cédula de Identidad',
  validator: (value: string, context: string) => {
    if (value.length !== 10) return false;

    // Province code (first 2 digits) should be 01-24
    const province = parseInt(value.substring(0, 2));
    if (province < 1 || province > 24) return false;

    // Third digit should be 0-6 (0-5 for persons, 6 for public sector, 9 for legal entities)
    const thirdDigit = parseInt(value[2]);
    if (thirdDigit > 6 && thirdDigit !== 9) return false;

    return /ecuador|ecuadorian|cédula|cedula|identidad/i.test(context);
  }
};

/**
 * Uruguay Cédula de Identidad
 * Format: X.XXX.XXX-X (7 digits + check digit)
 */
export const URUGUAY_CEDULA: PIIPattern = {
  type: 'URUGUAY_CEDULA',
  regex: /\b(\d{1}\.\d{3}\.\d{3}-\d{1})\b/g,
  placeholder: '[UY_CI_{n}]',
  priority: 90,
  severity: 'high',
  description: 'Uruguay Cédula de Identidad',
  validator: (value: string, context: string) => {
    const digits = value.replace(/[.\-]/g, '');
    if (digits.length !== 8) return false;

    return /uruguay|uruguayan|cédula|cedula|identidad/i.test(context);
  }
};

export const latinAmericaPatterns: PIIPattern[] = [
  ARGENTINA_DNI,
  ARGENTINA_CUIT,
  CHILE_RUT,
  COLOMBIA_CEDULA,
  COLOMBIA_NIT,
  PERU_DNI,
  PERU_RUC,
  VENEZUELA_CEDULA,
  VENEZUELA_RIF,
  ECUADOR_CEDULA,
  URUGUAY_CEDULA
];
