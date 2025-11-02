
import { notFound } from 'next/navigation';
import HardwareDetailClient from './hardware-detail-client';
import { initializeFirebase } from '@/firebase/server';
import { doc, getDoc } from 'firebase/firestore';

async function getHardware(id: string) {
    const { firestore } = initializeFirebase();
    const hardwareRef = doc(firestore, 'hardware', id);
    const hardwareSnap = await getDoc(hardwareRef);

    if (!hardwareSnap.exists()) {
        return null;
    }
    
    const hardwareData = hardwareSnap.data();
    return { ...hardwareData, id: hardwareSnap.id };
}

export default async function HardwareDetailPage({ params }: { params: { id: string } }) {
  const hardware = await getHardware(params.id);

  if (!hardware) {
    notFound();
  }

  // @ts-ignore
  return <HardwareDetailClient hardware={hardware} />;
}
