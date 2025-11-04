
'use client';

import Image from 'next/image';
import { useRef, useEffect, useState, useCallback } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function ShowcaseSection() {
    const firestore = useFirestore();
    const showcaseQuery = useMemoFirebase(() => firestore ? collection(firestore, 'showcase') : null, [firestore]);
    const { data: showcaseImages, isLoading } = useCollection(showcaseQuery);

    const autoplay = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay.current]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const onSelect = useCallback((api: EmblaCarouselType) => {
        setSelectedIndex(api.selectedScrollSnap());
    }, []);

    const scrollTo = useCallback((index: number) => {
        emblaApi?.scrollTo(index);
    }, [emblaApi]);


    useEffect(() => {
        if (!emblaApi) return;
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    if (isLoading) {
        return (
            <section id="showcase" className="py-12 md:py-16 w-full">
                <div className="flex flex-col items-center">
                    <Skeleton className="relative aspect-video w-full h-full rounded-lg border-2 border-dashed border-primary/50 p-2 max-w-4xl" />
                    <Skeleton className="mt-4 h-8 w-48 rounded-full" />
                </div>
            </section>
        );
    }

    if (!showcaseImages || showcaseImages.length === 0) {
        return null;
    }

    return (
        <section id="showcase" className="py-12 md:py-16 w-full">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex -ml-4">
                    {showcaseImages.map((image, index) => (
                        <div key={image.id || index} className="flex-[0_0_100%] pl-4">
                            <div className="flex flex-col items-center">
                                <div className="relative aspect-video w-full h-full overflow-hidden rounded-lg border-2 border-dashed border-primary/50 p-2 max-w-4xl mx-auto">
                                    <Image
                                        src={image.url}
                                        alt={image.alt}
                                        fill
                                        className="object-contain rounded-md"
                                    />
                                </div>
                                <div className="mt-4">
                                    <div className="bg-black/50 backdrop-blur-sm py-2 px-6 rounded-full border border-white/10">
                                        <p className="text-sm md:text-base font-bold text-white whitespace-nowrap">{image.alt}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-2 mt-6">
                {scrollSnaps.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={cn(
                            'w-3 h-3 rounded-full transition-all duration-300',
                            index === selectedIndex ? 'bg-primary scale-125' : 'bg-muted/50'
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
