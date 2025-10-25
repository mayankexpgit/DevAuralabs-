
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

// Using a constant for metadata since the layout is now a client component
// export const metadata: Metadata = {
//   title: 'DevAura Labs',
//   description: 'Master. Build. Secure — All in One Platform.',
//   icons: {
//     icon: '/favicon.ico',
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const noFooterPaths = ['/login', '/signup'];
  const showFooter = !noFooterPaths.includes(pathname);

  return (
    <html lang="en" className="dark">
      <head>
        <title>DevAura Labs</title>
        <meta name="description" content="Master. Build. Secure — All in One Platform." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          {showFooter && <Footer />}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
