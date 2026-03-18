import type { Metadata } from "next";
import "./globals.css";
import { defaultMetadata } from "@/lib/metadata";
import { StructuredData } from "@/components/StructuredData";
import { Analytics } from "@vercel/analytics/next";
import PageViewTracker from "@/components/PageViewTracker";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { BotIdClient } from "botid/client";

export const metadata: Metadata = {
  ...defaultMetadata,
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const protectedRoutes = [{ path: "/api/contact", method: "POST" as const }];

  return (
    <html lang="en">
      <body>
        <BotIdClient protect={protectedRoutes} />
        <GoogleAnalytics />
        <StructuredData />
        <PageViewTracker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
