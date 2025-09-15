import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'JWT_SECRET');


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
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Generate JWT
    const token = await new SignJWT({ userId: user.id, tenantId: user.tenantId, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h") 
      .sign(JWT_SECRET);

    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set("auth-token", token, {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Mitigates CSRF
      path: "/", // Cookie available across app
      maxAge: 60 * 60, // 1 hour (matches JWT expiration)
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
