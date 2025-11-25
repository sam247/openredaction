/**
 * Contextual Rules Engine
 * Defines proximity-based rules and keyword patterns for confidence boosting
 */

import type { PIIMatch } from '../types';

/**
 * Proximity rule for context-based confidence adjustment
 */
export interface ProximityRule {
  /** Pattern type this rule applies to (e.g., 'EMAIL', 'PHONE', 'SSN') */
  patternType: string | string[];
  /** Keywords to look for near the match */
  keywords: string[];
  /** Maximum word distance from match (default: 10) */
  proximityWindow?: number;
  /** Confidence boost if keyword found (0-1) */
  confidenceBoost?: number;
  /** Confidence penalty if keyword found (0-1) */
  confidencePenalty?: number;
  /** Whether match must come AFTER keyword (default: both directions) */
  keywordBefore?: boolean;
  /** Whether match must come BEFORE keyword (default: both directions) */
  keywordAfter?: boolean;
  /** Rule description */
  description?: string;
}

/**
 * Domain-specific vocabulary for context detection
 */
export interface DomainVocabulary {
  /** Domain name */
  domain: 'medical' | 'legal' | 'financial' | 'technical' | 'hr' | 'custom';
  /** Domain-specific terms */
  terms: string[];
  /** Pattern types to boost in this domain */
  boostPatterns?: string[];
  /** Confidence boost amount (default: 0.15) */
  boostAmount?: number;
}

/**
 * Contextual rules configuration
 */
export interface ContextRulesConfig {
  /** Proximity rules */
  proximityRules?: ProximityRule[];
  /** Domain vocabularies */
  domainVocabularies?: DomainVocabulary[];
  /** Enable default rules (default: true) */
  useDefaultRules?: boolean;
}

/**
 * Default proximity rules for common PII patterns
 */
