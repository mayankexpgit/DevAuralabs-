
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
        'relative w-full cursor-pointer overflow-hidden p-4 rounded-2xl bg-black border border-white/10',
        className
      )}
    >
        <h3 className="text-xl font-bold text-center mb-4 text-primary">{title}</h3>
      <div className="relative flex flex-row items-center justify-center gap-2 w-full h-full aspect-video">
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
                                <ShowcaseCard img={image.url} title={image.alt} />
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
