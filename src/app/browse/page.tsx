"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import PromptCard from "@/components/shared/PromptCard";
function BrowseInner(){
  const sp=useSearchParams();
  const [prompts,setPrompts]=useState<any[]>([]); const [cats,setCats]=useState<string[]>(["All Categories"]);
  const [q,setQ]=useState(sp.get("q")||""); const [tier,setTier]=useState(sp.get("tier")||"All"); const [cat,setCat]=useState(sp.get("category")||"All Categories");
  const [model,setModel]=useState("All Models"); const [type,setType]=useState("All Types"); const [sort,setSort]=useState("latest"); const [loading,setLoading]=useState(true); const [visible,setVisible]=useState(12);
  useEffect(()=>{ fetch("/api/admin/categories").then(r=>r.json()).then(d=>{ if(d.categories?.length) setCats(["All Categories",...d.categories.map((c:any)=>c.name)]); }).catch(()=>{}); },[]);
  useEffect(()=>{ setLoading(true); const params=new URLSearchParams(); if(q)params.set("search",q); if(tier!=="All")params.set("tier",tier); if(cat!=="All Categories")params.set("category",cat); if(model!=="All Models")params.set("model",model); if(type!=="All Types")params.set("type",type); params.set("sort",sort);
    const t=setTimeout(()=>fetch(`/api/prompts?${params}`).then(r=>r.json()).then(d=>setPrompts(d.prompts||[])).finally(()=>setLoading(false)),250); return ()=>clearTimeout(t);
  },[q,tier,cat,model,type,sort]);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
    <div><h1 className="text-3xl sm:text-4xl font-black">All Prompts</h1><p className="muted mt-1">Premium & Free AI Prompts</p></div>
    <div className="card rounded-2xl p-4 flex flex-col lg:flex-row gap-3">
      <div className="relative flex-1"><Search className="w-5 h-5 absolute left-3 top-3 muted"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search prompts..." className="input !pl-10"/></div>
      <div className="flex gap-1.5 bg-gray-100 dark:bg-black/30 p-1 rounded-xl">{["All","Free","Premium"].map(f=><button key={f} onClick={()=>setTier(f)} className={`px-4 py-2 rounded-lg text-sm font-bold ${tier===f?"bg-[#FF6B00] text-white":"muted"}`}>{f}</button>)}</div>
      <select value={model} onChange={e=>setModel(e.target.value)} className="input lg:w-40"><option>All Models</option>{["Veo","Seedance","Kling","Sora","Gemini","Midjourney","Other"].map(x=><option key={x}>{x}</option>)}</select>
      <select value={type} onChange={e=>setType(e.target.value)} className="input lg:w-36"><option>All Types</option>{["Video","Image","Story","Character","Other"].map(x=><option key={x}>{x}</option>)}</select>
      <select value={sort} onChange={e=>setSort(e.target.value)} className="input lg:w-44"><option value="latest">Latest</option><option value="oldest">Oldest</option><option value="popular">Popular</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select>
    </div>
    <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1"><SlidersHorizontal className="w-4 h-4 mt-2 shrink-0 muted"/>{cats.map(c=><button key={c} onClick={()=>setCat(c)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold ${cat===c?"bg-black text-white dark:bg-white dark:text-black":"bg-gray-200 dark:bg-gray-800"}`}>{c}</button>)}</div>
    {loading?<div className="text-center py-20 muted">Loading prompts...</div>:prompts.length?<><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">{prompts.slice(0,visible).map((p:any)=><PromptCard key={p.id} {...p}/>)}</div>{visible<prompts.length && <div className="text-center"><button onClick={()=>setVisible(v=>v+12)} className="btn-orange">Load More</button></div>}</>:<div className="text-center py-20 card rounded-2xl"><p className="muted">No prompts found.</p><button onClick={()=>{setQ("");setTier("All");setCat("All Categories")}} className="mt-4 text-[#FF6B00] font-bold">Reset filters</button></div>}
  </div>;
}
export default function BrowsePage(){ return <Suspense fallback={<div className="text-center py-20">Loading...</div>}><BrowseInner/></Suspense>; }
