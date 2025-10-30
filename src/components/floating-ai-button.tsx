
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function FloatingAiButton() {
  return (
    <Link href="/xino-ai-chat" className="fixed bottom-8 right-8 z-50 group">
      <Button
        size="icon"
        className="relative rounded-full h-16 w-16 bg-purple-600/50 backdrop-blur-md border border-purple-400/50 hover:bg-purple-500/60 shadow-lg transition-all duration-300 ease-in-out spin-glow-animation"
      >
        <Image
          src="https://beeimg.com/images/c24556176391.png"
          alt="Xino AI"
          width={40}
          height={40}
          className="transition-transform duration-300 group-hover:scale-110"
        />
      </Button>
    </Link>
  );
}