export const DEFAULT_PROXIMITY_RULES: ProximityRule[] = [
  // EMAIL rules
  {
    patternType: 'EMAIL',
    keywords: ['email', 'e-mail', 'contact', 'reach', 'write', 'send to'],
    proximityWindow: 5,
    confidenceBoost: 0.2,
    keywordBefore: true,
    description: 'Email preceded by email-related keywords'
  },
  {
    patternType: 'EMAIL',
    keywords: ['example', 'test', 'sample', 'demo'],
    proximityWindow: 8,
    confidencePenalty: 0.25,
    description: 'Email near test/example keywords'
  },

  // PHONE rules
  {
    patternType: ['PHONE', 'PHONE_UK', 'PHONE_US', 'PHONE_UK_MOBILE'],
    keywords: ['call', 'phone', 'tel', 'telephone', 'mobile', 'cell', 'ring', 'dial'],
    proximityWindow: 5,
    confidenceBoost: 0.2,
    keywordBefore: true,
    description: 'Phone number preceded by phone-related keywords'
  },
  {
    patternType: ['PHONE', 'PHONE_UK', 'PHONE_US'],
    keywords: ['fax', 'fax number'],
    proximityWindow: 5,
    confidencePenalty: 0.15,
    description: 'Likely a fax number, not personal phone'
  },

  // NAME rules
  {
    patternType: 'NAME',
    keywords: ['mr', 'mrs', 'ms', 'miss', 'dr', 'prof', 'professor', 'dear', 'hello', 'hi'],
    proximityWindow: 3,
    confidenceBoost: 0.25,
    keywordBefore: true,
    description: 'Name preceded by salutation'
  },
  {
    patternType: 'NAME',
    keywords: ['said', 'wrote', 'told', 'asked', 'replied', 'mentioned', 'stated'],
    proximityWindow: 5,
    confidenceBoost: 0.15,
    keywordBefore: true,
    description: 'Name preceded by speech verb'
  },
  {
    patternType: 'NAME',
    keywords: ['the', 'a', 'an', 'this', 'that'],
    proximityWindow: 1,
    confidencePenalty: 0.3,
    keywordBefore: true,
    description: 'Preceded by article - likely not a name'
  },

  // SSN rules
  {
    patternType: 'SSN',
    keywords: ['ssn', 'social security', 'social security number', 'social-security'],
    proximityWindow: 8,
    confidenceBoost: 0.25,
    description: 'SSN near SSN-related keywords'
  },
  {
    patternType: 'SSN',
    keywords: ['example', 'test', 'sample', '123-45-6789', '000-00-0000'],
    proximityWindow: 10,
    confidencePenalty: 0.4,
    description: 'SSN near example/test keywords or obvious test SSN'
  },

  // ACCOUNT rules
  {
    patternType: ['BANK_ACCOUNT', 'ACCOUNT_NUMBER', 'IBAN', 'SWIFT'],
    keywords: ['account', 'acct', 'account number', 'account#', 'bank account'],
    proximityWindow: 8,
    confidenceBoost: 0.2,
    description: 'Account number near account-related keywords'
  },

  // CREDIT CARD rules
  {
    patternType: 'CREDIT_CARD',
    keywords: ['card', 'credit card', 'debit card', 'visa', 'mastercard', 'amex', 'discover'],
    proximityWindow: 8,
    confidenceBoost: 0.2,
    description: 'Card number near card-related keywords'
  },
  {
    patternType: 'CREDIT_CARD',
    keywords: ['test', 'example', '4111', '4111111111111111'],
    proximityWindow: 10,
    confidencePenalty: 0.35,
    description: 'Near test card numbers'
  },

  // ADDRESS rules
  {
    patternType: ['ADDRESS', 'STREET_ADDRESS'],
    keywords: ['address', 'street', 'lives at', 'located at', 'residing at'],
    proximityWindow: 8,
    confidenceBoost: 0.15,
    description: 'Address near address-related keywords'
  },

  // MEDICAL rules
  {
    patternType: ['MRN', 'PATIENT_ID', 'NHS_NUMBER', 'MEDICAL_RECORD'],
    keywords: ['patient', 'subject', 'participant', 'mrn', 'medical record'],
    proximityWindow: 8,
    confidenceBoost: 0.25,
    description: 'Medical ID near medical keywords'
  },

  // DATE OF BIRTH rules
  {
    patternType: 'DATE_OF_BIRTH',
    keywords: ['dob', 'date of birth', 'birth date', 'birthdate', 'born', 'birthday'],
    proximityWindow: 8,
    confidenceBoost: 0.25,
    description: 'DOB near birth-related keywords'
  },

  // PASSPORT rules
  {
    patternType: 'PASSPORT',
    keywords: ['passport', 'passport number', 'passport#'],
    proximityWindow: 8,
    confidenceBoost: 0.2,
    description: 'Passport near passport keywords'
  },

  // DRIVER LICENSE rules
  {
    patternType: ['DRIVERS_LICENSE', 'DRIVING_LICENCE'],
    keywords: ['license', 'licence', 'driver', 'driving', 'dl#', 'dl number'],
    proximityWindow: 8,
    confidenceBoost: 0.2,
    description: 'License near license keywords'
  }
];

/**
 * Default domain vocabularies
 */
