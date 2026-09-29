"use client";

import { Video, ExternalLink } from "lucide-react";
import { getWhatsAppCommunityUrl } from "@/lib/whatsapp";

interface WatchSampleBtnProps {
  promptTitle?: string;
  className?: string;
}

export default function WatchSampleBtn({ promptTitle, className = "" }: WatchSampleBtnProps) {
  const handleOpenCommunity = () => {
    const url = getWhatsAppCommunityUrl();
    window.open(url, "_blank", "noopener,noreferrer");
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
