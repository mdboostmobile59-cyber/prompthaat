import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export async function GET(){ const u:any=await getCurrentUser(); if(!u||u.role!=="ADMIN") return NextResponse.json({error:"Unauthorized"},{status:401});
  const orders=await prisma.purchase.findMany({include:{user:true,prompt:true},orderBy:{createdAt:"desc"}});
  const vips=await prisma.vipSubscription.findMany({include:{user:true},orderBy:{createdAt:"desc"}});
  return NextResponse.json({orders:orders.map((o:any)=>({id:o.id,user:o.user?.name,email:o.user?.email,prompt:o.prompt?.title,amount:Number(o.amount),method:o.paymentMethod,transactionId:o.transactionId,status:o.status,date:o.createdAt})), vipOrders:vips.map((v:any)=>({id:v.id,user:v.user?.name,email:v.user?.email,amount:Number(v.amount),status:v.status,date:v.createdAt}))});
}
