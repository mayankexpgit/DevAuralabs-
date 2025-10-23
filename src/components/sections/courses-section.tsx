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

const useCoverflow = (api: EmblaCarouselType | undefined) => {
  const [transforms, setTransforms] = useState<
    { scale: number; rotateY: number; opacity: number }[]
  >([]);

  const onScroll = useCallback(() => {
    if (!api) return;

    const newTransforms = api.scrollSnapList().map((scrollSnap, index) => {
      let diff = scrollSnap - api.scrollProgress();
      const scrollProgress = Math.max(0, 1 - Math.abs(diff));
      
      const inView = Math.abs(diff) < 0.99;

      const scale = inView ? 1 - Math.abs(diff) * 0.4 : 0.6;
      const rotateY = diff * -25;
      const opacity = inView ? 1 - Math.abs(diff) * 0.5 : 0.5;
      
      return { scale, rotateY, opacity };
    });

    setTransforms(newTransforms);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    // Defer the initial calculation to prevent hydration mismatch
    const timer = setTimeout(() => {
        onScroll();
        api.on('scroll', onScroll);
        api.on('reInit', onScroll);
    }, 0);

    return () => {
        clearTimeout(timer);
        api.off('scroll', onScroll);
        api.off('reInit', onScroll);
    };
  }, [api, onScroll]);

  return transforms;
};

export default function CoursesSection() {
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const transforms = useCoverflow(api);

  return (
    <section id="courses" className="py-12 md:py-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Cybersecurity Courses</h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Equip yourself with the latest knowledge and skills to defend against digital threats.
        </p>
      </div>
      <Carousel
        setApi={setApi}
        opts={{
          align: 'center',
          loop: true,
        }}
        className="perspective-container"
      >
        <CarouselContent>
          {courses.map((course, index) => (
            <CarouselItem key={course.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/5">
              <div
                className="p-1 h-full transition-transform duration-300 ease-out"
                style={{
                  transform: `scale(${transforms[index]?.scale || 1}) rotateY(${transforms[index]?.rotateY || 0}deg)`,
                  opacity: transforms[index]?.opacity || 1,
                  transformStyle: 'preserve-3d',
                }}
              >
                <CourseCard course={course} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex"/>
        <CarouselNext className="hidden md:flex"/>
      </Carousel>
    </section>
  );
}
