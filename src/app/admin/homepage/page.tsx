"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function AdminHomepage(){ const [prompts,setPrompts]=useState<any[]>([]);
  const load=()=>fetch("/api/admin/prompts").then(r=>r.json()).then(d=>setPrompts(d.prompts||[])); useEffect(()=>{load()},[]);
  const toggleFeatured=async(p:any)=>{ await fetch(`/api/admin/prompts/${p.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({...p,categoryId:p.categoryId,isFeatured:!p.isFeatured,price:Number(p.price||0)})}); load(); };
  return <div className="space-y-6"><h1 className="text-3xl font-black">Homepage Management</h1><p className="muted text-sm">Featured prompts appear in the Featured section on Home. Free/Premium sections are automatic from prompt type. Hero text & VIP price are in Website Settings.</p>
  <div className="card rounded-2xl divide-y divide-gray-800">{prompts.map(p=><div key={p.id} className="flex items-center justify-between p-4 gap-3"><div className="flex items-center gap-3"><img src={p.imageUrl} className="w-14 h-10 object-cover rounded-lg"/><div><div className="font-bold text-sm">{p.title}</div><div className="text-xs muted">{p.isPremium?`Premium ৳${p.price}`:"Free"} • {p.status}</div></div></div><button onClick={()=>toggleFeatured(p)} className={`px-4 py-2 rounded-lg text-xs font-bold ${p.isFeatured?"bg-[#FF6B00] text-white":"card"}`}>{p.isFeatured?"★ Featured":"☆ Make Featured"}</button></div>)}</div>
  <Link href="/admin/settings" className="text-[#FF6B00] font-bold text-sm">Edit Hero / VIP / Website Settings →</Link></div>;
}
