/**
 * React hooks for PII detection
 * Local-first client-side PII detection in React applications
 *
 * NOTE: These are TypeScript hook definitions.
 * React is a peer dependency - users must install React separately.
 */

import { OpenRedaction } from '../detector';
import type { DetectionResult, OpenRedactionOptions } from '../types';
import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * Hook for PII detection in React components
 *
 * @example
 * ```tsx
 * function MyForm() {
 *   const { detect, result, isDetecting } = useOpenRedaction();
 *
 *   const handleSubmit = (text: string) => {
 *     const detection = detect(text);
 *     if (detection.detections.length > 0) {
 *       alert('PII detected!');
 *     }
 *   };
 * }
 * ```
 */
export function useOpenRedaction(options?: OpenRedactionOptions) {
  const detector = useMemo(() => new OpenRedaction(options), [options]);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const detect = useCallback(async (text: string): Promise<DetectionResult> => {
    setIsDetecting(true);
    try {
      const detection = await detector.detect(text);
      setResult(detection);
      setIsDetecting(false);
      return detection;
    } catch (error) {
      setIsDetecting(false);
      throw error;
    }
  }, [detector]);

  const clear = useCallback(() => {
    setResult(null);
  }, []);

  return {
    detect,
    result,
    isDetecting,
    hasPII: result ? result.detections.length > 0 : false,
    count: result ? result.detections.length : 0,
    clear,
    detector
  };
}

/**
 * Hook for real-time PII detection with debouncing
 *
 * @example
 * ```tsx
 * function EmailInput() {
 *   const [email, setEmail] = useState('');
 *   const { result, hasPII } = usePIIDetector(email, { debounce: 500 });
 *
 *   return (
 *     <div>
 *       <input value={email} onChange={e => setEmail(e.target.value)} />
 *       {hasPII && <Warning>PII detected!</Warning>}
 *     </div>
 *   );
 * }
 * ```
 */
export function usePIIDetector(
  text: string,
  options?: OpenRedactionOptions & { debounce?: number }
) {
  const { debounce = 300, ...redactOptions } = options || {};
  const detector = useMemo(() => new OpenRedaction(redactOptions), [redactOptions]);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!text) {
      setResult(null);
      return;
    }

    setIsDetecting(true);
    const timer = setTimeout(async () => {
      try {
        const detection = await detector.detect(text);
        setResult(detection);
        setIsDetecting(false);
      } catch (error) {
        setIsDetecting(false);
      }
    }, debounce);

    return () => {
      clearTimeout(timer);
      setIsDetecting(false);
    };
  }, [text, detector, debounce]);

  return {
    result,
    isDetecting,
    hasPII: result ? result.detections.length > 0 : false,
    count: result ? result.detections.length : 0,
    detections: result?.detections || []
  };
}

/**
 * Hook for form field PII validation
 *
 * @example
 * ```tsx
 * function UserForm() {
 *   const emailValidation = useFormFieldValidator({
 *     failOnPII: true,
 *     types: ['EMAIL', 'PHONE']
 *   });
 *
 *   return (
 *     <input
 *       {...emailValidation.getFieldProps()}
 *       onChange={e => emailValidation.validate(e.target.value)}
 *     />
 *   );
 * }
 * ```
 */
export function useFormFieldValidator(options?: OpenRedactionOptions & {
  failOnPII?: boolean;
  types?: string[];
  onPIIDetected?: (result: DetectionResult) => void;
}) {
  const { failOnPII = false, types = [], onPIIDetected, ...redactOptions } = options || {};
  const detector = useMemo(() => new OpenRedaction(redactOptions), [redactOptions]);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);

  const validate = useCallback(async (inputValue: string): Promise<boolean> => {
    setValue(inputValue);

    if (!inputValue) {
      setError(null);
      setResult(null);
      return true;
    }

    try {
      const detection = await detector.detect(inputValue);
      setResult(detection);

      // Filter by types if specified
      const relevantDetections = types.length > 0
        ? detection.detections.filter((d) => types.includes(d.type))
        : detection.detections;

    if (relevantDetections.length > 0) {
      if (failOnPII) {
        setError(`Sensitive information detected: ${relevantDetections[0].type}`);
      }

      if (onPIIDetected) {
        onPIIDetected(detection);
      }

      return false;
    }

    setError(null);
    return true;
    } catch (error) {
      setError('Validation failed');
      return false;
    }
  }, [detector, failOnPII, types, onPIIDetected]);

  const getFieldProps = useCallback(() => ({
    value,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? 'pii-error' : undefined
  }), [value, error]);

  return {
    value,
    error,
    result,
    validate,
    getFieldProps,
    isValid: !error,
    hasPII: result ? result.detections.length > 0 : false
  };
}

/**
 * Hook for batch PII detection
 *
 * @example
 * ```tsx
 * function BatchProcessor() {
 *   const { processAll, results, isProcessing } = useBatchDetector();
 *
 *   const handleProcess = async () => {
 *     const documents = ['text1', 'text2', 'text3'];
 *     await processAll(documents);
 *   };
 * }
 * ```
 */
export function useBatchDetector(options?: OpenRedactionOptions) {
  const detector = useMemo(() => new OpenRedaction(options), [options]);
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const processAll = useCallback(async (texts: string[]) => {
    setIsProcessing(true);
    setProgress(0);
    const detections: DetectionResult[] = [];

    for (let i = 0; i < texts.length; i++) {
      const result = await detector.detect(texts[i]);
      detections.push(result);
      setProgress(((i + 1) / texts.length) * 100);

      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    setResults(detections);
    setIsProcessing(false);
    setProgress(100);

    return detections;
  }, [detector]);

  const clear = useCallback(() => {
    setResults([]);
    setProgress(0);
  }, []);

  const totalDetections = useMemo(
    () => results.reduce((sum: number, r: DetectionResult) => sum + r.detections.length, 0),
    [results]
  );

  return {
    processAll,
    results,
    isProcessing,
    progress,
    totalDetections,
    clear
  };
}

/**
 * Hook for PII detection with auto-redaction
 *
 * @example
 * ```tsx
 * function SecureTextArea() {
 *   const { text, setText, redactedText, hasPII } = useAutoRedact();
 *
 *   return (
 *     <div>
 *       <textarea value={text} onChange={e => setText(e.target.value)} />
 *       {hasPII && <div>Redacted: {redactedText}</div>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAutoRedact(options?: OpenRedactionOptions & { debounce?: number }) {
  const { debounce = 300, ...redactOptions } = options || {};
  const detector = useMemo(() => new OpenRedaction(redactOptions), [redactOptions]);
  const [text, setText] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);

  useEffect(() => {
    if (!text) {
      setResult(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const detection = await detector.detect(text);
        setResult(detection);
      } catch (error) {
        // Silently fail
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [text, detector, debounce]);

  return {
    text,
    setText,
    result,
    redactedText: result?.redacted || text,
    hasPII: result ? result.detections.length > 0 : false,
    detections: result?.detections || [],
    count: result ? result.detections.length : 0
  };
}
