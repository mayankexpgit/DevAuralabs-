
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

export default function GeneralSettingsPage() {
  const { toast } = useToast();
  // Theme state
  const [primaryColor, setPrimaryColor] = useState('232 100% 59%');
  const [backgroundColor, setBackgroundColor] = useState('228 48% 6%');
  const [accentColor, setAccentColor] = useState('232 100% 59%');

  // Content state
  const [websiteName, setWebsiteName] = useState('DevAura Labs');
  const [heroTitle, setHeroTitle] = useState('Your Gateway to Digital Mastery.');
  const [heroSubtitle, setHeroSubtitle] = useState('Unlock your potential with expert-led courses in Cybersecurity, cutting-edge Skill Development programs, and professional Website Creation services to elevate your digital presence.');

  const handleApplyTheme = () => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--background', backgroundColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    toast({
      title: 'Theme Applied!',
      description: 'Your new color theme has been applied.',
    });
  };

  const handleSaveContent = () => {
    // In a real app, you'd save these values to your database.
    console.log({ websiteName, heroTitle, heroSubtitle });
    toast({
      title: 'Content Saved!',
      description: 'Your website content has been updated.',
    });
  };


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">General Settings</h1>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Theme Customization</CardTitle>
          <CardDescription>
            Customize the look and feel of your website. Enter colors in HSL format (e.g., "232 100% 59%").
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <Input
                id="primary-color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="background-color">Background Color</Label>
              <Input
                id="background-color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <Input
                id="accent-color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>
          <Button onClick={handleApplyTheme}>Apply Theme</Button>
        </CardContent>
      </Card>

      <Separator />

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
    </div>
  );
}
