
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import { useCollection, useFirestore, addDocumentNonBlocking, useMemoFirebase, useDoc } from '@/firebase';
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';

export default function GeneralSettingsPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  // Showcase state
  const showcaseQuery = useMemoFirebase(() => firestore ? collection(firestore, 'showcase') : null, [firestore]);
  const { data: showcaseItems, isLoading: showcaseLoading } = useCollection(showcaseQuery);
  const [newShowcaseUrl, setNewShowcaseUrl] = useState('');
  const [newShowcaseAlt, setNewShowcaseAlt] = useState('');

  // Content state management
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'content') : null, [firestore]);
  const { data: contentData, isLoading: contentLoading } = useDoc(contentRef);
  
  const [websiteName, setWebsiteName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [termsContent, setTermsContent] = useState('');
  const [privacyContent, setPrivacyContent] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (contentData) {
      setWebsiteName(contentData.websiteName || 'DevAura Labs');
      setHeroTitle(contentData.heroTitle || 'Your Gateway to Digital Mastery.');
      setHeroSubtitle(contentData.heroSubtitle || 'Unlock your potential with expert-led courses in Cybersecurity, cutting-edge Skill Development programs, and professional Website Creation services to elevate your digital presence.');
      setTermsContent(contentData.termsContent || 'Enter your Terms of Service content here...');
      setPrivacyContent(contentData.privacyContent || 'Enter your Privacy Policy content here...');
      setContactEmail(contentData.contactEmail || 'support@devaura.labs');
      setContactPhone(contentData.contactPhone || '+1 (555) 123-4567');
      setContactAddress(contentData.contactAddress || '123 Tech Avenue, Silicon Valley, CA 94043');
      setTwitterUrl(contentData.twitterUrl || '#');
      setInstagramUrl(contentData.instagramUrl || '#');
      setWhatsappUrl(contentData.whatsappUrl || '#');
    }
  }, [contentData]);

  const handleSaveSettings = async () => {
    if (!firestore) return;
    setIsSaving(true);
    const dataToSave = {
      websiteName,
      heroTitle,
      heroSubtitle,
      termsContent,
      privacyContent,
      contactEmail,
      contactPhone,
      contactAddress,
      twitterUrl,
      instagramUrl,
      whatsappUrl,
    };
    try {
      await setDoc(contentRef, dataToSave, { merge: true });
      toast({
        title: 'Settings Saved!',
        description: 'Your website settings have been updated.',
      });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Error Saving',
        description: 'Could not save settings to the database.',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddShowcaseItem = async () => {
    if (!newShowcaseUrl || !newShowcaseAlt || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide both an image URL and a title.',
      });
      return;
    }
    try {
      await addDocumentNonBlocking(collection(firestore, 'showcase'), { url: newShowcaseUrl, alt: newShowcaseAlt });
      toast({
        title: 'Showcase Item Added!',
        description: 'The new item has been added to your showcase.',
      });
      setNewShowcaseUrl('');
      setNewShowcaseAlt('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add showcase item.',
      });
    }
  };

  const handleDeleteShowcaseItem = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'showcase', id));
      toast({
        title: 'Showcase Item Deleted!',
        description: 'The item has been removed from your showcase.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete showcase item.',
      });
    }
  };
  
  if (contentLoading) {
      return (
          <div className="flex justify-center items-center h-screen">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="space-y-8">
        <div className="flex items-center gap-4">
            <Link href="/admin">
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <h1 className="text-3xl font-bold">General Settings</h1>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Website Content</CardTitle>
            <CardDescription>
                Edit the main text content displayed across your website.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="website-name">Website Name</Label>
                <Input 
                    id="website-name"
                    value={websiteName}
                    onChange={(e) => setWebsiteName(e.target.value)}
                    className="bg-background/50"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="hero-title">Hero Section Title</Label>
                <Input 
                    id="hero-title"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="bg-background/50"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="hero-subtitle">Hero Section Subtitle</Label>
                <Textarea 
                    id="hero-subtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="bg-background/50 min-h-[120px]"
                />
            </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Contact Page & Footer</CardTitle>
            <CardDescription>
                Update contact information and social media links.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input 
                    id="contact-email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="bg-background/50"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input 
                    id="contact-phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="bg-background/50"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Textarea 
                    id="contact-address"
                    value={contactAddress}
                    onChange={(e) => setContactAddress(e.target.value)}
                    className="bg-background/50"
                />
            </div>
            <hr className="my-4 border-white/10" />
            <div className="space-y-2">
                <Label htmlFor="twitter-url">Twitter URL</Label>
                <Input 
                    id="twitter-url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    className="bg-background/50"
                    placeholder="https://twitter.com/yourprofile"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="instagram-url">Instagram URL</Label>
                <Input 
                    id="instagram-url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="bg-background/50"
                    placeholder="https://instagram.com/yourprofile"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="whatsapp-url">WhatsApp URL</Label>
                <Input 
                    id="whatsapp-url"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    className="bg-background/50"
                    placeholder="https://wa.me/yournumber"
                />
            </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Page Content</CardTitle>
            <CardDescription>
                Edit the content for your static pages like Terms of Service and Privacy Policy.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="terms-content">Terms of Service</Label>
                <Textarea 
                    id="terms-content"
                    value={termsContent}
                    onChange={(e) => setTermsContent(e.target.value)}
                    className="bg-background/50 min-h-[200px]"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="privacy-content">Privacy Policy</Label>
                <Textarea 
                    id="privacy-content"
                    value={privacyContent}
                    onChange={(e) => setPrivacyContent(e.target.value)}
                    className="bg-background/50 min-h-[200px]"
                />
            </div>
        </CardContent>
      </Card>

       <Card className="glass-card">
        <CardHeader>
          <CardTitle>Showcase Settings</CardTitle>
          <CardDescription>Manage the images displayed in the homepage showcase carousel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Current Showcase Items</Label>
            {showcaseLoading ? (
              <p>Loading showcase items...</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {showcaseItems?.map(item => (
                  <div key={item.id} className="relative group">
                    <Image src={item.url} alt={item.alt} width={150} height={150} className="rounded-md object-cover aspect-square" />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteShowcaseItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                     <p className="text-xs text-center mt-1 truncate" title={item.alt}>{item.alt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-4 pt-4 border-t border-white/10">
             <Label>Add New Showcase Item</Label>
             <div className="flex flex-col sm:flex-row gap-4">
                <Input 
                    placeholder="Image URL"
                    value={newShowcaseUrl}
                    onChange={(e) => setNewShowcaseUrl(e.target.value)}
                    className="bg-background/50 flex-1"
                />
                <Input 
                    placeholder="Image Title/Alt Text"
                    value={newShowcaseAlt}
                    onChange={(e) => setNewShowcaseAlt(e.target.value)}
                    className="bg-background/50 flex-1"
                />
             </div>
             <Button onClick={handleAddShowcaseItem} disabled={!newShowcaseUrl || !newShowcaseAlt}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="sticky bottom-4 z-10 text-center">
        <Button size="lg" onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save All Settings'}
        </Button>
      </div>

    </div>
  );
}
