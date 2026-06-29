"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronDown,
  FileText,
  Code,
  Github,
  BookOpen,
  Heart,
  Map,
} from "lucide-react";
import Logo from "./Logo";
import GitHubBadge from "./GitHubBadge";
import { analytics } from "@/lib/analytics";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  // Track dropdown open
  useEffect(() => {
    if (resourcesOpen) {
      analytics.navDropdownOpen();
    }
  }, [resourcesOpen]);

  // Track mobile menu toggle
  useEffect(() => {
    analytics.mobileMenuToggle(mobileMenuOpen);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 py-2">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <Logo size={170} />
            </Link>

            {/* Desktop Navigation - Left Aligned */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/playground"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => analytics.navClick("/playground", "header")}
              >
                Playground
              </Link>
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => analytics.navClick("/pricing", "header")}
              >
                Enterprise
              </Link>

              {/* Resources dropdown: padding-top on the flyout bridges the gap under the label so
                  the pointer never crosses "dead air" (margin) that would fire mouseleave on the parent. */}
              <div
                className="relative"
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  aria-expanded={resourcesOpen}
                  aria-haspopup="true"
                >
                  <span>Resources</span>
                  <ChevronDown
                    size={16}
                    className={
                      resourcesOpen
                        ? "rotate-180 transition-transform"
                        : "transition-transform"
                    }
                  />
                </button>

                {resourcesOpen && (
                  <div className="absolute left-0 top-full z-50 w-96 pt-2">
                    <div className="rounded-lg border border-gray-800 bg-gray-950 shadow-2xl overflow-hidden">
                      <div className="p-1">
                        <div className="space-y-1">
                          <Link
                            href="/docs"
                            prefetch={false}
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                            onClick={() => {
                              setResourcesOpen(false);
                              analytics.navClick("/docs", "header");
                            }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                              <FileText size={20} className="text-gray-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm mb-1">
                                Documentation
                              </div>
                              <div className="text-gray-400 text-xs leading-relaxed">
                                Integrate OpenRedaction into your product
                              </div>
                            </div>
                          </Link>
                          <a
                            href="https://github.com/sam247/openredaction"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                            onClick={() => {
                              setResourcesOpen(false);
                              analytics.externalLinkClick(
                                "github",
                                "header",
                                "GitHub",
                              );
                            }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                              <Github size={20} className="text-gray-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm mb-1">
                                GitHub
                              </div>
                              <div className="text-gray-400 text-xs leading-relaxed">
                                Explore OpenRedaction&apos;s open-source
                                codebase
                              </div>
                            </div>
                          </a>
                          <Link
                            href="/blog"
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                            onClick={() => {
                              setResourcesOpen(false);
                              analytics.navClick("/blog", "header");
                            }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                              <BookOpen size={20} className="text-gray-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm mb-1">
                                Blog
                              </div>
                              <div className="text-gray-400 text-xs leading-relaxed">
                                Guides and updates on PII detection
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/community"
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                            onClick={() => {
                              setResourcesOpen(false);
                              analytics.navClick("/community", "header");
                            }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                              <Heart size={20} className="text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm mb-1">
                                Community
                              </div>
                              <div className="text-gray-400 text-xs leading-relaxed">
                                Who uses Open Redaction — get listed via GitHub
                              </div>
                            </div>
                          </Link>
                          <Link
                            href="/roadmap"
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-900 transition-colors group"
                            onClick={() => {
                              setResourcesOpen(false);
                              analytics.navClick("/roadmap", "header");
                            }}
                          >
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                              <Map size={20} className="text-gray-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium text-sm mb-1">
                                Roadmap
                              </div>
                              <div className="text-gray-400 text-xs leading-relaxed">
                                Direction and what shipped recently
                              </div>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <GitHubBadge repo="sam247/openredaction" />
            <Link
              href="/playground"
              className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
              onClick={() => analytics.ctaClick("header")}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 cursor-pointer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <Link
              href="/playground"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.navClick("/playground", "mobile");
              }}
            >
              Playground
            </Link>
            <Link
              href="/pricing"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.navClick("/pricing", "mobile");
              }}
            >
              Enterprise
            </Link>
            <Link
              href="/blog"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.navClick("/blog", "mobile");
              }}
            >
              Blog
            </Link>
            <Link
              href="/community"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.navClick("/community", "mobile");
              }}
            >
              Community
            </Link>
            <Link
              href="/roadmap"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.navClick("/roadmap", "mobile");
              }}
            >
              Roadmap
            </Link>
            <a
              href="https://github.com/sam247/openredaction"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.externalLinkClick("github", "mobile", "GitHub");
              }}
            >
              GitHub
            </a>
            <Link
              href="/playground"
              className="block bg-white text-black px-4 py-2 rounded-md font-medium text-center hover:bg-gray-100 transition-colors"
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.ctaClick("mobile");
              }}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
