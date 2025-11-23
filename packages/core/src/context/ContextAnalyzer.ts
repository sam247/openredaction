/**
 * Context Analysis for PII Detection
 * Provides NLP-lite features to reduce false positives
 */

export interface ContextAnalysis {
  /** 5 words before detection */
  beforeWords: string[];
  /** 5 words after detection */
  afterWords: string[];
  /** Full sentence containing detection */
  sentence: string;
  /** Inferred document type */
  documentType: 'email' | 'document' | 'code' | 'chat' | 'unknown';
  /** Confidence that this is actual PII (0-1) */
  confidence: number;
}

export interface ContextFeatures {
  /** Contains technical terms */
  hasTechnicalContext: boolean;
  /** Contains business/corporate terms */
  hasBusinessContext: boolean;
  /** Contains medical/healthcare terms */
  hasMedicalContext: boolean;
  /** Contains financial terms */
  hasFinancialContext: boolean;
  /** Contains example/test indicators */
  hasExampleContext: boolean;
  /** Position in document (0-1, 0 = start, 1 = end) */
  relativePosition: number;
}

/**
 * Extract context around a detection
 */
export function extractContext(
  text: string,
  startPos: number,
  endPos: number,
  wordsBefore: number = 5,
  wordsAfter: number = 5
): {
  before: string;
  after: string;
  beforeWords: string[];
  afterWords: string[];
  sentence: string;
} {
  // Extract before context
  const beforeText = text.substring(Math.max(0, startPos - 250), startPos);
  const beforeWordArray = beforeText.split(/\s+/).filter(w => w.length > 0);
  const beforeWords = beforeWordArray.slice(-wordsBefore);
  const before = beforeWords.join(' ');

  // Extract after context
  const afterText = text.substring(endPos, Math.min(text.length, endPos + 250));
  const afterWordArray = afterText.split(/\s+/).filter(w => w.length > 0);
  const afterWords = afterWordArray.slice(0, wordsAfter);
  const after = afterWords.join(' ');

  // Extract full sentence
  const sentence = extractSentence(text, startPos, endPos);

  return {
    before,
    after,
    beforeWords,
    afterWords,
    sentence
  };
}

/**
 * Extract the full sentence containing the detection
 */
function extractSentence(text: string, startPos: number, endPos: number): string {
  // Find sentence boundaries (., !, ?, or newline)
  const sentenceStart = findSentenceStart(text, startPos);
  const sentenceEnd = findSentenceEnd(text, endPos);

  return text.substring(sentenceStart, sentenceEnd).trim();
}

function findSentenceStart(text: string, pos: number): number {
  // Look backwards for sentence boundary
  for (let i = pos - 1; i >= 0; i--) {
    const char = text[i];
    if (char === '.' || char === '!' || char === '?' || char === '\n') {
      return i + 1;
    }
  }
  return 0; // Start of document
}

function findSentenceEnd(text: string, pos: number): number {
  // Look forwards for sentence boundary
  for (let i = pos; i < text.length; i++) {
    const char = text[i];
    if (char === '.' || char === '!' || char === '?' || char === '\n') {
      return i + 1;
    }
  }
  return text.length; // End of document
}

/**
 * Infer document type from content
 */
export function inferDocumentType(text: string): ContextAnalysis['documentType'] {
  const sample = text.substring(0, Math.min(1000, text.length)).toLowerCase();

  // Email indicators
  const emailIndicators = /\b(from|to|subject|dear|regards|sincerely|cc|bcc):/gi;
  const emailScore = (sample.match(emailIndicators) || []).length;

  // Code indicators
  const codeIndicators = /\b(function|const|let|var|class|import|export|return|if|else|for|while)\b/g;
  const codeScore = (sample.match(codeIndicators) || []).length;

  // Chat indicators
  const chatIndicators = /<.*?>|^\[?\d{1,2}:\d{2}\]?|^>|^@/gm;
  const chatScore = (sample.match(chatIndicators) || []).length;

  // Determine type based on scores
  if (codeScore > 5) return 'code';
  if (emailScore > 2) return 'email';
  if (chatScore > 3) return 'chat';

  return 'document';
}

/**
 * Extract context features for classification
 */
export function analyzeContextFeatures(fullContext: string): ContextFeatures {
  const lower = fullContext.toLowerCase();

  // Technical context
  const technicalTerms = /\b(api|sdk|cli|gui|json|xml|http|url|database|server|client|endpoint|variable|function|method|class|interface|code|debug|log)\b/g;
  const hasTechnicalContext = (lower.match(technicalTerms) || []).length > 0;

  // Business context
  const businessTerms = /\b(company|corporation|corp|ltd|llc|inc|ceo|cto|cfo|manager|director|employee|staff|team|department|office|business)\b/g;
  const hasBusinessContext = (lower.match(businessTerms) || []).length > 0;

  // Medical context
  const medicalTerms = /\b(patient|doctor|physician|nurse|hospital|clinic|medical|health|diagnosis|treatment|prescription|medication|surgery|exam|test|lab|specimen)\b/g;
  const hasMedicalContext = (lower.match(medicalTerms) || []).length > 0;

  // Financial context
  const financialTerms = /\b(bank|account|payment|transaction|transfer|wire|credit|debit|balance|deposit|withdrawal|loan|mortgage|investment|trading|stock|bond)\b/g;
  const hasFinancialContext = (lower.match(financialTerms) || []).length > 0;

  // Example/test indicators
  const exampleTerms = /\b(example|sample|test|demo|fake|placeholder|dummy|mock|xxx|todo|fixme)\b/g;
  const hasExampleContext = (lower.match(exampleTerms) || []).length > 0;

  return {
    hasTechnicalContext,
    hasBusinessContext,
    hasMedicalContext,
    hasFinancialContext,
    hasExampleContext,
    relativePosition: 0 // Will be set by caller
  };
}

