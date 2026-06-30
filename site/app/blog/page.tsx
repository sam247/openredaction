"use client";

import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

// Curated posts (see app/blog/[slug]/page.tsx)
const blogPosts = [
  {
    id: 1,
    title: "PII Detection for AI: How to Safely Use User Data with LLMs",
    excerpt:
      "Where PII leaks in LLM pipelines, how to architect pattern-first guardrails, and when to add separate ML detection — without sending data you cannot explain.",
    date: "2025-12-05",
    category: "Guide",
    slug: "pii-detection-for-ai",
  },
  {
    id: 2,
    title:
      "How to Handle PII Safely in Support Tickets, Emails and Chat Transcripts",
    excerpt:
      "Minimize what support channels store, redact early, and keep agents aligned — practical controls for tickets, email, and chat.",
    date: "2025-12-11",
    category: "Guide",
    slug: "pii-in-support-tickets",
  },
  {
    id: 3,
    title: "Building OpenRedaction: A Regex-First Open Source Story",
    excerpt:
      "How a small deterministic redaction experiment became a tested open-source library—patterns, trust, and what we learned shipping for privacy-minded developers.",
    date: "2025-12-04",
    category: "Guide",
    slug: "building-openredaction-developer-journey",
  },
];

const categories = ["Latest", "Guide"];

function BlogContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "latest";

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "latest") {
      return [...blogPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    }
    return blogPosts.filter(
      (post) => post.category.toLowerCase() === selectedCategory.toLowerCase(),
    );
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="pt-[148px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight max-w-7xl mx-auto">
              Blog
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Guides on PII detection, support workflows, and how OpenRedaction
              is built
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
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
                            ? "text-white font-semibold"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {category}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <div className="flex-1">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">
                    No posts found in this category.
                  </p>
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
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                        <h2 className="text-xl font-semibold mb-3 group-hover:text-white transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center text-white text-sm font-medium">
                          Read more
                          <ArrowRight
                            size={16}
                            className="ml-2 group-hover:translate-x-1 transition-transform"
                          />
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

export default function BlogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </div>
      }
    >
      <BlogContent />
    </Suspense>
  );
}
