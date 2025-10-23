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

const TWEEN_FACTOR = 1.2;

const useTweening = (api: EmblaCarouselType | undefined) => {
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const onScroll = useCallback(() => {
    if (!api) return;

    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();

    const getTweenValues = (scrollProgress: number) => {
        return api.scrollSnapList().map((scrollSnap, index) => {
            let diffToTarget = scrollSnap - scrollProgress;
            const isSlideInView = Math.abs(diffToTarget) < 1;

            if (isSlideInView) {
                 return 1 - Math.abs(diffToTarget);
            }
            return 0;
        });
    };

    setTweenValues(getTweenValues(scrollProgress));
  }, [api, setTweenValues]);


  useEffect(() => {
    if (!api) return;

    onScroll();
    api.on('scroll', onScroll);
    api.on('reInit', onScroll);
  }, [api, onScroll]);

  return tweenValues;
};

export default function CoursesSection() {
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const tweenValues = useTweening(api);

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
      >
        <CarouselContent>
          {courses.map((course, index) => (
            <CarouselItem key={course.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/4 xl:basis-1/5">
              <div
                className="p-1 h-full"
                 style={{
                    ...(tweenValues.length && {
                        opacity: tweenValues[index],
                        transform: `scale(${tweenValues[index]})`,
                    }),
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
