import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";
export async function GET(){
  const s=await getSettings(["whatsapp_community_url","whatsapp_community_name","vip_price","vip_enabled","website_name"]);
  return NextResponse.json({whatsappUrl:s.whatsapp_community_url,whatsappName:s.whatsapp_community_name,vipPrice:Number(s.vip_price||999),vipEnabled:s.vip_enabled!=="false",websiteName:s.website_name});
}