/**
 * Calculate confidence score for a detection based on context
 */
export function calculateContextConfidence(
  _value: string,
  patternType: string,
  context: {
    before: string;
    after: string;
    sentence: string;
    documentType: ContextAnalysis['documentType'];
    features: ContextFeatures;
  }
): number {
  let confidence = 0.7; // Base confidence

  // Document type adjustments
  if (context.documentType === 'code') {
    // Lower confidence for most PII in code
    if (!['API_KEY', 'JWT', 'BEARER_TOKEN', 'AWS_ACCESS_KEY'].includes(patternType)) {
      confidence -= 0.2;
    }
  } else if (context.documentType === 'email') {
    // Higher confidence for PII in emails
    if (['EMAIL', 'PHONE', 'NAME', 'ADDRESS'].includes(patternType.split('_')[0])) {
      confidence += 0.1;
    }
  }

  // Feature-based adjustments
  if (context.features.hasExampleContext) {
    // Strong penalty for example/test context
    confidence -= 0.4;
  }

  // Medical context boost
  const medicalPatterns = ['MEDICAL', 'MRN', 'PATIENT', 'NHS', 'NPI', 'DEA', 'ICD', 'CPT', 'PRESCRIPTION'];
  if (context.features.hasMedicalContext && medicalPatterns.some(p => patternType.includes(p))) {
    // Boost medical patterns in medical context
    confidence += 0.15;
  }

  // Financial context boost
  const financialPatterns = ['ACCOUNT', 'TRANSACTION', 'SWIFT', 'IBAN', 'BITCOIN', 'ETHEREUM', 'CRYPTO', 'PAYMENT'];
  if (context.features.hasFinancialContext && financialPatterns.some(p => patternType.includes(p))) {
    // Boost financial patterns in financial context
    confidence += 0.15;
  }

  // Technical context - reduce confidence for non-credentials
  const credentialPatterns = ['API_KEY', 'TOKEN', 'SECRET', 'AWS', 'GITHUB', 'STRIPE', 'JWT'];
  if (context.features.hasTechnicalContext && !credentialPatterns.some(p => patternType.includes(p))) {
    // Reduce confidence for non-credential PII in technical context
    confidence -= 0.1;
  }

  // Context word analysis
  const beforeLower = context.before.toLowerCase();
  const afterLower = context.after.toLowerCase();

  // Positive indicators
  const positiveIndicators = [
    { pattern: /\b(dear|hello|hi|mr|mrs|ms|dr)\s*$/i, boost: 0.2, types: ['NAME'] },
    { pattern: /^(is|was|wrote|said|told)/i, boost: 0.15, types: ['NAME'] },
    { pattern: /\b(call|phone|tel|mobile):\s*$/i, boost: 0.2, types: ['PHONE'] },
    { pattern: /\b(email|e-mail|contact):\s*$/i, boost: 0.2, types: ['EMAIL'] },
    { pattern: /\b(patient|subject|participant):\s*$/i, boost: 0.25, types: ['NAME', 'PATIENT_ID', 'MRN'] },
    { pattern: /\b(account|acct)[\s#:]*$/i, boost: 0.2, types: ['ACCOUNT', 'BANK'] }
  ];

  for (const indicator of positiveIndicators) {
    if (indicator.pattern.test(beforeLower)) {
      const matchesType = indicator.types.some(t => patternType.includes(t));
      if (matchesType) {
        confidence += indicator.boost;
      }
    }
  }

  // Negative indicators
  const negativeIndicators = [
    { pattern: /\b(the|a|an)\s*$/i, penalty: 0.3, types: ['NAME'] },
    { pattern: /\b(version|v|release)\s*$/i, penalty: 0.4, types: ['PHONE', 'NUMBER'] },
    { pattern: /^\s*(street|avenue|road|drive|way)/i, penalty: 0.2, types: ['NAME'] }
  ];

  for (const indicator of negativeIndicators) {
    if (indicator.pattern.test(beforeLower) || indicator.pattern.test(afterLower)) {
      const matchesType = indicator.types.some(t => patternType.includes(t));
      if (matchesType) {
        confidence -= indicator.penalty;
      }
    }
  }

  // Clamp confidence to [0, 1]
  return Math.max(0, Math.min(1, confidence));
}

/**
 * Perform full context analysis
 */
export function analyzeFullContext(
  text: string,
  value: string,
  patternType: string,
  startPos: number,
  endPos: number
): ContextAnalysis {
  const { before, after, beforeWords, afterWords, sentence } = extractContext(
    text,
    startPos,
    endPos
  );

  const documentType = inferDocumentType(text);
  const fullContext = before + ' ' + value + ' ' + after;
  const features = analyzeContextFeatures(fullContext);
  features.relativePosition = startPos / text.length;

  const confidence = calculateContextConfidence(value, patternType, {
    before,
    after,
    sentence,
    documentType,
    features
  });

  return {
    beforeWords,
    afterWords,
    sentence,
    documentType,
    confidence
  };
}
