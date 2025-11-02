
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useCurrency } from '@/context/currency-context';
import { Loader2 } from 'lucide-react';
import { createRazorpayOrder } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const CONVERSION_RATE_USD_TO_INR = 83.5;

export default function CheckoutHardwarePage() {
  const params = useParams();
  const { id } = params;
  const firestore = useFirestore();
  const { currency, getConvertedPrice } = useCurrency();
  const { user } = useUser();
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);

  const hardwareRef = useMemoFirebase(() => firestore && id ? doc(firestore, 'hardware', id as string) : null, [firestore, id]);
  const { data: hardware, isLoading } = useDoc(hardwareRef);

  const handlePayment = async () => {
    if (!hardware || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Hardware or user not found.' });
        return;
    }

    setIsPaying(true);

    const priceInSelectedCurrency = currency === 'INR' ? hardware.price * CONVERSION_RATE_USD_TO_INR : hardware.price;
    const result = await createRazorpayOrder(priceInSelectedCurrency, currency);

    if (!result.success || !result.order) {
        toast({ variant: 'destructive', title: 'Payment Error', description: result.error });
        setIsPaying(false);
        return;
    }

    const order = result.order;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RaqA9IeXeTgp3S',
      amount: order.amount,
      currency: order.currency,
      name: 'DevAura Labs',
      description: `Payment for ${hardware.name}`,
      image: 'https://i.ibb.co/20tFWD4P/IMG-20251019-191415-1.png',
      order_id: order.id,
      handler: function (response: any) {
        toast({ title: 'Payment Successful!', description: `Payment ID: ${response.razorpay_payment_id}` });
        setIsPaying(false);
      },
      prefill: {
        name: user.displayName || '',
        email: user.email || '',
        contact: user.phoneNumber || '',
      },
      notes: {
        hardwareId: hardware.id,
        userId: user.uid,
      },
      theme: {
        color: '#5222d0',
      },
      modal: {
          ondismiss: function() {
              setIsPaying(false);
              toast({ variant: 'destructive', title: 'Payment Cancelled', description: 'The payment was not completed.' });
          }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (!hardware) {
    notFound();
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Complete Your Purchase</h1>
          <p className="text-lg text-muted-foreground mt-2">You are one step away from owning this new hardware.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <Card className="glass-card overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                  {hardware.imageUrls && hardware.imageUrls.length > 0 && (
                    <Image
                      src={hardware.imageUrls[0]}
                      alt={hardware.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold">{hardware.name}</h2>
                <p className="text-muted-foreground mt-2">{hardware.description}</p>
                <Separator className="my-4 bg-white/10" />
                <div className="flex justify-between items-center font-bold">
                  <span className="text-muted-foreground">Price</span>
                  <span className="text-primary text-xl">{getConvertedPrice(hardware.price)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Confirm Order</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You are about to purchase the product: <span className="font-bold text-foreground">"{hardware.name}"</span>. Click the button below to proceed to payment.</p>
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full gradient-btn gradient-btn-1 relative" onClick={handlePayment} disabled={isPaying}>
                  {isPaying ? <Loader2 className="animate-spin" /> : `Pay ${getConvertedPrice(hardware.price)}`}
                  {!isPaying && <RippleEffect />}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
