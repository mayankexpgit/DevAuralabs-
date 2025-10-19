import Link from 'next/link';
import { ShieldEllipsis } from 'lucide-react';
import type { MouseEventHandler } from 'react';

type LogoProps = {
  onLinkClick?: MouseEventHandler<HTMLAnchorElement>;
};


export default function Logo({ onLinkClick }: LogoProps) {
  return (
    <Link href="/" onClick={onLinkClick} className="flex items-center gap-2" aria-label="DevAura Labs homepage">
      <ShieldEllipsis className="h-7 w-7 glowing-icon" />
      <span className="font-bold text-lg text-foreground">
        DevAura Labs
      </span>
    </Link>
  );
}
