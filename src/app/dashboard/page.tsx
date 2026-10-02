import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Heart, User, ShieldCheck, Crown } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { isVipUser } from "@/lib/access";
export const dynamic="force-dynamic";
export default async function DashboardPage(){ const user:any=await getCurrentUser(); if(!user) redirect("/login");
  let pc=0,fc=0,vip=false; try{ pc=await prisma.purchase.count({where:{userId:user.userId}}); fc=await prisma.favorite.count({where:{userId:user.userId}}); vip=await isVipUser(user.userId); }catch{}
  const cards=[{t:"Purchased Prompts",d:"Your unlocked premium prompts",href:"/dashboard/purchases",icon:ShoppingBag,meta:`${pc} items`},{t:"Favorite Prompts",d:"Saved prompts for later",href:"/dashboard/favorites",icon:Heart,meta:`${fc} saved`},{t:"Account",d:"Name, email & logout",href:"/dashboard/account",icon:User,meta:user.role}];
  return <div className="max-w-7xl mx-auto px-4 py-12"><div className="card rounded-2xl p-6 sm:p-8 mb-8 flex flex-wrap justify-between gap-4"><div><span className="text-xs font-bold uppercase text-[#FF6B00]">User Account</span><h1 className="text-3xl font-black mt-1">Welcome, {user.name}</h1><p className="muted text-sm">{user.email}</p>{vip && <span className="inline-flex mt-2 text-xs font-black text-amber-500">👑 VIP Member</span>}</div><div className="flex gap-2 items-start">{user.role==="ADMIN" && <Link href="/admin" className="btn-orange !py-2.5 text-sm"><ShieldCheck className="w-4 h-4"/> Admin Panel</Link>}{!vip && <Link href="/vip" className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl border font-bold text-sm"><Crown className="w-4 h-4 text-amber-500"/> Become VIP</Link>}</div></div>
  <div className="grid md:grid-cols-3 gap-5">{cards.map(c=>{ const Icon=c.icon; return <Link key={c.href} href={c.href} className="card rounded-2xl p-6 hover:border-[#FF6B00] transition"><Icon className="w-7 h-7 text-[#FF6B00]"/><h3 className="font-black text-lg mt-3">{c.t}</h3><p className="text-sm muted mt-1">{c.d}</p><div className="text-xs font-bold text-[#FF6B00] mt-3">{c.meta} →</div></Link> })}</div></div>;
}
