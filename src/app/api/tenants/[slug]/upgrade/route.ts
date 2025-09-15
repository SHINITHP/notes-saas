import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { tenantId, role, tenantSlug } = await verifyAuth(req);
    const { slug } = await context.params
    if (role !== "ADMIN")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    if (tenantSlug !== slug) {
      return NextResponse.json(
        { error: "Invalid tenant slug" },
        { status: 400 }
      );
    }

    // Update tenant to Pro
    await db.tenant.update({
      where: { slug: slug, id: tenantId },
      data: { isPro: true },
    });

    return NextResponse.json({ message: "Subscription upgraded" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
