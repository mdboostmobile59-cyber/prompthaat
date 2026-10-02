import Link from "next/link";
import PromptCard from "@/components/shared/PromptCard";
import { getPrompts } from "@/lib/prompts";
import { getSettings } from "@/lib/settings";
export const dynamic="force-dynamic";
export default async function PremiumPage(){ const [items,s]=await Promise.all([getPrompts({tier:"Premium",take:60}),getSettings(["vip_price","vip_enabled"])]);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><div className="flex flex-wrap justify-between gap-4 items-end"><div><h1 className="text-3xl sm:text-4xl font-black">🔥 Premium Prompts</h1><p className="muted mt-1">Price is shown before purchase. Unlock once, copy anytime from your dashboard.</p></div>{s.vip_enabled!=="false" && <Link href="/vip" className="btn-orange">👑 Get VIP — All Access ৳{s.vip_price}</Link>}</div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">{items.map((p:any)=><PromptCard key={p.id} {...p}/>)}</div>{!items.length && <p className="muted text-center py-16">No premium prompts yet.</p>}</div>;
}
