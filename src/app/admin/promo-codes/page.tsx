
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, TicketPercent, Copy, Trash2, Users, Loader2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { addDocumentNonBlocking, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, deleteDoc, doc, updateDoc, setDoc, query, where } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

type PromoCode = {
  id: string;
  code: string;
  discount: number;
  limit: number;
  isActive: boolean;
  createdAt: any;
};

type Redemption = {
  id: string;
  userId: string;
  redemptionDate: any;
};

function RedeemedUsersList({ promoCodeId }: { promoCodeId: string }) {
  const firestore = useFirestore();
  const redemptionsQuery = useMemoFirebase(
    () => firestore ? collection(firestore, `promo_codes/${promoCodeId}/redemptions`) : null,
    [firestore, promoCodeId]
  );
  const { data: redemptions, isLoading: redemptionsLoading } = useCollection<Redemption>(redemptionsQuery);

  const userIds = redemptions?.map(r => r.userId) || [];
  const usersQuery = useMemoFirebase(
    () => firestore && userIds.length > 0 ? query(collection(firestore, 'users'), where('__name__', 'in', userIds)) : null,
    [firestore, userIds]
  );
  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  const isLoading = redemptionsLoading || usersLoading;

  return (
    <div className="max-h-96 overflow-y-auto">
      {isLoading && <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>}
      {!isLoading && users && redemptions && users.length > 0 ? (
        <ul className="space-y-4">
          {users.map(user => {
            const redemption = redemptions.find(r => r.userId === user.id);
            return (
              <li key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {redemption?.redemptionDate ? formatDistanceToNow(redemption.redemptionDate.toDate(), { addSuffix: true }) : ''}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        !isLoading && <p className="text-center text-muted-foreground py-8">No one has redeemed this code yet.</p>
      )}
    </div>
  );
}

export default function PromoCodesPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState('10');
  const [userLimit, setUserLimit] = useState('100');
  
  const promoCodesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'promo_codes') : null, [firestore]);
  const { data: existingCodes, isLoading: codesLoading } = useCollection<PromoCode>(promoCodesQuery);

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

  const handleSaveCode = async () => {
    if (!promoCode || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter or generate a code first.' });
      return;
    }

    if (existingCodes?.some(c => c.code === promoCode)) {
      toast({ variant: 'destructive', title: 'Duplicate Code', description: 'This promo code already exists.' });
      return;
    }
    
    const newCode = {
      code: promoCode,
      discount: parseInt(discount),
      limit: parseInt(userLimit),
      isActive: true,
      createdAt: serverTimestamp(),
    };
    
    try {
      await addDocumentNonBlocking(collection(firestore, 'promo_codes'), newCode);
      toast({
        title: 'Promo Code Saved!',
        description: `Code "${promoCode}" with a ${discount}% discount has been saved.`,
      });
      setPromoCode('');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save promo code.' });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    if (!firestore) return;
    const codeRef = doc(firestore, 'promo_codes', id);
    try {
      await updateDoc(codeRef, { isActive: !currentStatus });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update code status.' });
    }
  };

  const handleDeleteCode = async () => {
    if (!codeToDelete || !firestore) return;
    try {
      await deleteDoc(doc(firestore, 'promo_codes', codeToDelete.id));
      toast({
        title: 'Code Deleted',
        description: `Promo code "${codeToDelete.code}" has been removed.`,
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete code.' });
    } finally {
      setCodeToDelete(null);
    }
  };

  // This is a temporary function to simulate a user redeeming a code.
  const simulateRedemption = async (promoCodeId: string) => {
    if (!firestore) return;
    // In a real app, you would use the actual logged-in user's ID.
    const mockUserId = 'mock_user_' + Math.random().toString(36).substr(2, 5);
    const mockUserDisplayName = 'Demo User ' + Math.random().toString(36).substr(2, 3);
    const mockUserEmail = `${mockUserId}@example.com`;
    
    const redemptionRef = doc(firestore, `promo_codes/${promoCodeId}/redemptions`, mockUserId);
    const userRef = doc(firestore, 'users', mockUserId);
    
    try {
      // Create a mock user for demonstration
      await setDoc(userRef, {
        displayName: mockUserDisplayName,
        email: mockUserEmail,
        photoURL: `https://api.pravatar.cc/150?u=${mockUserId}`
      });

      await setDoc(redemptionRef, {
        userId: mockUserId,
        redemptionDate: serverTimestamp(),
      });
      toast({ title: 'Simulated Redemption', description: `A demo user redeemed the code.` });
    } catch (error) {
       toast({ variant: 'destructive', title: 'Error', description: 'Failed to simulate redemption.' });
    }
  }

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
                    <TableHead>Redeemed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codesLoading ? (
                     <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : existingCodes && existingCodes.length > 0 ? (
                    existingCodes.map(c => (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono">{c.code}</TableCell>
                        <TableCell>{c.discount}%</TableCell>
                        <TableCell>{c.limit}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                               <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-primary">
                                <Users className="h-4 w-4" /> 
                                View
                               </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Redeemed By</DialogTitle>
                                <DialogDescription>Users who have redeemed the code <strong className="font-mono">{c.code}</strong>.</DialogDescription>
                              </DialogHeader>
                              <RedeemedUsersList promoCodeId={c.id} />
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={c.isActive}
                              onCheckedChange={() => handleToggleActive(c.id, c.isActive)}
                            />
                            <Badge variant={c.isActive ? 'default' : 'destructive'}>
                              {c.isActive ? 'Active' : 'Disabled'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => simulateRedemption(c.id)}>Simulate Use</Button>
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
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
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

    