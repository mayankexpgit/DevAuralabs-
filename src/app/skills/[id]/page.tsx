import { skills } from '@/lib/data';
import { notFound } from 'next/navigation';
import SkillDetailClient from './skill-detail-client';

export default function SkillDetailPage({ params }: { params: { id: string } }) {
  const skill = skills.find((s) => s.id === params.id);

  if (!skill) {
    notFound();
  }

  return <SkillDetailClient skill={skill} />;
}
