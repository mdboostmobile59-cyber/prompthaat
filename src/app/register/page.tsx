"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড দুটি মেলেনি");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("সার্ভারে সমস্যা হচ্ছে, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#151B28] border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">Create Account</h1>
          <p className="text-sm text-gray-400 mt-2">Join PromptHaat to unlock creative AI prompts</p>
        </div>

        {error && (
          <div className="mb-6 p-3 text-sm text-red-400 bg-red-950/40 border border-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Name</label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="আপনার নাম"
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="অন্তত ৬ অক্ষরের পাসওয়ার্ড"
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand-orange hover:bg-brand-orangeHover text-white font-semibold text-sm transition-all shadow-lg shadow-brand-orange/20 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-orange hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
