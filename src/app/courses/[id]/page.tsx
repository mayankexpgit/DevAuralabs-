'use client';
import { notFound, useParams } from 'next/navigation';
import CourseDetailClient from './course-detail-client';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function CourseDetailPage() {
  const params = useParams();
  const { id } = params;
  const firestore = useFirestore();
  
  const courseRef = useMemoFirebase(() => doc(firestore, 'courses', id as string), [firestore, id]);
  const { data: course, isLoading } = useDoc(courseRef);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    notFound();
  }

  return <CourseDetailClient course={course} />;
}
