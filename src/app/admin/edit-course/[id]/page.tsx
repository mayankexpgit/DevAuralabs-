
import EditCoursePageForm from '@/components/edit-course-page-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase/server';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { notFound } from 'next/navigation';

async function getCourse(id: string) {
    const { firestore } = initializeFirebase();
    const courseRef = doc(firestore, 'courses', id);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
        return null;
    }
    
    const courseData = courseSnap.data();

    // Firestore returns Timestamps, which are not serializable for client components.
    // Convert them to JS Date objects.
    const serializableData = { ...courseData, id: courseSnap.id };
    Object.keys(serializableData).forEach(key => {
        if (serializableData[key] instanceof Timestamp) {
            serializableData[key] = serializableData[key].toDate();
        }
    });

    return serializableData;
}

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Edit Course</CardTitle>
                    <CardDescription>Update the details for "{course.title}".</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* @ts-ignore */}
                    <EditCoursePageForm course={course} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
