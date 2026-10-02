import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// One-time bootstrap: creates tables if missing (Prisma schema equivalent DDL),
// seeds default categories + settings. Safe to call repeatedly (IF NOT EXISTS / upsert).
// POST {email} promotes that user to ADMIN only while no ADMIN exists yet.
const DDL = [
  `DO $$ BEGIN CREATE TYPE "Role" AS ENUM ('USER','ADMIN'); EXCEPTION WHEN duplicate_object THEN null; END $$`,
  `CREATE TABLE IF NOT EXISTS "User" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "role" "Role" NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY ("id"))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
  `CREATE TABLE IF NOT EXISTS "Category" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL, "description" TEXT, "iconUrl" TEXT, "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Category_pkey" PRIMARY KEY ("id"))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug")`,
  `CREATE TABLE IF NOT EXISTS "Prompt" ("id" TEXT NOT NULL, "title" TEXT NOT NULL, "slug" TEXT NOT NULL, "description" TEXT NOT NULL, "promptContent" TEXT NOT NULL, "imageUrl" TEXT NOT NULL, "aiModel" TEXT NOT NULL, "promptType" TEXT NOT NULL DEFAULT 'Image', "isPremium" BOOLEAN NOT NULL DEFAULT false, "price" DECIMAL(10,2) DEFAULT 0, "isFeatured" BOOLEAN NOT NULL DEFAULT false, "status" TEXT NOT NULL DEFAULT 'PUBLISHED', "viewCount" INTEGER NOT NULL DEFAULT 0, "copyCount" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, "categoryId" TEXT NOT NULL, CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id"))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Prompt_slug_key" ON "Prompt"("slug")`,
  `CREATE TABLE IF NOT EXISTS "Favorite" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "promptId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id"))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_promptId_key" ON "Favorite"("userId","promptId")`,
  `CREATE TABLE IF NOT EXISTS "Purchase" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "promptId" TEXT NOT NULL, "amount" DECIMAL(10,2) NOT NULL, "paymentMethod" TEXT NOT NULL, "transactionId" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'COMPLETED', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id"))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Purchase_transactionId_key" ON "Purchase"("transactionId")`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Purchase_userId_promptId_key" ON "Purchase"("userId","promptId")`,
  `CREATE TABLE IF NOT EXISTS "VipSubscription" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'ACTIVE', "amount" DECIMAL(10,2) NOT NULL, "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "expiresAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "VipSubscription_pkey" PRIMARY KEY ("id"))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "VipSubscription_userId_key" ON "VipSubscription"("userId")`,
  `CREATE TABLE IF NOT EXISTS "Setting" ("id" TEXT NOT NULL, "key" TEXT NOT NULL, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Setting_pkey" PRIMARY KEY ("id"))`,
  `CREATE UNIQUE INDEX IF NOT EXISTS "Setting_key_key" ON "Setting"("key")`,
];
const CATS = ["Animals & Pets","Art & Animation","ASMR","Comedy","DIY & Crafts","Emotional","Fantasy & Sci-Fi","Food","Kids & Family","Nature & Wildlife","Sports & Action","Marketing"];
function cuid(){ return "c"+Date.now().toString(36)+Math.random().toString(36).slice(2,12); }
async function setup(){
  for(const sql of DDL) await prisma.$executeRawUnsafe(sql);
  // FKs (ignore if already exist)
  const fks=[
    `ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    `ALTER TABLE "VipSubscription" ADD CONSTRAINT "VipSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
  ];
  for(const sql of fks){ try{ await prisma.$executeRawUnsafe(sql); }catch{} }
  for(const name of CATS){
    const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)+/g,"");
    await prisma.category.upsert({where:{slug},update:{},create:{name,slug}});
  }
  const defaults:Record<string,string>={vip_price:"999",vip_enabled:"true",vip_name:"VIP",website_name:"PromptHaat"};
  for(const [k,v] of Object.entries(defaults)) await prisma.setting.upsert({where:{key:k},update:{},create:{key:k,value:v}});
}
export async function GET(){
  try{ await setup(); const [users,admins,prompts,cats]=await Promise.all([prisma.user.count(),prisma.user.count({where:{role:"ADMIN"}}),prisma.prompt.count(),prisma.category.count()]);
    return NextResponse.json({ok:true,tables:"ready",users,admins,prompts,categories:cats,note:admins===0?"Register your account on the site, then POST {email} to /api/bootstrap once to become Admin.":"Admin exists"});
  }catch(e:any){ return NextResponse.json({ok:false,error:String(e?.message||e)},{status:500}); }
}
export async function POST(req:Request){
  try{ await setup(); const {email}=await req.json();
    const admins=await prisma.user.count({where:{role:"ADMIN"}});
    if(admins>0) return NextResponse.json({error:"Admin already exists — promotion is locked"},{status:403});
    if(!email) return NextResponse.json({error:"email required"},{status:400});
    const user=await prisma.user.update({where:{email:email.toLowerCase()},data:{role:"ADMIN"}});
    return NextResponse.json({ok:true,promoted:user.email,role:user.role});
  }catch(e:any){ return NextResponse.json({ok:false,error:String(e?.message||e)},{status:500}); }
}
