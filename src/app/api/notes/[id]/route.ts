import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { z } from "zod";

const noteSchema = z.object({
  title: z.string().min(1, "Title required").max(100),
  content: z.string().min(1, "Content required").max(5000),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { tenantId, role } = await verifyAuth(req);

    if (role !== "ADMIN" && role !== "MEMBER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = noteSchema.parse(await req.json());

    const note = await db.note.update({
      where: {
        id: params.id,
        tenantId,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { tenantId, role } = await verifyAuth(req);
    if (role !== "ADMIN" && role !== "MEMBER") {
      return NextResponse.json({ error: "UnAuthorized User" }, { status: 403 });
    }

    await db.note.delete({ where: { id: params.id, tenantId } });
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
