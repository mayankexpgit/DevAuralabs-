'use client';
import { notFound, useParams } from 'next/navigation';
import SkillDetailClient from './skill-detail-client';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function SkillDetailPage() {
  const params = useParams();
  const { id } = params;
  const firestore = useFirestore();
  
  const skillRef = useMemoFirebase(() => doc(firestore, 'skills', id as string), [firestore, id]);
  const { data: skill, isLoading } = useDoc(skillRef);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!skill) {
    notFound();
  }

  return <SkillDetailClient skill={skill} />;
}
