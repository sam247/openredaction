"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WordPressWaitlistTrigger from "@/components/WordPressWaitlistTrigger";
import Link from "next/link";
import { Loader2, Copy, Check, ArrowRight, ChevronDown } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface Detection {
  type: string;
  text: string;
  start: number;
  end: number;
  severity?: string;
}

interface RedactResponse {
  redacted_text: string;
  detections: Detection[];
}

const MAX_INPUT_REGEX = 500; // 500 characters for regex-only demo limit

/** Presets exposed in the playground UI (must match OpenRedaction `PresetName` where applicable). */
const PLAYGROUND_PRESET_IDS = new Set([
  "gdpr",
  "hipaa",
  "ccpa",
  "finance",
  "education",
  "transportation",
]);

function playgroundPreset(selected: string): string {
  return PLAYGROUND_PRESET_IDS.has(selected) ? selected : "gdpr";
}

/**
 * Demo detector options. FP filter off avoids domain blocklists; samples should still use
 * non-`@example.com` addresses — the core EMAIL validator skips common test domains unless
 * the surrounding text looks like a test/spec context.
 */
function playgroundDetectorOptions(preset: string) {
  return {
    preset: playgroundPreset(preset),
    redactionMode: "placeholder" as const,
    customPatterns: [] as const,
    enableFalsePositiveFilter: false,
  };
}

