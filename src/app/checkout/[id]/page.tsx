
'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RippleEffect } from '@/components/ui/ripple-effect';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useCurrency } from '@/context/currency-context';

export default function CheckoutPage() {
  const params = useParams();
  const { id } = params;
  const firestore = useFirestore();
  const { getConvertedPrice } = useCurrency();

  const courseRef = useMemoFirebase(() => firestore ? doc(firestore, 'courses', id as string) : null, [firestore, id]);
  const { data: course, isLoading } = useDoc(courseRef);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Complete Your Purchase</h1>
        <p className="text-lg text-muted-foreground mt-2">You are one step away from mastering new skills.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <Card className="glass-card overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-video">
                {course.posterUrl && (
                  <Image
                    src={course.posterUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold">{course.title}</h2>
              <p className="text-muted-foreground mt-2">{course.description}</p>
              <Separator className="my-4 bg-white/10" />
              <div className="flex justify-between items-center font-bold">
                <span className="text-muted-foreground">Price</span>
                <span className="text-primary text-xl">{getConvertedPrice(course.price)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="**** **** **** ****" className="bg-background/50" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" className="bg-background/50" />
                </div>
              </div>
               <div className="space-y-2">
                <Label htmlFor="coupon">Promo Code (Optional)</Label>
                <div className="flex gap-2">
                    <Input id="coupon" placeholder="ENTERCODE" className="bg-background/50" />
                    <Button variant="outline">Apply</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full gradient-btn gradient-btn-1 relative">
                Pay {getConvertedPrice(course.price)}
                <RippleEffect />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
