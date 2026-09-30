"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

interface FavoriteBtnProps {
  promptId: string;
  initialFavorite?: boolean;
}

export default function FavoriteBtn({ promptId, initialFavorite = false }: FavoriteBtnProps) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsFav(data.isFavorite);
      } else if (res.status === 401) {
        // লগইন না থাকলে সরাসরি লগইন পেজে নিয়ে যাবে
        router.push("/login");
      }
    } catch {
      // নেটওয়ার্ক ফেইল হলে পরিবর্তন হবে না
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full backdrop-blur-md transition-all ${
        isFav
          ? "bg-red-500/20 text-red-500 border border-red-500/40"
          : "bg-black/40 text-gray-300 hover:text-white hover:bg-black/60 border border-white/10"
      }`}
      title={isFav ? "Remove Favorite" : "Save to Favorites"}
    >
      <Heart className={`w-4 h-4 ${isFav ? "fill-red-500" : ""}`} />
    </button>
  );
}
