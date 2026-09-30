"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PromptCard from "@/components/shared/PromptCard";
import { CATEGORIES } from "@/lib/sample-data";

export default function BrowsePage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Free" | "Premium">("All");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(true);

  // ক্যাটাগরি লোড করা
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories");
        const data = await res.json();
        if (data.categories && data.categories.length > 0) {
          const dbCatNames = data.categories.map((c: any) => c.name);
          setCategories(["All Categories", ...dbCatNames]);
        }
      } catch {
        // ফলব্যাক ক্যাটাগরি কাজ করবে
      }
    }
    loadCategories();
  }, []);

  // প্রম্পট লোড করা
  useEffect(() => {
    async function fetchPrompts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (selectedFilter !== "All") params.set("tier", selectedFilter);
        if (selectedCategory !== "All Categories") params.set("category", selectedCategory);

        const res = await fetch(`/api/prompts?${params.toString()}`);
        const data = await res.json();
        if (data.prompts) setPrompts(data.prompts);
      } catch {
        console.error("Failed to load prompts");
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchPrompts, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedFilter, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          All Prompts
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1">
          Premium & Free AI Prompts
        </p>
      </div>

      {/* Search & Tier Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#151B28] border border-gray-800 p-4 rounded-2xl">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search prompts..."
            className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto bg-[#0B0F17] p-1.5 rounded-xl border border-gray-800">
          {(["All", "Free", "Premium"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                selectedFilter === filter
                  ? "bg-brand-orange text-white shadow-md"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase pr-2">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Categories:
        </div>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? "bg-white text-black font-bold shadow-md"
                : "bg-gray-800/80 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm">প্রম্পট খোঁজা হচ্ছে...</div>
      ) : prompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} {...prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#151B28]/40 border border-gray-800 rounded-2xl">
          <p className="text-gray-400 text-base">কোনো প্রম্পট খুঁজে পাওয়া যায়নি।</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedFilter("All");
              setSelectedCategory("All Categories");
            }}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-semibold text-brand-orange rounded-lg"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      )}
    </div>
  );
      }
