
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/context/currency-context";

export default function HardwarePage() {
  const firestore = useFirestore();
  const hardwareQuery = useMemoFirebase(() => firestore ? collection(firestore, 'hardware') : null, [firestore]);
  const { data: hardwareItems, isLoading } = useCollection(hardwareQuery);
  const { getConvertedPrice } = useCurrency();

  return (
    <div className="container mx-auto py-20 px-4">
      <div className="text-center mb-12">
        <Cpu className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Hardware Store</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of high-performance hardware, from custom PCs to essential components.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          [1, 2, 3].map((item) => (
            <Card key={item} className="glass-card">
              <CardHeader>
                <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Cpu className="w-24 h-24 text-muted-foreground" />
                </div>
                <CardTitle>Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Please wait while we load our products.
                </CardDescription>
              </CardContent>
            </Card>
          ))
        ) : hardwareItems && hardwareItems.length > 0 ? (
          hardwareItems.map((item) => (
            <Link href={`/hardware/${item.id}`} key={item.id} className="block">
              <Card className="glass-card h-full flex flex-col">
                <CardHeader>
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardTitle className="pt-4">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow">
                  <CardDescription className="flex-grow">
                    {item.description}
                  </CardDescription>
                  <div className="flex justify-between items-center mt-4">
                     <p className="text-lg font-bold text-primary">{getConvertedPrice(item.price)}</p>
                     <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
           <div className="text-center col-span-full py-16">
            <p className="text-muted-foreground">No hardware products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
