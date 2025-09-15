import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { TenantData, User } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const cookieStore = cookies();
    const { tenantId, role, tenantSlug, email } = await verifyAuth();
    const tenant = await db.tenant.findUnique({ where: { id: tenantId } });

    if (!tenant) throw new Error("Tenant not found");

    const tenantData: TenantData = {
      id: tenant.id,
      slug: tenant.slug,
      isPro: tenant.isPro,
    };

    const userData: User = {
      id: "", // Replace with actual user ID if needed
      tenantId,
      role,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar tenant={tenantData} user={userData} />
          <main className="w-full">
            <SidebarTrigger className="md:hidden mb-4" />
            {children}
          </main>
        </div>
      </SidebarProvider>
    );
  } catch {
    redirect("/login");
  }
}