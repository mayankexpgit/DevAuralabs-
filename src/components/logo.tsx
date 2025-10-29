
import Link from 'next/link';
import type { MouseEventHandler } from 'react';
import Image from 'next/image';

type LogoProps = {
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
};


export default function Logo({ onLinkClick }: LogoProps) {
  return (
    <Link href="/" onClick={onLinkClick} className="flex items-center justify-center w-full h-full" aria-label="DevAura Labs homepage">
      <Image src="https://i.ibb.co/20tFWD4P/IMG-20251019-191415-1.png" alt="DevAura Labs Logo" width={200} height={200} className="rounded-lg object-contain w-full h-full" unoptimized />
    </Link>
  );
}
