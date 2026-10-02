import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const _u:any=await getCurrentUser(); if(!_u || _u.role!=="ADMIN") return NextResponse.json({error:"Unauthorized"},{status:401});
    const prompts = await prisma.prompt.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: { name: true },
        },
      },
    });
    return NextResponse.json({ prompts });
  } catch (error) {
    console.error("Get Prompts Error:", error);
    return NextResponse.json({ error: "Failed to fetch prompts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user: any = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      promptContent,
      imageUrl,
      categoryId,
      aiModel,
      promptType,
      isPremium,
      price,
      isFeatured,
      status,
    } = await req.json();

    if (!title || !promptContent || !imageUrl || !categoryId) {
      return NextResponse.json({ error: "প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন" }, { status: 400 });
    }

    // স্লাগ তৈরি
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // প্রম্পটের মূল্য নির্ধারণ (ফ্রি হলে ০, প্রিমিয়াম হলে কাস্টম প্রাইজ)
    const finalPrice = isPremium ? parseFloat(price) || 30 : 0;

    const prompt = await prisma.prompt.create({
      data: {
        title,
        slug,
        description,
        promptContent,
        imageUrl,
        categoryId,
        aiModel: aiModel || "Universal",
        promptType: promptType || "Image",
        isPremium: Boolean(isPremium),
        price: finalPrice,
        isFeatured: Boolean(isFeatured),
        status: status || "PUBLISHED",
      },
    });

    return NextResponse.json({ success: true, prompt });
  } catch (error) {
    console.error("Create Prompt Error:", error);
    return NextResponse.json({ error: "প্রম্পট সেভ করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
