"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface FavoriteBtnProps {
  promptId: string;
  initialFavorite?: boolean;
}

export default function FavoriteBtn({ promptId, initialFavorite = false }: FavoriteBtnProps) {
  const [isFav, setIsFav] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    // ক্লিক করার সাথে সাথেই স্ক্রিনে রঙ পরিবর্তন হবে
    const nextState = !isFav;
    setIsFav(nextState);
    setLoading(true);

    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptId }),
      });

      if (res.status === 401) {
        // লগইন না থাকলে সরাসরি লগইন পেজে নিয়ে যাবে
        setIsFav(false);
        window.location.href = `/login?callbackUrl=/browse`;
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setIsFav(data.isFavorite);
      } else {
        setIsFav(!nextState);
      }
    } catch {
      setIsFav(!nextState);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      type="button"
      className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-lg ${
        isFav
          ? "bg-red-500 text-white shadow-red-500/50"
          : "bg-black/70 text-gray-200 hover:text-white hover:bg-black/90 border border-white/20"
      }`}
      title={isFav ? "Remove Favorite" : "Save to Favorites"}
    >
      <Heart className={`w-4 h-4 ${isFav ? "fill-white text-white" : ""}`} />
    </button>
  );
}
