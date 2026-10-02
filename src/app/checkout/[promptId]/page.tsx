"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Crown } from "lucide-react";
export default function CheckoutPage(){
  const router=useRouter(); const params=useParams(); const promptId=params?.promptId as string; const isVip=promptId==="VIP";
  const [prompt,setPrompt]=useState<any>(null); const [method,setMethod]=useState<"bKash"|"Nagad"|"Card">("bKash"); const [accountNo,setAccountNo]=useState("");
  const [loading,setLoading]=useState(false); const [fetching,setFetching]=useState(true); const [error,setError]=useState(""); const [success,setSuccess]=useState(false);
  useEffect(()=>{ async function load(){ if(isVip){ try{ const r=await fetch("/api/settings/public"); const d=await r.json(); setPrompt({id:"VIP",title:"VIP — All Prompts Access",slug:"vip",category:"VIP",price:d.vipPrice||999,imageUrl:""});}catch{ setPrompt({id:"VIP",title:"VIP — All Prompts Access",price:999}); } setFetching(false); return; }
      try{ const res=await fetch("/api/prompts"); const data=await res.json(); setPrompt(data.prompts?.find((p:any)=>p.id===promptId)||null); }catch{} setFetching(false); } load(); },[promptId,isVip]);
  if(fetching) return <div className="text-center py-20 muted">Loading...</div>;
  if(!prompt) return <div className="text-center py-20"><p>Prompt not found. It may be a demo prompt — add real prompts from Admin Panel.</p><Link href="/browse" className="text-[#FF6B00] font-bold">Browse →</Link></div>;
  const price=Number(prompt.price||999);
  const pay=async(e:any)=>{ e.preventDefault(); setLoading(true); setError(""); try{ const res=await fetch("/api/payment/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({promptId:prompt.id,kind:isVip?"vip":"prompt",method,accountNo})}); const d=await res.json(); if(!res.ok) setError(d.error||"Payment failed"); else { setSuccess(true); setTimeout(()=>router.push(isVip?"/dashboard":`/prompt/${prompt.slug}`),1500); } }catch{ setError("Server error"); } setLoading(false); };
  return <div className="max-w-3xl mx-auto px-4 py-12"><Link href={isVip?"/vip":`/prompt/${prompt.slug}`} className="inline-flex gap-2 text-sm muted mb-6"><ArrowLeft className="w-4 h-4"/> Cancel & Return</Link>
    <div className="card rounded-3xl p-6 sm:p-8 space-y-7 shadow-xl">
      <div><span className="text-xs font-bold uppercase text-[#FF6B00]">{isVip?"VIP Checkout":"Premium Unlock Checkout"}</span><h1 className="text-2xl sm:text-3xl font-black mt-1 flex items-center gap-2">{isVip && <Crown className="text-amber-500"/>} {prompt.title}</h1></div>
      <div className="flex justify-between items-center bg-gray-100 dark:bg-black/30 rounded-xl p-4"><span className="font-bold">{prompt.title}</span><span className="text-xl font-black text-[#FF6B00]">৳{price}</span></div>
      {error && <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-sm flex gap-2"><AlertCircle className="w-5 h-5"/>{error}</div>}
      {success ? <div className="p-8 text-center space-y-3"><CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto"/><h3 className="font-black text-xl">Payment successful!</h3><p className="text-sm muted">Unlocked. Redirecting...</p></div>
      : <form onSubmit={pay} className="space-y-6">
        <div><label className="text-xs font-bold uppercase muted">Payment Method</label><div className="grid grid-cols-3 gap-3 mt-2">{(["bKash","Nagad","Card"] as const).map(m=><button key={m} type="button" onClick={()=>setMethod(m)} className={`py-3 rounded-xl font-bold border ${method===m?"border-[#FF6B00] text-[#FF6B00] bg-orange-500/10":"border-gray-300 dark:border-gray-700"}`}>{m}</button>)}</div></div>
        <div><label className="text-xs font-bold uppercase muted">{method==="Card"?"Card Number":method+" Mobile Number / TrxID"}</label><input required value={accountNo} onChange={e=>setAccountNo(e.target.value)} placeholder="01XXXXXXXXX" className="input mt-2"/></div>
        <p className="text-xs muted flex gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500"/> Simulated payment for development. Real gateway will verify server-side in production.</p>
        <button disabled={loading} className="btn-orange w-full !py-4">{loading?"Processing...":`Pay ৳${price} with ${method}`}</button>
      </form>}
    </div></div>;
}
