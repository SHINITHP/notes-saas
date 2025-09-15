// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// const JWT_SECRET = process.env.JWT_SECRET!;

// export function middleware(req: NextRequest) {
//   if (req.nextUrl.pathname.startsWith("/api")) {
//     console.log("Middleware hit for API route:", req.nextUrl.pathname);
//     // Skip health check
//     if (
//       req.nextUrl.pathname === "/api/health" ||
//       req.nextUrl.pathname === "/api/auth/login" ||
//       req.nextUrl.pathname === "/api/auth/register"
//     ) {
//       return NextResponse.next();
//     }

//     const token = req.headers.get("authorization")?.split(" ")[1];
//     console.log("Extracted token:", token);
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     try {
//       const decoded = jwt.verify(token, JWT_SECRET) as {
//         userId: string;
//         tenantId: string;
//         role: "ADMIN" | "MEMBER";
//       };
//       const res = NextResponse.next();
//       res.headers.set("x-user-id", decoded.userId);
//       res.headers.set("x-tenant-id", decoded.tenantId);
//       res.headers.set("x-role", decoded.role);
//       console.log('efrfe')
//       return res;
//     } catch (e) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
//   }
//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/api/:path*",
// };

// middleware.ts (partial, as provided earlier)
// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
// const secret = new TextEncoder().encode(JWT_SECRET);

// export const config = {
//   matcher: ["/dashboard/:path*", "/api/notes/:path*"],
// };

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("auth-token")?.value;
//   console.log("Middleware hit for:", request.nextUrl.pathname, token);
//   if (!token) {
//     if (request.nextUrl.pathname.startsWith("/api")) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   try {
//     const { payload } = await jwtVerify(token, secret);
//     const response = NextResponse.next();

//     //set payload data in headers
//     response.headers.set('x-user-data', JSON.stringify(payload));

//     return response;
//   } catch (error) {
//     console.error("JWT verification failed:", error);
//     if (request.nextUrl.pathname.startsWith("/api")) {
//       return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
// }


// src/lib/api/notes.ts// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export const config = {
  matcher: ["/notes", "/api/notes/:path*"],
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