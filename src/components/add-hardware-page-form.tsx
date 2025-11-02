
'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RippleEffect } from './ui/ripple-effect';
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
import { PlusCircle, Trash2 } from 'lucide-react';
import { Separator } from './ui/separator';

const CONVERSION_RATE_USD_TO_INR = 83.5;

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: 'Price must be a positive number.' })
  ),
  currency: z.enum(['USD', 'INR']),
  stock: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().nonnegative({ message: 'Stock must be a non-negative number.' })
  ),
  imageUrls: z.array(z.object({ value: z.string().url({ message: 'Please enter a valid URL.' }) })).min(1, 'At least one image URL is required.'),
  videoUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  category: z.string().min(1, { message: 'Category is required.' }),
});

export default function AddHardwarePageForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [addedItemTitle, setAddedItemTitle] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '' as any,
      currency: 'INR',
      stock: '' as any,
      imageUrls: [{ value: '' }],
      videoUrl: '',
      category: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "imageUrls"
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;

    let priceInUSD = values.price;
    if (values.currency === 'INR') {
        priceInUSD = values.price / CONVERSION_RATE_USD_TO_INR;
    }

    const hardwareCol = collection(firestore, 'hardware');
    try {
      const dataToSave = {
        ...values,
        price: priceInUSD,
        currency: 'USD',
        imageUrls: values.imageUrls.map(item => item.value),
      };
      await addDocumentNonBlocking(hardwareCol, dataToSave);
      setAddedItemTitle(values.name);
      setShowSuccessDialog(true);
      form.reset();
      // @ts-ignore
      form.setValue('imageUrls', [{ value: '' }]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add hardware.',
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., DevAura Custom PC" {...field} className="bg-background/50"/>
                </FormControl>
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
                    <Input type="number" placeholder="e.g., 1299.99" {...field} className="bg-background/50"/>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50" {...field} className="bg-background/50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Custom PC, Component" {...field} className="bg-background/50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Provide a detailed description of the hardware." {...field} className="bg-background/50 min-h-[150px]" rows={6}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
              <FormLabel>Product Image URLs</FormLabel>
              <FormDescription className="mb-4">Add one or more URLs for product images.</FormDescription>
              <div className="space-y-4">
                  {fields.map((field, index) => (
                      <FormField
                          key={field.id}
                          control={form.control}
                          name={`imageUrls.${index}.value`}
                          render={({ field }) => (
                              <FormItem>
                                  <div className="flex items-center gap-2">
                                      <FormControl>
                                          <Input placeholder="https://example.com/image.png" {...field} className="bg-background/50" />
                                      </FormControl>
                                      {fields.length > 1 && (
                                          <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                              <Trash2 className="h-4 w-4" />
                                          </Button>
                                      )}
                                  </div>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  ))}
              </div>
              <Button type="button" variant="ghost" size="sm" className="mt-2 text-primary" onClick={() => append({ value: '' })}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Another Image
              </Button>
          </div>

          <Separator className="my-6 bg-white/10" />

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Review Video URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/watch?v=..." {...field} className="bg-background/50"/>
                </FormControl>
                <FormDescription>Provide a link to a YouTube, Vimeo, or other video review.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" size="lg" className="w-full gradient-btn gradient-btn-1 relative">
              Add Product
              <RippleEffect />
          </Button>
        </form>
      </Form>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              The product "{addedItemTitle}" has been successfully added.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    