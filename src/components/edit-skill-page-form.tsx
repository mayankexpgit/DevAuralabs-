
'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { icons } from '@/lib/data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RippleEffect } from './ui/ripple-effect';
import Link from 'next/link';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/context/currency-context';

const CONVERSION_RATE_USD_TO_INR = 83.5;

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  whatYoullLearn: z.string().min(10, { message: 'Please provide at least one learning point.' }),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: 'Price must be a positive number.' })
  ),
  currency: z.enum(['USD', 'INR']),
  icon: z.string().min(1, { message: 'Icon is required.' }),
  posterUrl: z.string().url({ message: 'Please enter a valid URL.' }),
});

export default function EditSkillPageForm({ skill }: { skill: Partial<z.infer<typeof formSchema>> & { id: string, price: number }}) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [updatedItemTitle, setUpdatedItemTitle] = useState('');
  const { currency } = useCurrency();

  const priceInSelectedCurrency = currency === 'INR' ? skill.price * CONVERSION_RATE_USD_TO_INR : skill.price;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: skill.title || '',
      description: skill.description || '',
      whatYoullLearn: skill.whatYoullLearn || '',
      price: priceInSelectedCurrency,
      currency: currency || 'INR',
      icon: skill.icon || '',
      posterUrl: skill.posterUrl || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    
    let priceInUSD = values.price;
    if (values.currency === 'INR') {
        priceInUSD = values.price / CONVERSION_RATE_USD_TO_INR;
    }

    const dataToUpdate = {
      ...values,
      price: priceInUSD,
      currency: 'USD', // Always store price in USD
    };
    
    const skillRef = doc(firestore, 'skills', skill.id);
    try {
      await updateDoc(skillRef, dataToUpdate);
      setUpdatedItemTitle(values.title);
      setShowSuccessDialog(true);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update skill.',
      });
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    router.push('/admin/content');
  };
  
  const iconNames = Object.keys(icons);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Full-Stack Development" {...field} className="bg-background/50"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe the skill program..." {...field} className="bg-background/50 min-h-[150px]"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="whatYoullLearn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What You'll Learn</FormLabel>
                <FormControl>
                  <Textarea placeholder="List the key takeaways and skills students will gain." {...field} className="bg-background/50 min-h-[150px]" rows={6}/>
                </FormControl>
                 <FormDescription>
                      Enter one learning point per line.
                  </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="499.99" {...field} className="bg-background/50"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger className="bg-background/50">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>


          <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                      <SelectTrigger className="bg-background/50">
                          <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      {iconNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
                      </SelectContent>
                  </Select>
                  <FormMessage />
                  </FormItem>
              )}
          />
          
          <FormField
            control={form.control}
            name="posterUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skill Poster URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.png" {...field} className="bg-background/50"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1 gradient-btn gradient-btn-1 relative">
                  Update Skill Program
                  <RippleEffect />
              </Button>
              <Link href="/admin/content" className="flex-1">
                  <Button type="button" variant="outline" size="lg" className="w-full">
                      Cancel
                  </Button>
              </Link>
          </div>
        </form>
      </Form>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              The skill program "{updatedItemTitle}" has been successfully updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSuccessDialogClose}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    