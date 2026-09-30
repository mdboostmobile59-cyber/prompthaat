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
      <head>
        {/* গ্যারান্টিযুক্ত স্টাইলিং ইঞ্জিন */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      brand: {
                        orange: '#FF6B00',
                        orangeHover: '#E05E00',
                        dark: '#0B0F17',
                        cardDark: '#151B28',
                        grayText: '#94A3B8',
                      }
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#0B0F17] text-white flex flex-col antialiased selection:bg-brand-orange selection:text-white">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
