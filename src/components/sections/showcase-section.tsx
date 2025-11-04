
'use client';

import Image from 'next/image';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { showcaseImages } from '@/lib/showcase-data';

export default function ShowcaseSection() {
  const autoplay = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <section id="showcase" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={[autoplay.current]}
          onMouseEnter={autoplay.current.stop}
          onMouseLeave={autoplay.current.reset}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {showcaseImages.map((image, index) => (
              <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
                <div className="relative aspect-square w-full h-full overflow-hidden rounded-lg">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
