
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { AdminProvider } from '@/context/admin-context';
import { CurrencyProvider } from '@/context/currency-context';
import { DemoUserProvider } from '@/context/demo-user-context';
import DemoUserFAB from '@/components/demo-user-fab';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If auth state is loaded and we have a user
    if (!isUserLoading && user) {
      // Check if profile is incomplete (e.g., no displayName)
      const isProfileIncomplete = !user.displayName;
      
      // Define paths that should NOT trigger the redirect
      const isAllowedPath = pathname === '/profile' || pathname.startsWith('/logout');

      // If profile is incomplete and user is not already on the profile page, redirect them.
      if (isProfileIncomplete && !isAllowedPath) {
        router.push('/profile');
      }
    }
  }, [user, isUserLoading, pathname, router]);

  if (isUserLoading) {
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
