import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RoadmapViewTracker from "@/components/RoadmapViewTracker";
import WordPressWaitlistTrigger from "@/components/WordPressWaitlistTrigger";
import { generatePageMetadata } from "@/lib/metadata";
import {
  roadmapInProgress,
  roadmapPlanned,
  roadmapRecentlyShipped,
} from "@/lib/roadmap-data";

export const metadata: Metadata = generatePageMetadata({
  title: "Roadmap | OpenRedaction",
  description:
    "What we are working on and what shipped recently — public direction for the open-source PII redaction library, not fixed dates.",
  path: "/roadmap",
});

function RoadmapList({
  title,
  items,
}: {
  title: string;
  items: readonly string[];
}) {
  return (
    <section className="bg-gray-900 rounded-lg border border-gray-800 p-6 md:p-8 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-gray-500 shrink-0 mt-0.5" aria-hidden>
              •
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <RoadmapViewTracker />
      <Header />

      <main className="pt-[148px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Roadmap</h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              OpenRedaction is open source and community-driven. This page is a
              snapshot of{" "}
              <strong className="text-white font-medium">
                current direction
              </strong>{" "}
              — not a contract on dates or scope. Priorities shift with
              feedback, contributions, and real-world use.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Shaped by{" "}
              <a
                href="https://github.com/sam247/openredaction/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline hover:text-gray-300"
              >
                Issues
              </a>{" "}
              and{" "}
              <a
                href="https://github.com/sam247/openredaction/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline hover:text-gray-300"
              >
                Discussions
              </a>
              .
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <RoadmapList title="Planned" items={roadmapPlanned} />
            <RoadmapList title="In progress" items={roadmapInProgress} />
            <RoadmapList
              title="Recently shipped"
              items={roadmapRecentlyShipped}
            />
          </div>

          <div className="max-w-2xl rounded-lg border border-gray-800 bg-gray-950/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-2">WordPress</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              We are exploring a plugin to help redact sensitive data in form
              submissions, comments, and other user-generated content — still
              early. If you want updates or possible early access, join the
              waitlist.
            </p>
            <WordPressWaitlistTrigger
              source="roadmap"
              triggerLabel="Join WordPress plugin waitlist"
            />
          </div>

          <p className="text-center text-gray-500 text-sm mt-12">
            Library and docs:{" "}
            <Link
              href="/docs"
              className="text-gray-400 hover:text-white underline"
            >
              Documentation
            </Link>
            {" · "}
            <a
              href="https://github.com/sam247/openredaction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
