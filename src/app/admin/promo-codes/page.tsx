
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, TicketPercent, Copy } from 'lucide-react';
import Link from 'next/link';

export default function PromoCodesPage() {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState('10');
  const [userLimit, setUserLimit] = useState('100');

  const generateCode = () => {
    const code = `DEVAURA${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setPromoCode(code);
  };

  const copyToClipboard = () => {
    if (!promoCode) return;
    navigator.clipboard.writeText(promoCode);
    toast({
      title: 'Copied!',
      description: `Promo code "${promoCode}" copied to clipboard.`,
    });
  };

  const handleSaveCode = () => {
    if (!promoCode) {
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please enter or generate a code first.',
        });
        return;
    }
    // In a real app, you'd save this to Firestore.
    console.log({
        code: promoCode,
        discount: `${discount}%`,
        limit: parseInt(userLimit),
    });
    toast({
        title: 'Promo Code Saved!',
        description: `Code "${promoCode}" with a ${discount}% discount and a limit of ${userLimit} users has been saved.`,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
            <TicketPercent /> Promo Codes
        </h1>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Promo Code Generator</CardTitle>
          <CardDescription>Create and manage discount codes for your customers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="discount-percentage">Discount Percentage (%)</Label>
              <Input
                id="discount-percentage"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="e.g., 15"
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-limit">Usage Limit</Label>
              <Input
                id="user-limit"
                type="number"
                value={userLimit}
                onChange={(e) => setUserLimit(e.target.value)}
                placeholder="e.g., 100"
                className="bg-background/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="promo-code">Promo Code</Label>
            <div className="flex gap-2">
              <Input
                id="promo-code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter custom code or generate"
                className="bg-background/50 font-mono text-lg"
              />
              <Button variant="outline" onClick={generateCode}>Generate</Button>
              <Button variant="outline" size="icon" onClick={copyToClipboard} disabled={!promoCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button onClick={handleSaveCode} className="gradient-btn gradient-btn-1 w-full" disabled={!promoCode}>
            Save Code
          </Button>

        </CardContent>
      </Card>
      
       <Card className="glass-card">
        <CardHeader>
          <CardTitle>Existing Promo Codes</CardTitle>
          <CardDescription>This is a placeholder for where existing codes would be listed and managed.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Feature coming soon.</p>
        </CardContent>
      </Card>

    </div>
  );
}
