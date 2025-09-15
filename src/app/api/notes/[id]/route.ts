// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import jwt from "jsonwebtoken";
// import { db } from "@/lib/db";

// const JWT_SECRET = process.env.JWT_SECRET!;

// // get a specific note
// export async function GET(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = req.headers.get("Authorization")?.split(" ")[1];
//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { tenantId: string };
//     const note = await db.note.findFirst({
//       where: { id: params.id, tenantId: decoded.tenantId },
//     });
//     if (!note) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }
//     return NextResponse.json(note);
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
// }

// // update a specific note
// export async function PUT(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = req.headers.get("Authorization")?.split(" ")[1];
//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as {
//       tenantId: string;
//       role: "ADMIN" | "MEMBER";
//     };
//     if (decoded.role !== "ADMIN" && decoded.role !== "MEMBER")
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });

//     const note = await db.note.findFirst({
//       where: {
//         id: params.id,
//         tenantId: decoded.tenantId,
//       },
//     });
//     if (!note)
//       return NextResponse.json({ error: "Not found" }, { status: 404 });

//     const { title, content } = await req.json();
//     const updateNote = await db.note.update({
//       where: { id: note.id },
//       data: { title, content },
//     });
//     return NextResponse.json(updateNote);
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
// }

// // delete a specific note
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const token = req.headers.get("Authorization")?.split(" ")[1];
//   if (!token) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { tenantId: string; role: "ADMIN" | "MEMBER"; };
//     if (decoded.role !== "ADMIN" && decoded.role !== "MEMBER")
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });

//     const note = await db.note.findFirst({
//       where: { id: params.id, tenantId: decoded.tenantId },
//     });
//     if (!note)
//       return NextResponse.json({ error: "Not found" }, { status: 404 });

//     await db.note.delete({ where: { id: note.id } });
//     return NextResponse.json({ message: "Note deleted" });
//   } catch (error) {
//     return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//   }
// }


// app/api/notes/[id]/route.ts (Edit and Delete)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { z } from "zod";

const noteSchema = z.object({
  title: z.string().min(1, "Title required").max(100),
  content: z.string().min(1, "Content required").max(5000),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { tenantId, role } = await verifyAuth(req);
    if (role !== "ADMIN" && role !== "MEMBER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = noteSchema.parse(await req.json());
    const note = await db.note.update({
      where: { id: params.id, tenantId },
      data: { ...data, updatedAt: new Date() },
    });
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { tenantId, role } = await verifyAuth(req);
    if (role !== "ADMIN" && role !== "MEMBER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.note.delete({ where: { id: params.id, tenantId } });
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}