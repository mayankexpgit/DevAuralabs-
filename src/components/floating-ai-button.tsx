
'use client';

import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function FloatingAiButton() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'ai-logo');

  return (
    <Link href="/aura-ai-chat" className="fixed bottom-8 right-8 z-50 group">
      <img
        src={logoImage?.imageUrl || ''}
        alt="Aura AI"
        className="w-16 h-16 object-contain transition-all duration-300 ease-in-out group-hover:scale-110"
      />
    </Link>
  );
}
