
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, TicketPercent, Copy, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type PromoCode = {
  id: string;
  code: string;
  discount: string;
  limit: number;
  isActive: boolean;
};

export default function PromoCodesPage() {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState('10');
  const [userLimit, setUserLimit] = useState('100');
  
  const [existingCodes, setExistingCodes] = useState<PromoCode[]>([]);
  const [codeToDelete, setCodeToDelete] = useState<PromoCode | null>(null);

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

    if (existingCodes.some(c => c.code === promoCode)) {
      toast({
        variant: 'destructive',
        title: 'Duplicate Code',
        description: 'This promo code already exists.',
      });
      return;
    }
    
    const newCode: PromoCode = {
      id: new Date().toISOString(),
      code: promoCode,
      discount: `${discount}%`,
      limit: parseInt(userLimit),
      isActive: true,
    };
    
    // In a real app, you'd save this to Firestore.
    setExistingCodes(prev => [newCode, ...prev]);
    
    toast({
      title: 'Promo Code Saved!',
      description: `Code "${promoCode}" with a ${discount}% discount has been saved.`,
    });

    // Reset generator fields
    setPromoCode('');
  };

  const handleToggleActive = (id: string) => {
    setExistingCodes(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const handleDeleteCode = () => {
    if (!codeToDelete) return;
    setExistingCodes(prev => prev.filter(c => c.id !== codeToDelete.id));
    toast({
      title: 'Code Deleted',
      description: `Promo code "${codeToDelete.code}" has been removed.`,
    });
    setCodeToDelete(null);
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
      
       <AlertDialog>
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Existing Promo Codes</CardTitle>
            <CardDescription>List of all created discount codes.</CardDescription>
          </CardHeader>
          <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage Limit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {existingCodes.length > 0 ? (
                    existingCodes.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono">{c.code}</TableCell>
                        <TableCell>{c.discount}</TableCell>
                        <TableCell>{c.limit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={c.isActive}
                              onCheckedChange={() => handleToggleActive(c.id)}
                            />
                            <Badge variant={c.isActive ? 'default' : 'destructive'}>
                              {c.isActive ? 'Active' : 'Disabled'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setCodeToDelete(c)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No promo codes have been created yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the promo code{' '}
              <strong className="font-mono">{codeToDelete?.code}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCodeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCode} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
