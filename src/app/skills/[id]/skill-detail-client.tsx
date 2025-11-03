
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Video, Clapperboard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking, useCollection, useDoc } from '@/firebase';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { collection, serverTimestamp, doc, Timestamp } from 'firebase/firestore';
import { useCurrency } from '@/context/currency-context';
import Link from 'next/link';
import { useDemoUser } from '@/context/demo-user-context';

type Skill = {
  id: string;
  title: string;
  description: string;
  whatYoullLearn: string;
  posterUrl: string;
  price?: number;
};

type ClassDetails = {
    liveClassUrl?: string;
    liveClassTime?: string; // Changed from Timestamp
    recordedVideos?: { title: string; url: string }[];
}

export default function SkillDetailClient({ skill }: { skill: Skill }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { getConvertedPrice } = useCurrency();
  const { isDemoMode } = useDemoUser();

  const enrollmentsQuery = useMemoFirebase(
    () => (user && firestore ? collection(firestore, 'users', user.uid, 'enrollments') : null),
    [firestore, user]
  );
  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection(enrollmentsQuery);

  const classDetailsRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'skills', skill.id, 'classDetails', 'details') : null),
    [firestore, skill.id]
  );
  const { data: classDetails, isLoading: classDetailsLoading } = useDoc<ClassDetails>(classDetailsRef);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isPurchased = isMounted && (isDemoMode || (user && !enrollmentsLoading && enrollments?.some(e => e.skillId === skill.id)));

  const learningPoints = skill.whatYoullLearn?.split('\n').filter(point => point.trim() !== '') || [];
  
  const handleEnrollNow = () => {
    if (!isMounted || !firestore) return;
    if (!user) {
      router.push(`/signup?next=/checkout-skill/${skill.id}`);
    } else {
      router.push(`/checkout-skill/${skill.id}`);
    }
  };

  const price = skill.price || 499.99;
  const compareAtPrice = price * 1.2;
  
  const renderContentAccessButtons = () => {
    const now = new Date();
    let showLiveButton = false;

    if (classDetails?.liveClassTime) {
        const liveTime = new Date(classDetails.liveClassTime);
        const startTime = new Date(liveTime.getTime() - 30 * 60 * 1000); // 30 mins before
        const endTime = new Date(liveTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours after
        if (now >= startTime && now <= endTime) {
            showLiveButton = true;
        }
    }

    return (
        <div className="space-y-4">
        {showLiveButton && classDetails?.liveClassUrl && (
            <Button asChild size="lg" className="w-full justify-start">
            <Link href={classDetails.liveClassUrl} target="_blank" rel="noopener noreferrer">
                <Clapperboard className="mr-2 h-5 w-5" />
                Join Live Mentorship
            </Link>
            </Button>
        )}
        {classDetails?.recordedVideos && classDetails.recordedVideos.length > 0 && (
             <div className="space-y-2">
                {classDetails.recordedVideos.map((video, index) => (
                    <Button asChild size="lg" variant="outline" className="w-full justify-start" key={index}>
                        <Link href={video.url} target="_blank" rel="noopener noreferrer">
                        <Video className="mr-2 h-5 w-5" />
                        {video.title}
                        </Link>
                    </Button>
                ))}
             </div>
        )}
        </div>
    );
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card mb-8">
            {skill.posterUrl && (
              <Image
                src={skill.posterUrl}
                alt={skill.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{skill.title}</h1>
          <p className="text-lg text-muted-foreground mb-8">{skill.description}</p>
          
          {learningPoints.length > 0 && (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">What you&apos;ll learn</h2>
                <ul className="space-y-2 text-muted-foreground">
                    {learningPoints.map((point, index) => (
                        <li key={index} className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-primary" /> {point}</li>
                    ))}
                </ul>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
            <div className="glass-card p-8 sticky top-24">
                {(enrollmentsLoading || classDetailsLoading) && <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                {!(enrollmentsLoading || classDetailsLoading) && isPurchased ? (
                     <div>
                        <h2 className="text-2xl font-bold text-primary mb-6">Program Content</h2>
                        {renderContentAccessButtons()}
                        <div className="mt-8 text-xs text-center text-muted-foreground">
                            You have lifetime access to this program.
                        </div>
                  </div>
                ) : !(enrollmentsLoading || classDetailsLoading) && (
                    <>
                        <div className="flex items-baseline gap-2 mb-6">
                            <p className="text-3xl font-bold text-primary">{getConvertedPrice(price)}</p>
                            <p className="text-xl text-muted-foreground line-through">{getConvertedPrice(compareAtPrice)}</p>
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

    