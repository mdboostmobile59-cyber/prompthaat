import Link from "next/link";
import { Crown, Check } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";
import { isVipUser } from "@/lib/access";
export const dynamic="force-dynamic";
export default async function VipPage(){ const s=await getSettings(["vip_price","vip_enabled","vip_name"]); const user:any=await getCurrentUser(); const vip=await isVipUser(user?.userId);
  return <div className="max-w-4xl mx-auto px-4 py-12">
    <div className="rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl">
      <div className="bg-gradient-to-r from-[#FF6B00] to-amber-500 text-white p-8 text-center"><Crown className="w-12 h-12 mx-auto"/><h1 className="text-3xl sm:text-4xl font-black mt-3">{s.vip_name||"VIP"} — All Prompts Access</h1><p className="text-white/90 mt-2">সব Premium prompt একবারেই unlock করুন।</p><div className="text-5xl font-black mt-5">৳{s.vip_price}</div><p className="text-sm text-white/80">one-time (admin can change price anytime)</p></div>
      <div className="card !border-0 p-8 space-y-3">
        {["All current Premium prompts unlocked","All future Premium prompts while VIP is active","No per-prompt checkout needed","Access from My Purchases / any prompt page"].map(x=><div key={x} className="flex gap-2 font-semibold"><Check className="w-5 h-5 text-emerald-500"/>{x}</div>)}
        {vip ? <div className="mt-6 text-center font-black text-emerald-500">✓ You are VIP</div> : s.vip_enabled==="false" ? <div className="mt-6 text-center muted">VIP is currently disabled.</div> : <Link href={user?"/checkout/VIP":"/login?callbackUrl=/checkout/VIP"} className="btn-orange w-full mt-6">👑 Become VIP — ৳{s.vip_price}</Link>}
      </div>
    </div>
  </div>;
}
