
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
    <figure
      className={cn(
        'relative w-48 h-48 cursor-pointer overflow-hidden rounded-xl border p-4 mx-4',
        'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
        'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
      )}
    >
      <div className="flex flex-row items-center justify-center gap-2 w-full h-full">
        <Image
          className="rounded-full object-contain"
          width={128}
          height={128}
          alt={alt}
          src={img}
          unoptimized
        />
      </div>
    </figure>
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
