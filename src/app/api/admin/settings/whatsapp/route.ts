import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user: any = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const setting = await prisma.setting.findUnique({
      where: { key: "whatsapp_community_url" },
    });

    return NextResponse.json({
      whatsappUrl: setting?.value || "",
    });
  } catch (error) {
    console.error("Admin Get WhatsApp Error:", error);
    return NextResponse.json({ error: "Failed to load setting" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user: any = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { whatsappUrl } = await req.json();

    if (!whatsappUrl || !whatsappUrl.startsWith("http")) {
      return NextResponse.json(
        { error: "সঠিক ও সম্পূর্ণ লিংক দিন (যেমন: https://chat.whatsapp.com/...)" },
        { status: 400 }
      );
    }

    // ডাটাবেজের Setting টেবিলে সেভ বা আপডেট করা
    const updated = await prisma.setting.upsert({
      where: { key: "whatsapp_community_url" },
      update: { value: whatsappUrl },
      create: {
        key: "whatsapp_community_url",
        value: whatsappUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "হোয়াটসঅ্যাপ কমিউনিটি লিংক সফলভাবে আপডেট করা হয়েছে!",
      value: updated.value,
    });
  } catch (error) {
    console.error("Admin Save WhatsApp Error:", error);
    return NextResponse.json({ error: "লিংক সেভ করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
