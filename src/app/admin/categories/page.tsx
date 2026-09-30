"use client";

import { useState, useEffect } from "react";
import { FolderTree, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {
      setError("ক্যাটাগরি লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "ক্যাটাগরি যোগ করা যায়নি");
      } else {
        setMessage("নতুন ক্যাটাগরি তৈরি হয়েছে!");
        setName("");
        setDescription("");
        loadCategories();
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`আপনি কি "${catName}" ক্যাটাগরি ডিলিট করতে চান?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      } else {
        alert("ক্যাটাগরি ডিলিট করা যায়নি");
      }
    } catch {
      alert("সমস্যা হয়েছে, পুনরায় চেষ্টা করুন");
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
          Admin Management
        </span>
        <h1 className="text-3xl font-black text-white mt-1 flex items-center gap-3">
          <FolderTree className="w-8 h-8 text-brand-orange" />
          Category Management
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          এখানে নতুন ক্যাটাগরি তৈরি ও পরিচালনা করুন। এগুলো স্বয়ংক্রিয়ভাবে ব্রাউজ পেজে যুক্ত হবে।
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Category Form */}
      <div className="bg-[#151B28] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-brand-orange" />
          Add New Category
        </h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Category Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: Cyberpunk, 3D Animation"
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ছোট বিবরণ"
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-sm transition-all shadow-md disabled:opacity-60"
          >
            {submitting ? "সংরক্ষণ হচ্ছে..." : "Create Category"}
          </button>
        </form>
      </div>

      {/* Categories Table */}
      <div className="bg-[#151B28] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-gray-800">
          <h3 className="text-base font-bold text-white">Existing Categories</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">লোডিং হচ্ছে...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">কোনো ক্যাটাগরি তৈরি করা হয়নি।</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0B0F17] text-xs uppercase text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Slug</th>
                  <th className="px-6 py-3.5">Prompts Count</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{cat.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{cat.slug}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-gray-800 text-xs text-brand-orange font-bold">
                        {cat._count?.prompts || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
