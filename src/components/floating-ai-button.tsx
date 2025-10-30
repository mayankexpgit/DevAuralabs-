
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function FloatingAiButton() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'ai-logo');

  return (
    <Link href="/aura-ai-chat" className="fixed bottom-8 right-8 z-50 group">
      <div
        className="relative h-16 w-16 transition-all duration-300 ease-in-out group-hover:scale-110 spin-glow-animation rounded-full"
      >
        <Image
          src={logoImage?.imageUrl || ''}
          alt="Aura AI"
          fill
          className="object-contain rounded-full"
        />
      </div>
    </Link>
  );
}
