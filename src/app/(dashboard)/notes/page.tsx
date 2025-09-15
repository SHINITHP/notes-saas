import { redirect } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { NoteCard } from "@/components/notes/NoteCard";
import { PageWrapper } from "@/components/page-wrapper";
import { NoteData, TenantData, UserData } from "@/lib/types";
import { PlanLimitBanner } from "@/components/subscription/PlanLimitBanner";

export default async function NotesPage() {
  try {
    const { tenantId, role, tenantSlug } = await verifyAuth();

    const rawNotes = await db.note.findMany({
      where: { tenantId },
      orderBy: { updatedAt: "desc" },
    });

    const tenant = await db.tenant.findUnique({
      where: { id: tenantId },
    });
    if (!tenant) throw new Error("Tenant not found");

    const notes: NoteData[] = rawNotes.map((note) => ({
      ...note,
      updatedAtFormatted: new Date(note.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

    const tenantData: TenantData = {
      id: tenant.id,
      slug: tenant.slug,
      isPro: tenant.isPro,
    };

    const userData: UserData = {
      id: "",
      tenantId,
      role,
    };

    return (
      <PageWrapper>
        <div className="w-full flex flex-col">
          <Suspense
            fallback={
              <div className="text-center text-muted-foreground">
                Loading...
              </div>
            }
          >
            <PlanLimitBanner tenant={tenantData} user={userData} />
            <NoteCard initialNotes={notes} />
          </Suspense>
        </div>
      </PageWrapper>
    );
  } catch {
    redirect("/login");
  }
}
