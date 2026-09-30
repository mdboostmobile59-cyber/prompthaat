"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Save, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

export default function WhatsAppSettingsPage() {
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // বর্তমান ডাটাবেজে থাকা লিংক লোড করা
  useEffect(() => {
    async function loadSetting() {
      try {
        const res = await fetch("/api/admin/settings/whatsapp");
        const data = await res.json();
        if (data.whatsappUrl) {
          setWhatsappUrl(data.whatsappUrl);
        }
      } catch {
        setError("বর্তমান লিংকটি লোড করা যায়নি");
      } finally {
        setLoading(false);
      }
    }
    loadSetting();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "সংরক্ষণ করা যায়নি");
      } else {
        setMessage(data.message || "লিংক সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে!");
      }
    } catch {
      setError("সার্ভারে সমস্যা হয়েছে, পুনরায় চেষ্টা করুন");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
          Website Settings
        </span>
        <h1 className="text-3xl font-black text-white mt-1 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-emerald-400" />
          WhatsApp Community Settings
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          এখানে আপনার অফিসিয়াল হোয়াটসঅ্যাপ কমিউনিটির ইনভাইট লিংক দিন। পরিবর্তন করলে পুরো ওয়েবসাইটে তা তাৎক্ষণিক কার্যকর হবে।
        </p>
      </div>

      <div className="bg-[#151B28] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
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

        {loading ? (
          <div className="text-gray-400 text-sm py-8 text-center">লোডিং হচ্ছে...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase mb-2">
                WhatsApp Community Invite Link
              </label>
              <input
                type="url"
                required
                value={whatsappUrl}
                onChange={(e) => setWhatsappUrl(e.target.value)}
                placeholder="https://chat.whatsapp.com/..."
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange text-sm font-medium"
              />
              <span className="text-xs text-gray-500 mt-2 block">
                উদাহরণ: https://chat.whatsapp.com/Gabc123xyz
              </span>
            </div>

            {whatsappUrl && (
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-orange hover:underline font-semibold"
                >
                  লিংকটি ওপেন করে টেস্ট করুন <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-bold text-sm transition-all shadow-lg shadow-brand-orange/20 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "সংরক্ষণ হচ্ছে..." : "Save Settings"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
    }
