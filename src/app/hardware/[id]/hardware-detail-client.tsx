
'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { useUser, useFirestore, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useCurrency } from '@/context/currency-context';

type Hardware = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
};

export default function HardwareDetailClient({ hardware }: { hardware: Hardware }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { getConvertedPrice } = useCurrency();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBuyNow = () => {
    if (!isMounted || !firestore) return;
    if (!user) {
      router.push(`/signup?next=/checkout/hardware/${hardware.id}`);
    } else {
      router.push(`/checkout/hardware/${hardware.id}`);
    }
  };

  const handleAddToCart = () => {
    if (!isMounted || !user || !firestore) {
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

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <div className="relative aspect-video rounded-2xl overflow-hidden glass-card mb-8">
            {hardware.imageUrl && (
              <Image
                src={hardware.imageUrl}
                alt={hardware.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{hardware.name}</h1>
          <p className="text-lg text-muted-foreground mb-8">{hardware.description}</p>
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
