import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export const config = {
  matcher: [
    "/notes",
    "/members",
    "/api/notes/:path*",
    "/api/users/invite",
    "/api/tenants/:path*/upgrade",
    "/api/invitations/accept",
  ],
};

export async function middleware(req: NextRequest) {
  try {
    const { role } = await verifyAuth(req);
    if (req.nextUrl.pathname.startsWith("/members") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/not-found", req.url));
    }

    return NextResponse.next();
  } catch {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
