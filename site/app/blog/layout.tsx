import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Blog - OpenRedaction Guides & Updates",
  description:
    "Read guides, tutorials, and updates about PII detection, redaction, privacy compliance, and OpenRedaction features.",
  path: "/blog",
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
