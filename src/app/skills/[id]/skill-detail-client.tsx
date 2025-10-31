
'use client';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Video, Clapperboard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking, useCollection } from '@/firebase';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { collection, serverTimestamp } from 'firebase/firestore';

const getPlaceholderImage = (id: string) => {
  return PlaceHolderImages.find((img) => img.id === id);
};

type Skill = {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: number;
};

export default function SkillDetailClient({ skill }: { skill: Skill }) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const enrollmentsQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'enrollments') : null),
    [firestore, user]
  );
  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection(enrollmentsQuery);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isPurchased = isMounted && user && !enrollmentsLoading && enrollments?.some(e => e.skillId === skill.id);
  
  const handleEnrollNow = () => {
    if (!isMounted) return;
    if (!user) {
      router.push(`/signup?next=/checkout-skill/${skill.id}`);
    } else {
      const enrollmentRef = collection(firestore, 'users', user.uid, 'enrollments');
      addDocumentNonBlocking(enrollmentRef, {
        skillId: skill.id,
        type: 'skill',
        enrollmentDate: serverTimestamp(),
        progress: 0,
        lastAccessed: serverTimestamp(),
      });
      toast({
        title: 'Enrollment Successful!',
        description: `You are now enrolled in ${skill.title}.`,
      });
    }
  };

  const placeholder = getPlaceholderImage(skill.image);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card mb-8">
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
          <h1 className="text-4xl font-bold mb-4">{skill.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{skill.description}</p>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">What you&apos;ll learn</h2>
            <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Industry-relevant development practices.</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Hands-on experience with modern frameworks.</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> How to build and deploy applications.</li>
                <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> Portfolio-worthy project development.</li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-2">
            <div className="glass-card p-8 sticky top-24">
                {enrollmentsLoading && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                {!enrollmentsLoading && isPurchased ? (
                     <div>
                        <h2 className="text-2xl font-bold text-primary mb-6">Program Content</h2>
                        <div className="space-y-4">
                        <Button size="lg" className="w-full justify-start">
                            <Clapperboard className="mr-2 h-5 w-5" />
                            Join Live Mentorship
                        </Button>
                        <Button size="lg" variant="outline" className="w-full justify-start">
                            <Video className="mr-2 h-5 w-5" />
                            Access Project Files
                        </Button>
                        </div>
                        <div className="mt-8 text-xs text-center text-muted-foreground">
                            You have lifetime access to this program.
                        </div>
                  </div>
                ) : !enrollmentsLoading && (
                    <>
                        <div className="flex items-baseline gap-2 mb-6">
                            <p className="text-3xl font-bold text-primary">${skill.price || '499.99'}</p>
                            <p className="text-xl text-muted-foreground line-through">$599.99</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">Get lifetime access to this program and all future updates.</p>
                        <div className="flex flex-col gap-4">
                            <Button size="lg" className="w-full gradient-btn gradient-btn-1 relative" onClick={handleEnrollNow}>
                                Enroll Now
                                <RippleEffect />
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
