
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Script from 'next/script';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useCurrency } from '@/context/currency-context';
import { Loader2 } from 'lucide-react';
import { createRazorpayOrder, applyPromoCode, recordPromoCodeRedemption } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useDemoUser } from '@/context/demo-user-context';
import type { User } from 'firebase/auth';
import Link from 'next/link';

const CONVERSION_RATE_USD_TO_INR = 83.5;

const getDemoUser = (): User => ({
  uid: 'demo_user',
  email: 'demo@devaura.labs',
  displayName: 'Demo User',
  photoURL: '',
  phoneNumber: '555-555-5555',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  providerId: 'demo',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => '',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
});

export default function CheckoutHardwarePage() {
  const params = useParams();
  const { id } = params;
  const firestore = useFirestore();
  const { currency } = useCurrency();
  const { user: realUser, isUserLoading } = useUser();
  const { toast } = useToast();
  const { isDemoMode, isLoading: isDemoLoading } = useDemoUser();
  
  const [user, setUser] = useState<User | null>(null);

  const [isPaying, setIsPaying] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState<{ codeId: string; discount: number } | null>(null);
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const hardwareRef = useMemoFirebase(() => firestore && id ? doc(firestore, 'hardware', id as string) : null, [firestore, id]);
  const { data: hardware, isLoading: isHardwareLoading } = useDoc(hardwareRef);

  useEffect(() => {
    if (isDemoLoading || isUserLoading) return;
    
    if (isDemoMode) {
      const demo = getDemoUser();
      setUser(demo);
    } else {
      setUser(realUser);
    }
    setAuthChecked(true);
  }, [isDemoMode, isDemoLoading, realUser, isUserLoading]);

  const getPriceInSelectedCurrency = (price: number) => {
    return currency === 'INR' ? price * CONVERSION_RATE_USD_TO_INR : price;
  };

  const formatPrice = (price: number) => {
    if (currency === 'INR') {
      return `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const originalPrice = hardware ? getPriceInSelectedCurrency(hardware.price) : 0;
  const discountAmount = originalPrice * (discount / 100);
  const finalPrice = originalPrice - discountAmount;

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim() || !user) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a code.' });
        return;
    }
    setIsApplyingCode(true);
    const result = await applyPromoCode(promoCode, user.uid);
    setIsApplyingCode(false);

    if (result.success && result.discount && result.codeId) {
        setDiscount(result.discount);
        setAppliedPromo({ codeId: result.codeId, discount: result.discount });
        toast({ title: 'Success!', description: result.message });
    } else {
        setDiscount(0);
        setAppliedPromo(null);
        toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const handlePayment = async () => {
    if (!hardware || !user || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Hardware, user, or database not found.' });
        return;
    }

    setIsPaying(true);

    const result = await createRazorpayOrder(finalPrice, currency);

    if (!result.success || !result.order) {
        toast({ variant: 'destructive', title: 'Payment Error', description: result.error });
        setIsPaying(false);
        return;
    }

    const order = result.order;

    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID_LIVE;

    if (!razorpayKeyId) {
        toast({ variant: 'destructive', title: 'Configuration Error', description: 'Razorpay Key ID is not set for the current mode.' });
        setIsPaying(false);
        return;
    }

    const options = {
      key: razorpayKeyId,
      amount: order.amount,
      currency: order.currency,
      name: 'DevAura Labs',
      description: `Payment for ${hardware.name}`,
      image: 'https://i.ibb.co/20tFWD4P/IMG-20251019-191415-1.png',
      order_id: order.id,
      handler: async function (response: any) {
        if (appliedPromo) {
           await recordPromoCodeRedemption(appliedPromo.codeId, user.uid);
        }
        
        toast({ title: 'Payment Successful!', description: `Your purchase of ${hardware.name} is confirmed.` });
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
        promoCode: appliedPromo ? promoCode : 'N/A',
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

  const isLoading = isHardwareLoading || !authChecked;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-12 w-12 animate-spin" /></div>;
  }

  if (!user) {
    notFound();
  }
  
  if (!hardware) {
    return <div className="flex h-screen items-center justify-center"><p>Hardware not found.</p></div>
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
            <Card className="glass-card overflow-hidden mb-8">
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
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Apply Promo Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter code" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={!!appliedPromo}
                    className="bg-background/50"
                  />
                  <Button onClick={handleApplyPromoCode} disabled={isApplyingCode || !!appliedPromo}>
                    {isApplyingCode ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Apply'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Confirm Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Price</span>
                  <span>{formatPrice(originalPrice)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="text-muted-foreground">Discount ({discount}%)</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}
                <Separator className="my-2 bg-white/10" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalPrice)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-center gap-4">
                <Button size="lg" className="w-full gradient-btn gradient-btn-1 relative" onClick={handlePayment} disabled={isPaying}>
                  {isPaying ? <Loader2 className="animate-spin" /> : `Pay ${formatPrice(finalPrice)}`}
                  {!isPaying && <RippleEffect />}
                </Button>
                <Link href="/refund-policy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    View our Refund Policy
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
