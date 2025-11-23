/**
 * React Form Example
 * Demonstrates OpenRedact hooks for real-time PII detection
 */

import React, { useState } from 'react';
import {
  useOpenRedact,
  usePIIDetector,
  useFormFieldValidator,
  useBatchDetector,
  useAutoRedact
} from 'openredact';

// Example 1: Basic detection with manual control
export function BasicDetectionExample() {
  const { detect, result, hasPII, count } = useOpenRedact({
    enableContextAnalysis: true
  });
  const [input, setInput] = useState('');

  const handleCheck = () => {
    detect(input);
  };

  return (
    <div className="example">
      <h3>Example 1: Basic Detection</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter text to check for PII..."
        rows={4}
        style={{ width: '100%' }}
      />
      <button onClick={handleCheck}>Check for PII</button>

      {result && (
        <div className={`result ${hasPII ? 'warning' : 'success'}`}>
          <p>
            <strong>Status:</strong> {hasPII ? `⚠️ Found ${count} PII item(s)` : '✅ No PII detected'}
          </p>
          {hasPII && (
            <>
              <p><strong>Redacted:</strong></p>
              <pre>{result.redacted}</pre>
              <details>
                <summary>Detection Details</summary>
                <ul>
                  {result.detections.map((d, i) => (
                    <li key={i}>
                      {d.type} - Severity: {d.severity}
                      {d.confidence && ` - Confidence: ${(d.confidence * 100).toFixed(1)}%`}
                    </li>
                  ))}
                </ul>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Example 2: Real-time detection with debouncing
export function RealTimeDetectionExample() {
  const [text, setText] = useState('');
  const { hasPII, detections, isDetecting } = usePIIDetector(text, {
    debounce: 500,
    enableContextAnalysis: true
  });

  return (
    <div className="example">
      <h3>Example 2: Real-time Detection (Debounced)</h3>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type to detect PII in real-time..."
        rows={4}
        style={{ width: '100%' }}
      />

      <div className="status">
        {isDetecting && <span>🔍 Analyzing...</span>}
        {!isDetecting && hasPII && (
          <div className="warning">
            ⚠️ PII Detected: {detections.length} item(s)
            <ul>
              {detections.map((d, i) => (
                <li key={i}>{d.type}</li>
              ))}
            </ul>
          </div>
        )}
        {!isDetecting && !hasPII && text && (
          <span className="success">✅ No PII detected</span>
        )}
      </div>
    </div>
  );
}

// Example 3: Form field validation
export function FormValidationExample() {
  const emailValidator = useFormFieldValidator({
    enableContextAnalysis: true,
    failOnPII: true,
    types: ['EMAIL', 'PHONE']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailValidator.isValid) {
      alert('Please fix validation errors');
      return;
    }

    alert('Form submitted successfully!');
  };

  return (
    <div className="example">
      <h3>Example 3: Form Field Validation</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Public Comment (no personal info):
            <textarea
              {...emailValidator.getFieldProps()}
              onChange={(e) => emailValidator.validate(e.target.value)}
              placeholder="Enter your comment..."
              rows={3}
              style={{ width: '100%' }}
            />
          </label>
          {emailValidator.error && (
            <p className="error" id="pii-error">
              ❌ {emailValidator.error}
            </p>
          )}
        </div>
        <button type="submit" disabled={!emailValidator.isValid}>
          Submit
        </button>
      </form>
    </div>
  );
}

// Example 4: Batch processing with progress
export function BatchProcessingExample() {
  const { processAll, results, isProcessing, progress, totalDetections } = useBatchDetector({
    enableContextAnalysis: true
  });

  const documents = [
    'Customer 1: john@example.com, 555-0123',
    'Customer 2: sarah@example.com, 555-0456',
    'Customer 3: mike@example.com, 555-0789'
  ];

  const handleProcess = async () => {
    await processAll(documents);
  };

  return (
    <div className="example">
      <h3>Example 4: Batch Processing</h3>
      <button onClick={handleProcess} disabled={isProcessing}>
        {isProcessing ? `Processing... ${progress.toFixed(0)}%` : 'Process Documents'}
      </button>

      {isProcessing && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      )}

      {results.length > 0 && (
        <div className="results">
          <p>
            <strong>Processed:</strong> {results.length} documents
          </p>
          <p>
            <strong>Total PII:</strong> {totalDetections} items
          </p>
          <ul>
            {results.map((result, i) => (
              <li key={i}>
                Document {i + 1}: {result.detections.length} PII item(s)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Example 5: Auto-redaction
export function AutoRedactionExample() {
  const { text, setText, redactedText, hasPII, detections } = useAutoRedact({
    debounce: 500,
    enableContextAnalysis: true
  });

  return (
    <div className="example">
      <h3>Example 5: Auto-Redaction</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>Original Text:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text with PII..."
            rows={6}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label>Redacted Text:</label>
          <textarea
            value={redactedText}
            readOnly
            rows={6}
            style={{ width: '100%', background: '#f5f5f5' }}
          />
        </div>
      </div>

      {hasPII && (
        <div className="info">
          <p>
            <strong>Detected:</strong> {detections.length} PII item(s)
          </p>
          <ul>
            {detections.map((d, i) => (
              <li key={i}>
                {d.type} ({d.severity} severity)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Main app combining all examples
export function App() {
  const [activeExample, setActiveExample] = useState(1);

  return (
    <div className="app">
      <header>
        <h1>🔒 OpenRedact React Examples</h1>
        <p>Real-time, client-side PII detection with React hooks</p>
      </header>

      <nav>
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setActiveExample(num)}
            className={activeExample === num ? 'active' : ''}
          >
            Example {num}
          </button>
        ))}
      </nav>

      <main>
        {activeExample === 1 && <BasicDetectionExample />}
        {activeExample === 2 && <RealTimeDetectionExample />}
        {activeExample === 3 && <FormValidationExample />}
        {activeExample === 4 && <BatchProcessingExample />}
        {activeExample === 5 && <AutoRedactionExample />}
      </main>

      <style>{`
        .app {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: system-ui, -apple-system, sans-serif;
        }

        header {
          text-align: center;
          margin-bottom: 2rem;
        }

        nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        nav button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
        }

        nav button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .example {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .result {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 4px;
        }

        .result.warning {
          background: #fff3cd;
          border: 1px solid #ffc107;
        }

        .result.success {
          background: #d4edda;
          border: 1px solid #28a745;
        }

        .error {
          color: #dc3545;
          margin-top: 0.5rem;
        }

        .progress-bar {
          height: 20px;
          background: #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
          margin: 1rem 0;
        }

        .progress-bar div {
          height: 100%;
          background: linear-gradient(90deg, #007bff, #0056b3);
          transition: width 0.3s ease;
        }

        pre {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
        }

        textarea {
          font-family: monospace;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        button {
          padding: 0.5rem 1rem;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        button:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}

export default App;
