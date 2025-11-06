
'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Loader2, ArrowLeft, Settings as SettingsIcon } from 'lucide-react';
import { RippleEffect } from '@/components/ui/ripple-effect';
import Link from 'next/link';

const settingsSchema = z.object({
  websiteName: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  contactEmail: z.string().email('Invalid email address.').or(z.literal('')),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  twitterUrl: z.string().url().or(z.literal('')),
  instagramUrl: z.string().url().or(z.literal('')),
  whatsappUrl: z.string().url().or(z.literal('')),
  termsContent: z.string().optional(),
  privacyContent: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'content') : null, [firestore]);
  const { data: contentData, isLoading } = useDoc(contentRef);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      websiteName: 'DevAura Labs',
      heroTitle: 'Your Gateway to Digital Mastery.',
      heroSubtitle: 'Unlock your potential with expert-led courses in Cybersecurity, cutting-edge Skill Development programs, and professional Website Creation services to elevate your digital presence.',
      contactEmail: '',
      contactPhone: '',
      contactAddress: '',
      twitterUrl: '',
      instagramUrl: '',
      whatsappUrl: '',
      termsContent: '',
      privacyContent: '',
    }
  });

  useEffect(() => {
    if (contentData) {
      // Merge fetched data with defaults, giving precedence to fetched data
      const newDefaults = {
        ...form.getValues(), // Start with existing defaults
        ...contentData       // Overwrite with any fields from Firestore
      };
      form.reset(newDefaults);
    }
  }, [contentData, form]);

  const onSubmit = async (values: SettingsFormValues) => {
    if (!firestore) return;
    try {
      await setDoc(doc(firestore, 'settings', 'content'), values, { merge: true });
      toast({
        title: 'Settings Saved!',
        description: 'Your platform settings have been updated.',
      });
    } catch (error) {
      console.error("Error saving settings: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Link href="/admin">
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-2"><SettingsIcon /> General Settings</h1>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Platform Configuration</CardTitle>
            <CardDescription>Manage the core content and contact details for your website.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  <div className="space-y-4 p-4 border rounded-lg border-white/10">
                    <h3 className="font-semibold text-lg">Branding & Hero</h3>
                    <FormField
                      control={form.control}
                      name="websiteName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website Name</FormLabel>
                          <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heroTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Title</FormLabel>
                          <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="heroSubtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hero Subtitle</FormLabel>
                          <FormControl><Textarea {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 p-4 border rounded-lg border-white/10">
                    <h3 className="font-semibold text-lg">Contact & Socials</h3>
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="twitterUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter URL</FormLabel>
                          <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instagramUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram URL</FormLabel>
                          <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="whatsappUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp URL</FormLabel>
                          <FormControl><Input {...field} className="bg-background/50" /></FormControl>
                           <FormDescription>e.g., https://wa.me/911234567890</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4 p-4 border rounded-lg border-white/10">
                    <h3 className="font-semibold text-lg">Legal Content</h3>
                     <FormField
                      control={form.control}
                      name="termsContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terms of Service</FormLabel>
                          <FormControl><Textarea {...field} className="bg-background/50 h-40" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="privacyContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Privacy Policy</FormLabel>
                          <FormControl><Textarea {...field} className="bg-background/50 h-40" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full gradient-btn gradient-btn-1 relative" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Settings'}
                    {!form.formState.isSubmitting && <RippleEffect />}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    