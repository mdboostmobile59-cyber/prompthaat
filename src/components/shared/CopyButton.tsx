"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
}

export default function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy prompt");
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-brand-orange hover:bg-brand-orangeHover transition-all shadow-lg shadow-brand-orange/25"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-white" />
          <span>Copied to Clipboard!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 text-white" />
          <span>Copy Prompt</span>
        </>
      )}
    </button>
  );
}
