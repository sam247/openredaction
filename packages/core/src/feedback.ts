/**
 * Feedback and learning system for OpenRedact
 * Allows users to report false positives/negatives to improve detection
 */

export interface FeedbackOptions {
  /** API endpoint for feedback submission */
  apiEndpoint?: string;
  /** API key for authentication (optional for public feedback) */
  apiKey?: string;
}

export interface FeedbackReport {
  /** Type of feedback */
  type: 'false_positive' | 'false_negative';
  /** The text that was incorrectly detected or missed */
  detectedText: string;
  /** The PII type (EMAIL, SSN, etc.) */
  detectionType: string;
  /** Surrounding context (for better analysis) */
  context?: string;
  /** Optional comment from user */
  comment?: string;
  /** Full text (optional, for deeper analysis) */
  fullText?: string;
}

export interface FeedbackResponse {
  success: boolean;
  feedbackId?: string;
  message: string;
  analysis?: {
    similarReports: number;
    priorityReview: boolean;
    suggestedAction: string;
  };
  error?: string;
}

/**
 * Feedback client for reporting detection issues
 */
export class FeedbackClient {
  private apiEndpoint: string;
  private apiKey?: string;

  constructor(options: FeedbackOptions = {}) {
    this.apiEndpoint = options.apiEndpoint || 'https://api.openredact.com/v1/feedback';
    this.apiKey = options.apiKey;
  }

  /**
   * Report a false positive (text incorrectly flagged as PII)
   */
  async reportFalsePositive(
    detectedText: string,
    detectionType: string,
    context?: string,
    comment?: string
  ): Promise<FeedbackResponse> {
    return this.submitFeedback({
      type: 'false_positive',
      detectedText,
      detectionType,
      context,
      comment
    });
  }

  /**
   * Report a false negative (PII that wasn't detected)
   */
  async reportFalseNegative(
    missedText: string,
    expectedType: string,
    context?: string,
    comment?: string
  ): Promise<FeedbackResponse> {
    return this.submitFeedback({
      type: 'false_negative',
      detectedText: missedText,
      detectionType: expectedType,
      context,
      comment
    });
  }

  /**
   * Submit feedback report
   */
  async submitFeedback(report: FeedbackReport): Promise<FeedbackResponse> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(report),
      });

      const data = await response.json() as any;

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Failed to submit feedback',
          error: data.message
        };
      }

      return data as FeedbackResponse;
    } catch (error) {
      return {
        success: false,
        message: 'Network error while submitting feedback',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Batch submit multiple feedback reports
   */
  async submitBatch(reports: FeedbackReport[]): Promise<FeedbackResponse[]> {
    return Promise.all(
      reports.map(report => this.submitFeedback(report))
    );
  }
}

/**
 * Helper to extract context around detected PII
 */
export function extractContext(
  text: string,
  startPos: number,
  endPos: number,
  contextSize: number = 50
): string {
  const contextStart = Math.max(0, startPos - contextSize);
  const contextEnd = Math.min(text.length, endPos + contextSize);
  return text.substring(contextStart, contextEnd);
}

/**
 * Helper to create feedback report from detection result
 */
export function createFeedbackFromDetection(
  originalText: string,
  detection: { type: string; value: string; position: [number, number] },
  isFalsePositive: boolean,
  comment?: string
): FeedbackReport {
  const [start, end] = detection.position;
  const context = extractContext(originalText, start, end);

  return {
    type: isFalsePositive ? 'false_positive' : 'false_negative',
    detectedText: detection.value,
    detectionType: detection.type,
    context,
    comment,
    fullText: originalText.length < 1000 ? originalText : undefined
  };
}
