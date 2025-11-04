'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className="relative w-full h-full aspect-square">
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
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );
  
  const firestore = useFirestore();
  const showcaseQuery = useMemoFirebase(() => firestore ? collection(firestore, 'showcase') : null, [firestore]);
  const { data: showcaseImages, isLoading } = useCollection(showcaseQuery);


    return (
      <section id="showcase" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
           <Carousel
                opts={{
                    align: 'center',
                    loop: true,
                }}
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
                className="w-full relative"
            >
                <CarouselContent>
                    {isLoading ? (
                      Array.from({ length: 4 }).map((_, index) => (
                        <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 flex justify-center">
                           <div className="p-1 h-full w-full max-w-xs">
                             <Skeleton className="w-full h-full aspect-square rounded-2xl bg-muted/50" />
                           </div>
                        </CarouselItem>
                      ))
                    ) : (
                      showcaseImages?.map((image) => (
                          <CarouselItem key={image.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 flex justify-center">
                              <div className="p-1 h-full w-full max-w-xs">
                                  <ShowcaseCard img={image.url} title={image.alt} />
                              </div>
                          </CarouselItem>
                      ))
                    )}
                </CarouselContent>
            </Carousel>
        </div>
      </section>
    );
}
