import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signToken } from "@/lib/jwt";
export async function POST(req: NextRequest) {
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
  if (!user)
    return NextResponse.json({ error: "Invalid user" }, { status: 401 });

  if (!bcrypt.compare(password, user.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = signToken({
    userId: user.id,
    tenantId: user.tenantId,
    role: user.role,
  });

  return NextResponse.json({ token });
}
