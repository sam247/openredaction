"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, Twitter, Instagram } from "lucide-react";
import Logo from "./Logo";
import { analytics } from "@/lib/analytics";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.formSubmit("newsletter");
    // TODO: Integrate with newsletter service
    setSubscribed(true);
    setEmail("");
    analytics.formSubmitSuccess("newsletter");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-black border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/playground"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/playground", "footer")}
                >
                  Playground
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  prefetch={false}
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/docs", "footer")}
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/pricing", "footer")}
                >
                  Enterprise
                </Link>
              </li>
              <li>
                <Link
                  href="/roadmap"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/roadmap", "footer")}
                >
                  Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/contact", "footer")}
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/about", "footer")}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/blog", "footer")}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/changelog", "footer")}
                >
                  Changelog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/careers", "footer")}
                >
                  Careers
                </Link>
              </li>
              <li>
                <a
                  href="https://disclosurely.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() =>
                    analytics.externalLinkClick(
                      "https://disclosurely.com",
                      "footer",
                      "Disclosurely.com",
                    )
                  }
                >
                  Disclosurely.com →
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/privacy", "footer")}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/terms", "footer")}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/security", "footer")}
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/contact", "footer")}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => analytics.navClick("/status", "footer")}
                >
                  Status
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-3">Stay Updated</h3>
              <p className="text-gray-400 text-sm mb-3">
                Get the latest updates on OpenRedaction and privacy compliance.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex gap-2 max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-gray-900 border border-gray-800 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-hidden focus:border-gray-700 text-sm"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors text-sm whitespace-nowrap"
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </form>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
              <div className="flex items-center gap-4">
                <div className="flex space-x-4">
                  <a
                    href="https://github.com/sam247/openredaction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="GitHub"
                    onClick={() =>
                      analytics.externalLinkClick(
                        "github",
                        "footer_social",
                        "GitHub",
                      )
                    }
                  >
                    <Github size={20} />
                  </a>
                  <a
                    href="https://x.com/openredaction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="X (Twitter)"
                    onClick={() =>
                      analytics.externalLinkClick("x", "footer_social", "X")
                    }
                  >
                    <Twitter size={20} />
                  </a>
                  <a
                    href="https://instagram.com/openredaction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Instagram"
                    onClick={() =>
                      analytics.externalLinkClick(
                        "instagram",
                        "footer_social",
                        "Instagram",
                      )
                    }
                  >
                    <Instagram size={20} />
                  </a>
                </div>
                <div className="hidden md:block ml-4 pl-4 border-l border-gray-800">
                  <Logo size={120} />
                </div>
              </div>
              <span className="text-gray-400 text-sm">
                © 2025 OpenRedaction. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
