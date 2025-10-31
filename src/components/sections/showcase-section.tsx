
'use client';

import Image from 'next/image';
import { showcaseImages } from '@/lib/showcase-data';
import { cn } from '@/lib/utils';

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
        'relative w-full aspect-square cursor-pointer overflow-hidden p-4',
        className
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2 w-full h-full">
        <Image
          className="object-contain"
          width={300}
          height={300}
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
        <div className="relative w-full overflow-hidden bg-transparent">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 items-center">
              {showcaseImages.map((image, index) => (
                <ShowcaseCard key={index} img={image.url} alt={image.alt} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
}
