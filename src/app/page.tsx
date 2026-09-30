import Link from "next/link";
import { ArrowRight, Flame, Sparkles, Gift } from "lucide-react";
import PromptCard from "@/components/shared/PromptCard";
import { prisma } from "@/lib/prisma";
import { popularPrompts, latestPrompts, freePrompts } from "@/lib/sample-data";

export const revalidate = 60;

export default async function HomePage() {
  let popular: any[] = popularPrompts;
  let latest: any[] = latestPrompts;
  let free: any[] = freePrompts;

  try {
    const dbPrompts = await prisma.prompt.findMany({
      where: { status: "PUBLISHED" },
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    if (dbPrompts && dbPrompts.length > 0) {
      const formatted = dbPrompts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category?.name || "General",
        description: p.description,
        imageUrl: p.imageUrl,
        isPremium: p.isPremium,
        aiModel: p.aiModel,
      }));

      const dbFeatured = formatted.filter((_, idx) => idx < 3);
      const dbLatest = formatted.slice(0, 6);
      const dbFree = formatted.filter((p) => !p.isPremium);

      if (dbFeatured.length > 0) popular = dbFeatured;
      if (dbLatest.length > 0) latest = dbLatest.slice(0, 3);
      if (dbFree.length > 0) free = dbFree.slice(0, 3);
    }
  } catch {
    // ফলব্যাক ডেটা কাজ করবে
  }

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 text-center px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-orange/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            AI Video & Image Marketplace
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Create Better AI Content with{" "}
            <span className="text-brand-orange">Better Prompts</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Discover ready-to-use AI prompts for images, videos, storytelling and creative content.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/browse"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-base font-bold text-white bg-brand-orange hover:bg-brand-orangeHover transition-all shadow-lg shadow-brand-orange/25"
            >
              Browse Prompts
            </Link>
            <Link
              href="/browse?tier=Premium"
              className="w-full sm:w-auto px-8 py-3.5 rounded-lg text-base font-bold text-gray-200 bg-gray-800/80 hover:bg-gray-700 hover:text-white transition-all border border-gray-700"
            >
              Explore Premium
            </Link>
          </div>
        </div>
      </section>

      {/* 2. POPULAR PROMPTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <Flame className="w-6 h-6 text-brand-orange" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Popular Prompts</h2>
          </div>
          <Link
            href="/browse"
            className="text-sm font-semibold text-brand-orange hover:underline inline-flex items-center gap-1"
          >
            View More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popular.map((prompt) => (
            <PromptCard key={prompt.id} {...prompt} />
          ))}
        </div>
      </section>

      {/* 3. LATEST PROMPTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-brand-orange" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Latest Prompts</h2>
          </div>
          <Link
            href="/browse"
            className="text-sm font-semibold text-brand-orange hover:underline inline-flex items-center gap-1"
          >
            View More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map((prompt) => (
            <PromptCard key={prompt.id} {...prompt} />
          ))}
        </div>
      </section>

      {/* 4. FREE PROMPTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <Gift className="w-6 h-6 text-brand-orange" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Free Prompts</h2>
          </div>
          <Link
            href="/browse?tier=Free"
            className="text-sm font-semibold text-brand-orange hover:underline inline-flex items-center gap-1"
          >
            View More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {free.map((prompt) => (
            <PromptCard key={prompt.id} {...prompt} />
          ))}
        </div>
      </section>

      {/* 5. BOTTOM CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <Link
          href="/browse"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-brand-orange hover:bg-brand-orangeHover transition-all shadow-xl shadow-brand-orange/20"
        >
          Explore All Prompts →
        </Link>
      </section>
    </div>
  );
}
