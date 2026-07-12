import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

const SEED_TESTIMONIALS = [
  {
    quote: "Upmark didn't just run our ads — they rebuilt our entire marketing system from the ground up. Within six months, our qualified leads tripled and our cost per acquisition dropped by 40%. They think like a partner, not a vendor.",
    name: "Arjun Mehta",
    role: "Head of Growth, Luxe Stays",
    featured: true,
    order: 1,
  },
  {
    quote: "We tried four agencies before Upmark. The difference? They actually understand how content, performance and brand work together. Our eCommerce revenue is up 340% and for the first time, we can trace every rupee back to a specific channel.",
    name: "Priya Sharma",
    role: "Founder, Bloom Retail",
    featured: true,
    order: 2,
  },
  {
    quote: "The production quality is outstanding, but what really sets Upmark apart is their speed. They went from strategy to a full campaign launch in two weeks — something our previous agency took two months to deliver.",
    name: "Rohan Kapoor",
    role: "CMO, Vertex Corp",
    featured: true,
    order: 3,
  },
  {
    quote: "We needed a team that could handle everything — brand, content, social, performance — without us managing five different agencies. Upmark became that single integrated team, and our reservation bookings are up 290% as a result.",
    name: "Neha Desai",
    role: "Director of Marketing, The Grove Kitchen",
    featured: false,
    order: 4,
  },
];

export async function POST() {
  try {
    const db = getAdminDb();
    const batch = db.batch();
    const now = new Date();

    for (const t of SEED_TESTIMONIALS) {
      const ref = db.collection("testimonials").doc();
      batch.set(ref, {
        ...t,
        createdAt: now,
        updatedAt: now,
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, count: SEED_TESTIMONIALS.length });
  } catch (error) {
    console.error("Failed to seed testimonials:", error);
    return NextResponse.json({ error: "Failed to seed testimonials" }, { status: 500 });
  }
}
