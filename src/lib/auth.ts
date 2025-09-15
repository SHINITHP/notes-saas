// lib/auth.ts
import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");

export async function verifyAuth(request?: NextRequest) {
  let token: string | undefined;

  if (request) {
    // For API routes
    token = request.cookies.get("auth-token")?.value;
  } else {
    // For server components
    const cookieStore = await cookies(); // Await the Promise
    token = cookieStore.get("auth-token")?.value;
  }

  if (!token) {
    throw new Error("Unauthorized: No auth token provided");
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; tenantId: string; role: "ADMIN" | "MEMBER" };
  } catch {
    throw new Error("Unauthorized: Invalid or expired token");
  }
}   