import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PromptCard from "@/components/shared/PromptCard";
import { isVipUser } from "@/lib/access";
export const dynamic="force-dynamic";
export default async function PurchasesPage(){ const user:any=await getCurrentUser(); if(!user) redirect("/login");
  let items:any[]=[]; let vip=false; try{ vip=await isVipUser(user.userId); const rows=await prisma.purchase.findMany({where:{userId:user.userId},include:{prompt:{include:{category:true}}},orderBy:{createdAt:"desc"}}); items=rows.map((r:any)=>({id:r.prompt.id,slug:r.prompt.slug,title:r.prompt.title,category:r.prompt.category?.name||"General",description:r.prompt.description,imageUrl:r.prompt.imageUrl,isPremium:r.prompt.isPremium,price:Number(r.prompt.price||0),aiModel:r.prompt.aiModel,promptType:r.prompt.promptType})); }catch{}
  return <div className="max-w-7xl mx-auto px-4 py-10"><h1 className="text-3xl font-black">My Purchases</h1>{vip && <p className="text-amber-500 font-bold mt-2">👑 You are VIP — all Premium prompts are unlocked for you.</p>}
  {items.length?<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">{items.map((p:any)=><PromptCard key={p.id} {...p}/>)}</div>:<div className="card rounded-2xl p-10 text-center muted mt-8">You haven't purchased any premium prompts yet.</div>}</div>;
}
