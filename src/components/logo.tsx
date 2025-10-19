import Link from 'next/link';
import type { MouseEventHandler } from 'react';

type LogoProps = {
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
};


export default function Logo({ onLinkClick }: LogoProps) {
  return (
    <Link href="/" onClick={onLinkClick} className="flex flex-col items-center gap-2" aria-label="DevAura Labs homepage">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://i.ibb.co/20tFWD4P/IMG-20251019-191415-1.png" alt="DevAura Labs Logo" width={80} height={80} className="rounded-full" />
    </Link>
  );
}
