import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ১. নির্দিষ্ট প্রম্পটের তথ্য লোড করা
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user: any = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!prompt) {
      return NextResponse.json({ error: "প্রম্পট খুঁজে পাওয়া যায়নি" }, { status: 404 });
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Get Single Prompt Error:", error);
    return NextResponse.json({ error: "Failed to fetch prompt" }, { status: 500 });
  }
}

// ২. প্রম্পট এডিট বা আপডেট করা
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user: any = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const finalPrice = isPremium ? parseFloat(price) || 0 : 0;

    const updatedPrompt = await prisma.prompt.update({
      where: { id },
      data: {
        title,
        description,
        promptContent,
        imageUrl,
        categoryId,
        aiModel,
        promptType,
        isPremium: Boolean(isPremium),
        price: finalPrice,
        isFeatured: Boolean(isFeatured),
        status,
      },
    });

    return NextResponse.json({ success: true, prompt: updatedPrompt });
  } catch (error) {
    console.error("Update Prompt Error:", error);
    return NextResponse.json({ error: "প্রম্পট আপডেট করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}

// ৩. প্রম্পট ডিলিট করা
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user: any = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.prompt.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Prompt deleted successfully" });
  } catch (error) {
    console.error("Delete Prompt Error:", error);
    return NextResponse.json({ error: "Failed to delete prompt" }, { status: 500 });
  }
}
