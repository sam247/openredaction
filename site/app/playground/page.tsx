"use client";

import type { LiteOpenRedaction, PresetName } from "@openredaction/core/lite";
import { ArrowRight, Check, Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
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

/** Raised from 500 so paste-from-logs works; over-limit is blocked with a visible warning. */
const MAX_INPUT_REGEX = 5_000;

const INSTALL_COMMAND = "npm install openredaction";

const USAGE_SNIPPET = `import { OpenRedaction } from "openredaction";

const redactor = new OpenRedaction({ preset: "hipaa" });
const { redacted } = await redactor.detect(
  "Email me at jane@acme.com or call 415-555-2671"
);

console.log(redacted);
// Email me at [EMAIL_…] or call [PHONE_US_…]`;

const API_PRESETS: Record<string, string> = {
  hipaa: "HIPAA",
  ccpa: "CCPA",
  gdpr: "GDPR",
  finance: "Finance",
  education: "Education",
  transportation: "Transport",
};

/**
 * Samples are curated so every sensitive value redacts under the default HIPAA
 * preset. Person names are omitted on purpose — NAME matching is context-sensitive
 * and looks “broken” in a 30-second demo when a line like “Customer: Sarah Johnson”
 * does not redact.
 */
const SAMPLE_TEXTS = {
  support: `From: alex.rivera@northwind.io
Phone: 415-555-2671
SSN: 457-55-5462
Card: 4242424242424242
IP: 203.0.113.42`,
  chat: `Hi — email jordan.lee@acmecorp.io or call 415-555-2671. Card 4242424242424242.`,
  json: `{
  "email": "jane.smith@acmecorp.io",
  "phone": "415-555-2671",
  "ssn_note": "SSN: 457-55-5462",
  "card": "4242424242424242",
  "ip": "203.0.113.42"
}`,
} as const;

type SampleKey = keyof typeof SAMPLE_TEXTS;

/** Default: multi-field ticket that HIPAA regex patterns fully redact. */
const DEFAULT_SAMPLE_KEY: SampleKey = "support";
const DEFAULT_PRESET = "hipaa";

function playgroundPreset(selected: string): PresetName {
  return (selected in API_PRESETS ? selected : DEFAULT_PRESET) as PresetName;
}

function playgroundDetectorOptions(preset: string) {
  return {
    preset: playgroundPreset(preset),
    redactionMode: "placeholder" as const,
    customPatterns: [] as [],
    enableFalsePositiveFilter: false,
  };
}

function transformDetectResult(
  inputText: string,
  regexResult: {
    redacted?: string;
    detections?: Array<{
      type?: string;
      value?: string;
      position?: [number, number] | number[];
      start?: number;
      end?: number;
      severity?: string;
    }>;
  },
): RedactResponse {
  const allDetections = [...(regexResult.detections || [])];

  allDetections.sort((a, b) => {
    const aStart = Array.isArray(a.position) ? a.position[0] : (a.start ?? 0);
    const bStart = Array.isArray(b.position) ? b.position[0] : (b.start ?? 0);
    return aStart - bStart;
  });

  return {
    redacted_text: regexResult.redacted ?? inputText,
    detections: allDetections.map((det) => ({
      type: det.type || "",
      text: det.value || "",
      start: Array.isArray(det.position) ? det.position[0] : (det.start ?? 0),
      end: Array.isArray(det.position) ? det.position[1] : (det.end ?? 0),
      severity: det.severity || "medium",
    })),
  };
}

function CopyButton({
  label,
  text,
  onCopied,
}: {
  label: string;
  text: string;
  onCopied?: () => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onCopied?.();
        window.setTimeout(() => setCopied(false), 2000);
      }}
      className="inline-flex items-center gap-1.5 rounded-md border border-gray-700 bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-gray-800 cursor-pointer"
    >
      {copied ? (
        <Check size={14} aria-hidden />
      ) : (
        <Copy size={14} aria-hidden />
      )}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

function InstallPath({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={
        compact
          ? "rounded-lg border border-gray-800 bg-gray-950/80 p-4"
          : "rounded-lg border border-gray-700 bg-gray-950 p-5"
      }
    >
      <h3 className="text-sm font-semibold text-white">Use this in your app</h3>
      <p className="mt-1 text-xs text-gray-400">
        Same detection path as this playground — install and call{" "}
        <code className="text-gray-300">detect()</code>.
      </p>

      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Install
            </span>
            <CopyButton label="Copy" text={INSTALL_COMMAND} />
          </div>
          <pre className="overflow-x-auto rounded-md border border-gray-800 bg-black px-3 py-2 font-mono text-sm text-green-400">
            {INSTALL_COMMAND}
          </pre>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Usage
            </span>
            <CopyButton label="Copy" text={USAGE_SNIPPET} />
          </div>
          <pre className="overflow-x-auto rounded-md border border-gray-800 bg-black px-3 py-2 font-mono text-xs leading-relaxed text-gray-300">
            {USAGE_SNIPPET}
          </pre>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        <a
          href="https://github.com/sam247/openredaction"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300"
        >
          View source on GitHub
        </a>
        {" · "}
        <Link
          href="/docs/getting-started"
          className="underline hover:text-gray-300"
        >
          Docs
        </Link>
      </p>
    </div>
  );
}

export default function Playground() {
  const [inputText, setInputText] = useState<string>(
    SAMPLE_TEXTS[DEFAULT_SAMPLE_KEY],
  );
  const [activeSample, setActiveSample] = useState<SampleKey | null>(
    DEFAULT_SAMPLE_KEY,
  );
  const [output, setOutput] = useState<RedactResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"redacted" | "entities" | "json">(
    "redacted",
  );
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(DEFAULT_PRESET);
  const [libraryLoaded, setLibraryLoaded] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(true);

  const detectorRef = useRef<LiteOpenRedaction | null>(null);
  const liteModuleRef = useRef<
    typeof import("@openredaction/core/lite") | null
  >(null);
  const autoDemoRan = useRef(false);
  const pageViewTracked = useRef(false);
  const inputTextRef = useRef(inputText);
  const selectedPresetRef = useRef(selectedPreset);

  inputTextRef.current = inputText;
  selectedPresetRef.current = selectedPreset;

  const overLimit = inputText.length > MAX_INPUT_REGEX;

  useEffect(() => {
    if (!pageViewTracked.current) {
      analytics.playgroundPageView(false);
      pageViewTracked.current = true;
    }
  }, []);

  const runDetect = useCallback(async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      setError("Please enter some text to redact");
      return;
    }

    if (text.length > MAX_INPUT_REGEX) {
      setError(
        `Input is over the ${MAX_INPUT_REGEX.toLocaleString()}-character demo limit (${text.length.toLocaleString()} characters). Shorten the text to continue.`,
      );
      analytics.playgroundError("text_too_long", "regex");
      return;
    }

    if (!detectorRef.current) {
      setError("Library is still loading. Please wait a moment.");
      analytics.playgroundError("library_load", "regex");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const regexResult = await detectorRef.current.detect(text);
      const transformedData = transformDetectResult(text, regexResult);
      setOutput(transformedData);

      analytics.playgroundRedact({
        mode: "regex",
        inputLength: text.length,
        detectionCount: transformedData.detections.length,
        preset: selectedPresetRef.current || "none",
        hasApiKey: false,
        success: true,
      });

      autoDemoRan.current = true;
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
  }, []);

  // Load lite module once; recreate detector when preset changes (no re-download).
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let cancelled = false;

    const ensureDetector = async () => {
      try {
        if (!liteModuleRef.current) {
          setLibraryLoading(true);
          const version =
            process.env.NEXT_PUBLIC_OPENREDACTION_VERSION !== undefined
              ? process.env.NEXT_PUBLIC_OPENREDACTION_VERSION
              : "0";
          const url = `${window.location.origin}/lib/openredaction-lite.mjs?v=${encodeURIComponent(version)}`;
          liteModuleRef.current = (await import(
            /* webpackIgnore: true */ url
          )) as typeof import("@openredaction/core/lite");
        }

        if (cancelled || !liteModuleRef.current) {
          return;
        }

        const { LiteOpenRedaction } = liteModuleRef.current;
        detectorRef.current = new LiteOpenRedaction(
          playgroundDetectorOptions(selectedPreset),
        );
        setLibraryLoaded(true);
        setLibraryLoading(false);
        setError(null);
        analytics.playgroundPageView(true);

        void runDetect(inputTextRef.current);
      } catch (err) {
        console.error("Failed to load OpenRedaction library:", err);
        if (!cancelled) {
          setLibraryLoaded(false);
          setLibraryLoading(false);
          setError(
            "Failed to load OpenRedaction library. Please refresh the page and try again.",
          );
          analytics.playgroundError("library_load", "regex");
        }
      }
    };

    void ensureDetector();

    return () => {
      cancelled = true;
    };
  }, [selectedPreset, runDetect]);

  const handleSampleChip = (key: SampleKey) => {
    setActiveSample(key);
    setInputText(SAMPLE_TEXTS[key]);
    setError(null);
    analytics.playgroundPresetChange(key, "text");

    if (libraryLoaded && detectorRef.current) {
      void runDetect(SAMPLE_TEXTS[key]);
    }
  };

  const handleCopyOutput = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedOutput(true);
    window.setTimeout(() => setCopiedOutput(false), 2000);

    if (output) {
      analytics.playgroundCopy(activeTab, output.detections.length);
    }
  };

  const detectDisabled =
    loading ||
    libraryLoading ||
    !libraryLoaded ||
    !inputText.trim() ||
    overLimit;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-24">
        <div className="border-b border-gray-800 bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-white">
              Runs entirely in your browser. Your text never leaves your device.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Try OpenRedaction before you install — same open-source regex
              engine, in the browser.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <li>Browser-only</li>
              <li aria-hidden className="text-gray-700">
                ·
              </li>
              <li>MIT licensed</li>
              <li aria-hidden className="text-gray-700">
                ·
              </li>
              <li>500+ PII patterns</li>
              <li aria-hidden className="text-gray-700">
                ·
              </li>
              <li>Open source</li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg border border-gray-800 bg-black lg:flex lg:min-h-[min(560px,calc(100vh-11rem))]">
            {/* Input */}
            <div className="flex flex-col border-b border-gray-800 bg-black lg:w-1/2 lg:border-b-0 lg:border-r">
              <div className="space-y-3 border-b border-gray-800 bg-gray-900/50 p-4">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">
                    Sample
                  </p>
                  <fieldset>
                    <legend className="sr-only">Sample texts</legend>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ["support", "Support log"],
                          ["chat", "Chat"],
                          ["json", "JSON"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => handleSampleChip(key)}
                          className={`rounded-md border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                            activeSample === key
                              ? "border-white bg-white text-black"
                              : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">
                    Every value in these samples is chosen because the{" "}
                    <span className="text-gray-400">HIPAA</span> regex preset
                    redacts it (email, US phone, SSN, card, IP). Person names
                    are omitted on purpose — name detection is context-sensitive
                    and easy to misread in a quick demo. Switch preset to see
                    coverage change (e.g. GDPR prioritises UK/EU identifiers and
                    will not redact US SSN).
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="playground-preset"
                    className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    Detection preset
                  </label>
                  <select
                    id="playground-preset"
                    value={selectedPreset}
                    onChange={(e) => {
                      setSelectedPreset(e.target.value);
                      analytics.playgroundPresetChange(e.target.value, "api");
                    }}
                    className="w-full cursor-pointer appearance-none rounded-md border border-gray-800 bg-gray-900 py-2 pl-3 pr-8 text-sm text-white focus:border-gray-600 focus:outline-hidden"
                  >
                    {Object.entries(API_PRESETS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex shrink-0 flex-col p-4">
                <label htmlFor="playground-input" className="sr-only">
                  Text to redact
                </label>
                <textarea
                  id="playground-input"
                  value={inputText}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setActiveSample(null);
                    if (error && e.target.value.length <= MAX_INPUT_REGEX) {
                      setError(null);
                    }
                  }}
                  placeholder="Paste chat logs, emails, or JSON here…"
                  rows={8}
                  className="min-h-[10rem] w-full resize-y rounded-lg border border-gray-800 bg-gray-900/50 p-4 font-mono text-sm text-white placeholder-gray-500 transition-all focus:border-gray-600 focus:outline-hidden focus:ring-1 focus:ring-gray-600"
                />
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span
                    className={
                      overLimit ? "font-medium text-amber-400" : "text-gray-500"
                    }
                  >
                    {inputText.length.toLocaleString()} /{" "}
                    {MAX_INPUT_REGEX.toLocaleString()} characters
                    {overLimit
                      ? " — over demo limit; shorten to run detection"
                      : null}
                  </span>
                  {libraryLoading ? (
                    <span className="inline-flex items-center gap-1.5 text-gray-400">
                      <Loader2 className="animate-spin" size={14} aria-hidden />
                      Loading library…
                    </span>
                  ) : libraryLoaded ? (
                    <span className="text-gray-600">Library ready</span>
                  ) : null}
                </div>
              </div>

              <div className="sticky bottom-0 border-t border-gray-800 bg-gray-900/95 p-4 backdrop-blur-sm lg:static lg:bg-gray-900/50 lg:backdrop-blur-none">
                <button
                  type="button"
                  onClick={() => void runDetect(inputText)}
                  disabled={detectDisabled}
                  className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-white px-6 py-3 font-semibold text-black shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none"
                >
                  {libraryLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} aria-hidden />
                      <span>Loading library…</span>
                    </>
                  ) : loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} aria-hidden />
                      <span>Redacting…</span>
                    </>
                  ) : (
                    <span>Detect &amp; Redact PII</span>
                  )}
                </button>
              </div>
            </div>

            {/* Output — sits directly under Detect on mobile */}
            <div className="flex min-h-[320px] flex-col lg:w-1/2 lg:min-h-0">
              {error ? (
                <div
                  className="border-b border-red-800 bg-red-950/80 p-4"
                  role="alert"
                >
                  <p className="break-words text-sm text-red-200">{error}</p>
                </div>
              ) : null}

              {loading && !output ? (
                <div className="flex flex-1 items-center justify-center text-gray-500">
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="animate-spin" size={18} aria-hidden />
                    Running detection…
                  </div>
                </div>
              ) : null}

              {output ? (
                <>
                  <div className="flex border-b border-gray-800 bg-gray-900/50">
                    {(
                      [
                        ["redacted", "Redacted Text"],
                        ["entities", "Detected Entities"],
                        ["json", "Raw JSON"],
                      ] as const
                    ).map(([tab, label]) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => {
                          setActiveTab(tab);
                          analytics.playgroundTabChange(tab);
                        }}
                        className={`cursor-pointer border-b-2 px-4 py-3 text-sm font-medium transition-all sm:px-6 ${
                          activeTab === tab
                            ? "border-white bg-gray-900/30 text-white"
                            : "border-transparent text-gray-400 hover:bg-gray-900/20 hover:text-gray-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-auto">
                    {activeTab === "redacted" ? (
                      <div className="flex h-full flex-col p-4">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <div>
                            <h2 className="text-sm font-semibold text-gray-400">
                              Redacted output
                            </h2>
                            <p className="text-xs text-gray-500">
                              {output.detections.length} PII item
                              {output.detections.length !== 1 ? "s" : ""}{" "}
                              detected
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              void handleCopyOutput(output.redacted_text)
                            }
                            className="flex cursor-pointer items-center space-x-2 rounded-md bg-gray-800 px-3 py-1 text-sm transition-colors hover:bg-gray-700"
                          >
                            {copiedOutput ? (
                              <Check size={16} aria-hidden />
                            ) : (
                              <Copy size={16} aria-hidden />
                            )}
                            <span>{copiedOutput ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>
                        <div className="min-h-[8rem] flex-1 overflow-auto rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
                            {output.redacted_text}
                          </pre>
                        </div>
                        <div className="mt-4 lg:hidden">
                          <InstallPath compact />
                        </div>
                      </div>
                    ) : null}

                    {activeTab === "entities" ? (
                      <div className="p-4">
                        <h2 className="mb-4 text-sm font-semibold text-gray-400">
                          Detected entities
                        </h2>
                        {output.detections.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No entities detected for this input and preset.
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-800">
                                  <th className="px-4 py-2 text-left font-semibold text-gray-400">
                                    Type
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-400">
                                    Original
                                  </th>
                                  <th className="px-4 py-2 text-left font-semibold text-gray-400">
                                    Position
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {output.detections.map((det, idx) => (
                                  <tr
                                    key={`${det.type}-${det.start}-${idx}`}
                                    className="border-b border-gray-900 hover:bg-gray-900"
                                  >
                                    <td className="px-4 py-2">
                                      <span className="rounded bg-blue-950 px-2 py-1 text-xs font-medium text-blue-300">
                                        {det.type}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 font-mono text-xs text-gray-300">
                                      {det.text.length > 48
                                        ? `${det.text.slice(0, 48)}…`
                                        : det.text}
                                    </td>
                                    <td className="px-4 py-2 text-xs text-gray-400">
                                      {det.start}-{det.end}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {activeTab === "json" ? (
                      <div className="flex h-full flex-col p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h2 className="text-sm font-semibold text-gray-400">
                            Raw JSON response
                          </h2>
                          <button
                            type="button"
                            onClick={() =>
                              void handleCopyOutput(
                                JSON.stringify(output, null, 2),
                              )
                            }
                            className="flex cursor-pointer items-center space-x-2 rounded-md bg-gray-800 px-3 py-1 text-sm transition-colors hover:bg-gray-700"
                          >
                            {copiedOutput ? (
                              <Check size={16} aria-hidden />
                            ) : (
                              <Copy size={16} aria-hidden />
                            )}
                            <span>{copiedOutput ? "Copied!" : "Copy"}</span>
                          </button>
                        </div>
                        <div className="flex-1 overflow-auto rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                          <pre className="font-mono text-sm leading-relaxed text-gray-300">
                            {JSON.stringify(output, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              ) : null}

              {!output && !loading && !error && libraryLoading ? (
                <div className="flex flex-1 items-center justify-center text-gray-500">
                  <div className="flex items-center gap-2 px-4 text-sm">
                    <Loader2 className="animate-spin" size={18} aria-hidden />
                    Preparing demo…
                  </div>
                </div>
              ) : null}

              {!output && !loading && !error && !libraryLoading ? (
                <div className="flex flex-1 items-center justify-center text-gray-500">
                  <p className="px-4 text-center text-sm">
                    Enter text and run Detect &amp; Redact PII
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Desktop install path beside the demo — conversion after “it works” */}
          <div className="mt-6 hidden lg:block">
            <InstallPath />
          </div>

          <div className="mt-8 mb-16 max-w-3xl text-sm text-gray-400">
            <p>
              This demo uses the browser build of the open-source library (regex
              patterns). Self-hosting has no character limit —{" "}
              <Link
                href="/docs/getting-started"
                className="text-gray-300 underline hover:text-white"
              >
                get started in the docs
              </Link>
              .
            </p>
            <p className="mt-3">
              <a
                href="https://github.com/sam247/openredaction"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gray-300 underline hover:text-white"
              >
                GitHub repository
                <ArrowRight size={14} aria-hidden />
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
