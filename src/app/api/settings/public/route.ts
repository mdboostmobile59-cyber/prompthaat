import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "whatsapp_community_url" },
    });

    const fallbackUrl =
      process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL ||
      "https://chat.whatsapp.com/your-community-invite-link";

    return NextResponse.json({
      whatsappUrl: setting?.value || fallbackUrl,
    });
  } catch (error) {
    console.error("Public Settings API Error:", error);
    return NextResponse.json({
      whatsappUrl: "https://chat.whatsapp.com/your-community-invite-link",
    });
  }
}
