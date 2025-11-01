
import { notFound } from 'next/navigation';
import CourseDetailClient from './course-detail-client';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

async function getCourse(id: string) {
    // We need to initialize firebase on the server for this to work
    const { firestore } = initializeFirebase();
    const courseRef = doc(firestore, 'courses', id);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
        return null;
    }
    
    return { ...courseSnap.data(), id: courseSnap.id };
}


export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id);

  if (!course) {
    notFound();
  }

  // @ts-ignore
  return <CourseDetailClient course={course} />;
}
