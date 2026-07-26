import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Try PII Redaction Free in Your Browser",
  description:
    "Paste text and see PII redacted instantly — emails, phones, cards. No signup. Runs in your browser; nothing is uploaded.",
  path: "/playground",
});

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
