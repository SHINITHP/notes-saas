import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret"); // Ensure secret is set

export async function POST(req: NextRequest) {
  console.log("Login route hit");
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email },
      include: { tenant: true }, 
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    if (!user.tenant) {
      return NextResponse.json({ error: "Tenant not found for user" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    // generate token
    const token = await new SignJWT({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      tenantSlug: user.tenant.slug,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict", 
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}