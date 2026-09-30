import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { allPromptsData } from "@/lib/sample-data";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tier = searchParams.get("tier"); // all, free, premium
    const search = searchParams.get("search") || "";

    // ডাটাবেজ থেকে পাবলিশ হওয়া প্রম্পট খোঁজা
    let whereClause: any = {
      status: "PUBLISHED",
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { aiModel: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tier === "Free") {
      whereClause.isPremium = false;
    } else if (tier === "Premium") {
      whereClause.isPremium = true;
    }

    if (category && category !== "All Categories") {
      whereClause.category = {
        name: category,
      };
    }

    const dbPrompts = await prisma.prompt.findMany({
      where: whereClause,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    // ডাটাবেজে প্রম্পট থাকলে তা পাঠাবে, আর একদম ফাঁকা থাকলে ডামি ডেটা পাঠাবে
    if (dbPrompts.length > 0) {
      const formatted = dbPrompts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category?.name || "General",
        description: p.description,
        imageUrl: p.imageUrl,
        isPremium: p.isPremium,
        price: Number(p.price || 0),
        aiModel: p.aiModel,
      }));
      return NextResponse.json({ prompts: formatted });
    }

    // ফলব্যাক
    return NextResponse.json({ prompts: allPromptsData });
  } catch (error) {
    console.error("Public Prompts API Error:", error);
    return NextResponse.json({ prompts: allPromptsData });
  }
        }
