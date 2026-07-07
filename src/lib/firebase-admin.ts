import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import type { SiteSettings } from "@/types";

// Server-side Firebase Admin SDK — used in API routes and server components.
// This uses service account credentials (not exposed to the browser).
// Initialization is lazy to avoid build-time errors with placeholder env vars.

let _app: App | null = null;
let _db: Firestore | null = null;

function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  _app = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  return _app;
}

export function getAdminDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getAdminApp());
  return _db;
}

export async function getAdminSiteSettings(): Promise<SiteSettings | null> {
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("settings").doc("global").get();
    if (!snapshot.exists) return null;
    return snapshot.data() as SiteSettings;
  } catch (error) {
    console.error("Error fetching site settings (admin):", error);
    return null;
  }
}
