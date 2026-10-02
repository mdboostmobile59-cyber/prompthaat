"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layers, Plus, Trash2, Sparkles, Lock, ArrowUpRight, Edit } from "lucide-react";

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPrompts = async () => {
    try {
      const res = await fetch("/api/admin/prompts");
      const data = await res.json();
      if (data.prompts) setPrompts(data.prompts);
    } catch {
      console.error("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrompts();
  }, []);

  const handleDuplicate = async (p:any) => { try{ const res=await fetch("/api/admin/prompts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...p,title:p.title+" (Copy)",categoryId:p.categoryId})}); if(res.ok) loadPrompts(); }catch{} };
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`আপনি কি "${title}" প্রম্পটটি ডিলিট করতে চান?`)) return;

    try {
      const res = await fetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPrompts(prompts.filter((p) => p.id !== id));
      } else {
        alert("প্রম্পট ডিলিট করা যায়নি");
      }
    } catch {
      alert("সমস্যা হয়েছে");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Content Engine
          </span>
          <h1 className="text-3xl font-black text-white mt-1 flex items-center gap-3">
            <Layers className="w-8 h-8 text-brand-orange" />
            Prompt Management
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            ওয়েবসাইটের সব প্রম্পট পরিচালনা ও এডিট করুন।
          </p>
        </div>

        <Link
          href="/admin/prompts/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-sm transition-all shadow-lg shadow-brand-orange/20"
        >
          <Plus className="w-4 h-4" />
          Add New Prompt
        </Link>
      </div>

      {/* Prompts Table */}
      <div className="bg-[#151B28] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">প্রম্পট তালিকা লোড হচ্ছে...</div>
        ) : prompts.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm space-y-3">
            <p>ডাটাবেজে এখনো কোনো প্রম্পট যুক্ত করা হয়নি।</p>
            <Link
              href="/admin/prompts/new"
              className="inline-block px-4 py-2 rounded-lg bg-brand-orange text-white text-xs font-bold"
            >
              প্রথম প্রম্পট যোগ করুন
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0B0F17] text-xs uppercase text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-3.5">Prompt Title</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">AI Model</th>
                  <th className="px-6 py-3.5">Tier & Price</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {prompts.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    {/* টাইটেলে চাপ দিলেও এডিট পেজ খুলবে */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/prompts/${p.id}/edit`}
                        className="flex items-center gap-3 group"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-12 h-9 object-cover rounded-lg border border-gray-700 group-hover:border-brand-orange"
                        />
                        <div>
                          <h4 className="font-bold text-white group-hover:text-brand-orange transition-colors line-clamp-1">
                            {p.title}
                          </h4>
                          <span className="text-xs text-gray-500 font-mono">{p.slug}</span>
                        </div>
                      </Link>
                    </td>

                    <td className="px-6 py-4 text-xs font-semibold text-gray-300">
                      {p.category?.name || "Uncategorized"}
                    </td>

                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">{p.aiModel}</td>

                    <td className="px-6 py-4">
                      {p.isPremium ? (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-orange text-white">
                            <Lock className="w-2.5 h-2.5" /> PREMIUM
                          </span>
                          <span className="text-xs font-bold text-brand-orange">
                            ৳{Number(p.price || 0).toFixed(0)}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                          <Sparkles className="w-2.5 h-2.5" /> FREE (৳০)
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                          p.status === "PUBLISHED"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* স্পষ্ট বাটন: [ Edit ] [ Delete ] */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/prompts/${p.id}/edit`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-red-200 bg-red-950/60 hover:bg-red-800 border border-red-800 transition-colors shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