export const DEFAULT_DOMAIN_VOCABULARIES: DomainVocabulary[] = [
  {
    domain: 'medical',
    terms: [
      'patient', 'doctor', 'physician', 'nurse', 'hospital', 'clinic', 'medical',
      'health', 'diagnosis', 'treatment', 'prescription', 'medication', 'surgery',
      'exam', 'test', 'lab', 'specimen', 'chart', 'record', 'mrn', 'hipaa',
      'healthcare', 'practitioner', 'provider', 'pharmacy', 'radiology'
    ],
    boostPatterns: ['MRN', 'PATIENT_ID', 'NHS_NUMBER', 'NPI', 'DEA', 'MEDICAL'],
    boostAmount: 0.15
  },
  {
    domain: 'legal',
    terms: [
      'case', 'court', 'judge', 'attorney', 'lawyer', 'counsel', 'plaintiff',
      'defendant', 'lawsuit', 'litigation', 'docket', 'tribunal', 'hearing',
      'deposition', 'subpoena', 'warrant', 'verdict', 'settlement', 'contract',
      'agreement', 'legal', 'law', 'bar number', 'case number'
    ],
    boostPatterns: ['CASE_NUMBER', 'DOCKET', 'BAR_NUMBER', 'LEGAL'],
    boostAmount: 0.15
  },
  {
    domain: 'financial',
    terms: [
      'bank', 'account', 'payment', 'transaction', 'transfer', 'wire', 'credit',
      'debit', 'balance', 'deposit', 'withdrawal', 'loan', 'mortgage', 'investment',
      'trading', 'stock', 'bond', 'portfolio', 'iban', 'swift', 'routing',
      'bic', 'ach', 'financial', 'finance', 'money', 'currency', 'crypto'
    ],
    boostPatterns: ['BANK_ACCOUNT', 'IBAN', 'SWIFT', 'ROUTING', 'CREDIT_CARD', 'BITCOIN'],
    boostAmount: 0.15
  },
  {
    domain: 'hr',
    terms: [
      'employee', 'staff', 'personnel', 'workforce', 'human resources', 'hr',
      'payroll', 'salary', 'compensation', 'benefits', 'onboarding', 'offboarding',
      'termination', 'resignation', 'promotion', 'performance', 'review',
      'evaluation', 'disciplinary', 'complaint', 'grievance', 'harassment'
    ],
    boostPatterns: ['EMPLOYEE_ID', 'PAYROLL', 'HR'],
    boostAmount: 0.15
  },
  {
    domain: 'technical',
    terms: [
      'api', 'key', 'token', 'secret', 'password', 'credential', 'auth',
      'authentication', 'authorization', 'oauth', 'jwt', 'bearer', 'session',
      'access', 'refresh', 'client', 'server', 'endpoint', 'webhook', 'sdk'
    ],
    boostPatterns: ['API_KEY', 'JWT', 'BEARER_TOKEN', 'AWS_ACCESS_KEY', 'SECRET'],
    boostAmount: 0.2
  }
];

/**
 * Contextual Rules Engine
 */
export class ContextRulesEngine {
  private proximityRules: ProximityRule[];
  private domainVocabularies: DomainVocabulary[];

  constructor(config?: ContextRulesConfig) {
    const useDefaults = config?.useDefaultRules !== false;

    this.proximityRules = [
      ...(useDefaults ? DEFAULT_PROXIMITY_RULES : []),
      ...(config?.proximityRules || [])
    ];

    this.domainVocabularies = [
      ...(useDefaults ? DEFAULT_DOMAIN_VOCABULARIES : []),
      ...(config?.domainVocabularies || [])
    ];
  }

  /**
   * Apply proximity rules to adjust confidence
   */
  applyProximityRules(
    match: PIIMatch,
    text: string
  ): PIIMatch {
    let adjustedConfidence = match.confidence;

    // Find applicable rules for this pattern type
    const applicableRules = this.proximityRules.filter(rule => {
      if (Array.isArray(rule.patternType)) {
        return rule.patternType.some(type => match.type.includes(type));
      }
      return match.type.includes(rule.patternType);
    });

    for (const rule of applicableRules) {
      const hasKeyword = this.checkProximity(
        text,
        match.start,
        match.end,
        rule.keywords,
        rule.proximityWindow || 10,
        rule.keywordBefore,
        rule.keywordAfter
      );

      if (hasKeyword) {
        if (rule.confidenceBoost) {
          adjustedConfidence += rule.confidenceBoost;
        }
        if (rule.confidencePenalty) {
          adjustedConfidence -= rule.confidencePenalty;
        }
      }
    }

    // Clamp to [0, 1]
    adjustedConfidence = Math.max(0, Math.min(1, adjustedConfidence));

    return {
      ...match,
      confidence: adjustedConfidence
    };
  }

