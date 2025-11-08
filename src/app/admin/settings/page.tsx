
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
  returnRefundPolicyContent: z.string().optional(),
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
      termsContent: `
# Terms of Service for DevAura Labs

**Last Updated: [Date]**

Welcome to DevAura Labs! These terms and conditions outline the rules and regulations for the use of our website and services.

## 1. Introduction
By accessing this website, we assume you accept these terms and conditions. Do not continue to use DevAura Labs if you do not agree to all of the terms and conditions stated on this page.

## 2. Intellectual Property Rights
Other than the content you own, under these Terms, DevAura Labs and/or its licensors own all the intellectual property rights and materials contained in this Website. You are granted a limited license only for purposes of viewing the material contained on this website.

## 3. User Accounts
When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.

## 4. Purchases
If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.

## 5. Termination
We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

## 6. Governing Law
These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.

## 7. Changes to Terms
We reserve the right, at our sole discretion, to modify or replace these Terms at any time.

## 8. Contact Us
If you have any questions about these Terms, please contact us at [Your Contact Email].
`,
      privacyContent: `
# Privacy Policy for DevAura Labs

**Last Updated: [Date]**

DevAura Labs ("us", "we", or "our") operates the [Your Website URL] website (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service.

## 1. Information Collection and Use
We collect several different types of information for various purposes to provide and improve our Service to you.

### Types of Data Collected
* **Personal Data:** While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to: Email address, First name and last name, Phone number, Cookies and Usage Data.
* **Usage Data:** We may also collect information on how the Service is accessed and used ("Usage Data").

## 2. Use of Data
DevAura Labs uses the collected data for various purposes:
* To provide and maintain the Service
* To notify you about changes to our Service
* To provide customer care and support
* To provide analysis or valuable information so that we can improve the Service

## 3. Data Security
The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.

## 4. Your Data Protection Rights
You have certain data protection rights. DevAura Labs aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.

## 5. Changes to This Privacy Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

## 6. Contact Us
If you have any questions about this Privacy Policy, please contact us.
`,
      returnRefundPolicyContent: `
# Return & Refund Policy for DevAura Labs

**Last Updated: [Date]**

Thank you for shopping at DevAura Labs. We appreciate the fact that you like to buy the stuff we build. We also want to make sure you have a rewarding experience while you’re exploring, evaluating, and purchasing our products.

## Digital Products (Courses & Skill Programs)
We offer a **3-Day Money-Back Guarantee** on all our digital courses and skill development programs.

### Eligibility for a Refund:
* You are eligible for a full refund if you request it within **3 days** of the purchase date.
* To be eligible, you must not have completed more than **20%** of the course content.
* Refund requests must be submitted to our support team via email.

### How to Request a Refund:
Please contact our support team at [Your Support Email] with your purchase details and the reason for your request. We will process your request within 5-7 business days.

## Hardware Products
Due to the nature of custom-built hardware, all sales of physical products are final once the product has been shipped. If you receive a damaged or defective product, please contact us within 48 hours of delivery to arrange for a repair or replacement.

## Contact Us
If you have any questions about our Returns and Refunds Policy, please contact us.
`,
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
                     <FormField
                      control={form.control}
                      name="returnRefundPolicyContent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Return & Refund Policy</FormLabel>
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
