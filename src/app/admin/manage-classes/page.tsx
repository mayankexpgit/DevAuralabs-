
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ManageClassForm from '@/components/manage-class-form';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ManageClassesPage() {
    const firestore = useFirestore();

    const coursesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'courses') : null, [firestore]);
    const { data: courses, isLoading: coursesLoading } = useCollection(coursesQuery);

    const skillsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'skills') : null, [firestore]);
    const { data: skills, isLoading: skillsLoading } = useCollection(skillsQuery);
    
    if (coursesLoading || skillsLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/content">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold">Manage Class URLs</h1>
                </div>

                <Card className="glass-card">
                    <CardHeader>
                        <CardDescription>Update the class details for each course and skill program below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {courses && courses.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-bold mt-8 mb-4">Courses</h2>
                                    {courses.map(course => (
                                        <AccordionItem value={`course-${course.id}`} key={course.id}>
                                            <AccordionTrigger>{course.title}</AccordionTrigger>
                                            <AccordionContent>
                                                <ManageClassForm content={course} collectionName="courses" />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </>
                            )}
                             {skills && skills.length > 0 && (
                                <>
                                    <h2 className="text-2xl font-bold mt-8 mb-4">Skill Programs</h2>
                                    {skills.map(skill => (
                                        <AccordionItem value={`skill-${skill.id}`} key={skill.id}>
                                            <AccordionTrigger>{skill.title}</AccordionTrigger>
                                            <AccordionContent>
                                                <ManageClassForm content={skill} collectionName="skills" />
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </>
                            )}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    