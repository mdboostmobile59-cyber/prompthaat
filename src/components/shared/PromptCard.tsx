import Link from "next/link";
import FavoriteBtn from "./FavoriteBtn";
export interface PromptCardProps{ id:string; slug:string; title:string; category:string; description:string; imageUrl:string; isPremium:boolean; price?:number; aiModel?:string; promptType?:string; isFeatured?:boolean }
export default function PromptCard(p:PromptCardProps){
  const price=Number(p.price||0);
  return <div className="card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col">
    <div className="relative aspect-[16/10] overflow-hidden bg-gray-200 dark:bg-gray-900">
      <img src={p.imageUrl} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
      <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full text-white ${p.isPremium?"bg-[#FF6B00]":"bg-emerald-600"}`}>{p.isPremium?"PREMIUM":"FREE"}</span>
      <div className="absolute top-3 right-3"><FavoriteBtn promptId={p.id}/></div>
    </div>
    <div className="p-4 flex flex-col flex-1">
      <div className="text-[11px] font-bold uppercase tracking-wide text-[#FF6B00]">{p.category} • {p.aiModel||"AI"}{p.promptType?` • ${p.promptType}`:""}</div>
      <h3 className="font-extrabold text-base mt-1 line-clamp-2">{p.title}</h3>
      <p className="text-sm muted mt-1 line-clamp-2 flex-1">{p.description}</p>
      {p.isPremium ? <div className="flex items-center justify-between mt-4"><span className="text-lg font-black text-[#FF6B00]">৳{price}</span><Link href={`/prompt/${p.slug}`} className="btn-orange !py-2.5 !px-4 text-sm">🔓 Unlock Prompt →</Link></div>
      : <Link href={`/prompt/${p.slug}`} className="btn-orange mt-4 text-sm">View Prompt →</Link>}
    </div>
  </div>;
}
