import { prisma } from "./prisma";
export const DEFAULTS: Record<string,string> = {
  website_name: "PromptHaat",
  whatsapp_community_url: process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL || "https://chat.whatsapp.com/your-community-invite-link",
  whatsapp_community_name: "PromptHaat Sample Videos",
  vip_price: "999",
  vip_enabled: "true",
  vip_name: "VIP",
  premium_from_label: "30",
  hero_headline: "Powerful AI Prompts. Better Results.",
  hero_subtext: "Discover ready-to-use AI prompts for images, videos, storytelling and creative projects.",
};
export async function getSetting(key:string){
  try{ const s=await prisma.setting.findUnique({where:{key}}); return s?.value ?? DEFAULTS[key] ?? ""; }catch{ return DEFAULTS[key] ?? ""; }
}
export async function getSettings(keys:string[]){
  const out:Record<string,string>={}; for(const k of keys) out[k]=await getSetting(k); return out;
}
export async function getVipPrice(){ const v=parseFloat(await getSetting("vip_price")); return isNaN(v)?999:v; }
