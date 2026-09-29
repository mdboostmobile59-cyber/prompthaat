import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-brand-dark text-white flex flex-col">
        {/* সব পেজের কন্টেন্ট এখানে লোড হবে */}
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
