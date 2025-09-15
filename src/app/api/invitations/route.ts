import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const acceptSchema = z.object({
  token: z.string().min(1, "Token required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const data = acceptSchema.parse(await req.json());

    // Find invitation
    const invitation = await db.invitation.findUnique({
      where: { token: data.token },
    });

    if (!invitation || invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        email: invitation.email,
        password: hashedPassword,
        role: invitation.role,
        tenantId: invitation.tenantId,
      },
    });

    // Delete invitation
    await db.invitation.delete({ where: { id: invitation.id } });

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}