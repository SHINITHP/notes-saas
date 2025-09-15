import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { User } from "@/lib/types";
import MembersPage from "@/components/MembersPage";
import { PageWrapper } from "@/components/page-wrapper";

export default async function Members() {
  try {
    const { tenantId, role, email } = await verifyAuth();
    const rawUsers = await db.user.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });

    const users: User[] = rawUsers.map((user) => ({
      id: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdAtFormatted: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));

    return (
      <PageWrapper>
      <div className="container mx-auto p-4">
        <MembersPage initialUsers={users} />
      </div>
      </PageWrapper>
    );
  } catch {
    redirect("/login");
  }
}