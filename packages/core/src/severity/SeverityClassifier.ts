/**
 * Severity Classification System
 * Assigns severity levels to PII patterns and calculates risk scores
 */

import type { PIIPattern, PIIDetection } from '../types';

/**
 * Severity level for PII types
 */
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

/**
 * Severity classification with reasoning
 */
export interface SeverityClassification {
  /** Severity level */
  level: SeverityLevel;
  /** Numeric score (0-10) */
  score: number;
  /** Reasoning for classification */
  reason?: string;
}

/**
 * Risk score calculation result
 */
export interface RiskScore {
  /** Overall risk score (0-1) */
  score: number;
  /** Risk level */
  level: 'very-high' | 'high' | 'medium' | 'low' | 'minimal';
  /** Contributing factors */
  factors: {
    piiCount: number;
    avgSeverity: number;
    avgConfidence: number;
    criticalCount: number;
    highCount: number;
  };
}

/**
 * Default severity mappings by pattern type
 */
export const DEFAULT_SEVERITY_MAP: Record<string, SeverityLevel> = {
  // CRITICAL - Highly sensitive, major identity theft risk
  'SSN': 'critical',
  'SOCIAL_SECURITY': 'critical',
  'CREDIT_CARD': 'critical',
  'CVV': 'critical',
  'BANK_ACCOUNT': 'critical',
  'ROUTING_NUMBER': 'critical',
  'PASSPORT': 'critical',
  'DRIVERS_LICENSE': 'critical',
  'DRIVING_LICENCE': 'critical',
  'NHS_NUMBER': 'critical',
  'NI_NUMBER': 'critical',
  'NATIONAL_INSURANCE': 'critical',
  'TAX_ID': 'critical',
  'EIN': 'critical',
  'ITIN': 'critical',
  'SIN': 'critical', // Canadian
  'TFN': 'critical', // Australian
  'AADHAAR': 'critical', // Indian
  'MEDICAL_RECORD': 'critical',
  'MRN': 'critical',
  'PATIENT_ID': 'critical',
  'DEA_NUMBER': 'critical',
  'NPI': 'critical',
  'API_KEY': 'critical',
  'SECRET_KEY': 'critical',
  'AWS_SECRET_KEY': 'critical',
  'PRIVATE_KEY': 'critical',
  'SSH_KEY': 'critical',
  'JWT': 'critical',
  'OAUTH_SECRET': 'critical',
  'PASSWORD': 'critical',
  'BEARER_TOKEN': 'critical',
  'BITCOIN_PRIVATE': 'critical',

  // HIGH - Personal identifiers, significant privacy risk
  'EMAIL': 'high',
  'PHONE': 'high',
  'PHONE_UK': 'high',
  'PHONE_US': 'high',
  'PHONE_MOBILE': 'high',
  'NAME': 'high',
  'FULL_NAME': 'high',
  'DATE_OF_BIRTH': 'high',
  'DOB': 'high',
  'ADDRESS': 'high',
  'STREET_ADDRESS': 'high',
  'IBAN': 'high',
  'SWIFT': 'high',
  'BIC': 'high',
  'IFSC': 'high', // Indian bank code
  'CLABE': 'high', // Mexican bank code
  'IP_ADDRESS': 'high',
  'MAC_ADDRESS': 'high',
  'VEHICLE_VIN': 'high',
  'LICENSE_PLATE': 'high',
  'GITHUB_TOKEN': 'high',
  'AWS_ACCESS_KEY': 'high',
  'STRIPE_KEY': 'high',
  'GOOGLE_API_KEY': 'high',
  'PRESCRIPTION': 'high',
  'BIOMETRIC': 'high',

  // MEDIUM - Business/organizational identifiers, moderate risk
  'EMPLOYEE_ID': 'medium',
  'USERNAME': 'medium',
  'COMPANY_NUMBER': 'medium',
  'VAT_NUMBER': 'medium',
  'UTR': 'medium', // UK tax reference
  'ORDER_NUMBER': 'medium',
  'INVOICE_NUMBER': 'medium',
  'ACCOUNT_NUMBER': 'medium', // Generic account
  'CUSTOMER_ID': 'medium',
  'TRANSACTION_ID': 'medium',
  'CASE_NUMBER': 'medium',
  'DOCKET_NUMBER': 'medium',
  'BAR_NUMBER': 'medium',
  'TRACKING_NUMBER': 'medium',
  'SESSION_ID': 'medium',
  'DEVICE_ID': 'medium',
  'CERTIFICATE_NUMBER': 'medium',
  'POLICY_NUMBER': 'medium', // Insurance
  'MEMBERSHIP_ID': 'medium',
  'LOYALTY_CARD': 'medium',
  'GIFT_CARD': 'medium',
  'BITCOIN_ADDRESS': 'medium', // Public address
  'ETHEREUM_ADDRESS': 'medium',
  'CRYPTOCURRENCY': 'medium',

  // LOW - Public or less sensitive information
  'POSTCODE': 'low',
  'ZIP_CODE': 'low',
  'POSTAL_CODE': 'low',
  'URL': 'low',
  'DOMAIN': 'low',
  'ORGANIZATION': 'low',
  'COMPANY': 'low',
  'PRODUCT_SKU': 'low',
  'COUPON_CODE': 'low',
  'PROMO_CODE': 'low',
  'PLACEHOLDER': 'low'
};

/**
 * Severity scores (for numeric calculations)
 */
export const SEVERITY_SCORES: Record<SeverityLevel, number> = {
  'critical': 10,
  'high': 7,
  'medium': 4,
  'low': 2
};

/**
 * Severity Classifier
 */
export class SeverityClassifier {
  private severityMap: Record<string, SeverityLevel>;

