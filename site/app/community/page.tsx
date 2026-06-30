import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import WallOfLove from "@/components/WallOfLove";
import { generatePageMetadata } from "@/lib/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Community & Wall of Love | OpenRedaction",
  description:
    "Teams and projects using Open Redaction. Get listed via GitHub Discussions — curated on this page.",
  path: "/community",
});

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="pt-[116px] pb-32">
        <WallOfLove variant="full" />
      </main>
      <Footer />
    </div>
  );
}
