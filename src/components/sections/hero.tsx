
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TypeAnimation } from 'react-type-animation';
import Logo from '@/components/logo';
import { RippleButton } from '../ui/ripple-button';

export default function HeroSection() {

  return (
    <section className="relative w-full h-screen min-h-[500px] flex items-center justify-center text-center overflow-hidden -mt-20">
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
          Your Gateway to Digital Mastery.
        </p>
        <p className="max-w-2xl mx-auto text-muted-foreground md:text-xl mb-12">
          Unlock your potential with expert-led courses in Cybersecurity, cutting-edge Skill Development programs, and professional Website Creation services to elevate your digital presence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/courses">
            <RippleButton size="lg" className="gradient-btn gradient-btn-1 w-full sm:w-auto">
              Start Learning
            </RippleButton>
          </Link>
          <Link href="/services">
            <RippleButton size="lg" className="gradient-btn gradient-btn-2 w-full sm:w-auto">
              Hire Us
            </RippleButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
