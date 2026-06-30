import type { Metadata } from "next";
import "./globals.css";
import { BotIdClient } from "botid/client";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageViewTracker from "@/components/PageViewTracker";
import { StructuredData } from "@/components/StructuredData";
import WordPressWaitlistRoot from "@/components/WordPressWaitlistRoot";
import { defaultMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const protectedRoutes = [
    { path: "/api/contact", method: "POST" as const },
    { path: "/api/wordpress-waitlist", method: "POST" as const },
  ];

  return (
    <html lang="en">
      <body>
        <BotIdClient protect={protectedRoutes} />
        <GoogleAnalytics />
        <StructuredData />
        <PageViewTracker />
        {children}
        <WordPressWaitlistRoot />
      </body>
    </html>
  );
}
