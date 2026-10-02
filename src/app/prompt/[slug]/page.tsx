import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Sparkles, Calendar, Layers, Cpu, CheckCircle2, Crown } from "lucide-react";
import { getPromptBySlug, getPrompts } from "@/lib/prompts";
import { getCurrentUser } from "@/lib/auth";
import { hasPromptAccess, isVipUser } from "@/lib/access";
import WatchSampleBtn from "@/components/shared/WatchSampleBtn";
import CopyButton from "@/components/shared/CopyButton";
import FavoriteBtn from "@/components/shared/FavoriteBtn";
import PromptCard from "@/components/shared/PromptCard";
import { getVipPrice } from "@/lib/settings";
export const dynamic="force-dynamic";
export default async function PromptDetailsPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const user:any=await getCurrentUser();
  const prompt:any=await getPromptBySlug(slug); if(!prompt) notFound();
  const unlocked=await hasPromptAccess(user,prompt); const vip=await isVipUser(user?.userId); const vipPrice=await getVipPrice();
  const related=(await getPrompts({category:prompt.category,take:8})).filter((x:any)=>x.slug!==slug).slice(0,4);
  // SECURITY: only expose content string to the renderer when unlocked
  const content = unlocked ? prompt.promptContent : "";
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <Link href="/browse" className="inline-flex items-center gap-2 text-sm font-semibold muted hover:text-[#FF6B00]"><ArrowLeft className="w-4 h-4"/> Back to All Prompts</Link>
    <div className="grid md:grid-cols-2 gap-8 items-start">
      <div className="rounded-2xl overflow-hidden card relative aspect-[16/10]"><img src={prompt.imageUrl} alt={prompt.title} className="w-full h-full object-cover"/><div className="absolute top-4 right-4"><FavoriteBtn promptId={prompt.id}/></div></div>
      <div className="space-y-5">
        <div><span className="text-xs font-bold uppercase text-[#FF6B00]">{prompt.category}</span> <span className="muted">•</span> {prompt.isPremium?<span className="text-xs font-bold text-[#FF6B00]"><Lock className="w-3 h-3 inline"/> PREMIUM ৳{prompt.price}</span>:<span className="text-xs font-bold text-emerald-500"><Sparkles className="w-3 h-3 inline"/> FREE</span>} {vip && <span className="ml-2 text-xs font-bold text-amber-500">👑 VIP</span>}</div>
        <h1 className="text-2xl sm:text-3xl font-black leading-tight">{prompt.title}</h1>
        <p className="muted leading-relaxed">{prompt.description}</p>
        <div className="grid grid-cols-2 gap-3 card p-4 rounded-xl text-xs"><span className="muted flex gap-2"><Cpu className="w-4 h-4 text-[#FF6B00]"/>Model: <b>{prompt.aiModel}</b></span><span className="muted flex gap-2"><Layers className="w-4 h-4 text-[#FF6B00]"/>Type: <b>{prompt.promptType}</b></span><span className="muted flex gap-2"><Calendar className="w-4 h-4 text-[#FF6B00]"/>Date: <b>{String(prompt.createdAt).slice(0,10)}</b></span></div>
        {!prompt.isPremium && !user && <Link href={`/login?callbackUrl=/prompt/${slug}`} className="btn-orange w-full">Login to Unlock</Link>}
        {prompt.isPremium && !unlocked && <div className="space-y-2"><Link href={user?`/checkout/${prompt.id}`:`/login?callbackUrl=/checkout/${prompt.id}`} className="btn-orange w-full">🔓 Unlock Prompt — ৳{prompt.price}</Link><Link href="/vip" className="block text-center text-sm font-bold text-amber-600">👑 Or get VIP All-Access — ৳{vipPrice}</Link></div>}
        {unlocked && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500"><CheckCircle2 className="w-4 h-4"/> Unlocked</span>}
      </div>
    </div>
    <div className="card rounded-2xl p-6 flex flex-col sm:flex-row justify-between gap-5"><div><h3 className="font-bold text-lg">🎬 See the Result</h3><p className="text-sm muted">Watch the real sample in our WhatsApp Community.</p></div><WatchSampleBtn/></div>
    <div className="card rounded-2xl p-6 sm:p-8 space-y-5">
      <h3 className="font-bold text-lg">Prompt</h3>
      {unlocked ? <div className="space-y-4"><div className="p-4 rounded-xl bg-gray-100 dark:bg-black/40 font-mono text-sm leading-relaxed break-words">{content}</div><div className="flex justify-end"><CopyButton textToCopy={content}/></div></div>
      : prompt.isPremium ? <div className="text-center py-8 space-y-3"><Lock className="w-10 h-10 mx-auto text-[#FF6B00]"/><h4 className="font-bold">🔒 Premium Prompt</h4><p className="text-sm muted">Unlock this prompt to access the complete prompt.</p><div className="font-black text-2xl text-[#FF6B00]">৳{prompt.price}</div><Link href={user?`/checkout/${prompt.id}`:`/login?callbackUrl=/checkout/${prompt.id}`} className="btn-orange">🔓 Unlock Prompt →</Link></div>
      : <div className="text-center py-8 space-y-3"><Lock className="w-10 h-10 mx-auto text-emerald-500"/><h4 className="font-bold">🔒 Login to Unlock</h4><p className="text-sm muted">Sign in to view the full prompt. No payment needed.</p><Link href={`/login?callbackUrl=/prompt/${slug}`} className="btn-orange">Login to Unlock</Link></div>}
    </div>
    {related.length>0 && <div><h3 className="text-xl font-black mb-5">You May Also Like</h3><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{related.map((p:any)=><PromptCard key={p.id} {...p}/>)}</div></div>}
  </div>;
}
