
'use client';

import Image from 'next/image';
import { Marquee } from 'magic-ui-react';
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
        'relative w-48 h-48 cursor-pointer overflow-hidden rounded-xl border p-4',
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
        />
      </div>
    </figure>
  );
};

export default function ShowcaseSection() {
    const firstRow = showcaseImages.slice(0, showcaseImages.length);
  
    return (
      <section id="showcase" className="py-12 md:py-16">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((image) => (
              <ShowcaseCard key={image.id} img={image.url} alt={image.alt} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background"></div>
        </div>
      </section>
    );
}
