"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AddPromptPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [promptContent, setPromptContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [aiModel, setAiModel] = useState("Kling AI");
  const [promptType, setPromptType] = useState("Video");
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState("49"); // আপনার নির্দেশ অনুযায়ী BDT নিজস্ব মূল্য
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState("PUBLISHED");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ক্যাটাগরি তালিকা লোড করা
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
          setCategoryId(data.categories[0].id);
        }
      } catch {
        console.error("Failed to load categories");
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          promptContent,
          imageUrl,
          categoryId,
          aiModel,
          promptType,
          isPremium,
          price: isPremium ? price : "0",
          isFeatured,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "প্রম্পট সেভ করা যায়নি");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/prompts");
        }, 1500);
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <Link
          href="/admin/prompts"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Prompts
        </Link>
        <h1 className="text-3xl font-black text-white mt-1">Publish New Prompt</h1>
        <p className="text-sm text-gray-400 mt-1">
          এখানে নতুন প্রম্পট তৈরি করুন। এটি প্রকাশ করলে সরাসরি ওয়েবসাইটে লাইভ চলে আসবে।
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>প্রম্পট সফলভাবে পাবলিশ হয়েছে! প্রম্পট তালিকায় নিয়ে যাওয়া হচ্ছে...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#151B28] border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Prompt Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমন: Cute Panda Bamboo Rescue"
            className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm font-medium"
          />
        </div>

        {/* Category & AI Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Category</label>
            {categories.length > 0 ? (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-xs text-amber-400 py-3">
                কোনো ক্যাটাগরি নেই। আগে ক্যাটাগরি তৈরি করুন।
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">AI Model</label>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
            >
              <option value="Kling AI">Kling AI</option>
              <option value="Veo / Sora">Veo / Sora</option>
              <option value="Midjourney">Midjourney</option>
              <option value="Seedance">Seedance</option>
              <option value="Gemini">Gemini</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Prompt Type</label>
            <select
              value={promptType}
              onChange={(e) => setPromptType(e.target.value)}
              className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange"
            >
              <option value="Video">Video</option>
              <option value="Image">Image</option>
              <option value="Story">Story</option>
              <option value="Character">Character</option>
            </select>
          </div>
        </div>

        {/* Image Thumbnail URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Thumbnail Image URL</label>
          <input
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm font-medium"
          />
        </div>

        {/* Tier (Free/Premium) & Price (BDT ৳) */}
        <div className="p-4 rounded-xl bg-[#0B0F17] border border-gray-800 space-y-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-white">
              <input
                type="radio"
                name="tier"
                checked={!isPremium}
                onChange={() => setIsPremium(false)}
                className="w-4 h-4 text-emerald-500"
              />
              <span>Free Prompt (বিনামূল্যে)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-brand-orange">
              <input
                type="radio"
                name="tier"
                checked={isPremium}
                onChange={() => setIsPremium(true)}
                className="w-4 h-4 text-brand-orange"
              />
              <span>Premium Prompt (পেইড)</span>
            </label>
          </div>

          {/* আপনার নির্দেশ অনুযায়ী নিজস্ব Price ফিল্ড */}
          {isPremium && (
            <div className="pt-2 max-w-xs">
              <label className="block text-xs font-bold text-brand-orange uppercase mb-1">
                Individual Price in BDT (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-gray-400">৳</span>
                <input
                  type="number"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="49"
                  className="w-full bg-[#151B28] border border-brand-orange/50 rounded-xl pl-8 pr-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-brand-orange"
                />
              </div>
              <span className="text-[11px] text-gray-500 mt-1 block">
                এই প্রম্পটের জন্য ভিজিটরকে কত টাকা দিতে হবে (যেমন: ২৯, ৪৯, ৭৯ ইত্যাদি)।
              </span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Short Description</label>
          <textarea
            required
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="প্রম্পটের একটি আকর্ষণীয় ছোট বিবরণ লিখুন..."
            className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm font-medium"
          />
        </div>

        {/* Prompt Content */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Prompt Code / Content</label>
          <textarea
            required
            rows={5}
            value={promptContent}
            onChange={(e) => setPromptContent(e.target.value)}
            placeholder="সম্পূর্ণ AI প্রম্পটটি এখানে পেস্ট করুন..."
            className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange font-mono text-xs leading-relaxed"
          />
        </div>

        {/* Options: Featured & Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-800">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-brand-orange"
            />
            <span>🔥 Feature on Homepage (জনপ্রিয় সেকশনে দেখাবে)</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#0B0F17] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white"
            >
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || categories.length === 0}
          className="w-full py-4 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-base transition-all shadow-xl shadow-brand-orange/25 disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Publish Prompt"}
        </button>
      </form>
    </div>
  );
          }
