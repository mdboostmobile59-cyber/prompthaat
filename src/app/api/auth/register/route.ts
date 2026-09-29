import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "সবগুলো ফিল্ড পূরণ করুন" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "USER",
      },
    });

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email } });
    response.cookies.set("prompthaat_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "অ্যাকাউন্ট তৈরি করতে সমস্যা হচ্ছে" }, { status: 500 });
  }
}
