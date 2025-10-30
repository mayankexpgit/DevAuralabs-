
'use client';

import Link from 'next/link';
import { Menu, User, ShoppingCart, LayoutGrid, BookOpen, Briefcase, Info, UserCog, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import Logo from '../logo';
import SocialIcon from '../social-icon';

const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/', label: 'Menu', icon: LayoutGrid },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/xino-ai-chat', label: 'Xino AI', icon: Sparkles },
  { href: '/about', label: 'About', icon: Info },
  { href: '/admin', label: 'Admin Panel', icon: UserCog },
];

const socialLinks = [
  { name: 'Twitter', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'WhatsApp', href: '#' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [headerClass, setHeaderClass] = useState("w-full z-50");

  useEffect(() => {
    setIsMounted(true);
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, [pathname]);

  useEffect(() => {
    if (isMounted) {
      if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
        setHeaderClass("w-full z-50 absolute");
      } else {
        setHeaderClass("w-full z-50 top-0 sticky glass-header");
      }
    }
  }, [pathname, isMounted]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    // a full page reload is a good way to reset all state
    window.location.href = '/';
  };

  if (pathname === '/xino-ai-chat') {
    return null; // Don't render the navbar on the chat page
  }

  return (
    <header className={headerClass}>
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Mobile Menu Button - Top Left */}
        <div className="md:hidden">
          {isMounted && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <div className="glass-icon-btn">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </div>
              </SheetTrigger>
              <SheetContent side="left" className="glass-header flex flex-col">
                <SheetTitle>
                    <div className='w-40 h-auto mx-auto'>
                        <Logo />
                    </div>
                </SheetTitle>
                <nav className="flex flex-col gap-2 text-lg font-medium mt-10">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                        key={href}
                        href={href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                            'flex items-center gap-4 rounded-lg px-4 py-3 text-xl transition-colors hover:text-primary',
                            pathname === href ? 'text-foreground bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'text-muted-foreground'
                        )}
                        >
                        <Icon className="h-6 w-6" />
                        <span>{label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto">
                    <div className="flex items-center justify-center gap-4 my-4">
                        {socialLinks.map((social) => (
                        <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
                            <SocialIcon name={social.name} />
                        </Link>
                        ))}
                    </div>
                    {isMounted && (
                      !isAuthenticated ? (
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button className="w-full" variant="outline">Login</Button>
                        </Link>
                      ) : (
                        <Button className="w-full" variant="destructive" onClick={() => { handleLogout(); setIsOpen(false); }}>
                          Logout
                        </Button>
                      )
                    )}
                  </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
        
        {/* Desktop nav */}
        <nav className={cn(
            "hidden md:flex items-center gap-6 text-sm",
            (pathname === '/' || pathname === '/login' || pathname === '/signup') && "invisible"
        )}>
            {navLinks.map(({ href, label }) => (
                <Link
                key={href}
                href={href}
                className={cn(
                    'transition-colors hover:text-primary',
                    pathname === href ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}
                >
                {label}
                </Link>
            ))}
        </nav>

        {/* Login/Profile Buttons - Top Right */}
        <div className="flex items-center justify-end gap-2">
          {isMounted && (
            isAuthenticated ? (
              <>
                <Link href="/cart" className="glass-icon-btn">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="sr-only">Cart</span>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="glass-icon-btn h-10 w-10">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="@user" />
                        <AvatarFallback>
                            <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">John Doe</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          john.doe@example.com
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                      <Link href="/profile/my-courses">My Courses</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login" className="glass-icon-btn login-btn text-foreground">
                  Login
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
