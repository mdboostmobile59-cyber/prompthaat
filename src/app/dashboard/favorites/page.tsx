import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import PromptCard from "@/components/shared/PromptCard";
import { allPromptsData } from "@/lib/sample-data";

export default async function FavoritesPage() {
  const user: any = await getCurrentUser();
  if (!user) redirect("/login");

  let savedPrompts: any[] = [];

  try {
    // সরাসরি ডাটাবেজ থেকে প্রম্পটসহ ফেভারিট তথ্য আনা
    const dbFavorites = await prisma.favorite.findMany({
      where: { userId: user.userId },
      include: {
        prompt: {
          include: {
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbFavorites.length > 0) {
      savedPrompts = dbFavorites
        .filter((f) => f.prompt !== null)
        .map((f) => ({
          id: f.prompt.id,
          slug: f.prompt.slug,
          title: f.prompt.title,
          category: f.prompt.category?.name || "General",
          description: f.prompt.description,
          imageUrl: f.prompt.imageUrl,
          isPremium: f.prompt.isPremium,
          aiModel: f.prompt.aiModel,
        }));
    }

    // ফলব্যাক: যদি ডাটাবেজের কোনো আইডি স্যাম্পল ডেটায় থাকে
    if (savedPrompts.length === 0 && dbFavorites.length > 0) {
      const favIds = new Set(dbFavorites.map((f) => f.promptId));
      savedPrompts = allPromptsData.filter((p) => favIds.has(p.id));
    }
  } catch (error) {
    console.error("Failed to load user favorites from DB:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-black text-white flex items-center gap-3">
          <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
          My Favorite Prompts
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Quickly access the prompts you saved for your upcoming projects.
        </p>
      </div>

      {savedPrompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedPrompts.map((prompt) => (
            <PromptCard key={prompt.id} {...prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#151B28] border border-gray-800 rounded-2xl space-y-4">
          <Heart className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">আপনার পছন্দের তালিকা এখনো খালি</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            যেকোনো প্রম্পটের হার্ট (❤️) আইকনে ক্লিক করে সহজেই এই তালিকায় জমা রাখতে পারেন।
          </p>
          <Link
            href="/browse"
            className="inline-block px-6 py-2.5 rounded-lg bg-brand-orange text-white text-sm font-semibold shadow-md"
          >
            Explore Prompts
          </Link>
        </div>
      )}
    </div>
  );
}
