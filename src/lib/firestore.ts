import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type { CaseStudy, WorkItem, Service, Lead, SiteSettings, Testimonial } from "@/types";

// ─── Settings ───────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const docRef = doc(db, "settings", "global");
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists) return null;
    return snapshot.data() as SiteSettings;
  } catch (error) {
    console.error("Error fetching site settings:", error);
    return null;
  }
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>
): Promise<void> {
  const docRef = doc(db, "settings", "global");
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  await setDoc(docRef, {
    ...cleanData,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ─── Case Studies ───────────────────────────────────────────

const caseStudiesRef = collection(db, "case_studies");

export async function getCaseStudies(): Promise<CaseStudy[]> {
  try {
    const q = query(caseStudiesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as CaseStudy);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return [];
  }
}

export async function getCaseStudyById(
  id: string
): Promise<CaseStudy | null> {
  const docRef = doc(db, "case_studies", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...snapshot.data() } as CaseStudy;
}

export async function createCaseStudy(
  data: Omit<CaseStudy, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(caseStudiesRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateCaseStudy(
  id: string,
  data: Partial<Omit<CaseStudy, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, "case_studies", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCaseStudy(id: string): Promise<void> {
  const docRef = doc(db, "case_studies", id);
  await deleteDoc(docRef);
}

// ─── Work Items ────────────────────────────────────────────

const workRef = collection(db, "work");

export async function getWorkItems(): Promise<WorkItem[]> {
  try {
    const q = query(workRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as WorkItem);
  } catch (error) {
    console.error("Error fetching work items:", error);
    return [];
  }
}

export async function getWorkItemById(id: string): Promise<WorkItem | null> {
  const docRef = doc(db, "work", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...snapshot.data() } as WorkItem;
}

export async function createWorkItem(
  data: Omit<WorkItem, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(workRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateWorkItem(
  id: string,
  data: Partial<Omit<WorkItem, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, "work", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWorkItem(id: string): Promise<void> {
  const docRef = doc(db, "work", id);
  await deleteDoc(docRef);
}

export async function batchUpdateWorkItems(
  updates: { id: string; data: Partial<Omit<WorkItem, "id" | "createdAt">> }[]
): Promise<void> {
  const batch = writeBatch(db);
  for (const { id, data } of updates) {
    const docRef = doc(db, "work", id);
    batch.update(docRef, { ...data, updatedAt: serverTimestamp() });
  }
  await batch.commit();
}

// ─── Services ───────────────────────────────────────────────

const servicesRef = collection(db, "services");

export async function getServices(): Promise<Service[]> {
  try {
    const q = query(servicesRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Service);
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

export async function getServiceById(id: string): Promise<Service | null> {
  const docRef = doc(db, "services", id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists) return null;
  return { id: snapshot.id, ...snapshot.data() } as Service;
}

export async function createService(
  data: Omit<Service, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(servicesRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateService(
  id: string,
  data: Partial<Omit<Service, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, "services", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteService(id: string): Promise<void> {
  const docRef = doc(db, "services", id);
  await deleteDoc(docRef);
}

// ─── Testimonials ───────────────────────────────────────────

const testimonialsRef = collection(db, "testimonials");

export async function getTestimonials(): Promise<Testimonial[]> {
  const q = query(testimonialsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Testimonial);
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const all = await getTestimonials();
    const featured = all.filter((t) => t.featured === true);
    if (featured.length > 0) {
      return featured.slice(0, 3);
    }
    // Fallback: return first 3 by order
    return all
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .slice(0, 3);
  } catch (error) {
    console.error("Error fetching featured testimonials:", error);
    return [];
  }
}

export async function createTestimonial(
  data: Omit<Testimonial, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(testimonialsRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateTestimonial(
  id: string,
  data: Partial<Omit<Testimonial, "id" | "createdAt">>
): Promise<void> {
  const docRef = doc(db, "testimonials", id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTestimonial(id: string): Promise<void> {
  const docRef = doc(db, "testimonials", id);
  await deleteDoc(docRef);
}

// ─── Leads (Read-Only) ─────────────────────────────────────

const leadsRef = collection(db, "leads");

export async function getLeads(): Promise<Lead[]> {
  const q = query(leadsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Lead);
}
