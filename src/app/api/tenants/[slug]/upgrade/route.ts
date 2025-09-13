import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { verifyToken } from "@/lib/jwt";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as {
      userId: string;
      tenantId: string;
      role: string;
    };

    if (decoded.role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tenant = await db.tenant.findUnique({ where: { slug: params.slug } });

    if (!tenant || tenant.id !== decoded.tenantId)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    await db.tenant.update({
      where: { id: tenant.id },
      data: { isPro: true },
    });

    return NextResponse.json({ message: "Upgraded to Pro" });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
