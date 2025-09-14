import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    console.log("Middleware hit for API route:", req.nextUrl.pathname);
    // Skip health check
    if (
      req.nextUrl.pathname === "/api/health" ||
      req.nextUrl.pathname === "/api/auth/login" ||
      req.nextUrl.pathname === "/api/auth/register"
    ) {
      return NextResponse.next();
    }

    const token = req.headers.get("authorization")?.split(" ")[1];
    console.log("Extracted token:", token);
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: number;
        tenantId: number;
        role: string;
      };
      // Attach to request for use in routes if needed (but we already verify in routes for simplicity)
      return NextResponse.next();
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
