import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Lock, Calendar, Layers, Cpu } from "lucide-react";
import { allPromptsData } from "@/lib/sample-data";
import WatchSampleBtn from "@/components/shared/WatchSampleBtn";
import CopyButton from "@/components/shared/CopyButton";

interface PromptDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PromptDetailsPage({ params }: PromptDetailsPageProps) {
  const { slug } = await params;
  const prompt = allPromptsData.find((p) => p.slug === slug);

  if (!prompt) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Prompts
        </Link>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Large Thumbnail */}
        <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl">
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full h-auto object-cover aspect-[16/10]"
          />
        </div>

        {/* Right: Meta Information */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                {prompt.category}
              </span>
              <span className="text-gray-600">•</span>
              {prompt.isPremium ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange">
                  <Lock className="w-3 h-3" /> PREMIUM
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <Sparkles className="w-3 h-3" /> FREE
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {prompt.title}
            </h1>
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {prompt.description}
          </p>

          {/* Prompt Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#151B28] border border-gray-800 p-4 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Cpu className="w-4 h-4 text-brand-orange" />
              <span>AI Model:</span>
              <strong className="text-white font-semibold">{prompt.aiModel || "Universal"}</strong>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Layers className="w-4 h-4 text-brand-orange" />
              <span>Type:</span>
              <strong className="text-white font-semibold">{prompt.promptType}</strong>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="w-4 h-4 text-brand-orange" />
              <span>Date:</span>
              <strong className="text-white font-semibold">{prompt.createdAt}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* SAMPLE SECTION (ব্লুপ্রিন্ট সেকশন ৪ ও ৫ অনুযায়ী) */}
      <div className="bg-[#151B28] border border-emerald-900/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            🎬 See the Result
          </h3>
          <p className="text-sm text-gray-400">
            Want to see what this prompt can create? Watch the real sample video in our WhatsApp Community.
          </p>
        </div>
        <WatchSampleBtn promptTitle={prompt.title} className="w-full sm:w-auto" />
      </div>

      {/* PROMPT CONTENT SECTION */}
      <div className="bg-[#151B28] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-bold text-white">Prompt Code</h3>

        {prompt.isPremium ? (
          /* PREMIUM LOCKED BOX */
          <div className="text-center py-10 px-4 bg-[#0B0F17] border border-gray-800 rounded-xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">🔒 Premium Prompt</h4>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Unlock this prompt to access the complete prompt and copy it directly to your clipboard.
            </p>
            <div className="pt-2">
              <Link
                href={`/checkout/${prompt.id}`}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-brand-orange hover:bg-brand-orangeHover transition-all shadow-lg shadow-brand-orange/25"
              >
                Unlock Premium
              </Link>
            </div>
          </div>
        ) : (
          /* FREE PROMPT UNLOCKED */
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-xl bg-[#0B0F17] border border-gray-800 font-mono text-sm text-gray-200 leading-relaxed break-words">
              {prompt.promptContent}
            </div>
            <div className="flex justify-end">
              <CopyButton textToCopy={prompt.promptContent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
