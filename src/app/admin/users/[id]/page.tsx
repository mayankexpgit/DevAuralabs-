
'use client';

import { notFound, useParams } from 'next/navigation';
import { useDoc, useCollection, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { doc, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { Loader2, User as UserIcon, Mail, Smartphone, Shield, BookOpen, Award, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Link from 'next/link';

export default function UserDetailPage() {
  const params = useParams();
  const { id } = params;
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  // Fetch user data
  const userRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', id as string) : null, [firestore, id]);
  const { data: user, isLoading: userLoading } = useDoc(userRef);

  // Fetch user's enrollments
  const enrollmentsQuery = useMemoFirebase(
    () => firestore ? collection(firestore, `users/${id}/enrollments`) : null,
    [firestore, id]
  );
  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection(enrollmentsQuery);

  const enrolledCourseIds = enrollments?.filter(e => e.courseId).map(e => e.courseId) || [];
  const enrolledSkillIds = enrollments?.filter(e => e.skillId).map(e => e.skillId) || [];

  // Fetch details of enrolled courses
  const enrolledCoursesQuery = useMemoFirebase(
    () => firestore && enrolledCourseIds.length > 0 ? query(collection(firestore, 'courses'), where('__name__', 'in', enrolledCourseIds)) : null,
    [firestore, enrolledCourseIds]
  );
  const { data: enrolledCourses, isLoading: enrolledCoursesLoading } = useCollection(enrolledCoursesQuery);

  // Fetch details of enrolled skills
  const enrolledSkillsQuery = useMemoFirebase(
    () => firestore && enrolledSkillIds.length > 0 ? query(collection(firestore, 'skills'), where('__name__', 'in', enrolledSkillIds)) : null,
    [firestore, enrolledSkillIds]
  );
  const { data: enrolledSkills, isLoading: enrolledSkillsLoading } = useCollection(enrolledSkillsQuery);
  
  // Fetch all courses and skills for the grant access dropdowns
  const allCoursesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'courses') : null, [firestore]);
  const { data: allCourses } = useCollection(allCoursesQuery);
  
  const allSkillsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'skills') : null, [firestore]);
  const { data: allSkills } = useCollection(allSkillsQuery);


  const isLoading = userLoading || enrollmentsLoading || enrolledCoursesLoading || enrolledSkillsLoading;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (!user) {
    notFound();
  }
  
  const handleGrantAccess = async (type: 'course' | 'skill') => {
      if (!firestore) return;
      const enrollmentRef = collection(firestore, 'users', id as string, 'enrollments');
      const itemToAdd = type === 'course' ? selectedCourse : selectedSkill;
      const itemTitle = type === 'course' 
          ? allCourses?.find(c => c.id === itemToAdd)?.title 
          : allSkills?.find(s => s.id === itemToAdd)?.title;

      if (!itemToAdd) {
          toast({ variant: 'destructive', title: `Please select a ${type}.` });
          return;
      }
      
      const enrollmentData = {
          userId: id,
          [`${type}Id`]: itemToAdd,
          enrollmentDate: serverTimestamp(),
          progress: 0,
          type: type
      };

      try {
          await addDocumentNonBlocking(enrollmentRef, enrollmentData);
          toast({ title: 'Access Granted!', description: `${user.displayName} now has access to ${itemTitle}.` });
          if(type === 'course') setSelectedCourse('');
          if(type === 'skill') setSelectedSkill('');
      } catch (error) {
          toast({ variant: 'destructive', title: 'Error granting access.' });
      }
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
        <div className="flex items-center gap-4">
            <Link href="/admin/users">
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold">{user.displayName || 'No Name'}</h1>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="glass-card lg:col-span-1">
            <CardHeader>
                <CardTitle>User Details</CardTitle>
                <CardDescription>Personal and account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <UserIcon className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold">{user.displayName || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-semibold">{user.email || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Mobile</p>
                        <p className="font-semibold">{user.phoneNumber || 'Not provided'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="font-semibold">{'Student'}</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2">
            <CardHeader>
                <CardTitle>Enrollments</CardTitle>
                <CardDescription>Courses and skill programs the user has access to.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><BookOpen /> Enrolled Courses</h3>
                    {enrolledCourses && enrolledCourses.length > 0 ? (
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            {enrolledCourses.map(course => <li key={course.id}>{course.title}</li>)}
                        </ul>
                    ) : <p className="text-sm text-muted-foreground">No courses enrolled.</p>}
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><Award /> Enrolled Skill Programs</h3>
                    {enrolledSkills && enrolledSkills.length > 0 ? (
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                            {enrolledSkills.map(skill => <li key={skill.id}>{skill.title}</li>)}
                        </ul>
                    ) : <p className="text-sm text-muted-foreground">No skill programs enrolled.</p>}
                </div>
            </CardContent>
        </Card>
      </div>

       <Card className="glass-card">
            <CardHeader>
                <CardTitle>Grant Access</CardTitle>
                <CardDescription>Manually grant access to a course or skill program.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                         <Select onValueChange={setSelectedCourse} value={selectedCourse}>
                            <SelectTrigger><SelectValue placeholder="Select a course..." /></SelectTrigger>
                            <SelectContent>
                                {allCourses?.filter(c => !enrolledCourseIds.includes(c.id)).map(course => (
                                    <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={() => handleGrantAccess('course')} className="w-full sm:w-auto" disabled={!selectedCourse}>Grant Course Access</Button>
                    </div>
                    <div className="flex-1 space-y-2">
                        <Select onValueChange={setSelectedSkill} value={selectedSkill}>
                            <SelectTrigger><SelectValue placeholder="Select a skill..." /></SelectTrigger>
                            <SelectContent>
                                {allSkills?.filter(s => !enrolledSkillIds.includes(s.id)).map(skill => (
                                    <SelectItem key={skill.id} value={skill.id}>{skill.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={() => handleGrantAccess('skill')} className="w-full sm:w-auto" disabled={!selectedSkill}>Grant Skill Access</Button>
                    </div>
                </div>
            </CardContent>
       </Card>
    </div>
  );
}

