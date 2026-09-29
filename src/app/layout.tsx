import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "PromptHaat — AI Prompt Marketplace",
  description: "Discover ready-to-use AI prompts for images, videos, and creative content.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-[#0B0F17] text-white flex flex-col antialiased selection:bg-brand-orange selection:text-white">
        {/* সব পেজের উপরে হেডার থাকবে */}
        <Header />

        {/* যে পেজে ভিজিট করবেন তার কন্টেন্ট এখানে লোড হবে */}
        <main className="flex-grow">{children}</main>

        {/* সব পেজের নিচে ফুটার থাকবে */}
        <Footer />
      </body>
    </html>
  );
}
