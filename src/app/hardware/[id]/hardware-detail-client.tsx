
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, addDocumentNonBlocking } from '@/firebase';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useCurrency } from '@/context/currency-context';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useDemoUser } from '@/context/demo-user-context';

type Hardware = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  videoUrl?: string;
  category: string;
  stock: number;
};

// Helper to convert YouTube URL to embeddable URL
const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length == 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
}

export default function HardwareDetailClient({ hardware }: { hardware: Hardware }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { getConvertedPrice } = useCurrency();
  const { isDemoMode } = useDemoUser();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBuyNow = () => {
    if (!isMounted || !firestore) return;
    if (!user && !isDemoMode) {
      router.push(`/signup?next=/checkout/hardware/${hardware.id}`);
    } else {
      router.push(`/checkout/hardware/${hardware.id}`);
    }
  };

  const handleAddToCart = () => {
     if (!isMounted || !firestore) return;
    if (!user) {
        if(isDemoMode) {
             toast({
                variant: 'destructive',
                title: 'Action Not Available',
                description: 'Adding to cart is disabled in demo mode. Please proceed with "Buy Now" to test the payment flow.',
            });
            return;
        }
      router.push(`/signup?next=/hardware/${hardware.id}`);
      return;
    }
    
    const cartRef = collection(firestore, 'users', user.uid, 'cart');
    addDocumentNonBlocking(cartRef, {
        ...hardware,
        quantity: 1,
        addedAt: serverTimestamp(),
    });

    toast({
      title: 'Added to Cart',
      description: `${hardware.name} has been added to your shopping cart.`,
      action: (
        <Button variant="ghost" size="sm" onClick={() => router.push('/cart')}>
          View Cart
        </Button>
      ),
    });
  };

  const videoEmbedUrl = hardware.videoUrl ? getYouTubeEmbedUrl(hardware.videoUrl) : null;

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <Carousel className="rounded-2xl overflow-hidden glass-card mb-8">
            <CarouselContent>
              {hardware.imageUrls?.map((url, index) => (
                <CarouselItem key={index}>
                  <div className="relative aspect-video">
                    <Image
                      src={url}
                      alt={`${hardware.name} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4" />
            <CarouselNext className="absolute right-4" />
          </Carousel>
          
          <h1 className="text-4xl font-bold mb-4">{hardware.name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{hardware.description}</p>
          
          {videoEmbedUrl && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Product Video</h2>
                <Card className="glass-card">
                    <CardContent className="p-2">
                        <div className="aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={videoEmbedUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-lg"
                            ></iframe>
                        </div>
                    </CardContent>
                </Card>
              </div>
          )}

        </div>
        <div className="lg:col-span-2">
            <div className="glass-card p-8 sticky top-24">
                <div className="flex items-baseline gap-2 mb-6">
                    <p className="text-3xl font-bold text-primary">{getConvertedPrice(hardware.price)}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {hardware.stock > 0 ? `In Stock: ${hardware.stock} units available.` : 'Out of Stock'}
                </p>
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full gradient-btn gradient-btn-1 relative" onClick={handleBuyNow} disabled={hardware.stock === 0}>
                        Buy Now
                        <RippleEffect />
                    </Button>
                    <Button size="lg" variant="outline" className="w-full relative" onClick={handleAddToCart} disabled={hardware.stock === 0}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                    </Button>
                </div>
                <div className="mt-8 text-xs text-center text-muted-foreground">
                    Secure checkout. Standard warranty included.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

    