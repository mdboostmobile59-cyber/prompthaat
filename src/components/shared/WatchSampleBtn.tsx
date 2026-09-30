"use client";

import { useState, useEffect } from "react";
import { Video, ExternalLink } from "lucide-react";

interface WatchSampleBtnProps {
  promptTitle?: string;
  className?: string;
}

export default function WatchSampleBtn({ className = "" }: WatchSampleBtnProps) {
  const [communityUrl, setCommunityUrl] = useState(
    "https://chat.whatsapp.com/your-community-invite-link"
  );

  // ডাটাবেজ থেকে লাইভ হোয়াটসঅ্যাপ লিংক সংগ্রহ করা
  useEffect(() => {
    async function fetchUrl() {
      try {
        const res = await fetch("/api/settings/public");
        const data = await res.json();
        if (data.whatsappUrl) {
          setCommunityUrl(data.whatsappUrl);
        }
      } catch {
        // কোনো সমস্যা হলে ডিফল্ট লিংক কাজ করবে
      }
    }
    fetchUrl();
  }, []);

  const handleOpenCommunity = () => {
    window.open(communityUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleOpenCommunity}
      type="button"
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-950/40 ${className}`}
    >
      <Video className="w-4 h-4 text-white" />
      <span>Watch Sample Video</span>
      <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
    </button>
  );
}
