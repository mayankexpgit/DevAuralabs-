
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

const ShowcaseCard = ({
  img,
  alt,
  className,
}: {
  img: string;
  alt: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative w-full aspect-video cursor-pointer overflow-hidden p-4',
        className
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2 w-full h-full">
        <Image
          className="object-contain"
          width={400}
          height={400}
          alt={alt}
          src={img}
          unoptimized
        />
      </div>
    </div>
  );
};

export default function ShowcaseSection() {
    return (
      <section id="showcase" className="py-12 md:py-16">
        <div className="container mx-auto px-4">
           <Carousel
                opts={{
                    align: 'center',
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {showcaseImages.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/1">
                            <div className="p-1">
                                <ShowcaseCard img={image.url} alt={image.alt} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
      </section>
    );
}
