import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { DEFAULTS } from "@/lib/settings";
async function admin(){ const u:any=await getCurrentUser(); return u&&u.role==="ADMIN"; }
export async function GET(){ if(!await admin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const rows=await prisma.setting.findMany(); const out={...DEFAULTS}; rows.forEach(r=>out[r.key]=r.value); return NextResponse.json({settings:out});
}
export async function POST(req:Request){ if(!await admin()) return NextResponse.json({error:"Unauthorized"},{status:401});
  const body=await req.json(); const allowed=["website_name","whatsapp_community_url","whatsapp_community_name","vip_price","vip_enabled","vip_name","premium_from_label","hero_headline","hero_subtext"];
  for(const k of allowed){ if(body[k]!==undefined){ await prisma.setting.upsert({where:{key:k},update:{value:String(body[k])},create:{key:k,value:String(body[k])}}); } }
  return NextResponse.json({success:true});
}
