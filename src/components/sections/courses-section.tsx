'use client';

import { useState, useEffect, useCallback } from 'react';
import { courses } from '@/lib/data';
import CourseCard from '@/components/course-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

const ROTATE_Y_DEGREES = 30;

export default function CoursesSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onScroll = useCallback((api: CarouselApi) => {
    if (!api) return;
    setScrollProgress(api.scrollProgress());
  }, []);

  useEffect(() => {
    if (!api) return;
    onScroll(api);
    api.on('scroll', onScroll);
    api.on('reInit', onScroll);
  }, [api, onScroll]);

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
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <div style={{ perspective: '1000px' }}>
          <CarouselContent>
            {courses.map((course, index) => {
              if (!api) {
                return (
                  <CarouselItem key={course.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                    <div className="p-1 h-full">
                      <CourseCard course={course} />
                    </div>
                  </CarouselItem>
                );
              }
              const scrollSnaps = api.scrollSnapList();
              let diffToTarget = scrollSnaps[index] - scrollProgress;
              
              const engine = api.internalEngine();
              if (engine && engine.options.loop) {
                  engine.slideLooper.loopPoints.forEach(loopPoint => {
                    const isUsed = loopPoint.target() === scrollProgress;
                    if (isUsed) {
                      const sign = Math.sign(engine.dragHandler.dragged.x);
                      if (sign === -1) {
                          diffToTarget = scrollSnaps[index] - (1 + scrollProgress);
                      }
                      if (sign === 1) {
                          diffToTarget = scrollSnaps[index] + (1 - scrollProgress);
                      }
                    }
                  });
              }

              const scale = 1 - Math.abs(diffToTarget) * 0.4;
              const rotateY = diffToTarget * -ROTATE_Y_DEGREES;
              const opacity = 1 - Math.abs(diffToTarget) * 0.5;

              return (
                <CarouselItem key={course.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                  <div className="p-1 h-full" style={{ 
                      transform: `scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity: opacity,
                      transition: 'transform 0.5s ease, opacity 0.5s ease'
                  }}>
                    <CourseCard course={course} />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </div>
        {isClient && (
          <>
            <CarouselPrevious className="hidden md:flex"/>
            <CarouselNext className="hidden md:flex"/>
          </>
        )}
      </Carousel>
    </section>
  );
}