  /**
   * Apply domain vocabulary boosting
   */
  applyDomainBoosting(
    matches: PIIMatch[],
    text: string
  ): PIIMatch[] {
    // Detect which domain(s) the text belongs to
    const detectedDomains = this.detectDomains(text);

    if (detectedDomains.length === 0) {
      return matches; // No domain detected
    }

    // Apply domain-specific boosts
    return matches.map(match => {
      let boosted = false;
      let adjustedConfidence = match.confidence;

      for (const domain of detectedDomains) {
        const vocabulary = this.domainVocabularies.find(v => v.domain === domain);

        if (vocabulary && vocabulary.boostPatterns) {
          const shouldBoost = vocabulary.boostPatterns.some(pattern =>
            match.type.includes(pattern)
          );

          if (shouldBoost) {
            adjustedConfidence += vocabulary.boostAmount || 0.15;
            boosted = true;
          }
        }
      }

      if (boosted) {
        return {
          ...match,
          confidence: Math.min(1, adjustedConfidence)
        };
      }

      return match;
    });
  }

  /**
   * Check if keywords are within proximity window
   */
  private checkProximity(
    text: string,
    matchStart: number,
    matchEnd: number,
    keywords: string[],
    proximityWindow: number,
    keywordBefore?: boolean,
    keywordAfter?: boolean
  ): boolean {
    // Extract context before and after match
    const beforeText = text.substring(Math.max(0, matchStart - 500), matchStart);
    const afterText = text.substring(matchEnd, Math.min(text.length, matchEnd + 500));

    // Split into words
    const beforeWords = beforeText.split(/\s+/).filter(w => w.length > 0);
    const afterWords = afterText.split(/\s+/).filter(w => w.length > 0);

    // Get proximity window
    const beforeWindowWords = beforeWords.slice(-proximityWindow);
    const afterWindowWords = afterWords.slice(0, proximityWindow);

    // Check for keywords
    const beforeLower = beforeWindowWords.join(' ').toLowerCase();
    const afterLower = afterWindowWords.join(' ').toLowerCase();

    for (const keyword of keywords) {
      const keywordLower = keyword.toLowerCase();

      if (keywordBefore && beforeLower.includes(keywordLower)) {
        return true;
      }

      if (keywordAfter && afterLower.includes(keywordLower)) {
        return true;
      }

      if (!keywordBefore && !keywordAfter) {
        // Check both directions
        if (beforeLower.includes(keywordLower) || afterLower.includes(keywordLower)) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Detect which domains the text belongs to
   */
  private detectDomains(text: string): DomainVocabulary['domain'][] {
    const textLower = text.toLowerCase();
    const detectedDomains: DomainVocabulary['domain'][] = [];

    for (const vocabulary of this.domainVocabularies) {
      let termCount = 0;

      for (const term of vocabulary.terms) {
        if (textLower.includes(term.toLowerCase())) {
          termCount++;
        }
      }

      // Require at least 3 domain terms to consider it that domain
      if (termCount >= 3) {
        detectedDomains.push(vocabulary.domain);
      }
    }

    return detectedDomains;
  }

  /**
   * Add custom proximity rule
   */
  addProximityRule(rule: ProximityRule): void {
    this.proximityRules.push(rule);
  }

  /**
   * Add custom domain vocabulary
   */
  addDomainVocabulary(vocabulary: DomainVocabulary): void {
    this.domainVocabularies.push(vocabulary);
  }

  /**
   * Get all proximity rules
   */
  getProximityRules(): ProximityRule[] {
    return [...this.proximityRules];
  }

  /**
   * Get all domain vocabularies
   */
  getDomainVocabularies(): DomainVocabulary[] {
    return [...this.domainVocabularies];
  }
}

/**
 * Create a context rules engine instance
 */
export function createContextRulesEngine(config?: ContextRulesConfig): ContextRulesEngine {
  return new ContextRulesEngine(config);
}
