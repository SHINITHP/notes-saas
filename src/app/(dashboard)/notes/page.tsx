import { redirect } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { NoteCard } from "@/components/notes/NoteCard";
import { PageWrapper } from "@/components/page-wrapper";
import { NoteData } from "@/lib/types";

export default async function NotesPage() {
  try {
    const { tenantId } = await verifyAuth();
    const rawNotes = await db.note.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    });

    // Format dates on the server
    const notes: NoteData[] = rawNotes.map((note) => ({
      ...note,
      updatedAtFormatted: new Date(note.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }), // e.g., "Sep 15, 2025"
    }));

    return (
      <PageWrapper>
        <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
          <NoteCard initialNotes={notes} />
        </Suspense>
      </PageWrapper>
    );
  } catch {
    redirect("/login");
  }
}

