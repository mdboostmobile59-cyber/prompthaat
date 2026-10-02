"use client";
import { useEffect, useState } from "react";
export default function AdminSettings(){ const [s,setS]=useState<any>({}); const [msg,setMsg]=useState("");
  useEffect(()=>{ fetch("/api/admin/settings").then(r=>r.json()).then(d=>setS(d.settings||{})); },[]);
  const save=async()=>{ const r=await fetch("/api/admin/settings",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)}); setMsg(r.ok?"✓ Saved — website updated":"Failed"); };
  const F=(k:string,label:string)=> <div><label className="text-xs font-bold uppercase muted">{label}</label><input value={s[k]||""} onChange={e=>setS({...s,[k]:e.target.value})} className="input mt-1"/></div>;
  return <div className="space-y-6 max-w-2xl"><h1 className="text-3xl font-black">Website Settings</h1>
    <div className="card rounded-2xl p-6 space-y-4">{F("website_name","Website Name")}{F("hero_headline","Hero Headline")}{F("hero_subtext","Hero Subtext")}{F("whatsapp_community_name","WhatsApp Community Name")}{F("whatsapp_community_url","WhatsApp Community URL")}
    <div className="border-t border-gray-700 pt-4 space-y-4"><h3 className="font-black">👑 VIP</h3>{F("vip_name","VIP Name")}{F("vip_price","VIP Price (৳)")}<div><label className="text-xs font-bold uppercase muted">VIP Enabled</label><select value={s.vip_enabled||"true"} onChange={e=>setS({...s,vip_enabled:e.target.value})} className="input mt-1"><option value="true">Enabled</option><option value="false">Disabled</option></select></div></div>
    {msg && <p className="text-emerald-500 text-sm font-bold">{msg}</p>}<button onClick={save} className="btn-orange w-full">Save Settings</button></div></div>;
}
