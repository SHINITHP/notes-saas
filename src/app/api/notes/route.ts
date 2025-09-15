import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { z } from "zod";

const noteSchema = z.object({
  title: z.string().min(1, "Title required").max(100),
  content: z.string().min(1, "Content required").max(5000),
});

export async function GET(req: NextRequest) {
  try {
    const { tenantId } = await verifyAuth(req);
    const notes = await db.note.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(notes);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tenantId, role } = await verifyAuth(req);
    if (role !== "ADMIN" && role !== "MEMBER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tenant = await db.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant?.isPro) {
      const noteCount = await db.note.count({ where: { tenantId } });
      if (noteCount >= 3) {
        return NextResponse.json({ error: "Free plan limit reached" }, { status: 403 });
      }
    }

    const data = noteSchema.parse(await req.json());
    const note = await db.note.create({
      data: { ...data, tenantId, updatedAt: new Date() },
    });
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}