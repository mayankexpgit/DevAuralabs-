
'use client';

import Image from 'next/image';
import { showcaseImages } from '@/lib/showcase-data';
import { cn } from '@/lib/utils';

const ShowcaseCard = ({
  img,
  alt,
}: {
  img: string;
  alt: string;
}) => {
  return (
    <div
      className={cn(
        'relative w-48 h-48 cursor-pointer overflow-hidden p-4 mx-4'
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2 w-full h-full">
        <Image
          className="object-contain"
          width={128}
          height={128}
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
          <div className="flex justify-center w-full">
            {showcaseImages.map((image, index) => (
              <ShowcaseCard key={index} img={image.url} alt={image.alt} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
      </section>
    );
}
