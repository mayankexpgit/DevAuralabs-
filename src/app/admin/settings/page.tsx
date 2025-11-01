
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

export default function GeneralSettingsPage() {
  const { toast } = useToast();

  // Content state
  const [websiteName, setWebsiteName] = useState('DevAura Labs');
  const [heroTitle, setHeroTitle] = useState('Your Gateway to Digital Mastery.');
  const [heroSubtitle, setHeroSubtitle] = useState('Unlock your potential with expert-led courses in Cybersecurity, cutting-edge Skill Development programs, and professional Website Creation services to elevate your digital presence.');
  
  // Footer Links State
  const [termsUrl, setTermsUrl] = useState('#');
  const [privacyUrl, setPrivacyUrl] = useState('#');
  const [contactUrl, setContactUrl] = useState('#');
  
  // Social Links State
  const [twitterUrl, setTwitterUrl] = useState('#');
  const [instagramUrl, setInstagramUrl] = useState('#');
  const [whatsappUrl, setWhatsappUrl] = useState('#');


  const handleSaveContent = () => {
    // In a real app, you'd save these values to your database.
    console.log({ websiteName, heroTitle, heroSubtitle });
    toast({
      title: 'Content Saved!',
      description: 'Your website content has been updated.',
    });
  };

  const handleSaveLinks = () => {
    console.log({ termsUrl, privacyUrl, contactUrl, twitterUrl, instagramUrl, whatsappUrl });
    toast({
        title: 'Links Saved!',
        description: 'Your footer and social links have been updated.',
    });
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">General Settings</h1>
      
      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Content Customization</CardTitle>
            <CardDescription>
                Edit the main text content displayed on your website.
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
            <Button onClick={handleSaveContent}>Save Content</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
            <CardTitle>Footer Links</CardTitle>
            <CardDescription>
                Edit the URLs for the quick links in your website footer.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="terms-url">Terms URL</Label>
                <Input 
                    id="terms-url"
                    value={termsUrl}
                    onChange={(e) => setTermsUrl(e.target.value)}
                    className="bg-background/50"
                    placeholder="e.g., /terms-of-service"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="privacy-url">Privacy URL</Label>
                <Input 
                    id="privacy-url"
                    value={privacyUrl}
                    onChange={(e) => setPrivacyUrl(e.target.value)}
                    className="bg-background/50"
                    placeholder="e.g., /privacy-policy"
                />
            </div>
             <div className="space-y-2">
                <Label htmlFor="contact-url">Contact URL</Label>
                <Input 
                    id="contact-url"
                    value={contactUrl}
                    onChange={(e) => setContactUrl(e.target.value)}
                    className="bg-background/50"
                    placeholder="e.g., /contact-us"
                />
            </div>
            <Button onClick={handleSaveLinks}>Save Footer Links</Button>
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
            <Button onClick={handleSaveLinks}>Save Social Links</Button>
        </CardContent>
      </Card>

    </div>
  );
}
