import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Lock, Calendar, Layers, Cpu, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { allPromptsData } from "@/lib/sample-data";
import WatchSampleBtn from "@/components/shared/WatchSampleBtn";
import CopyButton from "@/components/shared/CopyButton";
import FavoriteBtn from "@/components/shared/FavoriteBtn";

interface PromptDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PromptDetailsPage({ params }: PromptDetailsPageProps) {
  const { slug } = await params;
  const user: any = await getCurrentUser();

  let prompt: any = null;
  let isUnlocked = false;

  // ১. ডাটাবেজ থেকে প্রম্পট খোঁজা
  try {
    const dbPrompt = await prisma.prompt.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (dbPrompt) {
      prompt = {
        id: dbPrompt.id,
        slug: dbPrompt.slug,
        title: dbPrompt.title,
        category: dbPrompt.category?.name || "General",
        description: dbPrompt.description,
        promptContent: dbPrompt.promptContent,
        imageUrl: dbPrompt.imageUrl,
        aiModel: dbPrompt.aiModel,
        promptType: dbPrompt.promptType,
        isPremium: dbPrompt.isPremium,
        price: Number(dbPrompt.price || 49),
        createdAt: dbPrompt.createdAt.toISOString().split("T")[0],
      };

      if (user && dbPrompt.isPremium) {
        const purchase = await prisma.purchase.findUnique({
          where: {
            userId_promptId: {
              userId: user.userId,
              promptId: dbPrompt.id,
            },
          },
        });
        if (purchase) isUnlocked = true;
      }
    }
  } catch {
    // ফলব্যাক
  }

  // ২. ফলব্যাক চেক
  if (!prompt) {
    const fallback = allPromptsData.find((p) => p.slug === slug);
    if (!fallback) notFound();
    prompt = {
      ...fallback,
      price: 49,
    };
  }

  if (!prompt.isPremium && user) {
    isUnlocked = true;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Prompts
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* বড় থাম্বনেইল ছবি এবং তার ওপর ❤️ হার্ট বাটন */}
        <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl relative aspect-[16/10]">
          <img
            src={prompt.imageUrl}
            alt={prompt.title}
            className="w-full h-full object-cover"
          />
          {/* ❤️ Favorite Button (বড় ছবির উপরে ডানে) */}
          <div className="absolute top-4 right-4 z-20">
            <FavoriteBtn promptId={prompt.id} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                {prompt.category}
              </span>
              <span className="text-gray-600">•</span>
              {prompt.isPremium ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange">
                  <Lock className="w-3 h-3" /> PREMIUM (৳{prompt.price})
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

          <div className="grid grid-cols-2 gap-3 bg-[#151B28] border border-gray-800 p-4 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Cpu className="w-4 h-4 text-brand-orange" />
              <span>AI Model:</span>
              <strong className="text-white font-semibold">{prompt.aiModel}</strong>
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

      {/* SAMPLE SECTION */}
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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Prompt Code</h3>
          {prompt.isPremium && isUnlocked && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-800/40">
              <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked / Purchased
            </span>
          )}
        </div>

        {/* কেস ১: ফ্রি প্রম্পট এবং ইউজার লগইন নেই -> LOGIN TO UNLOCK */}
        {!prompt.isPremium && !user && (
          <div className="text-center py-10 px-4 bg-[#0B0F17] border border-emerald-900/40 rounded-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              🎁 FREE PROMPT
            </span>
            <h4 className="text-2xl font-bold text-white">Login to Unlock</h4>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Sign in to view the full prompt. No payment needed.
            </p>
            <div className="pt-2">
              <Link
                href={`/login?callbackUrl=/prompt/${prompt.slug}`}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40"
              >
                Login Free — Get This Prompt
              </Link>
            </div>
          </div>
        )}

        {/* কেস ২: ফ্রি প্রম্পট এবং ইউজার লগইন করা আছে -> UNLOCKED */}
        {!prompt.isPremium && user && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-xl bg-[#0B0F17] border border-gray-800 font-mono text-sm text-gray-200 leading-relaxed break-words">
              {prompt.promptContent}
            </div>
            <div className="flex justify-end">
              <CopyButton textToCopy={prompt.promptContent} />
            </div>
          </div>
        )}

        {/* কেস ৩: প্রিমিয়াম প্রম্পট কেনা হয়েছে */}
        {prompt.isPremium && isUnlocked && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-xl bg-[#0B0F17] border border-gray-800 font-mono text-sm text-gray-200 leading-relaxed break-words">
              {prompt.promptContent}
            </div>
            <div className="flex justify-end">
              <CopyButton textToCopy={prompt.promptContent} />
            </div>
          </div>
        )}

        {/* কেস ৪: প্রিমিয়াম প্রম্পট লক করা -> ৳XX UNLOCK PROMPT BUTTON */}
        {prompt.isPremium && !isUnlocked && (
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
                href={user ? `/checkout/${prompt.id}` : `/login?callbackUrl=/checkout/${prompt.id}`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-brand-orange hover:bg-brand-orangeHover transition-all shadow-lg shadow-brand-orange/25"
              >
                <span className="bg-black/30 px-2 py-0.5 rounded text-amber-200 font-mono">
                  [ ৳{prompt.price} ]
                </span>
                <span>[ Unlock Prompt → ]</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
          }
