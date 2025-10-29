
import Link from 'next/link';
import type { MouseEventHandler } from 'react';
import Image from 'next/image';

type LogoProps = {
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
};


export default function Logo({ onLinkClick }: LogoProps) {
  return (
    <Link href="/" onClick={onLinkClick} className="flex flex-col items-center gap-2" aria-label="DevAura Labs homepage">
      <Image src="https://i.ibb.co/sVqVqS3/IMG-20251019-191415-1.png" alt="DevAura Labs Logo" width={200} height={200} className="rounded-lg" unoptimized />
    </Link>
  );
}
