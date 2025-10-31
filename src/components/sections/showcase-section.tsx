
'use client';

import Image from 'next/image';
import { showcaseImages } from '@/lib/showcase-data';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useState, useCallback, useEffect, useRef } from 'react';
import { EmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

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

    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    
    const newTransforms = api.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      // Handle looping to create a seamless circular effect
      if (engine.options.loop) {
        if (Math.abs(diffToTarget) > 0.5) {
          const sign = Math.sign(diffToTarget);
          if (sign === -1) {
            diffToTarget = 1 + diffToTarget;
          } else {
            diffToTarget = diffToTarget - 1;
          }
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


const ShowcaseCard = ({
  img,
  title,
  className,
}: {
  img: string;
  title: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative w-full cursor-pointer overflow-hidden p-4 rounded-2xl bg-black border border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.5)]',
        className
      )}
    >
        <h3 className="text-xl font-bold text-center mb-4 text-primary">{title}</h3>
      <div className="relative flex flex-row items-center justify-center gap-2 w-full h-full aspect-[16/10]">
        <Image
          className="object-contain"
          fill
          alt={title}
          src={img}
          unoptimized
        />
      </div>
    </div>
  );
};

export default function ShowcaseSection() {
  const [api, setApi] = useState<EmblaCarouselType | undefined>();
  const transforms = useCircularEffect(api);
  const [isMounted, setIsMounted] = useState(false);
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

    return (
      <section id="showcase" className="py-12 md:py-16">
        <div className="container mx-auto px-4" style={{perspective: '1000px'}}>
           <Carousel
                setApi={setApi}
                opts={{
                    align: 'center',
                    loop: true,
                }}
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
                className="w-full"
            >
                <CarouselContent style={{ transformStyle: 'preserve-3d' }}>
                    {showcaseImages.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4 flex justify-center">
                            <div className="p-1 h-full w-full max-w-md"
                              style={{
                                ...(isMounted && transforms.length && {
                                  opacity: transforms[index].opacity,
                                  transform: `scale(${transforms[index].scale}) rotateY(${transforms[index].rotateY}deg)`,
                                }),
                              }}
                            >
                                <ShowcaseCard img={image.url} title={image.alt} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
            </Carousel>
        </div>
      </section>
    );
}
