
'use client';

import Link from 'next/link';
import { Menu, User, ShoppingCart, LayoutGrid, BookOpen, Briefcase, Info, Sparkles, LogIn, DollarSign, IndianRupee, Cpu, ChevronDown, GitPullRequest } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import Logo from '../logo';
import SocialIcon from '../social-icon';
import { useAuth, useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdmin } from '@/context/admin-context';
import BackButton from './back-button';
import { useCurrency } from '@/context/currency-context';
import { useDemoUser } from '@/context/demo-user-context';


const AuraAiIcon = () => {
  const logoImage = PlaceHolderImages.find(p => p.id === 'ai-logo');
  return logoImage ? <Image src={logoImage.imageUrl} alt="Aura AI" width={24} height={24} className="h-6 w-6" /> : <Sparkles />;
}


const navLinks: { href?: string; label: string; icon: LucideIcon | React.ComponentType, subLinks?: { href: string; label: string, forLoggedIn?: boolean }[] }[] = [
  { href: '/', label: 'Menu', icon: LayoutGrid },
  { 
    label: 'Courses', 
    icon: BookOpen,
    subLinks: [
      { href: '/profile/my-courses', label: 'My Courses', forLoggedIn: true },
      { href: '/courses', label: 'Buy Course' }
    ]
  },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/hardware', label: 'Hardware', icon: Cpu },
  { href: '/aura-ai-chat', label: 'Aura AI', icon: AuraAiIcon },
  { href: '/about', label: 'About', icon: Info },
];

