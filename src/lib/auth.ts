import { jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key"
);

export async function verifyAuth(request?: NextRequest) {
  let token: string | undefined;

  if (request) {
    token = request.cookies.get("auth-token")?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get("auth-token")?.value;
  }

  if (!token) {
    throw new Error("Unauthorized: No auth token provided");
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as {
      userId: string;
      tenantId: string;
      role: "ADMIN" | "MEMBER";
      tenantSlug: string;
      email: string;
    };
  } catch {
    throw new Error("Unauthorized: Invalid or expired token");
  }
}
