
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TypeAnimation } from 'react-type-animation';
import Logo from '@/components/logo';
import { RippleEffect } from '@/components/ui/ripple-effect';
import VantaGlobeBackground from '../vanta-globe-background';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function HeroSection() {
  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'content') : null, [firestore]);
  const { data: contentData, isLoading } = useDoc(contentRef);

  const heroTitle = contentData?.heroTitle || 'Your Gateway to Digital Mastery.';
  const heroSubtitle = contentData?.heroSubtitle || 'Unlock your potential with expert-led courses in Cybersecurity, cutting-edge Skill Development programs, and professional Website Creation services to elevate your digital presence.';

  return (
    <section className="relative w-full h-screen min-h-[500px] flex items-center justify-center text-center overflow-hidden">
      <VantaGlobeBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />

      <div className="container relative z-20 px-4">
        
        <div className="w-56 h-auto mx-auto mb-4">
            <Logo />
        </div>

        <div className="relative flex justify-center items-center h-24 md:h-32 lg:h-40 mb-4">
          <TypeAnimation
            sequence={[
              'Master',
              1500,
              'Build',
              1500,
              'Secure',
              1500,
            ]}
            wrapper="span"
            speed={50}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 [text-shadow:0_2px_4px_rgba(0,0,0,0.2)]"
            repeat={Infinity}
            cursor={true}
          />
        </div>
        
        <p className="text-xl md:text-2xl font-bold mb-8 text-primary">
          {heroTitle}
        </p>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl mb-12">
          {heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses">
            <Button size="lg" className="gradient-btn gradient-btn-1 w-full sm:w-auto relative">
              Start Learning
              <RippleEffect />
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" className="gradient-btn gradient-btn-2 w-full sm:w-auto relative">
              Hire Us
              <RippleEffect />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
