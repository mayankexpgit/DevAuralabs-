
'use client';

import Link from 'next/link';
import { Menu, User, ShoppingCart } from 'lucide-react';
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, [pathname]); // Re-check on path change

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    // a full page reload is a good way to reset all state
    window.location.href = '/';
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "glass-header" : ""
    )}>
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
            {/* Mobile Menu Button - Top Left */}
            <div className="md:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <div className="glass-icon-btn">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </div>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    <nav className="flex flex-col gap-4 text-lg font-medium mt-10">
                        {navLinks.map(({ href, label }) => (
                            <Link
                            key={href}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                'transition-colors hover:text-primary',
                                pathname === href ? 'text-primary' : 'text-muted-foreground'
                            )}
                            >
                            {label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-auto">
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
            </div>
            
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
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
              <Link href="/login" className="glass-icon-btn login-btn text-sm">
                  Login
              </Link>
            )
          )}
        </div>
      </div>
    </header>
  );
}
