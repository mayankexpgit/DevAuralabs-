
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import VantaBackground from '@/components/vanta-background';
import { useEffect, useState } from 'react';
import MetallicText from '@/components/metallic-text';
import { parseLogoImage } from '@/components/metallic-text';

export default function HeroSection() {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    async function loadImage() {
      try {
        const response = await fetch('/hero-text.svg');
        const svgBlob = await response.blob();
        const file = new File([svgBlob], 'hero-text.svg', { type: 'image/svg+xml' });
        const { imageData: parsedImageData } = await parseLogoImage(file);
        setImageData(parsedImageData);
      } catch (error) {
        console.error('Error loading or parsing SVG:', error);
      }
    }
    loadImage();
  }, []);

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden pt-12">
      <VantaBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />

      <div className="container relative z-20 px-4">
        <div className="flex justify-center -mt-12 mb-8">
          <Logo />
        </div>
        
        <div className="flex justify-center items-center h-24 md:h-32 lg:h-40 mb-4">
          {imageData ? (
            <MetallicText imageData={imageData} />
          ) : (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 [text-shadow:0_2px_4px_rgba(0,0,0,0.2)]">
              Master. Build. Secure.
            </h1>
          )}
        </div>
        
        <p className="text-xl md:text-2xl font-bold mb-8 text-primary">
          All in One Platform.
        </p>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl mb-12">
          DevAura Labs is your all-in-one platform for e-commerce learning and services, specializing in Cybersecurity, Skill Development, and Website Creation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses">
            <Button size="lg" className="gradient-btn gradient-btn-1 w-full sm:w-auto">
              Start Learning
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" className="gradient-btn gradient-btn-2 w-full sm:w-auto">
              Hire Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
