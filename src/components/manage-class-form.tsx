
'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDoc, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { RippleEffect } from './ui/ripple-effect';
import { Separator } from './ui/separator';
import { useEffect } from 'react';

const formSchema = z.object({
  liveClassUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  liveClassTime: z.date().optional(),
  recordedVideos: z.array(z.object({
    title: z.string().min(1, { message: 'Title cannot be empty.' }),
    url: z.string().url({ message: 'Please enter a valid URL.' }),
  })).optional(),
});

type ManageClassFormProps = {
  content: { id: string; title: string; };
  collectionName: 'courses' | 'skills';
};

export default function ManageClassForm({ content, collectionName }: ManageClassFormProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      liveClassUrl: '',
      liveClassTime: undefined,
      recordedVideos: [{ title: '', url: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'recordedVideos',
  });

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!firestore) return;
      const classDetailsRef = doc(firestore, collectionName, content.id, 'classDetails', 'details');
      const classDetailsSnap = await getDoc(classDetailsRef);
      if (classDetailsSnap.exists()) {
        const data = classDetailsSnap.data();
        form.reset({
          liveClassUrl: data.liveClassUrl || '',
          liveClassTime: data.liveClassTime?.toDate(),
          recordedVideos: data.recordedVideos && data.recordedVideos.length > 0 ? data.recordedVideos : [{ title: '', url: '' }],
        });
      }
    };
    fetchClassDetails();
  }, [firestore, collectionName, content.id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) return;
    const classDetailsRef = doc(firestore, collectionName, content.id, 'classDetails', 'details');
    try {
      await setDoc(classDetailsRef, values, { merge: true });
      toast({
        title: 'Success!',
        description: `Class details for "${content.title}" have been updated.`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update class details.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 bg-background/30 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold mb-4">Live Class Details</h3>
          <div className="space-y-4">
             <FormField
                control={form.control}
                name="liveClassTime"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Live Class Start Time</FormLabel>
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
                                format(field.value, "PPP p")
                            ) : (
                                <span>Pick a date and time</span>
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
                        <input
                            type="time"
                            className="w-full p-2 border-t bg-background text-foreground"
                            value={field.value ? format(field.value, 'HH:mm') : ''}
                            onChange={(e) => {
                                const newTime = e.target.value.split(':');
                                const newDate = field.value ? new Date(field.value) : new Date();
                                newDate.setHours(parseInt(newTime[0]), parseInt(newTime[1]));
                                field.onChange(newDate);
                            }}
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
              control={form.control}
              name="liveClassUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Class URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://meet.google.com/..." {...field} className="bg-background/50"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator className="my-6 bg-white/10" />

        <div>
            <h3 className="text-lg font-semibold mb-4">Recorded Videos</h3>
            <div className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-md border-white/10 relative">
                    <FormField
                    control={form.control}
                    name={`recordedVideos.${index}.title`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Recording Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Week 1 - Introduction" {...field} className="bg-background/50"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name={`recordedVideos.${index}.url`}
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Recording URL</FormLabel>
                        <FormControl>
                            <Input placeholder="https://youtube.com/watch?v=..." {...field} className="bg-background/50"/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-3 -right-3 h-7 w-7"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-4 text-primary"
              onClick={() => append({ title: '', url: '' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Recording
            </Button>
        </div>
        
        <Button type="submit" size="lg" className="w-full gradient-btn gradient-btn-1 relative">
            Save Class Details
            <RippleEffect />
        </Button>
      </form>
    </Form>
  );
}
