
'use client';

import { courses } from '@/lib/data';
import CourseCard from '@/components/course-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useState, useCallback, useEffect } from 'react';
import { EmblaCarouselType } from 'embla-carousel-react';
import { Button } from '../ui/button';
import Link from 'next/link';

const CIRCULAR_EFFECT_FACTOR = 10;

const useCircularEffect = (api: EmblaCarouselType | undefined) => {
  const [transforms, setTransforms] = useState<{
    opacity: number,
    scale: number,
    rotateY: number,
  }[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onScroll = useCallback(() => {
    if (!api || !isMounted) return;

    const scrollProgress = api.scrollProgress();
    
    const newTransforms = api.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      // Handle looping
      const slidesInView = api.slidesInView(true);
      if (slidesInView.indexOf(index) === -1) {
        if (Math.abs(diffToTarget) > 0.5) {
          const sign = Math.sign(diffToTarget);
          if (sign === -1) diffToTarget = 1 + diffToTarget;
          else diffToTarget = diffToTarget - 1;
        }
      }
      
      const opacity = 1 - Math.abs(diffToTarget);
      const scale = 1 - Math.abs(diffToTarget) * 0.15;
      const rotateY = diffToTarget * CIRCULAR_EFFECT_FACTOR * -5;

      return { opacity, scale, rotateY };
    });

    setTransforms(newTransforms);
  }, [api, isMounted]);

  useEffect(() => {
    if (!api || !isMounted) return;

    onScroll();
    api.on('scroll', onScroll);
    api.on('reInit', onScroll);

    return () => {
      api.off('scroll', onScroll);
    };
  }, [api, onScroll, isMounted]);

  return transforms;
};


export default function CoursesSection() {
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const transforms = useCircularEffect(api);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="courses" className="py-12 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Cybersecurity Courses</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Equip yourself with the latest knowledge and skills to defend against digital threats.
        </p>
      </div>
      <div style={{ perspective: '1000px' }}>
        <Carousel
          setApi={setApi}
          opts={{
            align: 'center',
            loop: true,
          }}
        >
          <CarouselContent style={{ transformStyle: 'preserve-3d' }}>
            {courses.map((course, index) => (
              <CarouselItem key={course.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/5">
                <div
                  className="p-1 h-full transition-transform duration-200 ease-out"
                  style={{
                    ...(isMounted && transforms.length && {
                      opacity: transforms[index].opacity,
                      transform: `scale(${transforms[index].scale}) rotateY(${transforms[index].rotateY}deg)`,
                    }),
                  }}
                >
                  <CourseCard course={course} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {isMounted && (
            <>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </>
          )}
        </Carousel>
      </div>
        <div className="text-center mt-12">
            <Link href="/profile/my-courses">
                <Button className="gradient-btn gradient-btn-2 relative">
                    My Courses
                </Button>
            </Link>
        </div>
    </section>
  );
}
