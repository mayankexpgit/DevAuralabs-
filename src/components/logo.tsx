import Link from 'next/link';
import Image from 'next/image';
import type { MouseEventHandler } from 'react';

type LogoProps = {
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
};


export default function Logo({ onLinkClick }: LogoProps) {
  return (
    <Link href="/" onClick={onLinkClick} className="flex items-center gap-2" aria-label="DevAura Labs homepage">
      <Image src="https://i.ibb.co/20tFWD4P/IMG-20251019-191415-1.png" alt="DevAura Labs Logo" width={40} height={40} className="rounded-full" />
      <span className="font-bold text-lg text-foreground">
        DevAura Labs
      </span>
    </Link>
  );
}
