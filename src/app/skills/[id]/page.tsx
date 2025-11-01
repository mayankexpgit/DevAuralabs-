
import { notFound } from 'next/navigation';
import SkillDetailClient from './skill-detail-client';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';


async function getSkill(id: string) {
    const { firestore } = initializeFirebase();
    const skillRef = doc(firestore, 'skills', id);
    const skillSnap = await getDoc(skillRef);

    if (!skillSnap.exists()) {
        return null;
    }

    return { ...skillSnap.data(), id: skillSnap.id };
}

export default async function SkillDetailPage({ params }: { params: { id: string } }) {
  const skill = await getSkill(params.id);

  if (!skill) {
    notFound();
  }

  // @ts-ignore
  return <SkillDetailClient skill={skill} />;
}
