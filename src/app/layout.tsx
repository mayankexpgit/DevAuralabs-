
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { AdminProvider, useAdmin } from '@/context/admin-context';
import { CurrencyProvider } from '@/context/currency-context';
import { DemoUserProvider } from '@/context/demo-user-context';
import DemoUserFAB from '@/components/demo-user-fab';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for both user and admin states to be resolved
    if (isUserLoading || isAdminLoading) return;

    // If we have a regular user (not an admin)
    if (user && !isAdmin) {
      // Check if their profile is incomplete
      const isProfileIncomplete = !user.displayName;
      
      // Define paths that are always allowed
      const isAllowedPath = pathname === '/profile' || pathname.startsWith('/logout');

      // If profile is incomplete and they are not on an allowed path, redirect them.
      if (isProfileIncomplete && !isAllowedPath) {
        router.push('/profile');
      }
    }
  }, [user, isUserLoading, isAdmin, isAdminLoading, pathname, router]);

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
      </div>
      <DemoUserFAB />
      <Toaster />
    </>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={`dark`}>
      <head>
        <title>DevAura Labs</title>
        <meta name="description" content="Master. Build. Secure — All in One Platform." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased bg-background text-foreground">
        <FirebaseClientProvider>
          <AdminProvider>
            <DemoUserProvider>
              <CurrencyProvider>
                <AppContent>{children}</AppContent>
              </CurrencyProvider>
            </DemoUserProvider>
          </AdminProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
