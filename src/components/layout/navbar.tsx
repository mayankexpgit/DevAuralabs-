'use client';

import Link from 'next/link';
import { Menu, ShieldEllipsis } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Logo from '@/components/logo';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/admin', label: 'Admin Panel' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium ml-10">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden md:flex">
            <Link href="/login" legacyBehavior passHref>
              <Button className="glowing-btn" variant="outline" size="sm">
                Login
              </Button>
            </Link>
          </div>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="mb-8">
                     <Logo onLinkClick={() => setIsOpen(false)}/>
                  </div>
                  <nav className="flex flex-col gap-6 text-lg font-medium">
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'transition-colors hover:text-primary',
                           pathname === href ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                  <div className="mt-auto">
                     <Link href="/login" legacyBehavior passHref>
                        <Button className="glowing-btn w-full" variant="outline" onClick={() => setIsOpen(false)}>Login</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
