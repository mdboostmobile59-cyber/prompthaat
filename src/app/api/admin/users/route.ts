import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export async function GET(req:Request){ const u:any=await getCurrentUser(); if(!u||u.role!=="ADMIN") return NextResponse.json({error:"Unauthorized"},{status:401});
  const q=new URL(req.url).searchParams.get("q")||"";
  const users=await prisma.user.findMany({where:q?{OR:[{name:{contains:q,mode:"insensitive"}},{email:{contains:q,mode:"insensitive"}}]}:{},include:{purchases:true,vipSubscription:true},orderBy:{createdAt:"desc"}});
  return NextResponse.json({users:users.map((x:any)=>({id:x.id,name:x.name,email:x.email,role:x.role,createdAt:x.createdAt,isVip:!!x.vipSubscription && x.vipSubscription.status==="ACTIVE",isPremiumUser:x.purchases.length>0,purchasedCount:x.purchases.length,totalSpent:x.purchases.reduce((a:number,b:any)=>a+Number(b.amount||0),0)}))});
}
