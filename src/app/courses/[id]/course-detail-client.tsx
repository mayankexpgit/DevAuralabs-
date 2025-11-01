
'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ShoppingCart, Video, Clapperboard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking, useCollection } from '@/firebase';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { collection, doc, serverTimestamp } from 'firebase/firestore';

const getPlaceholderImage = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

type Course = {
  id: string;
  title: string;
  level: string;
  price: number;
  description: string;
  image: string;
  compareAtPrice?: number;
};

export default function CourseDetailClient({ course }: { course: Course }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const enrollmentsQuery = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'enrollments') : null),
    [firestore, user]
  );
  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection(enrollmentsQuery);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const isPurchased = isMounted && user && !enrollmentsLoading && enrollments?.some(e => e.courseId === course.id);

  const handleBuyNow = () => {
    if (!isMounted || !firestore) return;
    if (!user) {
      router.push(`/signup?next=/checkout/${course.id}`);
    } else {
      // In a real app, this would be part of a checkout flow.
      // For now, we'll just enroll the user directly.
      const enrollmentRef = collection(firestore, 'users', user.uid, 'enrollments');
      addDocumentNonBlocking(enrollmentRef, {
        courseId: course.id,
        type: 'course',
        enrollmentDate: serverTimestamp(),
        progress: 0,
        lastAccessed: serverTimestamp(),
      });
      toast({
        title: 'Enrollment Successful!',
        description: `You are now enrolled in ${course.title}.`,
      });
    }
  };

  const handleAddToCart = () => {
    if (!isMounted || !user || !firestore) {
      router.push(`/signup?next=/courses/${course.id}`);
      return;
    }
    
    const cartRef = collection(firestore, 'users', user.uid, 'cart');
    // Check if item is already in cart, if so, maybe update quantity. For now, just add.
    addDocumentNonBlocking(cartRef, {
        ...course,
        quantity: 1,
        addedAt: serverTimestamp(),
    });

    toast({
      title: 'Added to Cart',
      description: `${course.title} has been added to your shopping cart.`,
      action: (
        <Button variant="ghost" size="sm" onClick={() => router.push('/cart')}>
          View Cart
        </Button>
      ),
    });
  };

  const placeholder = getPlaceholderImage(course.image);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card mb-8">
            {placeholder && (
              <Image
                src={placeholder.imageUrl}
                alt={course.title}
                data-ai-hint={placeholder.imageHint}
                fill
                className="object-cover"
              />
            )}
            <Badge variant="secondary" className="absolute top-4 left-4 bg-background/70 backdrop-blur-sm text-primary border-primary/20">
              {course.level}
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{course.description}</p>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What you&apos;ll learn</h2>
            <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Core security principles and practices.</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Hands-on experience with security tools.</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> How to identify and mitigate vulnerabilities.</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Preparation for industry certifications.</li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-2">
            <div className="glass-card p-8 sticky top-24">
                {enrollmentsLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                {!enrollmentsLoading && isPurchased ? (
                  <div>
                    <h2 className="text-2xl font-bold text-primary mb-6">Course Content</h2>
                    <div className="space-y-4">
                      <Button size="lg" className="w-full justify-start">
                        <Clapperboard className="mr-2 h-5 w-5" />
                        Join Live Class
                      </Button>
                      <Button size="lg" variant="outline" className="w-full justify-start">
                         <Video className="mr-2 h-5 w-5" />
                        Watch Recordings
                      </Button>
                    </div>
                     <div className="mt-8 text-xs text-center text-muted-foreground">
                        You have lifetime access to this course.
                    </div>
                  </div>
                ) : !enrollmentsLoading && (
                  <>
                    <div className="flex items-baseline gap-2 mb-6">
                        <p className="text-3xl font-bold text-primary">${course.price}</p>
                        {course.compareAtPrice && (
                            <p className="text-xl text-muted-foreground line-through">${course.compareAtPrice}</p>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">Get lifetime access to this course and all future updates.</p>
                    <div className="flex flex-col gap-4">
                        <Button size="lg" className="w-full gradient-btn gradient-btn-1 relative" onClick={handleBuyNow}>
                            Buy Now
                            <RippleEffect />
                        </Button>
                        <Button size="lg" variant="outline" className="w-full relative" onClick={handleAddToCart}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                        </Button>
                    </div>
                    <div className="mt-8 text-xs text-center text-muted-foreground">
                        3-Day Money-Back Guarantee
                    </div>
                  </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
