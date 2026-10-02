import { prisma } from "@/lib/prisma";
import { Layers, Users, DollarSign, Crown, ShoppingBag } from "lucide-react";
export const dynamic="force-dynamic";
export default async function AdminDashboardPage(){
  let stats:any[]=[]; let recent:any[]=[];
  try{
    const [totalPrompts,freePrompts,premiumPrompts,totalUsers,purchases,vips,allUsers]=await Promise.all([prisma.prompt.count(),prisma.prompt.count({where:{isPremium:false}}),prisma.prompt.count({where:{isPremium:true}}),prisma.user.count(),prisma.purchase.findMany(),prisma.vipSubscription.findMany({where:{status:"ACTIVE"}}),prisma.user.findMany({include:{purchases:true}})]);
    const revenue=purchases.reduce((a:number,b:any)=>a+Number(b.amount||0),0)+vips.reduce((a:number,b:any)=>a+Number(b.amount||0),0);
    const premiumUsers=allUsers.filter((u:any)=>u.purchases.length>0).length;
    stats=[{label:"Total Users",value:totalUsers,icon:Users},{label:"Free Users",value:totalUsers-premiumUsers,icon:Users},{label:"Premium Users",value:premiumUsers,icon:Users},{label:"VIP Members",value:vips.length,icon:Crown},{label:"Total Prompts",value:totalPrompts,icon:Layers},{label:"Free / Premium",value:`${freePrompts} / ${premiumPrompts}`,icon:Layers},{label:"Total Purchases",value:purchases.length,icon:ShoppingBag},{label:"Total Revenue",value:`৳${revenue.toFixed(0)}`,icon:DollarSign}];
    recent=await prisma.purchase.findMany({take:5,orderBy:{createdAt:"desc"},include:{user:true,prompt:true}});
  }catch{ stats=[{label:"Database",value:"Not connected yet",icon:Layers}]; }
  return <div className="space-y-8"><div><span className="text-xs font-bold uppercase text-[#FF6B00]">Admin Control Center</span><h1 className="text-3xl font-black mt-1">PromptHaat Dashboard</h1><p className="text-sm muted mt-1">Prompts, prices, categories, users, orders & VIP — everything is controlled from here, no code editing needed.</p></div>
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{stats.map((s:any)=>{ const Icon=s.icon; return <div key={s.label} className="card rounded-2xl p-5"><div className="text-xs muted uppercase font-bold">{s.label}</div><div className="text-2xl font-black mt-2 flex items-center gap-2"><Icon className="w-5 h-5 text-[#FF6B00]"/>{s.value}</div></div> })}</div>
  {recent.length>0 && <div className="card rounded-2xl p-5"><h3 className="font-bold mb-3">Recent Orders</h3>{recent.map((o:any)=><div key={o.id} className="flex justify-between text-sm py-2 border-b border-gray-800 last:border-0"><span>{o.user?.name} — {o.prompt?.title}</span><span className="font-bold">৳{Number(o.amount)}</span></div>)}</div>}
  </div>;
}
