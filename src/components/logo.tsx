
import Link from 'next/link';
import type { MouseEventHandler } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type LogoProps = {
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
};


export default function Logo({ onLinkClick }: LogoProps) {
  const logoImage = PlaceHolderImages.find(p => p.id === 'ai-logo');
  
  return (
    <Link href="/" onClick={onLinkClick} className="flex items-center justify-center w-full h-full" aria-label="DevAura Labs homepage">
      <Image src={logoImage?.imageUrl || ''} alt="DevAura Labs Logo" width={200} height={200} className="rounded-lg object-contain w-full h-full" unoptimized />
    </Link>
  );
}
