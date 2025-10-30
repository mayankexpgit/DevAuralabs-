
'use client';

import { courses } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { RippleButton } from '@/components/ui/ripple-button';

const getPlaceholderImage = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

// Simulate purchased courses
const purchasedCourses = [
  { ...courses[0], progress: 75, lastAccessed: '2 days ago' },
  { ...courses[1], progress: 30, lastAccessed: '1 week ago' },
];

export default function MyCoursesPage() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">My Courses</h1>
        <p className="text-lg text-muted-foreground mt-2">Continue your learning journey.</p>
      </div>

      {purchasedCourses.length > 0 ? (
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
                            <RippleButton className="gradient-btn gradient-btn-2">
                                <BookOpen className="mr-2 h-4 w-4" />
                                Continue Learning
                            </RippleButton>
                        </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 glass-card rounded-2xl">
          <BookOpen className="mx-auto h-24 w-24 text-muted-foreground" />
          <h2 className="mt-6 text-2xl font-bold">No Courses Yet</h2>
          <p className="mt-2 text-muted-foreground">You haven't enrolled in any courses.</p>
          <div className="mt-6">
            <Link href="/courses">
                <RippleButton className="gradient-btn gradient-btn-2">
                    Explore Courses
                </RippleButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
