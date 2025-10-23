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

const useParallax = (
    api: CarouselApi,
    isClient: boolean,
  ) => {
    const [transforms, setTransforms] = useState<
      {
        scale: number;
        rotateY: number;
        opacity: number;
      }[]
    >([]);
  
    const onScroll = useCallback(() => {
      if (!api) return;
  
      const engine = api.internalEngine();
      const scrollProgress = api.scrollProgress();
  
      const newTransforms = api.scrollSnapList().map((scrollSnap, index) => {
        let diffToTarget = scrollSnap - scrollProgress;

        const slidesInView = api.slidesInView(true);
        if (engine.options.loop && slidesInView.indexOf(index) === -1) {
            const { slideLooper } = engine;
            const loopPoints = slideLooper.loopPoints;
            const shortest = loopPoints.reduce((acc, loopPoint) => {
                const diff = loopPoint.location - scrollSnap;
                const dir = Math.sign(diff);
                const abs = Math.abs(diff);
                const far = Math.abs(acc);
                return abs < far ? diff : acc;
            }, diffToTarget);
            diffToTarget = shortest;
        }

        const scale = 1 - Math.abs(diffToTarget) * 0.4;
        const rotateY = diffToTarget * -30;
        const opacity = 1 - Math.abs(diffToTarget) * 0.5;
  
        return { scale, rotateY, opacity };
      });
      setTransforms(newTransforms);
    }, [api]);
  
    useEffect(() => {
      if (!api || !isClient) return;
      onScroll();
      api.on('scroll', onScroll);
      api.on('reInit', onScroll);
    }, [api, isClient, onScroll]);
  
    return transforms;
  };

export default function CoursesSection() {
  const [api, setApi] = useState<CarouselApi>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const transforms = useParallax(api, isClient);

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
        className="w-full"
      >
        <div className='perspective-1000 transform-style-3d'>
          <CarouselContent>
            {courses.map((course, index) => {
              const style = transforms[index]
              ? {
                  transform: `scale(${transforms[index].scale}) rotateY(${transforms[index].rotateY}deg)`,
                  opacity: transforms[index].opacity,
                  transition: 'transform 0.5s ease, opacity 0.5s ease',
                }
              : {};
              return (
                <CarouselItem key={course.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                  <div className="p-1 h-full" style={style}>
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
