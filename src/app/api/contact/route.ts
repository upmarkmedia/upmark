import { getAdminDb } from "@/lib/firebase-admin";
import { resend, FROM_EMAIL, NOTIFICATION_EMAIL } from "@/lib/resend";
import {
  internalNotificationTemplate,
  autoResponderTemplate,
} from "@/lib/email-templates";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  try {
    // ─── 0. Validate Environment ──────────────────────────────────
    const missingVars: string[] = [];
    if (!process.env.RESEND_API_KEY) missingVars.push("RESEND_API_KEY");
    if (!process.env.FIREBASE_PROJECT_ID) missingVars.push("FIREBASE_PROJECT_ID");
    if (!process.env.FIREBASE_CLIENT_EMAIL) missingVars.push("FIREBASE_CLIENT_EMAIL");
    if (!process.env.FIREBASE_PRIVATE_KEY) missingVars.push("FIREBASE_PRIVATE_KEY");

    if (missingVars.length > 0) {
      console.error(
        `[Contact API] Missing environment variables: ${missingVars.join(", ")}`
      );
      return Response.json(
        {
          error: "Server configuration error. Please contact the administrator.",
          _debug: process.env.NODE_ENV === "development" ? missingVars : undefined,
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    // ─── 1. Parse & Validate ────────────────────────────────────
    const { name, email, company, service, project } = body;

    if (!name || !email || !service || !project) {
      return Response.json(
        { error: "Missing required fields: name, email, service, project" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const leadData = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      company: String(company || "").trim(),
      service: String(service).trim(),
      projectDetails: String(project).trim(),
    };

    // ─── 2. Save to Firestore ───────────────────────────────────
    const db = getAdminDb();
    await db.collection("leads").add({
      ...leadData,
      createdAt: FieldValue.serverTimestamp(),
    });

    // ─── 3. Send Emails ─────────────────────────────────────────
    const emailErrors: string[] = [];

    // Internal notification
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: NOTIFICATION_EMAIL,
        subject: `🚀 New Lead: ${leadData.name} — ${leadData.service}`,
        html: internalNotificationTemplate(leadData),
      });
      console.log("[Contact API] Internal notification sent:", JSON.stringify(result));
    } catch (emailErr) {
      const msg =
        emailErr instanceof Error ? emailErr.message : String(emailErr);
      console.error("[Contact API] Failed to send internal notification:", msg);
      emailErrors.push(`notification: ${msg}`);
    }

    // Auto-responder to user
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: leadData.email,
        subject: "We've received your brief — Upmark",
        html: autoResponderTemplate(leadData),
      });
      console.log("[Contact API] Auto-responder sent:", JSON.stringify(result));
    } catch (emailErr) {
      const msg =
        emailErr instanceof Error ? emailErr.message : String(emailErr);
      console.error("[Contact API] Failed to send auto-responder:", msg);
      emailErrors.push(`auto-responder: ${msg}`);
    }

    // ─── 4. Success Response ────────────────────────────────────
    return Response.json(
      {
        success: true,
        message: "Form submitted successfully",
        ...(emailErrors.length > 0 && {
          emailWarnings: emailErrors,
        }),
      },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Contact API] Unhandled error:", msg);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
