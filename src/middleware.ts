import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export const config = {
  matcher: ["/notes", "/api/notes/:path*", "/api/users/invite", "/api/tenants/:path*/upgrade"],
};

export async function middleware(req: NextRequest) {
  try {
    await verifyAuth(req);
    return NextResponse.next();
  } catch {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}