import { CheckCircle2, Code, Package, Shield, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { TrackedDocsGettingStartedLink } from "@/components/TrackedLinks";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title:
    "Node.js Redaction API - Automated PII Detection & Redaction | OpenRedaction",
  description:
    "Automated redaction for Node.js applications. Open-source library with 500+ regex patterns for PII detection. Easy npm integration, GDPR/HIPAA compliant.",
  path: "/nodejs-redaction",
});

export default function NodejsRedaction() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              Automated Redaction for Node.js
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Open-source PII detection and redaction library for Node.js. 500+
              tested regex patterns, GDPR/HIPAA compliant. Easy npm integration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/playground"
                className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Try Playground
              </Link>
              <TrackedDocsGettingStartedLink
                location="nodejs_redaction_hero"
                className="bg-gray-900 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors border border-gray-800"
              >
                View Docs
              </TrackedDocsGettingStartedLink>
            </div>
            <p className="mt-6 text-sm text-gray-400">
              Full pipeline guide:{" "}
              <Link
                href="/pii-redaction"
                className="text-white underline underline-offset-4 hover:text-gray-200"
              >
                PII redaction
              </Link>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Package
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Easy npm Integration
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Install with a single command. Works with Express, Fastify,
                    NestJS, and any Node.js framework.
                  </p>
                  <pre className="overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 font-mono text-sm text-green-400">
                    <code>npm install openredaction</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Zap className="text-white mr-4 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Fast & Deterministic
                  </h2>
                  <p className="text-gray-300">
                    Regex-first detection runs entirely locally. No external API
                    calls, no latency. Process thousands of documents per
                    second.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Code
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Simple API</h2>
                  <p className="text-gray-300 mb-4">
                    Create an{" "}
                    <code className="text-gray-200">OpenRedaction</code>{" "}
                    instance and call{" "}
                    <code className="text-gray-200">detect()</code> (async).
                    Works in Express, Fastify, NestJS, and plain Node.
                  </p>
                  <pre className="overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 font-mono text-sm leading-6 text-green-400">
                    <code>{`import { OpenRedaction } from "openredaction";

const redactor = new OpenRedaction({
  preset: "gdpr",
  redactionMode: "placeholder",
});

const result = await redactor.detect(text);
console.log(result.redacted);`}</code>
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-start">
                <Shield
                  className="text-white mr-4 mt-1 flex-shrink-0"
                  size={24}
                />
                <div>
                  <h2 className="text-2xl font-semibold mb-3">Privacy-First</h2>
                  <p className="text-gray-300">
                    All processing happens locally. No data leaves your
                    infrastructure. No external API calls.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-3xl font-semibold mb-4">Express middleware</h2>
            <p className="text-gray-300 mb-4">
              Scrub request bodies at the gateway so every route inherits the
              same policy:
            </p>
            <pre className="mb-2 overflow-x-auto rounded-lg border border-gray-800 bg-black p-4 font-mono text-sm leading-6 text-green-400">
              <code>{`import express from "express";
import { openredactionMiddleware } from "@openredaction/express";

const app = express();
app.use(express.json());
app.use(openredactionMiddleware({ autoRedact: true }));`}</code>
            </pre>
            <p className="text-sm text-gray-400">
              Need LLM gateways, RAG, logs, and citations? See the{" "}
              <Link
                href="/pii-redaction"
                className="text-white underline underline-offset-4"
              >
                PII redaction guide
              </Link>
              .
            </p>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-12">
            <h2 className="text-3xl font-semibold mb-6">
              Use Cases for Node.js Redaction
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">
                  Log sanitization before storage
                </span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">
                  API request/response filtering
                </span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">
                  Email and chat message redaction
                </span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">
                  Document processing pipelines
                </span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">
                  GDPR/HIPAA compliance automation
                </span>
              </div>
              <div>
                <CheckCircle2 className="text-white inline mr-2" size={20} />
                <span className="text-gray-300">
                  Data export and backup sanitization
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-3xl font-semibold mb-4">
              Get Started with Node.js Redaction
            </h2>
            <p className="text-gray-300 mb-6">
              Start redacting PII in your Node.js applications in minutes. The
              open-source library is free and works entirely offline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <TrackedDocsGettingStartedLink
                location="nodejs_redaction_cta"
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                Installation Guide →
              </TrackedDocsGettingStartedLink>
              <Link
                href="/docs/api-reference"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                API Reference →
              </Link>
              <Link
                href="/docs/examples"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                Code Examples →
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Related Resources</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/pii-redaction"
                className="text-gray-300 hover:text-white underline"
              >
                PII Redaction Guide
              </Link>
              <Link
                href="/redact-pii-before-openai"
                className="text-gray-300 hover:text-white underline"
              >
                Redact Before OpenAI
              </Link>
              <Link
                href="/pii-detection"
                className="text-gray-300 hover:text-white underline"
              >
                PII Detection Guide
              </Link>
              <Link
                href="/pii-redaction"
                className="text-gray-300 hover:text-white underline"
              >
                PII Redaction
              </Link>
              <Link
                href="/gdpr-redaction"
                className="text-gray-300 hover:text-white underline"
              >
                GDPR Redaction
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
