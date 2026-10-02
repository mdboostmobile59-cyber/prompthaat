import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getVipPrice, getSetting } from "@/lib/settings";
// SIMULATED PAYMENT ADAPTER (development): creates a COMPLETED purchase after basic validation.
// Production: replace with real bKash/Nagad/Card server-side verification before granting access.
export async function POST(req:Request){
  const user:any=await getCurrentUser(); if(!user) return NextResponse.json({error:"Login required"},{status:401});
  const {promptId, method, accountNo, kind}=await req.json();
  if(!method) return NextResponse.json({error:"Payment method required"},{status:400});
  const txn=`SIM-${Date.now()}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;
  try{
    if(kind==="vip" || promptId==="VIP"){
      if(await getSetting("vip_enabled")==="false") return NextResponse.json({error:"VIP is disabled"},{status:400});
      const price=await getVipPrice();
      const existing=await prisma.vipSubscription.findUnique({where:{userId:user.userId}});
      if(existing && existing.status==="ACTIVE" && (!existing.expiresAt || existing.expiresAt>new Date())) return NextResponse.json({success:true,alreadyVip:true});
      await prisma.vipSubscription.upsert({where:{userId:user.userId},update:{status:"ACTIVE",amount:price,startsAt:new Date()},create:{userId:user.userId,status:"ACTIVE",amount:price}});
      // record as a payment-like purchase row is not possible (needs promptId) -> keep VIP revenue in VipSubscription.amount; admin reads it there.
      return NextResponse.json({success:true,vip:true,transactionId:txn,amount:price});
    }
    const prompt=await prisma.prompt.findUnique({where:{id:promptId}});
    if(!prompt) return NextResponse.json({error:"Prompt not found in database. Add it from Admin Panel first."},{status:404});
    if(!prompt.isPremium) return NextResponse.json({error:"This prompt is free — login only"},{status:400});
    const existing=await prisma.purchase.findUnique({where:{userId_promptId:{userId:user.userId,promptId:prompt.id}}});
    if(existing) return NextResponse.json({success:true,alreadyUnlocked:true});
    const amount=Number(prompt.price||0);
    await prisma.purchase.create({data:{userId:user.userId,promptId:prompt.id,amount,paymentMethod:method,transactionId:txn,status:"COMPLETED"}});
    return NextResponse.json({success:true,transactionId:txn,amount});
  }catch(e){ console.error(e); return NextResponse.json({error:"Payment failed"},{status:500}); }
}
