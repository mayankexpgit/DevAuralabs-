
import EditSkillPageForm from '@/components/edit-skill-page-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase/server';
import { doc, getDoc } from 'firebase/firestore';
import { notFound } from 'next/navigation';

async function getSkill(id: string) {
    const { firestore } = initializeFirebase();
    const skillRef = doc(firestore, 'skills', id);
    const skillSnap = await getDoc(skillRef);

    if (!skillSnap.exists()) {
        return null;
    }

    return { ...skillSnap.data(), id: skillSnap.id };
}

export default async function EditSkillPage({ params }: { params: { id: string } }) {
  const skill = await getSkill(params.id);

  if (!skill) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Edit Skill Program</CardTitle>
                    <CardDescription>Update the details for "{skill.title}".</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* @ts-ignore */}
                    <EditSkillPageForm skill={skill} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
