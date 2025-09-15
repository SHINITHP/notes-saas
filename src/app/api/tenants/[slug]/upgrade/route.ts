import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    console.log("Upgrade request for tenant slug:", params.slug);
    const { tenantId, role, tenantSlug } = await verifyAuth(req);

    if (role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (tenantSlug !== params.slug) {
      return NextResponse.json(
        { error: "Invalid tenant slug" },
        { status: 400 }
      );
    }

    // Update tenant to Pro
    const tenant = await db.tenant.update({
      where: { slug: params.slug, id: tenantId },
      data: { isPro: true },
    });

    return NextResponse.json({ message: "Subscription upgraded" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
