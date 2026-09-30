import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { prompts: true },
        },
      },
    });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user: any = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "ক্যাটাগরির নাম দিন" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await prisma.category.findFirst({
      where: { OR: [{ name }, { slug }] },
    });

    if (existing) {
      return NextResponse.json({ error: "এই নামের ক্যাটাগরি আগেই তৈরি আছে" }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ error: "ক্যাটাগরি তৈরি করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
