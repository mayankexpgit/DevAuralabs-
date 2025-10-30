
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function FloatingAiButton() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'ai-logo');

  return (
    <Link href="/aura-ai-chat" className="fixed bottom-8 right-8 z-50 group">
      <Button
        size="icon"
        className="relative rounded-full h-16 w-16 bg-purple-600/50 backdrop-blur-md border border-purple-400/50 hover:bg-purple-500/60 shadow-lg transition-all duration-300 ease-in-out spin-glow-animation"
      >
        <Image
          src={logoImage?.imageUrl || ''}
          alt="Aura AI"
          width={40}
          height={40}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </Button>
    </Link>
  );
}
