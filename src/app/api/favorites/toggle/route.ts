import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export async function POST(req:Request){
  const user:any=await getCurrentUser(); if(!user) return NextResponse.json({error:"Login required"},{status:401});
  const {promptId}=await req.json(); if(!promptId) return NextResponse.json({error:"promptId required"},{status:400});
  try{
    const existing=await prisma.favorite.findUnique({where:{userId_promptId:{userId:user.userId,promptId}}});
    if(existing){ await prisma.favorite.delete({where:{id:existing.id}}); return NextResponse.json({isFavorite:false}); }
    await prisma.favorite.create({data:{userId:user.userId,promptId}}); return NextResponse.json({isFavorite:true});
  }catch(e){ // prompt may be a sample fallback id that is not in DB yet
    return NextResponse.json({error:"Prompt not in database yet"},{status:400});
  }
}
