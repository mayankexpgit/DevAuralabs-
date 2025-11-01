
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function GeneralSettingsPage() {
  const { toast } = useToast();

  // Content state
  const [websiteName, setWebsiteName] = useState('DevAura Labs');
  const [heroTitle, setHeroTitle] = useState('Your Gateway to Digital Mastery.');
  const [heroSubtitle, setHeroSubtitle] = useState('Unlock your potential with expert-led courses in Cybersecurity, cutting-edge Skill Development programs, and professional Website Creation services to elevate your digital presence.');
  
  // Page Content State
  const [termsContent, setTermsContent] = useState('Enter your Terms of Service content here...');
  const [privacyContent, setPrivacyContent] = useState('Enter your Privacy Policy content here...');
  const [contactInfo, setContactInfo] = useState({
    email: 'support@devaura.labs',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Avenue, Silicon Valley, CA 94043'
  });

  // Social Links State
  const [twitterUrl, setTwitterUrl] = useState('#');
  const [instagramUrl, setInstagramUrl] = useState('#');
  const [whatsappUrl, setWhatsappUrl] = useState('#');

  const handleSaveContent = () => {
    // In a real app, you'd save these values to your database.
    console.log({ websiteName, heroTitle, heroSubtitle, termsContent, privacyContent, contactInfo });
    toast({
      title: 'Content Saved!',
      description: 'Your website content has been updated.',
    });
  };

  const handleSaveSocialLinks = () => {
    console.log({ twitterUrl, instagramUrl, whatsappUrl });
    toast({
        title: 'Links Saved!',
        description: 'Your social links have been updated.',
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
            <Button onClick={handleSaveContent}>Save Website Content</Button>
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
            <Button onClick={handleSaveContent}>Save Page Content</Button>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Contact Page Settings</CardTitle>
            <CardDescription>
                Update the contact information displayed on the "Contact Us" page.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input 
                    id="contact-email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({...prev, email: e.target.value}))}
                    className="bg-background/50"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="contact-phone">Contact Phone</Label>
                <Input 
                    id="contact-phone"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo(prev => ({...prev, phone: e.target.value}))}
                    className="bg-background/50"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Textarea 
                    id="contact-address"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo(prev => ({...prev, address: e.target.value}))}
                    className="bg-background/50"
                />
            </div>
            <Button onClick={handleSaveContent}>Save Contact Info</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
            <CardDescription>
                Edit the URLs for your social media profiles.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <Button onClick={handleSaveSocialLinks}>Save Social Links</Button>
        </CardContent>
      </Card>

    </div>
  );
}