const socialLinks = [
  { name: 'Twitter', href: '#' },
  { name: 'Instagram', href: '#' },
  { name: 'WhatsApp', href: '#' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [headerClass, setHeaderClass] = useState("w-full z-50");
  
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { isAdmin, logout: adminLogout } = useAdmin();
  const { currency, setCurrency } = useCurrency();
  const { isDemoMode, endDemoMode } = useDemoUser();

  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'content') : null, [firestore]);
  const { data: contentData } = useDoc(contentRef);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
        setHeaderClass("w-full z-50 absolute");
      } else {
        setHeaderClass("w-full z-50 top-0 sticky glass-header");
      }
    }
  }, [pathname, isMounted]);

  const handleUserLogout = () => {
    signOut(auth);
  };
  
  const handleAdminLogout = () => {
    adminLogout();
    router.push('/');
  }

  const handleDemoLogout = () => {
    endDemoMode();
    router.push('/admin');
  }

  const showBackButton = isMounted && pathname !== '/' && pathname !== '/login' && pathname !== '/signup';

  if (pathname === '/aura-ai-chat' || (isAdmin && !isDemoMode && pathname.startsWith('/admin'))) {
    return null; // Don't render the navbar on the chat page or admin pages (unless in demo mode)
  }

  const getActiveUser = () => {
    if (isDemoMode) {
      return {
        isDemo: true,
        displayName: 'Demo User',
        email: 'demo@devaura.labs',
        photoURL: undefined
      }
    }
    if (isAdmin) {
        return {
            isAdmin: true,
            displayName: 'Administrator',
            email: 'admin@devaura.labs',
            photoURL: undefined
        }
    }
    return user;
  }

  const activeUser = getActiveUser();

  return (
    <header className={headerClass}>
      <div className="container mx-auto flex items-center justify-between p-4">
        
        <div className='flex items-center gap-2'>
            {showBackButton && <BackButton />}

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
                        {navLinks.map(({ href, label, icon: Icon, subLinks }) => {
                          if (subLinks) {
                            return (
                              <div key={label}>
                                <p className="flex items-center gap-4 rounded-lg px-4 py-3 text-xl text-muted-foreground">
                                  <Icon className="h-6 w-6" />
                                  <span>{label}</span>
                                </p>
                                <div className="flex flex-col pl-10">
                                  {subLinks.map(subLink => (
                                    (!subLink.forLoggedIn || (subLink.forLoggedIn && activeUser)) && (
                                      <Link
                                        key={subLink.href}
                                        href={subLink.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                          'flex items-center gap-4 rounded-lg px-4 py-2 text-lg transition-colors hover:text-primary',
                                          pathname === subLink.href ? 'text-primary' : 'text-muted-foreground'
                                        )}
                                      >
                                        {subLink.label}
                                      </Link>
                                    )
                                  ))}
                                </div>
                              </div>
                            )
                          }
                          return (
                            <Link
                            key={href}
                            href={href!}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                'flex items-center gap-4 rounded-lg px-4 py-3 text-xl transition-colors hover:text-primary',
                                pathname === href ? 'text-foreground bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_12px_rgba(255,255,255,0.4)]' : 'text-muted-foreground'
                            )}
                            >
                            <Icon className="h-6 w-6" />
                            <span>{label}</span>
                            </Link>
                          );
                        })}
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
                        !activeUser && !isUserLoading ? (
                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                <div className="glass-icon-btn login-btn text-foreground w-full">Login</div>
                            </Link>
                        ) : (
                            <Button className="w-full" variant="destructive" onClick={() => { (isAdmin ? handleAdminLogout() : handleUserLogout()); setIsOpen(false); }}>
                            Logout
                            </Button>
                        )
                        )}
                    </div>
                </SheetContent>
                </Sheet>
            )}
            </div>
        </div>
        
        {/* Desktop nav */}
        <nav className={cn(
            "hidden md:flex items-center gap-6 text-sm",
            pathname !== '/' && (pathname === '/login' || pathname === '/signup') && "invisible"
        )}>
            {navLinks.map(({ href, label, subLinks }) => {
              if (subLinks) {
                return (
                   <DropdownMenu key={label}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className={cn(
                        'flex items-center gap-1 transition-colors hover:text-primary focus-visible:ring-0 focus-visible:ring-offset-0 p-0',
                        pathname.startsWith('/courses') || pathname.startsWith('/profile/my-courses') ? 'text-primary font-semibold' : 'text-muted-foreground'
                      )}>
                        {label}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {activeUser && (
                        <DropdownMenuItem asChild>
                          <Link href="/profile/my-courses">My Courses</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/courses">Buy Course</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              }
              return (
                <Link
                  key={href}
                  href={href!}
                  className={cn(
                      'transition-colors hover:text-primary',
                      pathname === href ? 'text-primary font-semibold' : 'text-muted-foreground'
                  )}
                  >
                  {label}
                </Link>
              );
            })}
        </nav>

        {/* Login/Profile Buttons - Top Right */}
        <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="glass-icon-btn text-muted-foreground hover:text-primary h-10 w-10">
                  {currency === 'USD' ? <DollarSign className="h-5 w-5" /> : <IndianRupee className="h-5 w-5" />}
                  <span className="sr-only">Change currency</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={currency} onValueChange={(value) => setCurrency(value as 'USD' | 'INR')}>
                  <DropdownMenuRadioItem value="INR">INR (₹)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="USD">USD ($)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

          {isMounted && !isUserLoading ? (
            activeUser ? (
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full glass-icon-btn p-0">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={activeUser.photoURL || undefined} alt={activeUser.displayName || 'user'} />
                        <AvatarFallback>
                            {(activeUser as any).isAdmin ? 'AD' : (activeUser.displayName ? activeUser.displayName.charAt(0) : <User className="h-5 w-5" />)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{activeUser.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {activeUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(activeUser as any).isDemo ? (
                      <DropdownMenuItem onClick={handleDemoLogout} className="text-destructive focus:text-destructive">
                        Exit Demo Mode
                      </DropdownMenuItem>
                    ) : (activeUser as any).isAdmin ? (
                       <DropdownMenuItem onClick={handleAdminLogout} className="text-destructive focus:text-destructive">
                        Logout
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                         <DropdownMenuItem asChild>
                          <Link href="/profile/my-courses">My Learning</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                           <Link href="/profile/my-requests">My Requests</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/profile/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleUserLogout}>
                          Log out
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Link href="/login">
                  <div className="glass-icon-btn login-btn text-foreground">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </div>
                </Link>
            )
          ) : (
            <Skeleton className="h-9 w-20 rounded-md" />
          )}
        </div>
      </div>
    </header>
  );
}