  constructor(customMap?: Record<string, SeverityLevel>) {
    this.severityMap = {
      ...DEFAULT_SEVERITY_MAP,
      ...(customMap || {})
    };
  }

  /**
   * Classify severity for a pattern type
   */
  classify(patternType: string): SeverityClassification {
    // Check for exact match
    if (this.severityMap[patternType]) {
      return {
        level: this.severityMap[patternType],
        score: SEVERITY_SCORES[this.severityMap[patternType]],
        reason: `Mapped severity for ${patternType}`
      };
    }

    // Check for partial matches (e.g., "PHONE_UK_MOBILE" matches "PHONE")
    for (const [key, severity] of Object.entries(this.severityMap)) {
      if (patternType.includes(key) || key.includes(patternType)) {
        return {
          level: severity,
          score: SEVERITY_SCORES[severity],
          reason: `Partial match: ${patternType} ≈ ${key}`
        };
      }
    }

    // Default to medium if unknown
    return {
      level: 'medium',
      score: SEVERITY_SCORES['medium'],
      reason: `Unknown pattern type, defaulting to medium`
    };
  }

  /**
   * Ensure pattern has severity assigned
   */
  ensurePatternSeverity(pattern: PIIPattern): PIIPattern {
    if (pattern.severity) {
      return pattern; // Already has severity
    }

    const classification = this.classify(pattern.type);

    return {
      ...pattern,
      severity: classification.level
    };
  }

  /**
   * Ensure all patterns have severity
   */
  ensureAllSeverity(patterns: PIIPattern[]): PIIPattern[] {
    return patterns.map(p => this.ensurePatternSeverity(p));
  }

  /**
   * Calculate risk score for a set of detections
   */
  calculateRiskScore(detections: PIIDetection[]): RiskScore {
    if (detections.length === 0) {
      return {
        score: 0,
        level: 'minimal',
        factors: {
          piiCount: 0,
          avgSeverity: 0,
          avgConfidence: 0,
          criticalCount: 0,
          highCount: 0
        }
      };
    }

    // Count by severity
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;
    let lowCount = 0;

    // Calculate average confidence
    let totalConfidence = 0;
    let totalSeverityScore = 0;

    for (const detection of detections) {
      // Count severity
      if (detection.severity === 'critical') criticalCount++;
      else if (detection.severity === 'high') highCount++;
      else if (detection.severity === 'medium') mediumCount++;
      else if (detection.severity === 'low') lowCount++;

      // Sum confidence
      totalConfidence += detection.confidence || 0.8;

      // Sum severity score
      totalSeverityScore += SEVERITY_SCORES[detection.severity];
    }

    const avgConfidence = totalConfidence / detections.length;
    const avgSeverity = totalSeverityScore / detections.length;

    // Calculate risk score (0-1)
    // Formula: weighted by count, severity, and confidence
    const countFactor = Math.min(detections.length / 10, 1); // Cap at 10 items
    const severityFactor = avgSeverity / 10; // Normalize to 0-1
    const criticalFactor = Math.min(criticalCount / 5, 1); // Heavy weight on critical
    const confidenceFactor = avgConfidence;

    const riskScore =
      0.3 * countFactor +
      0.3 * severityFactor +
      0.3 * criticalFactor +
      0.1 * confidenceFactor;

    // Clamp to [0, 1]
    const clampedScore = Math.max(0, Math.min(1, riskScore));

    // Determine risk level
    let level: RiskScore['level'];
    if (clampedScore >= 0.8) level = 'very-high';
    else if (clampedScore >= 0.6) level = 'high';
    else if (clampedScore >= 0.4) level = 'medium';
    else if (clampedScore >= 0.2) level = 'low';
    else level = 'minimal';

    return {
      score: clampedScore,
      level,
      factors: {
        piiCount: detections.length,
        avgSeverity,
        avgConfidence,
        criticalCount,
        highCount
      }
    };
  }

  /**
   * Get severity for a pattern type
   */
  getSeverity(patternType: string): SeverityLevel {
    return this.classify(patternType).level;
  }

  /**
   * Get severity score for a pattern type
   */
  getSeverityScore(patternType: string): number {
    return this.classify(patternType).score;
  }

  /**
   * Add custom severity mapping
   */
  addSeverityMapping(patternType: string, severity: SeverityLevel): void {
    this.severityMap[patternType] = severity;
  }

  /**
   * Get all severity mappings
   */
  getSeverityMap(): Record<string, SeverityLevel> {
    return { ...this.severityMap };
  }

  /**
   * Filter detections by severity threshold
   */
  filterBySeverity(
    detections: PIIDetection[],
    minSeverity: SeverityLevel
  ): PIIDetection[] {
    const minScore = SEVERITY_SCORES[minSeverity];

    return detections.filter(detection => {
      const score = SEVERITY_SCORES[detection.severity];
      return score >= minScore;
    });
  }

  /**
   * Group detections by severity
   */
  groupBySeverity(detections: PIIDetection[]): Record<SeverityLevel, PIIDetection[]> {
    const grouped: Record<SeverityLevel, PIIDetection[]> = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    for (const detection of detections) {
      grouped[detection.severity].push(detection);
    }

    return grouped;
  }
}

/**
 * Create a severity classifier instance
 */
export function createSeverityClassifier(customMap?: Record<string, SeverityLevel>): SeverityClassifier {
  return new SeverityClassifier(customMap);
}

/**
 * Quick helper to get severity for a pattern type
 */
export function getSeverity(patternType: string): SeverityLevel {
  const classifier = new SeverityClassifier();
  return classifier.getSeverity(patternType);
}

/**
 * Quick helper to calculate risk score
 */
export function calculateRisk(detections: PIIDetection[]): RiskScore {
  const classifier = new SeverityClassifier();
  return classifier.calculateRiskScore(detections);
}
