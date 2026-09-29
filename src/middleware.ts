import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "prompthaat-default-jwt-secret-key-bangladesh"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("prompthaat_session")?.value;

  let session: any = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      session = payload;
    } catch {
      session = null;
    }
  }

  // ড্যাশবোর্ড প্রটেকশন (লগইন না থাকলে লগইন পেজে পাঠাবে)
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // অ্যাডমিন প্যানেল প্রটেকশন (ADMIN না হলে ড্যাশবোর্ডে পাঠাবে)
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=admin_only", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
