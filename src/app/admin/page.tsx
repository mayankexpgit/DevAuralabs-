
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/context/admin-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, UserCog, LogOut, PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddCourseForm from '@/components/add-course-form';
import AddSkillForm from '@/components/add-skill-form';

export default function AdminPage() {
  const { isAdmin, isLoading, logout } = useAdmin();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !isAdmin) {
      router.push('/login');
    }
  }, [isAdmin, isLoading, router, isMounted]);

  if (!isMounted || isLoading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const handleLogout = () => {
    logout();
    router.push('/');
  }

  return (
    <div className="container mx-auto py-10 px-4">
       <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
       </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserCog /> Admin Profile</CardTitle>
            <CardDescription>Welcome, Administrator.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You have full access to manage courses, skills, and users.</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your platform content.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card">
                    <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                    </DialogHeader>
                    <AddCourseForm />
                </DialogContent>
            </Dialog>

             <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card">
                    <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    </DialogHeader>
                    <AddSkillForm />
                </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
