'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useMemo, Suspense } from 'react';

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Understanding PII Detection',
    excerpt: 'Learn what PII is, why detecting it is challenging, and how pattern-based and AI-assisted approaches combine for robust redaction pipelines.',
    date: '2025-01-15',
    category: 'Guide',
    slug: 'understanding-pii-detection',
  },
  {
    id: 2,
    title: 'From Regex Library to Real API: Building OpenRedaction\'s Developer Journey',
    excerpt: 'How OpenRedaction evolved from a simple regex-based redaction library into a hosted API with AI-assist, billing and product-grade infrastructure.',
    date: '2025-12-04',
    category: 'Guide',
    slug: 'building-openredaction-developer-journey',
  },
  {
    id: 3,
    title: 'PII Detection for AI: How to Safely Use User Data with LLMs',
    excerpt: 'Learn how PII detection fits into AI workflows, where personal data typically leaks, and how to design a PII-aware architecture using a hybrid pattern-first + AI assist approach.',
    date: '2025-12-05',
    category: 'Guide',
    slug: 'pii-detection-for-ai',
  },
  {
    id: 4,
    title: 'What Is PII? A Plain-English Guide for Developers and Product Teams',
    excerpt: 'PII is any data that can identify someone, directly like names or emails, or indirectly when combined with other information. You should treat both direct and indirect identifiers with strict access controls, data minimization, and strong auditing.',
    date: '2025-12-14',
    category: 'Guide',
    slug: 'what-is-pii',
  },
  {
    id: 5,
    title: 'Redacting Sensitive Data in Legal Documents: A Practical Starter Guide',
    excerpt: 'Upholding privacy in legal documents starts here, but the full method reveals pitfalls you won\'t want to miss.',
    date: '2025-12-13',
    category: 'Guide',
    slug: 'redacting-legal-documents',
  },
  {
    id: 6,
    title: 'PII Redaction in Call Centres: How to Protect Customers on Every Call Recording',
    excerpt: 'Aiming to shield customers on every call, this guide reveals how to implement automated PII redaction with human checks—but the full method awaits your next step.',
    date: '2025-12-12',
    category: 'Guide',
    slug: 'pii-call-centre-redaction',
  },
  {
    id: 7,
    title: 'How to Handle PII Safely in Support Tickets, Emails and Chat Transcripts',
    excerpt: 'Describe practical steps to handle PII safely in support tickets, emails, and chat transcripts, and discover what you\'re risking by skipping safeguards.',
    date: '2025-12-11',
    category: 'Guide',
    slug: 'pii-in-support-tickets',
  },
  {
    id: 8,
    title: 'How to Design a Basic Redaction Policy for Your SaaS or Internal Tools',
    excerpt: 'Laying the groundwork for a practical redaction policy can seem daunting—wondering how to start, you\'ll discover a simple, auditable path to follow.',
    date: '2025-12-10',
    category: 'Guide',
    slug: 'how-to-design-redaction-policy',
  },
  {
    id: 9,
    title: 'Manual Vs Automated PII Redaction: Pros, Cons and Common Pitfalls',
    excerpt: 'Weigh manual vs automated PII redaction—pros, cons, and pitfalls—then discover why the right mix matters and what you should consider next.',
    date: '2025-12-09',
    category: 'Guide',
    slug: 'manual-vs-automated-pii-redaction',
  },
  {
    id: 10,
    title: 'Data Redaction Vs Data Masking: Key Differences and When to Use Each',
    excerpt: 'Organize your data security choices: explore redaction vs masking and discover when to choose each, but the answer might surprise you—keep reading.',
    date: '2025-12-08',
    category: 'Guide',
    slug: 'data-redaction-vs-masking',
  },
  {
    id: 11,
    title: '7 PII Redaction Best Practices to Protect Customer Data in 2025',
    excerpt: 'Wise strategies to redact PII in 2025 reveal gaps and invite safer data practices—will you uncover the steps that keep customers protected?',
    date: '2025-12-07',
    category: 'Guide',
    slug: '7-pii-redaction-best-practices',
  },
  {
    id: 12,
    title: '10 Common PII Redaction Mistakes Engineers Make (And How to Avoid Them)',
    excerpt: 'Learn the 10 most common PII redaction mistakes engineers make and how to shut them down before data leaks bite.',
    date: '2025-12-06',
    category: 'Guide',
    slug: '10-common-pii-redaction-mistakes',
  },
];

const categories = ['Latest', 'Guide'];

function BlogContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'latest';

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'latest') {
      // Show all posts, sorted by date (newest first)
      return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    // Filter by category (case-insensitive)
    return blogPosts.filter(post => 
      post.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-[148px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">Blog</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Guides, tutorials, and updates on PII detection, privacy compliance, and OpenRedaction
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 sticky top-24">
                <h2 className="text-white font-semibold mb-4">Categories</h2>
                <nav className="space-y-2">
                  {categories.map((category) => {
                    const categoryLower = category.toLowerCase();
                    const isActive = selectedCategory === categoryLower;
                    return (
                      <Link
                        key={category}
                        href={`/blog?category=${categoryLower}`}
                        className={`block transition-colors text-sm ${
                          isActive
                            ? 'text-white font-semibold'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {category}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Main Content - Blog Posts */}
            <div className="flex-1">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No posts found in this category.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors overflow-hidden group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-400 bg-gray-800 px-2 py-1 rounded">
                          {post.category}
                        </span>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar size={14} className="mr-1" />
                          {new Date(post.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center text-white text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Read More
                        <ArrowRight size={16} className="ml-2" />
                      </div>
                    </div>
                  </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Blog() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="pt-[148px] pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <p className="text-gray-400">Loading...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}

