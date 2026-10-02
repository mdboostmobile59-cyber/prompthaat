import Link from "next/link";
import { ArrowRight, Flame, Sparkles, Gift, Crown } from "lucide-react";
import PromptCard from "@/components/shared/PromptCard";
import { getPrompts, getCategories, minPremiumPrice } from "@/lib/prompts";
import { getSettings } from "@/lib/settings";
export const dynamic="force-dynamic";
export default async function HomePage(){
  const [all,free,premium,featured,cats,settings,minPrice]=await Promise.all([
    getPrompts({take:6,sort:"popular"}), getPrompts({tier:"Free",take:6}), getPrompts({tier:"Premium",take:6}), getPrompts({featured:true,take:6}), getCategories(), getSettings(["hero_headline","hero_subtext","vip_price","vip_enabled"]), minPremiumPrice()
  ]);
  const latest=await getPrompts({take:6});
  const heroPrompts=all.slice(0,4);
  const vipPrice=settings.vip_price||"999";
  return <div className="pb-16">
    {/* HERO v2 */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-[#FF6B00] text-[11px] font-extrabold tracking-widest">✦ AI PROMPTS MARKETPLACE</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.02] mt-5">Powerful AI Prompts.<br/><span className="text-[#FF6B00]">Better Results.</span></h1>
          <p className="muted text-base sm:text-lg mt-4 max-w-xl">{settings.hero_subtext}</p>
          <form action="/browse" className="flex mt-6 bg-white dark:bg-white rounded-full overflow-hidden border border-gray-300 shadow-lg max-w-xl">
            <input name="q" placeholder="Search prompts, categories, or AI models..." className="flex-1 px-5 py-3.5 text-sm text-black outline-none min-w-0"/>
            <button className="bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold px-6 text-sm">Search</button>
          </form>
          <div className="flex flex-wrap gap-3 mt-5">
            <Link href="/browse" className="btn-orange">Browse Prompts →</Link>
            <Link href="/premium" className="inline-flex items-center px-5 py-3 rounded-xl font-bold border border-gray-300 dark:border-gray-700">Explore Premium →</Link>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5 text-xs font-bold muted"><span>🎁 Free Prompts</span><span>🔥 Premium from ৳{minPrice}</span><span>🎬 Sample Videos on WhatsApp</span>{settings.vip_enabled!=="false" && <span className="text-[#FF6B00]">👑 VIP All-Access ৳{vipPrice}</span>}</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {heroPrompts.map(p=><PromptCard key={p.id} {...p}/>)}
        </div>
      </div>
    </section>

    {/* CATEGORIES */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6"><h2 className="text-2xl sm:text-3xl font-black">Popular Categories</h2><Link href="/categories" className="text-sm font-bold text-[#FF6B00] inline-flex items-center gap-1">View All <ArrowRight className="w-4 h-4"/></Link></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cats.slice(0,10).map(c=><Link key={c.slug} href={`/browse?category=${encodeURIComponent(c.name)}`} className="card rounded-xl p-4 hover:border-[#FF6B00] transition"><div className="font-bold text-sm">{c.name}</div><div className="text-xs muted mt-1">{c.count} prompts</div></Link>)}
      </div>
    </section>

    {featured.length>0 && <Section title="✨ Featured Prompts" href="/browse" items={featured}/>}
    <Section title="🎁 Free Prompts" href="/browse?tier=Free" items={free} icon={<Gift className="w-6 h-6 text-[#FF6B00]"/>}/>

    {/* VIP BANNER */}
    {settings.vip_enabled!=="false" && <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-3xl bg-gradient-to-r from-[#FF6B00] to-amber-500 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-xl">
        <div><div className="flex items-center gap-2 font-black text-2xl"><Crown className="w-7 h-7"/> VIP — All Prompts Access</div><p className="text-white/90 text-sm mt-1">একবার VIP নিলে সব Premium prompt unlock. আলাদা আলাদা কেনার ঝামেলা নেই।</p></div>
        <div className="flex items-center gap-4"><span className="text-3xl font-black">৳{vipPrice}</span><Link href="/vip" className="bg-black text-white px-6 py-3 rounded-xl font-bold">Become VIP →</Link></div>
      </div>
    </section>}

    <Section title="🔥 Premium Prompts" href="/premium" items={premium} icon={<Flame className="w-6 h-6 text-[#FF6B00]"/>}/>
    <Section title="✨ Latest Prompts" href="/browse" items={latest} icon={<Sparkles className="w-6 h-6 text-[#FF6B00]"/>}/>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
      <h2 className="text-2xl sm:text-3xl font-black">Find the Right Prompt for Your Next Creation.</h2>
      <Link href="/browse" className="btn-orange mt-6">Explore All Prompts →</Link>
    </section>
  </div>;
}
function Section({title,href,items,icon}:any){
  if(!items?.length) return null;
  return <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="flex justify-between items-center mb-6"><h2 className="text-2xl sm:text-3xl font-black flex items-center gap-2">{icon}{title}</h2><Link href={href} className="text-sm font-bold text-[#FF6B00] inline-flex items-center gap-1">View More <ArrowRight className="w-4 h-4"/></Link></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{items.map((p:any)=><PromptCard key={p.id} {...p}/>)}</div>
  </section>;
}
