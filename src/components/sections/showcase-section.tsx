
'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useState, useCallback, useEffect, useRef } from 'react';
import { EmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { showcaseImages } from '@/lib/showcase-data';

const CIRCULAR_EFFECT_FACTOR = 10;

const useCircularEffect = (api: EmblaCarouselType | undefined) => {
  const [transforms, setTransforms] = useState<{
    opacity: number,
    scale: number,
    rotateY: number,
  }[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const animationFrame = useRef(0);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      cancelAnimationFrame(animationFrame.current);
    }
  }, []);

  const onScroll = useCallback(() => {
    if (!api || !isMounted) return;

    cancelAnimationFrame(animationFrame.current);

    animationFrame.current = requestAnimationFrame(() => {
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
    });
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
        'w-full cursor-pointer overflow-hidden rounded-2xl bg-zinc-800/30 border border-primary/10 shadow-lg flex flex-col',
        className
      )}
    >
      <div className="flex items-center gap-2 h-10 px-4 bg-zinc-900/50 border-b border-primary/10">
        <span className="h-3 w-3 rounded-full bg-primary"></span>
        <span className="h-3 w-3 rounded-full bg-white/50"></span>
        <span className="h-3 w-3 rounded-full bg-white/30"></span>
        <p className="text-xs text-muted-foreground ml-auto font-bold">{title}</p>
      </div>
      <div className="relative flex-grow p-4 bg-black/20">
        <div className="relative w-full h-full aspect-square p-4">
            <Image
            className="object-contain"
            fill
            alt={title}
            src={img}
            />
        </div>
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
                        <CarouselItem key={image.id} className="sm:basis-1/2 md:basis-1/2 lg:basis-1/4 flex justify-center">
                            <div className="p-1 h-full w-full max-w-md"
                              style={{
                                ...(isMounted && transforms.length > index && {
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
