import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import TestimonialCard from '@/components/TestimonialCard';
import FAQAccordion from '@/components/FAQAccordion';
import HomepageCTAs from '@/components/HomepageCTAs';
import DemoCTA from '@/components/DemoCTA';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { Rocket, Search, CheckCircle2, Shield, Package, BarChart3, Lock, Target, Zap, Home as HomeIcon, Eye, DollarSign, Key, Trash2 } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Open Source PII Detection & Redaction | OpenRedaction',
  description: 'Regex-first PII redaction. Open-source library with 500+ tested patterns. Self-host for complete privacy and control. GDPR, HIPAA, CCPA compliant.',
  path: '/',
});

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      {/* Hero Section */}
      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gray-900 px-4 py-2 rounded-full mb-8 mt-8">
              <span className="text-sm text-gray-300">500+ Tested Patterns • Fast & Deterministic</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              Open-source, Automated PII Redaction.<br className="hidden md:block" /> Regex-first PII detection.
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              500+ patterns. Free, open-source. Self-host for full control.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <HomepageCTAs />
            </div>

            {/* Demo Section */}
            <div className="mt-20 bg-gray-900 rounded-lg p-8 border border-gray-800 max-w-7xl mx-auto">
              <div className="text-left">
                <h2 className="text-2xl font-semibold mb-4">Try it out</h2>
                <div className="bg-black rounded-lg p-4 border border-gray-800 font-mono text-sm">
                  <div className="text-gray-400 mb-2">Input:</div>
                  <div className="text-white mb-4">
                    &quot;Hi, my name is John Doe and my email is john@example.com. 
                    My SSN is 123-45-6789.&quot;
                  </div>
                  <div className="text-gray-400 mb-2">Output:</div>
                  <div className="text-green-400">
                    &quot;Hi, my name is [REDACTED] and my email is [REDACTED]. 
                    My SSN is [REDACTED].&quot;
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <DemoCTA />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Examples Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real examples of how OpenRedaction detects and redacts PII from different types of text
            </p>
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example 1: Email & Phone */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Email & Phone Number</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-mono">Input:</div>
                  <div className="bg-black rounded p-3 border border-gray-800 text-sm text-white font-mono">
                    Contact Sarah at sarah.johnson@company.com or call (555) 987-6543
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-mono">Output:</div>
                  <div className="bg-black rounded p-3 border border-gray-800 text-sm text-green-400 font-mono">
                    Contact [REDACTED] at [REDACTED] or call [REDACTED]
                  </div>
                </div>
              </div>
            </div>

            {/* Example 2: Address & SSN */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Address & SSN</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-mono">Input:</div>
                  <div className="bg-black rounded p-3 border border-gray-800 text-sm text-white font-mono">
                    John Smith, 123 Main St, New York, NY 10001. SSN: 123-45-6789
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-mono">Output:</div>
                  <div className="bg-black rounded p-3 border border-gray-800 text-sm text-green-400 font-mono">
                    [REDACTED], [REDACTED]. SSN: [REDACTED]
                  </div>
                </div>
              </div>
            </div>

            {/* Example 3: Credit Card */}
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Credit Card Number</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-mono">Input:</div>
                  <div className="bg-black rounded p-3 border border-gray-800 text-sm text-white font-mono">
                    Payment card: 4532-1234-5678-9010, expires 12/25
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-2 font-mono">Output:</div>
                  <div className="bg-black rounded p-3 border border-gray-800 text-sm text-green-400 font-mono">
                    Payment card: [REDACTED], expires [REDACTED]
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/playground"
              className="inline-block bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Try More Examples in Playground →
            </Link>
          </div>
        </div>

        {/* Blog Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <Link
            href="/blog/building-openredaction-developer-journey"
            className="block bg-gradient-to-r from-gray-900 to-black rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors group"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Rocket className="text-white" size={24} />
                <div>
                  <p className="text-white font-semibold group-hover:text-green-400 transition-colors">
                    New: Read the OpenRedaction developer journey
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Developer Journey →</p>
                </div>
              </div>
              <span className="text-gray-500 group-hover:text-white transition-colors">→</span>
            </div>
          </Link>
        </div>

        {/* Benefits Section - Bento Box Layout */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose OpenRedaction?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Focus on what matters - we handle the complexity of PII detection
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Search className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Regex-Based Redaction</h3>
              <p className="text-gray-400">
                Transparent, deterministic detection using 500+ tested regex patterns for detecting names, emails, SSNs, phone numbers, and more. Fast, reliable, and fully auditable.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <CheckCircle2 className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Comply with GDPR Instantly</h3>
              <p className="text-gray-400">
                Automatically detect and redact PII to meet GDPR, HIPAA, and CCPA requirements. 
                Our 500+ tested regex patterns handle it all with deterministic, transparent results.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Shield className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Protect Customer Data Automatically</h3>
              <p className="text-gray-400">
                Real-time PII detection ensures sensitive information never leaves your system unprotected.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Package className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Simple npm Install</h3>
              <p className="text-gray-400">
                Install via npm and use directly in your application. Self-host for complete control.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <BarChart3 className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Self-Hosted Control</h3>
              <p className="text-gray-400">
                When self-hosted, you control all logging and data handling. Track PII detections 
                with detailed reporting for compliance and security reviews.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Lock className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Zero Data Retention</h3>
              <p className="text-gray-400">
                When self-hosted, your data is processed in-memory and never stored. No persistent databases. 
                You maintain complete control over your data.
              </p>
            </div>
          </div>
        </div>

        {/* Why Pattern-Based Detection Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Pattern-Based Detection?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Fast, transparent, and privacy-preserving PII detection built for developers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Target className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Deterministic & Transparent</h3>
              <p className="text-gray-400">
                Same input always produces the same output. Patterns are visible and testable - no black box AI.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Zap className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Fast Processing</h3>
              <p className="text-gray-400">
                Processes in milliseconds with no external API calls. No waiting for third-party AI services.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <HomeIcon className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Runs Locally</h3>
              <p className="text-gray-400">
                No data leaves your environment. Process everything on your infrastructure for maximum privacy.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Lock className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Privacy-Preserving</h3>
              <p className="text-gray-400">
                No third-party AI models. No data sent to external services. Complete control over your data.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Eye className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Easy to Audit</h3>
              <p className="text-gray-400">
                Patterns are visible and testable. Perfect for compliance reviews and security audits.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <DollarSign className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Predictable Costs</h3>
              <p className="text-gray-400">
                No per-token pricing. Self-hosted version has zero variable costs. Predictable and affordable.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple, transparent, and privacy-aware PII redaction
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Regex detection</h3>
                    <p className="text-gray-400">
                      We run our hardened regex patterns over your text. This is the default and primary detection method - fast, deterministic, and transparent.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Redact</h3>
                    <p className="text-gray-400">
                      Detected spans are redacted in memory by the OpenRedaction engine. All processing is local; nothing is sent to external services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 bg-black rounded-lg p-6 border border-gray-800">
              <p className="text-gray-300 text-center">
                Text is processed in memory and discarded — we store nothing.
              </p>
            </div>
          </div>
        </div>

        {/* Getting Started Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Getting Started</h2>
            <p className="text-xl text-gray-300">Get started in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Try the Playground</h3>
              <p className="text-gray-400">
                Test OpenRedaction with our free playground. No signup required - see how it works instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Install the Library</h3>
              <p className="text-gray-400">
                Install via npm: <code className="bg-gray-800 px-2 py-1 rounded text-sm">npm install openredaction</code>. 
                Use directly in your Node.js application.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Deploy Self-Hosted</h3>
              <p className="text-gray-400">
                Self-host on your infrastructure for complete privacy and control. 
                Contribute on GitHub to help improve the library.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/use-cases/healthcare"
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">Healthcare</h3>
              <p className="text-gray-400 text-sm">
                Protect patient data in medical records and communications
              </p>
            </Link>
            <Link
              href="/use-cases/legal"
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">Legal</h3>
              <p className="text-gray-400 text-sm">
                Redact sensitive information from legal documents
              </p>
            </Link>
            <Link
              href="/use-cases/finance"
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">Finance</h3>
              <p className="text-gray-400 text-sm">
                Secure financial documents and customer communications
              </p>
            </Link>
            <Link
              href="/use-cases/education"
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">Education</h3>
              <p className="text-gray-400 text-sm">
                Protect student privacy in educational records
              </p>
            </Link>
          </div>
        </div>

        {/* Simple Installation Section */}
        <div className="mt-32 bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Installation</h2>
              <p className="text-xl text-gray-300 mb-8">
                Install the open-source library and start detecting PII in minutes
              </p>
              <div className="bg-black rounded-lg p-6 border border-gray-800 text-left">
                <div className="text-gray-400 text-sm mb-2">Install via npm</div>
                <pre className="text-green-400 font-mono text-sm overflow-x-auto mb-4">
{`npm install openredaction`}
                </pre>
                <div className="text-gray-400 text-sm mb-2 mt-4">Use in your code</div>
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import { redact } from 'openredaction';

const result = await redact('Your text here');
console.log(result.redacted_text);`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Compliance Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Secure PII Detection for Self-Hosted Deployments
            </h2>
            <p className="text-xl text-gray-300">
              Self-hosted security with zero data retention
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Key className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Self-Hosted Control</h3>
              <p className="text-gray-400">
                Self-hosted deployments give you complete control. Processes text in memory, never stores raw input. 
                No persistent databases by default. Your data never leaves your environment.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <Zap className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Deploy Anywhere</h3>
              <p className="text-gray-400">
                Open-source library works with Node.js and can be integrated into any application. 
                Self-host on your infrastructure for complete privacy.
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <BarChart3 className="text-white mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Self-Hosted Logging</h3>
              <p className="text-gray-400">
                When self-hosted, you manage all logging. Complete detection logs with entity types, positions, and timestamps. 
                Perfect for compliance reporting.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Loved by Developers Worldwide</h2>
            <p className="text-xl text-gray-300">See what our users are saying</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Sarah Chen"
              role="Lead Developer"
              company="TechCorp"
              content="OpenRedaction saved us weeks of development time. The open-source library is transparent and easy to integrate. Self-hosting gives us complete control over our data."
              rating={5}
            />
            <TestimonialCard
              name="Michael Rodriguez"
              role="CTO"
              company="HealthData Inc"
              content="We needed HIPAA-compliant PII detection and OpenRedaction delivered. The self-hosted option gives us complete control, and the regex patterns are transparent and auditable."
              rating={5}
            />
            <TestimonialCard
              name="Emily Johnson"
              role="Privacy Officer"
              company="FinanceSecure"
              content="The regex-first approach is perfect for our needs. We can audit all patterns, and self-hosting ensures our data never leaves our environment. The open-source community is helpful."
              rating={5}
            />
          </div>
        </div>


        {/* Our Open-Source Tools Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Open-Source Tools</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              OpenRedaction offers open-source solutions for PII detection and redaction
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-3">OpenRedaction (npm library)</h3>
              <p className="text-gray-300 mb-4">
                Open-source regex library, developer-friendly, available via npm. Use directly in your Node.js applications. 
                Self-host for complete privacy and control.
              </p>
              <a
                href="https://github.com/sam247/openredaction"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 underline text-sm"
              >
                View on GitHub →
              </a>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-2xl font-semibold mb-3">OpenRedaction-site (this site)</h3>
              <p className="text-gray-300 mb-4">
                Playground where users can try redaction in the browser, with no storage. 
                Free demo of the library capabilities.
              </p>
              <Link
                href="/playground"
                className="text-white hover:text-gray-300 underline text-sm"
              >
                Try Playground →
              </Link>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 md:col-span-2">
              <h3 className="text-2xl font-semibold mb-3">Disclosurely.com</h3>
              <p className="text-gray-300 mb-4">
                A separate whistleblowing platform with compliance features and advanced auditing. 
                Uses OpenRedaction for PII protection.
              </p>
              <a
                href="https://disclosurely.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 underline text-sm"
              >
                Visit Disclosurely.com →
              </a>
            </div>
          </div>
        </div>

        {/* Cost Comparison Section */}
        <div className="mt-32 bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Open Source, Self-Hosted</h2>
              <p className="text-xl text-gray-300 mb-4">
                The OpenRedaction library is free and open source. Use it locally or self-host with no fees.
              </p>
              <p className="text-lg text-gray-400 mb-8">
                For enterprise support, custom deployments, or SLAs, contact us.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-800">
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-4">Self-Hosted OpenRedaction</h3>
                    <div className="text-3xl font-bold text-green-400 mb-2">$0 Variable</div>
                    <p className="text-gray-300 text-sm mb-4">One-time setup</p>
                    <ul className="text-left space-y-2 text-gray-400 text-sm">
                      <li>• No per-request fees</li>
                      <li>• Only infrastructure costs</li>
                      <li>• No usage limits</li>
                      <li>• Open-source and free</li>
                    </ul>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-4">AWS/Google Cloud</h3>
                    <div className="text-3xl font-bold text-yellow-400 mb-2">Per-Token</div>
                    <p className="text-gray-300 text-sm mb-4">Variable pricing</p>
                    <ul className="text-left space-y-2 text-gray-400 text-sm">
                      <li>• Pay per character/token</li>
                      <li>• Costs scale with usage</li>
                      <li>• 1M requests: $100s-$1000s</li>
                      <li>• Proprietary and vendor-locked</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Not AWS/Google Comparison */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why OpenRedaction vs. AWS/Google?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Open source, self-hostable, and privacy-first - data never leaves your environment
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left p-4 text-gray-300 font-semibold">Feature</th>
                    <th className="text-center p-4 text-gray-300 font-semibold">OpenRedaction</th>
                    <th className="text-center p-4 text-gray-300 font-semibold">AWS/Google</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  <tr>
                    <td className="p-4 text-gray-300">Open Source</td>
                    <td className="p-4 text-center text-green-400">✓ Yes</td>
                    <td className="p-4 text-center text-gray-500">✗ Proprietary</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-300">Self-Hostable</td>
                    <td className="p-4 text-center text-green-400">✓ Yes</td>
                    <td className="p-4 text-center text-gray-500">✗ Cloud-only</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-300">Data Retention</td>
                    <td className="p-4 text-center text-green-400">✓ None</td>
                    <td className="p-4 text-center text-yellow-400">⚠ May log data</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-300">Account Required</td>
                    <td className="p-4 text-center text-green-400">✓ No</td>
                    <td className="p-4 text-center text-gray-500">✗ Yes</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-300">Pricing Model</td>
                    <td className="p-4 text-center text-green-400">✓ Predictable</td>
                    <td className="p-4 text-center text-yellow-400">⚠ Per-token</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-300">Compliance Setup</td>
                    <td className="p-4 text-center text-green-400">✓ Simple</td>
                    <td className="p-4 text-center text-yellow-400">⚠ Complex</td>
                  </tr>
                  <tr>
                    <td className="p-4 text-gray-300">Data Control</td>
                    <td className="p-4 text-center text-green-400">✓ Full control</td>
                    <td className="p-4 text-center text-gray-500">✗ Vendor-dependent</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-300 text-lg">
                <strong>With self-hosted OpenRedaction, your data never leaves your environment.</strong> 
                Complete privacy and control.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <FAQAccordion
            columns={2}
            items={[
              {
                question: 'Do you store my data?',
                answer: 'When self-hosted, your data never leaves your environment. The library processes text in memory and never persists it. No data is stored or logged. Processes run in real-time with zero data retention. You maintain complete control over your data.',
              },
              {
                question: 'Is this ISO/SOC compliant?',
                answer: 'OpenRedaction is an open-source library. When self-hosted, you are responsible for your own compliance certifications (ISO/SOC 2, etc.). The architecture (in-memory processing, no data retention) is designed to help you achieve compliance by minimizing data risk.',
              },
              {
                question: 'How is this different from other redaction tools?',
                answer: 'OpenRedaction is open source, self-hostable, and regex-first. Unlike proprietary solutions, you can audit the code, deploy on your infrastructure, and maintain full control. We use 500+ tested patterns for deterministic, transparent detection with zero data retention.',
              },
              {
                question: 'What\'s the difference between regex and AI detection?',
                answer: 'Regex patterns are fast (milliseconds), deterministic, transparent, and easy to audit. They work great for structured data. The optional AI layer may help with messy, unstructured text but is slower, costlier, less predictable, and may miss entities or produce false positives. See our comparison table above for details.',
              },
              {
                question: 'What use cases is this good for?',
                answer: 'OpenRedaction works best for structured data like forms, databases, JSON, and well-formatted text. It\'s ideal when you need fast, deterministic, and transparent PII detection. The optional AI layer can help with messy chat logs or transcripts, but comes with trade-offs in speed, cost, and predictability.',
              },
              {
                question: 'When should I not trust automatic redaction?',
                answer: 'Automatic redaction is best-effort, not perfect. You should manually review output when handling highly sensitive data, legal documents, or compliance-critical content. Messy or unstructured input may still leak sensitive information. Always verify critical redactions manually.',
              },
              {
                question: 'How do I self-host OpenRedaction?',
                answer: (
                  <>
                    Install the library via npm: <code className="bg-gray-800 px-1 py-0.5 rounded">npm install openredaction</code>. 
                    Use it directly in your Node.js application. For deployment, you can run it on your own infrastructure 
                    (Docker, Node.js server, etc.). See our documentation for detailed self-hosting instructions.
                  </>
                ),
              },
              {
                question: 'Can I use this without sending data to third parties?',
                answer: 'Yes! Self-hosting is the primary deployment method. Your data never leaves your environment. You can deploy OpenRedaction on your own infrastructure for complete data control and privacy. See our documentation for self-hosting instructions.',
              },
              {
                question: 'Why not just use AWS/Google services?',
                answer: 'OpenRedaction is open source and self-hostable, so your data never leaves your environment. Unlike AWS/Google, we require no account, log no data, and offer predictable costs (no per-token pricing). Our regex-first approach is faster, more transparent, and easier to audit than proprietary AI services.',
              },
              {
                question: 'How does OpenRedaction help with compliance?',
                answer: 'OpenRedaction helps you meet GDPR, HIPAA, and CCPA requirements through regex transparency, self-hosting, and zero data retention. The deterministic nature of pattern-based detection makes audits easier, and self-hosting gives you complete control over your data and infrastructure. You are responsible for your own compliance certifications.',
              },
              {
                question: 'Can we self-host the solution?',
                answer: 'Yes! Self-hosting is the primary deployment method. Install via npm and deploy on your own infrastructure for full control over your data. See our documentation for self-hosting instructions.',
              },
              {
                question: 'What if there\'s a compliance issue?',
                answer: 'As an open-source tool, you maintain full control and responsibility over your infrastructure and data. We provide the tools and documentation to help you meet compliance requirements, but you are responsible for your own compliance certifications and audits.',
              },
              {
                question: 'How accurate is the detection?',
                answer: 'OpenRedaction uses 500+ tested regex patterns for detecting names, emails, SSNs, phone numbers, addresses, and more. Detection is best-effort and works best on structured data. You can contribute patterns or customize them for your specific needs. The optional AI layer may help with messy text but is not guaranteed to catch everything.',
              },
              {
                question: 'Do I have to use AI assist?',
                answer: 'No. Regex-only mode is the default and works fully offline / self-hosted.',
              },
              {
                question: 'Where does my data go when AI assist is enabled?',
                answer: 'Text is sent to a hosted AI proxy for detection only; we do not store or log your input.',
              },
              {
                question: 'Can I self-host the API and AI assist myself?',
                answer: 'Yes. The entire system is open source — you can run it on your own server or infrastructure, with or without AI assist.',
              },
              {
                question: 'Do you store my data?',
                answer: 'When you use the library (self-hosted), your data never leaves your environment. We do not operate a hosted service that processes or stores your text. See our Privacy Policy for details.',
              },
              {
                question: 'How do I get enterprise support?',
                answer: 'OpenRedaction is open source and self-hostable. For enterprise support, custom deployments, or SLAs, contact us via the Enterprise page or contact form.',
              },
            ]}
          />
        </div>

        {/* Developer CTA Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg p-8 md:p-12 border border-gray-800">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">Using Node or another backend?</h2>
              <p className="text-xl text-gray-300 mb-6">
                Install the open-source library and run redaction in your own environment. For enterprise support or custom deployments, get in touch.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com/sam247/openredaction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
                >
                  <span>Install library</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <Link
                  href="/pricing"
                  className="bg-gray-800 text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Enterprise support
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Transparency & Community Section */}
        <div className="mt-32 bg-gray-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Transparency & Community</h2>
              <p className="text-xl text-gray-300 mb-8">
                OpenRedaction is open source. Audit the code, contribute patterns, and help improve the library.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <a
                  href="https://github.com/sam247/openredaction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
                >
                  <span>View on GitHub</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <Link
                  href="/docs"
                  prefetch={false}
                  className="bg-gray-800 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Read Documentation
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-12 text-left">
                <div className="bg-black rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-3">Report Issues</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Found a bug or have a suggestion? Open an issue on GitHub and help us improve.
                  </p>
                  <a
                    href="https://github.com/sam247/openredaction/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 underline text-sm"
                  >
                    View Issues →
                  </a>
                </div>
                <div className="bg-black rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-3">Contribute Patterns</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Share new regex patterns or improve existing ones. The community helps maintain and expand pattern coverage.
                  </p>
                  <a
                    href="https://github.com/sam247/openredaction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 underline text-sm"
                  >
                    Contribute →
                  </a>
                </div>
                <div className="bg-black rounded-lg p-6 border border-gray-800">
                  <h3 className="text-xl font-semibold mb-3">How to Contribute</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Fork the repository, make your changes, and submit a pull request. We welcome contributions from the community.
                  </p>
                  <a
                    href="https://github.com/sam247/openredaction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-gray-300 underline text-sm"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Self-Host Instructions Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Self-Host OpenRedaction</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Install the open-source library and deploy on your infrastructure for complete privacy and control
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-8 border border-gray-800">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Installation</h3>
                <div className="bg-black rounded-lg p-4 border border-gray-800">
                  <pre className="text-green-400 font-mono text-sm">
{`npm install openredaction`}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Basic Usage</h3>
                <div className="bg-black rounded-lg p-4 border border-gray-800">
                  <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import { redact } from 'openredaction';

const text = "Contact John Doe at john@example.com";
const result = await redact(text);
console.log(result.redacted_text);`}
                  </pre>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Deployment Options</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Node.js server - Run directly in your Node.js application</li>
                  <li>Docker - Containerize and deploy on any infrastructure</li>
                  <li>On-premise - Deploy on your own servers for maximum control</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-800">
                <p className="text-gray-400 text-sm mb-4">
                  For detailed self-hosting instructions, configuration options, and deployment examples, 
                  see our documentation or the GitHub README.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/docs"
                    prefetch={false}
                    className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
                  >
                    View Documentation
                  </Link>
                  <a
                    href="https://github.com/sam247/openredaction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Limitations & Best Practices Section */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Limitations & Best Practices</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Important information about using OpenRedaction effectively
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg p-8 border border-gray-800">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Best-Effort Redaction</h3>
                <p className="text-gray-300">
                  Redaction is best-effort, not perfect. OpenRedaction uses regex patterns and optional AI to detect PII, 
                  but it may miss some entities or produce false positives. Always manually review output when handling 
                  highly sensitive data.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Structured vs Unstructured Data</h3>
                <p className="text-gray-300">
                  Regex patterns work best on structured data (forms, databases, JSON, well-formatted text). 
                  Messy or unstructured input may still leak sensitive information. The optional AI layer may help 
                  with messy text but is slower, costlier, and not guaranteed to catch everything.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Manual Review Recommended</h3>
                <p className="text-gray-300">
                  For legal documents, compliance-critical content, or highly sensitive data, always manually review 
                  the redacted output. Automatic redaction should be used as a first pass, not a final solution.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3 text-yellow-400">Self-Hosted Responsibility</h3>
                <p className="text-gray-300">
                  When self-hosting, you are responsible for your own infrastructure, security, compliance certifications, 
                  and data handling. OpenRedaction provides the tools, but you maintain full control and responsibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-32 bg-gradient-to-r from-gray-900 to-black py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Try the playground, install the library, or contribute on GitHub
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/playground"
                className="bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors w-full sm:w-auto"
              >
                Try Playground
              </Link>
              <a
                href="https://github.com/sam247/openredaction"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-700 transition-colors border border-gray-700 w-full sm:w-auto"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className="mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-center">Security & Privacy</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <Lock className="text-white mb-3 mx-auto" size={32} />
                <h3 className="text-lg font-semibold mb-2">Stateless Processing</h3>
                <p className="text-gray-400 text-sm">
                  All processing happens in memory. No persistent storage of your data.
                </p>
              </div>
              <div className="text-center">
                <Trash2 className="text-white mb-3 mx-auto" size={32} />
                <h3 className="text-lg font-semibold mb-2">No Raw Text Stored</h3>
                <p className="text-gray-400 text-sm">
                  Your input text is processed and immediately discarded. We don&apos;t log or store it.
                </p>
              </div>
              <div className="text-center">
                <Zap className="text-white mb-3 mx-auto" size={32} />
                <h3 className="text-lg font-semibold mb-2">Fully Offline</h3>
                <p className="text-gray-400 text-sm">
                  All detection runs locally. No external APIs or third-party services.
                </p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/privacy"
                className="text-white hover:text-gray-300 underline text-sm"
              >
                Read our Privacy Policy →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

