'use client';

import Image from 'next/image';
import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/context/admin-context';
import { Button } from '../ui/button';
import { DatabaseZap } from 'lucide-react';

export default function ShowcaseSection() {
  const autoplay = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  
  const firestore = useFirestore();
  const { isAdmin } = useAdmin();
  const showcaseQuery = useMemoFirebase(() => firestore ? collection(firestore, 'showcase') : null, [firestore]);
  const { data: showcaseImages, isLoading } = useCollection(showcaseQuery);

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
                className="w-full relative min-h-[100px]"
            >
                <CarouselContent className="-ml-4">
                    {isLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
                           <div className="p-1">
                             <Skeleton className="w-full aspect-square rounded-lg bg-muted/50" />
                           </div>
                        </CarouselItem>
                      ))
                    ) : showcaseImages && showcaseImages.length > 0 ? (
                      showcaseImages?.map((image) => (
                          <CarouselItem key={image.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
                             <div className="p-1">
                              <div className="relative aspect-square w-full h-full overflow-hidden rounded-lg">
                                <Image
                                  src={image.url}
                                  alt={image.alt}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            </div>
                          </CarouselItem>
                      ))
                    ) : (
                       <CarouselItem className="basis-full">
                         <div className="text-center text-muted-foreground py-10">
                            <p>Showcase images are not available.</p>
                            {isAdmin && (
                                <div className="mt-4">
                                    <p className="mb-2">As an administrator, you can add them.</p>
                                    <Link href="/admin/seed-database">
                                        <Button variant="outline">
                                            <DatabaseZap className="mr-2 h-4 w-4"/>
                                            Seed Database
                                        </Button>
                                    </Link>
                                </div>
                            )}
                         </div>
                       </CarouselItem>
                    )}
                </CarouselContent>
            </Carousel>
        </div>
      </section>
    );
}
