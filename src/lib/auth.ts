import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "prompthaat-default-jwt-secret-key-bangladesh"
);

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: {
  userId: string;
  email: string;
  name: string;
  role: string;
}): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}

// সেভার কম্পোনেন্ট থেকে কুকি রিড করার নিরাপদ ফাংশন
export async function getCurrentUser() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get("prompthaat_session")?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}
