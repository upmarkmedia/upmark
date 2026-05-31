import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { CAPABILITIES_DATA } from '@/components/interactive-diagram/services-data';

const iconMap: Record<string, string> = {
  'content-engine': 'PlaySquare',
  'marketing-strategy': 'Target',
  'production-post': 'Film',
  'packaging-design': 'Package',
  'performance-marketing': 'Zap',
  'social-media': 'Share2',
  'seo-lead-gen': 'Search',
};

export async function GET() {
  try {
    const adminDb = getAdminDb();
    let order = 0;
    const batch = adminDb.batch();

    for (const service of CAPABILITIES_DATA) {
      const docRef = adminDb.collection('services').doc(service.id);
      
      batch.set(docRef, {
        title: service.title,
        description: service.description,
        icon_name: iconMap[service.id] || 'Check',
        label: service.label,
        subtitle: service.subtitle,
        order: order++,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await batch.commit();

    return NextResponse.json({ success: true, message: `Migrated ${CAPABILITIES_DATA.length} services using admin SDK.` });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
