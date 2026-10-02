"use client";
import { useEffect, useState } from "react";
import PromptCard from "@/components/shared/PromptCard";
export default function FavoritesPage(){ const [items,setItems]=useState<any[]>([]); const [filter,setFilter]=useState("All");
  useEffect(()=>{ fetch("/api/favorites").then(r=>r.json()).then(d=>setItems(d.favorites||[])); },[]);
  const shown=items.filter(p=>filter==="All"||(filter==="Premium"?p.isPremium:!p.isPremium));
  return <div className="max-w-7xl mx-auto px-4 py-10"><h1 className="text-3xl font-black">❤️ My Favorites</h1>
  <div className="flex gap-2 mt-5">{["All","Free","Premium"].map(f=><button key={f} onClick={()=>setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-bold ${filter===f?"bg-[#FF6B00] text-white":"card"}`}>{f}</button>)}</div>
  {shown.length?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">{shown.map((p:any)=><PromptCard key={p.id} {...p}/>)}</div>:<div className="card rounded-2xl p-10 text-center muted mt-8">No favorites yet. <a href="/browse" className="text-[#FF6B00] font-bold">Browse Prompts →</a></div>}</div>;
}
