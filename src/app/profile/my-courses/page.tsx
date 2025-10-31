
'use client';

import { courses, skills } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const getPlaceholderImage = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

// In a real app, this would be fetched from user data
const purchasedCourseIds = ['c1', 'c2']; 
const purchasedSkillIds = ['s1'];

const purchasedCourses = courses
  .filter(course => purchasedCourseIds.includes(course.id))
  .map(course => ({
      ...course,
      progress: course.id === 'c1' ? 75 : 30, // Example progress
      lastAccessed: course.id === 'c1' ? '2 days ago' : '1 week ago' // Example access time
  }));

const purchasedSkills = skills
    .filter(skill => purchasedSkillIds.includes(skill.id))
    .map(skill => ({
        ...skill,
        lastAccessed: '5 days ago'
    }));


export default function MyLearningPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">My Learning</h1>
        <p className="text-lg text-muted-foreground mt-2">Continue your learning journey.</p>
      </div>

      {purchasedCourses.length === 0 && purchasedSkills.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <BookOpen className="mx-auto h-24 w-24 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-bold">No Content Yet</h2>
          <p className="mt-2 text-muted-foreground">You haven't enrolled in any courses or programs.</p>
          <div className="mt-6">
            <Link href="/courses">
                <Button className="gradient-btn gradient-btn-2 relative">
                    Explore Courses
                </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-16">
            {purchasedCourses.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><BookOpen/> My Courses</h2>
                    <div className="space-y-8">
                    {purchasedCourses.map((course) => {
                        const placeholder = getPlaceholderImage(course.image);
                        return (
                        <Card key={course.id} className="glass-card flex flex-col md:flex-row overflow-hidden">
                            <div className="relative w-full md:w-52 h-48 md:h-auto flex-shrink-0">
                            {placeholder && (
                                <Image
                                src={placeholder.imageUrl}
                                alt={course.title}
                                data-ai-hint={placeholder.imageHint}
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
                                        <span>{course.progress}%</span>
                                    </div>
                                    <Progress value={course.progress} className="h-2 [&>div]:bg-primary" />
                                </div>
                                <p className="text-xs text-muted-foreground mb-6">Last accessed: {course.lastAccessed}</p>
                                <div className="mt-auto">
                                    <Link href={`/courses/${course.id}`}>
                                        <Button className="gradient-btn gradient-btn-2 relative">
                                            <BookOpen className="mr-2 h-4 w-4" />
                                            Continue Learning
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
            
            {purchasedCourses.length > 0 && purchasedSkills.length > 0 && <Separator className="bg-white/10" />}

            {purchasedSkills.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2"><Award/> Enrolled Programs</h2>
                     <div className="space-y-8">
                    {purchasedSkills.map((skill) => {
                        const placeholder = getPlaceholderImage(skill.image);
                        return (
                        <Card key={skill.id} className="glass-card flex flex-col md:flex-row overflow-hidden">
                            <div className="relative w-full md:w-52 h-48 md:h-auto flex-shrink-0">
                            {placeholder && (
                                <Image
                                src={placeholder.imageUrl}
                                alt={skill.title}
                                data-ai-hint={placeholder.imageHint}
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
                                        <span>{skill.progress}%</span>
                                    </div>
                                    <Progress value={skill.progress} className="h-2 [&>div]:bg-secondary" />
                                </div>
                                <p className="text-xs text-muted-foreground mb-6">Last accessed: {skill.lastAccessed}</p>
                                <div className="mt-auto">
                                    <Link href={`/skills/${skill.id}`}>
                                        <Button className="gradient-btn gradient-btn-2 relative">
                                            <Award className="mr-2 h-4 w-4" />
                                            Continue Program
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