export default function Playground() {
  const [inputText, setInputText] = useState("");
  const [output, setOutput] = useState<RedactResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"redacted" | "entities" | "json">(
    "redacted",
  );
  const [copied, setCopied] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("gdpr");
  const detectorRef = useRef<any>(null);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const pageViewTracked = useRef(false);

  // Track page view on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !pageViewTracked.current) {
      analytics.playgroundPageView(false);
      pageViewTracked.current = true;
    }
  }, []);

  // Lazy load OpenRedaction library only on client side
  useEffect(() => {
    if (typeof window !== "undefined" && !libraryLoaded) {
      const loadLibrary = async () => {
        try {
          // Load the CommonJS build from public folder at runtime (version query busts cache)
          const version =
            typeof process.env.NEXT_PUBLIC_OPENREDACTION_VERSION !== "undefined"
              ? process.env.NEXT_PUBLIC_OPENREDACTION_VERSION
              : "0";
          const response = await fetch(`/lib/openredaction.js?v=${version}`);
          const code = await response.text();

          // Create a module-like environment
          const moduleObj = { exports: {} };
          const exports = moduleObj.exports;

          // Wrap the code in a function that provides module/exports
          const fn = new Function("module", "exports", "require", code);
          fn(moduleObj, exports, () => {});

          // Get OpenRedaction from the loaded module
          const { OpenRedaction } = moduleObj.exports as any;
          console.log("OpenRedaction loaded:", !!OpenRedaction);

          detectorRef.current = new OpenRedaction(
            playgroundDetectorOptions(selectedPreset) as any,
          );
          console.log(
            "Detector created with config:",
            playgroundDetectorOptions(selectedPreset),
          );
          console.log(
            "Detector has detect method:",
            !!detectorRef.current?.detect,
          );
          setLibraryLoaded(true);
          analytics.playgroundPageView(true);
        } catch (err) {
          console.error("Failed to load OpenRedaction library:", err);
          setError(
            "Failed to load OpenRedaction library. Please refresh the page and try again.",
          );
          analytics.playgroundError("library_load", "regex");
        }
      };
      loadLibrary();
    }
  }, [selectedPreset, libraryLoaded]);

  // Update detector when preset changes
  useEffect(() => {
    if (libraryLoaded && detectorRef.current && typeof window !== "undefined") {
      const updateDetector = async () => {
        try {
          const version =
            typeof process.env.NEXT_PUBLIC_OPENREDACTION_VERSION !== "undefined"
              ? process.env.NEXT_PUBLIC_OPENREDACTION_VERSION
              : "0";
          const response = await fetch(`/lib/openredaction.js?v=${version}`);
          const code = await response.text();

          const moduleObj = { exports: {} };
          const exports = moduleObj.exports;
          const fn = new Function("module", "exports", "require", code);
          fn(moduleObj, exports, () => {});

          const { OpenRedaction } = moduleObj.exports as any;

          detectorRef.current = new OpenRedaction(
            playgroundDetectorOptions(selectedPreset) as any,
          );
        } catch (err) {
          console.error("Failed to update detector:", err);
        }
      };
      updateDetector();
    }
  }, [selectedPreset]);

  // API presets: gdpr, hipaa, ccpa, finance, education, transportation
  const apiPresets = {
    gdpr: "GDPR - General Data Protection defaults",
    hipaa: "HIPAA - Health data emphasis",
    ccpa: "CCPA - Consumer privacy defaults",
    finance: "Finance - Sector-focused bundle",
    education: "Education - Sector-focused bundle",
    transportation: "Transportation - Sector-focused bundle",
  };

  // Sample text presets for quick testing
  const textPresets = {
    "General chat input":
      "Hi, my name is John Doe and my email is john.doe@acmecorp.io. You can reach me at 555-123-4567.",
    "Customer support log":
      "Customer: Sarah Johnson\nEmail: sarah.j@company.com\nPhone: (555) 987-6543\nIssue: Account access problem\nSSN: 123-45-6789",
    "System log with IDs":
      "User ID: 12345\nIP Address: 192.168.1.100\nEmail: admin@system.com\nPhone: +1-555-000-1234\nTimestamp: 2024-01-15",
    "JSON API payload": JSON.stringify(
      {
        user: {
          name: "Jane Smith",
          email: "jane.smith@acmecorp.io",
          phone: "555-111-2222",
          address: "123 Main St, City, State 12345",
        },
        metadata: {
          ip: "10.0.0.1",
          ssn: "987-65-4321",
        },
      },
      null,
      2,
    ),
  };

  const handleTextPreset = (presetName: string) => {
    setInputText(textPresets[presetName as keyof typeof textPresets]);
    analytics.playgroundPresetChange(presetName, "text");
  };

  const handleApiPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    analytics.playgroundPresetChange(presetName, "api");
  };

  const handleRedact = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to redact");
      return;
    }

    if (inputText.length > MAX_INPUT_REGEX) {
      setError(
        `Text too long — please reduce input to ${MAX_INPUT_REGEX.toLocaleString()} characters. Current: ${inputText.length.toLocaleString()} characters.`,
      );
      analytics.playgroundError("text_too_long", "regex");
      return;
    }

    if (!libraryLoaded || !detectorRef.current) {
      setError("Library is still loading. Please wait a moment and try again.");
      analytics.playgroundError("library_load", "regex");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);

    try {
      // First, run regex detection
      const regexResult = await detectorRef.current.detect(inputText);
      console.log("Regex result:", regexResult);
      console.log("Regex result detections array:", regexResult.detections);

      const allDetections = [...(regexResult.detections || [])];
      console.log("Initial detections:", allDetections);
      console.log("Number of detections:", allDetections.length);

      allDetections.sort((a: any, b: any) => {
        const aStart = Array.isArray(a.position) ? a.position[0] : a.start || 0;
        const bStart = Array.isArray(b.position) ? b.position[0] : b.start || 0;
        return aStart - bStart;
      });

      // Use library output so overlaps, ordering, and modes stay consistent with core
      const redactedText = regexResult.redacted ?? inputText;

      const transformedData: RedactResponse = {
        redacted_text: redactedText,
        detections: allDetections.map((det: any) => ({
          type: det.type || "",
          text: det.value || "",
          start: Array.isArray(det.position) ? det.position[0] : det.start || 0,
          end: Array.isArray(det.position) ? det.position[1] : det.end || 0,
          severity: det.severity || "medium",
        })),
      };

      setOutput(transformedData);

      analytics.playgroundRedact({
        mode: "regex",
        inputLength: inputText.length,
        detectionCount: transformedData.detections.length,
        preset: selectedPreset || "none",
        hasApiKey: false,
        success: true,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while redacting text";
      setError(errorMessage);
      analytics.playgroundError("other", "regex");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Track copy action
    if (output) {
      analytics.playgroundCopy(activeTab, output.detections.length);
    }
  };

  const getRedactedDisplay = (
    redactedText: string,
    detections: Detection[],
  ) => {
    // For now, just return the redacted text from API
    // In the future, we can apply client-side transformations based on mode
    return redactedText;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24">
        {/* Top Bar */}
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 flex-wrap">
                  <div>
                    <p className="text-sm text-gray-300">
                      Try the OpenRedaction library in your browser. This is a
                      demo of the open-source library capabilities.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Nothing is logged or stored. Regex-only detection runs in
                      your browser using the open-source library. Sample
                      payloads use generic domains;{" "}
                      <code className="text-gray-400">@example.com</code> is
                      often skipped by built-in email rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col lg:flex-row h-auto lg:min-h-[min(560px,calc(100vh-12rem))] border border-gray-800 rounded-lg overflow-hidden bg-black">
            {/* Left Side - Input */}
            <div className="flex-1 lg:border-r border-b lg:border-b-0 border-gray-800 flex flex-col bg-black">
              <div className="p-4 border-b border-gray-800 space-y-3 bg-gray-900/50">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Detection preset:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedPreset}
                      onChange={(e) => handleApiPreset(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-md pl-3 pr-9 py-2.5 text-sm text-white focus:outline-hidden focus:border-gray-600 appearance-none cursor-pointer"
                    >
                      <option value="">None (default)</option>
                      {Object.entries(apiPresets).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      aria-hidden
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Load Sample Text:
                  </label>
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleTextPreset(e.target.value);
                          e.target.value = ""; // Reset to placeholder
                        }
                      }}
                      className="w-full bg-gray-900 border border-gray-800 rounded-md pl-3 pr-9 py-2.5 text-sm text-white focus:outline-hidden focus:border-gray-600 appearance-none cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select sample text...
                      </option>
                      {Object.keys(textPresets).map((preset) => (
                        <option key={preset} value={preset}>
                          {preset}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col shrink-0">
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_INPUT_REGEX) {
                      setInputText(e.target.value);
                    }
                  }}
                  placeholder="Paste chat logs, emails, or JSON here…"
                  rows={10}
                  className="w-full min-h-[10rem] max-h-[14rem] bg-gray-900/50 border border-gray-800 rounded-lg p-4 font-mono text-sm text-white placeholder-gray-500 focus:outline-hidden focus:border-gray-600 focus:ring-1 focus:ring-gray-600 resize-y transition-all"
                />
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span
                    className={`${inputText.length > MAX_INPUT_REGEX ? "text-red-400" : "text-gray-500"}`}
                  >
                    {inputText.length.toLocaleString()} /{" "}
                    {MAX_INPUT_REGEX.toLocaleString()} characters
                  </span>
                </div>
              </div>
              <div className="p-4 border-t border-gray-800 bg-gray-900/50 space-y-3">
                <button
                  onClick={handleRedact}
                  disabled={loading || !inputText.trim()}
                  className="w-full bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Redacting...</span>
                    </>
                  ) : (
                    <span>Detect & Redact PII</span>
                  )}
                </button>
              </div>
            </div>

            {/* Right Side - Output */}
            <div className="flex-1 flex flex-col min-h-[400px] lg:min-h-0">
              {error && (
                <div className="p-4 bg-red-900 border-b border-red-800">
                  <p className="text-red-200 text-sm break-words">{error}</p>
                </div>
              )}

              {output && (
                <>
                  {/* Tabs */}
                  <div className="flex border-b border-gray-800 bg-gray-900/50">
                    {(["redacted", "entities", "json"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => {
                          setActiveTab(tab);
                          analytics.playgroundTabChange(tab);
                        }}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                          activeTab === tab
                            ? "border-white text-white bg-gray-900/30"
                            : "border-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-900/20"
                        }`}
                      >
                        {tab === "redacted"
                          ? "Redacted Text"
                          : tab === "entities"
                            ? "Detected Entities"
                            : "JSON Diff"}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-auto">
                    {activeTab === "redacted" && (
                      <div className="p-4 h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-gray-400">
                            Redacted Output
                          </h3>
                          <div className="flex items-center gap-2">
                            {output.detections.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {output.detections.length} PII item
                                {output.detections.length !== 1 ? "s" : ""}{" "}
                                detected
                              </span>
                            )}
                            <button
                              onClick={() => handleCopy(output.redacted_text)}
                              className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors cursor-pointer"
                            >
                              {copied ? (
                                <Check size={16} />
                              ) : (
                                <Copy size={16} />
                              )}
                              <span>{copied ? "Copied!" : "Copy"}</span>
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 h-[calc(100%-60px)] overflow-auto">
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                            {output.redacted_text}
                          </pre>
                        </div>
                        {output.detections.length > 0 && (
                          <div className="mt-4 bg-gray-900 border border-gray-800 rounded-lg p-4">
                            <p className="text-sm text-gray-300 mb-3">
                              Want to use this in your application?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <a
                                href="https://github.com/sam247/openredaction"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 text-white hover:text-gray-300 text-sm font-medium"
                              >
                                <span>Install the library</span>
                                <ArrowRight size={16} />
                              </a>
                              <span className="text-gray-600 hidden sm:inline">
                                •
                              </span>
                              <Link
                                href="/docs"
                                className="inline-flex items-center space-x-2 text-white hover:text-gray-300 text-sm font-medium"
                              >
                                <span>View documentation</span>
                                <ArrowRight size={16} />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "entities" && (
                      <div className="p-4 h-full">
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-400 mb-4">
                            Detected Entities
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-800">
                                  <th className="text-left py-2 px-4 text-gray-400 font-semibold">
                                    Type
                                  </th>
                                  <th className="text-left py-2 px-4 text-gray-400 font-semibold">
                                    Original
                                  </th>
                                  <th className="text-left py-2 px-4 text-gray-400 font-semibold">
                                    Position
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {output.detections.map((det, idx) => (
                                  <tr
                                    key={idx}
                                    className="border-b border-gray-900 hover:bg-gray-900 transition-colors"
                                  >
                                    <td className="py-2 px-4">
                                      <span className="px-2 py-1 bg-blue-900 text-blue-300 rounded text-xs font-medium">
                                        {det.type}
                                      </span>
                                    </td>
                                    <td className="py-2 px-4 text-gray-300 font-mono text-xs">
                                      {det.text.length > 30
                                        ? `${det.text.substring(0, 30)}...`
                                        : det.text}
                                    </td>
                                    <td className="py-2 px-4 text-gray-400 text-xs">
                                      {det.start}-{det.end}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "json" && (
                      <div className="p-4 h-full">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-gray-400">
                            Raw JSON Response
                          </h3>
                          <button
                            onClick={() =>
                              handleCopy(JSON.stringify(output, null, 2))
                            }
                            className="flex items-center space-x-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-md text-sm transition-colors cursor-pointer"
                          >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copied ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>
                        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 h-[calc(100%-60px)] overflow-auto">
                          <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                            {JSON.stringify(output, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {!output && !loading && !error && (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center max-w-md px-4">
                    <p className="text-lg mb-2">Ready to redact</p>
                    <p className="text-sm">
                      Enter text on the left and click &quot;Detect & Redact
                      PII&quot;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Playground Guide Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">
              How to Use the Playground
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Getting Started
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-white mr-2">•</span>
                    <span>
                      Paste or type text containing PII (emails, phone numbers,
                      names, etc.) in the input field
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">•</span>
                    <span>
                      Select an API preset (GDPR, HIPAA, CCPA) or use the
                      default settings
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">•</span>
                    <span>
                      Detection uses the open-source library with 500+ regex
                      patterns
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">•</span>
                    <span>
                      Click &quot;Detect & Redact PII&quot; to process your text
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">•</span>
                    <span>
                      View results in three tabs: Redacted Text, Detected
                      Entities, or JSON Diff
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Limits & Restrictions
                </h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start">
                    <span className="text-white mr-2">•</span>
                    <span>
                      <strong>Demo limit:</strong>{" "}
                      {MAX_INPUT_REGEX.toLocaleString()} characters per request
                      in this playground
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">•</span>
                    <span>
                      No data is logged or stored — all processing runs in your
                      browser
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-2">•</span>
                    <span>
                      For high-volume use, self-host the library or{" "}
                      <Link
                        href="/pricing"
                        className="text-white hover:text-gray-300 underline"
                      >
                        contact us for enterprise support
                      </Link>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6">
              <h3 className="text-lg font-semibold mb-4 text-white">
                What Gets Detected?
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Contact Information
                  </h4>
                  <ul className="space-y-1">
                    <li>• Email addresses</li>
                    <li>• Phone numbers</li>
                    <li>• Physical addresses</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Identity & Financial
                  </h4>
                  <ul className="space-y-1">
                    <li>• Names (first, last, full)</li>
                    <li>• Social Security Numbers</li>
                    <li>• Credit card numbers</li>
                    <li>• Bank account numbers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Other Identifiers
                  </h4>
                  <ul className="space-y-1">
                    <li>• IP addresses</li>
                    <li>• Passport numbers</li>
                    <li>• Driver&apos;s license numbers</li>
                    <li>• Date of birth</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-white">
                Want to Use This in Your Application?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://github.com/sam247/openredaction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-2 bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                >
                  <span>Install Library</span>
                  <ArrowRight size={18} />
                </a>
                <a
                  href="/docs"
                  className="inline-flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <span>View Documentation</span>
                  <ArrowRight size={18} />
                </a>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  <span>Enterprise support</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-3 text-white">
                What&apos;s next
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Explore the project, read the docs, see what we&apos;re
                building, or get in touch.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://github.com/sam247/openredaction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                >
                  GitHub
                </a>
                <Link
                  href="/docs"
                  className="inline-flex items-center rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                >
                  Docs
                </Link>
                <Link
                  href="/roadmap"
                  className="inline-flex items-center rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                >
                  Roadmap
                </Link>
                <WordPressWaitlistTrigger
                  source="playground"
                  triggerLabel="WP waitlist"
                  triggerClassName="inline-flex items-center rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                />
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                >
                  Contact
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-gray-800"
                >
                  Enterprise
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="pb-16"></div>
      <Footer />
    </div>
  );
}
