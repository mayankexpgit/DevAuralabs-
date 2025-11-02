
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
import { addDocumentNonBlocking, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
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

const CONVERSION_RATE_USD_TO_INR = 83.5;

const formSchema = z.object({
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  level: z.string().min(1, { message: 'Level is required.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  whatYoullLearn: z.string().min(10, { message: 'Please provide at least one learning point.' }),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive({ message: 'Price must be a positive number.' })
  ),
  currency: z.enum(['USD', 'INR']),
  posterUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  startDate: z.date({ required_error: 'Start date is required.' }),
  endDate: z.date({ required_error: 'End date is required.' }),
  duration: z.string().min(1, { message: 'Course duration is required.' }),
}).refine(data => data.endDate > data.startDate, {
  message: "End date must be after start date.",
  path: ['endDate'],
});

export default function AddCoursePageForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [addedItemTitle, setAddedItemTitle] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      level: '',
      description: '',
      whatYoullLearn: '',
      price: '' as any,
      currency: 'INR',
      posterUrl: 'https://i.ibb.co/3p3j2fK/course-placeholder.jpg',
      duration: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    
    let priceInUSD = values.price;
    if (values.currency === 'INR') {
      priceInUSD = values.price / CONVERSION_RATE_USD_TO_INR;
    }

    const dataToSave = {
      ...values,
      price: priceInUSD,
      currency: 'USD', // Always store price in USD
    };
    
    const coursesCol = collection(firestore, 'courses');
    try {
      await addDocumentNonBlocking(coursesCol, dataToSave);
      setAddedItemTitle(values.title);
      setShowSuccessDialog(true);
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to add course.',
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Advanced Ethical Hacking Masterclass" {...field} className="bg-background/50"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
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
                    <Input type="number" placeholder="e.g., 299.99" {...field} className="bg-background/50"/>
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
              name="startDate"
              render={({ field }) => (
                  <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                      <PopoverTrigger asChild>
                      <FormControl>
                          <Button
                          variant={"outline"}
                          className={cn(
                              "w-full pl-3 text-left font-normal bg-background/50",
                              !field.value && "text-muted-foreground"
                          )}
                          >
                          {field.value ? (
                              format(field.value, "PPP")
                          ) : (
                              <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                      </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                      />
                      </PopoverContent>
                  </Popover>
                  <FormMessage />
                  </FormItem>
              )}
              />
              <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                  <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                      <PopoverTrigger asChild>
                      <FormControl>
                          <Button
                          variant={"outline"}
                          className={cn(
                              "w-full pl-3 text-left font-normal bg-background/50",
                              !field.value && "text-muted-foreground"
                          )}
                          >
                          {field.value ? (
                              format(field.value, "PPP")
                          ) : (
                              <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                      </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                      />
                      </PopoverContent>
                  </Popover>
                  <FormMessage />
                  </FormItem>
              )}
              />
          </div>

          <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Overall Course Duration</FormLabel>
                  <FormControl>
                      <Input placeholder="e.g., '40 hours'" {...field} className="bg-background/50"/>
                  </FormControl>
                  <FormDescription>
                      Enter the total duration of the course.
                  </FormDescription>
                  <FormMessage />
                  </FormItem>
              )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Course Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Provide a detailed description of the course content, what students will learn, and any prerequisites." {...field} className="bg-background/50 min-h-[150px]" rows={6}/>
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

          <FormField
            control={form.control}
            name="posterUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Poster URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.png" {...field} className="bg-background/50"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" size="lg" className="w-full gradient-btn gradient-btn-1 relative">
              Create Course
              <RippleEffect />
          </Button>
        </form>
      </Form>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Success!</AlertDialogTitle>
            <AlertDialogDescription>
              The course "{addedItemTitle}" has been successfully added.
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

    