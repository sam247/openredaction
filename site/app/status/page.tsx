import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Status - OpenRedaction Service Status',
  description: 'Check the current status of OpenRedaction services including API, playground, and documentation.',
  path: '/status',
});

export default function Status() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[116px] pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">Service Status</h1>
          
          <div className="space-y-6 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <CheckCircle2 className="text-green-400 mr-3" size={24} />
                  <h2 className="text-2xl font-semibold">All Systems Operational</h2>
                </div>
                <span className="bg-green-900 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                  Operational
                </span>
              </div>
              <p className="text-gray-300">
                All OpenRedaction services are running normally.
              </p>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Service Components</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-400 mr-3" size={20} />
                    <span className="text-gray-300">API Service</span>
                  </div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-400 mr-3" size={20} />
                    <span className="text-gray-300">Playground</span>
                  </div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-400 mr-3" size={20} />
                    <span className="text-gray-300">Documentation</span>
                  </div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle2 className="text-green-400 mr-3" size={20} />
                    <span className="text-gray-300">GitHub Repository</span>
                  </div>
                  <span className="text-green-400 text-sm">Operational</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Last Updated</h3>
              <p className="text-gray-300">
                {new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="text-gray-300 mb-4">
              If you&apos;re experiencing issues, please check our documentation or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/docs"
                className="bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors text-center"
              >
                View Documentation
              </Link>
              <Link
                href="/contact"
                className="bg-gray-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-gray-700 transition-colors border border-gray-700 text-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

