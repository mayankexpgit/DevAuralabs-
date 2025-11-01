
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';

export default function MyLearningPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const enrollmentsQuery = useMemoFirebase(() => 
    user && firestore ? collection(firestore, 'users', user.uid, 'enrollments') : null,
    [firestore, user]
  );
  const { data: enrollments } = useCollection(enrollmentsQuery);

  const courseIds = useMemo(() => 
    enrollments?.filter(e => e.type === 'course').map(e => e.courseId) || [],
    [enrollments]
  );

  const skillIds = useMemo(() => 
    enrollments?.filter(e => e.type === 'skill').map(e => e.skillId) || [],
    [enrollments]
  );
  
  const coursesQuery = useMemoFirebase(() => 
    firestore && courseIds.length > 0 ? query(collection(firestore, 'courses'), where('__name__', 'in', courseIds)) : null,
    [firestore, courseIds]
  );
  const { data: purchasedCourses } = useCollection(coursesQuery);
  
  const skillsQuery = useMemoFirebase(() =>
    firestore && skillIds.length > 0 ? query(collection(firestore, 'skills'), where('__name__', 'in', skillIds)) : null,
    [firestore, skillIds]
  );
  const { data: purchasedSkills } = useCollection(skillsQuery);
  
  const getProgress = (id: string) => {
      return enrollments?.find(e => e.courseId === id || e.skillId === id)?.progress || 0;
  }

  const getLastAccessed = (id: string) => {
    const enrollment = enrollments?.find(e => e.courseId === id || e.skillId === id);
    if (!enrollment || !enrollment.lastAccessed) return 'N/A';
    // This could be formatted to be more human-readable
    return new Date(enrollment.lastAccessed.seconds * 1000).toLocaleDateString();
  }


  if (isUserLoading) {
    return <div>Loading...</div>
  }


  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">My Learning</h1>
        <p className="text-lg text-muted-foreground mt-2">Continue your learning journey.</p>
      </div>

      {!purchasedCourses && !purchasedSkills ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <BookOpen className="mx-auto h-24 w-24 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-bold">No Content Yet</h2>
          <p className="mt-2 text-muted-foreground">You haven't enrolled in any courses or programs.</p>
          <div className="mt-6">
            <Link href="/courses">
                <Button className="gradient-btn gradient-btn-2 relative">
                    Explore Courses
                    <RippleEffect />
                </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-16">
            {purchasedCourses && purchasedCourses.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><BookOpen/> My Courses</h2>
                    <div className="space-y-8">
                    {purchasedCourses.map((course) => {
                        const progress = getProgress(course.id);
                        const lastAccessed = getLastAccessed(course.id);
                        return (
                        <Card key={course.id} className="glass-card flex flex-col md:flex-row overflow-hidden">
                            <div className="relative w-full md:w-52 h-48 md:h-auto flex-shrink-0">
                            {course.posterUrl && (
                                <Image
                                src={course.posterUrl}
                                alt={course.title}
                                fill
                                className="object-cover"
                                />
                            )}
                            </div>
                            <CardContent className="p-6 flex-grow w-full">
                            <div className="flex flex-col h-full">
                                <h3 className="text-xl font-bold">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{course.level}</p>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2 [&>div]:bg-primary" />
                                </div>
                                <p className="text-xs text-muted-foreground mb-6">Last accessed: {lastAccessed}</p>
                                <div className="mt-auto">
                                    <Link href={`/courses/${course.id}`}>
                                        <Button className="gradient-btn gradient-btn-2 relative">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Continue Learning
                                            <RippleEffect />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        );
                    })}
                    </div>
                </div>
            )}
            
            {purchasedCourses && purchasedCourses.length > 0 && purchasedSkills && purchasedSkills.length > 0 && <Separator className="bg-white/10" />}

            {purchasedSkills && purchasedSkills.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Award/> Enrolled Programs</h2>
                     <div className="space-y-8">
                    {purchasedSkills.map((skill) => {
                        const progress = getProgress(skill.id);
                        const lastAccessed = getLastAccessed(skill.id);
                        return (
                        <Card key={skill.id} className="glass-card flex flex-col md:flex-row overflow-hidden">
                            <div className="relative w-full md:w-52 h-48 md:h-auto flex-shrink-0">
                            {skill.posterUrl && (
                                <Image
                                src={skill.posterUrl}
                                alt={skill.title}
                                fill
                                className="object-cover"
                                />
                            )}
                            </div>
                            <CardContent className="p-6 flex-grow w-full">
                            <div className="flex flex-col h-full">
                                <h3 className="text-xl font-bold">{skill.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{skill.description}</p>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-muted-foreground">Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2 [&>div]:bg-secondary" />
                                </div>
                                <p className="text-xs text-muted-foreground mb-6">Last accessed: {lastAccessed}</p>
                                <div className="mt-auto">
                                    <Link href={`/skills/${skill.id}`}>
                                        <Button className="gradient-btn gradient-btn-2 relative">
                                            <Award className="mr-2 h-4 w-4" />
                                            Continue Program
                                            <RippleEffect />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        );
                    })}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
