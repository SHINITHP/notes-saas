import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET!;

// list notes
export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { tenantId: string };
    const notes = await db.note.findMany({
      where: { tenantId: decoded.tenantId },
    });

    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

// create note
export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      tenantId: string;
      role: "ADMIN" | "MEMBER";
    };
    if (decoded.role !== "ADMIN" && decoded.role !== "MEMBER")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tenant = await db.tenant.findUnique({
      where: { id: decoded.tenantId },
    });

    if(!tenant) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });

    if(!tenant.isPro){
        const noteCount = await db.note.count({
            where: {
                tenantId: decoded.tenantId
            }
        })
    }

    const { title, content } = await req.json();
    const note = await db.note.create({
        data: {
            title, content,tenantId: decoded.tenantId
        }
    })

    return NextResponse.json(note, { status: 201 } );

  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
