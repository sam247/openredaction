import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Playground - Try PII Detection Free",
  description:
    "Try OpenRedaction in your browser — paste text, see redaction instantly, then install with npm. No signup. Your text never leaves your device.",
  path: "/playground",
});

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
