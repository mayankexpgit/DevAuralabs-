
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookPlus, Award, LayoutDashboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddCourseForm from './add-course-form';
import AddSkillForm from './add-skill-form';
import Link from 'next/link';

export default function AdminFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-28 right-8 z-50 group">
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-4 flex flex-col items-end gap-3">
             <Dialog>
                <DialogTrigger asChild>
                     <Button variant="outline" className="w-full flex justify-start items-center gap-2 pr-8">
                        <BookPlus className="h-5 w-5" />
                        <span>Add Course</span>
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
                    <Button variant="outline" className="w-full flex justify-start items-center gap-2 pr-8">
                        <Award className="h-5 w-5" />
                        <span>Add Skill</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glass-card">
                    <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    </DialogHeader>
                    <AddSkillForm />
                </DialogContent>
            </Dialog>

            <Link href="/admin">
                <Button variant="outline" className="w-full flex justify-start items-center gap-2 pr-8">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                </Button>
            </Link>
          </div>
        )}
        <Button
          size="icon"
          className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90 shadow-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Plus className={`h-8 w-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
        </Button>
      </div>
    </div>
  );
}
