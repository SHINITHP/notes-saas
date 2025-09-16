import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";
import { z } from "zod";
import sgMail from "@sendgrid/mail";
import { randomBytes } from "crypto";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

const inviteSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(["ADMIN", "MEMBER"]),
});

export async function POST(req: NextRequest) {
  try {
    console.log("Invite API called");
    const { tenantId, role, tenantSlug } = await verifyAuth(req);
    if (role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only Admins can invite users" },
        { status: 403 }
      );
    }

    const data = inviteSchema.parse(await req.json());

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create invitation
    const invitation = await db.invitation.create({
      data: {
        email: data.email,
        role: data.role,
        token,
        tenantId,
        expiresAt,
      },
    });

    // Verify Resend API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service configuration error" },
        { status: 500 }
      );
    }

    // Send invite email
    const inviteLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/invitations/accept?token=${token}`;
    const emailResponse = await sgMail.send({
      from: "Notes App <shinithshini6@gmail.com>", // Your verified sender email
      to: data.email, // Any valid email address
      subject: "You're Invited to Join Notes App",
      html: `
        <p>You've been invited to join the ${tenantSlug} tenant as a ${
        data.role
      }.</p>
        <p><a href="${inviteLink}">Click here to accept the invitation</a> and set your password.</p>
        <p>This link expires on ${expiresAt.toLocaleDateString()}.</p>
      `,
    });

    console.log("Email response:", emailResponse);

    return NextResponse.json(
      { message: "Invitation sent", invitation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in invite route:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
