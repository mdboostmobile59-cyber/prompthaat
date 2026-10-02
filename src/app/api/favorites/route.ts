import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export async function GET(){ const user:any=await getCurrentUser(); if(!user) return NextResponse.json({error:"Login required"},{status:401});
  const favs=await prisma.favorite.findMany({where:{userId:user.userId},include:{prompt:{include:{category:true}}},orderBy:{createdAt:"desc"}});
  return NextResponse.json({favorites:favs.map((f:any)=>({id:f.prompt.id,slug:f.prompt.slug,title:f.prompt.title,category:f.prompt.category?.name||"General",description:f.prompt.description,imageUrl:f.prompt.imageUrl,isPremium:f.prompt.isPremium,price:Number(f.prompt.price||0),aiModel:f.prompt.aiModel,promptType:f.prompt.promptType}))});
}
