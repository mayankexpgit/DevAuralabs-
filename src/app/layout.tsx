
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import Navbar from '@/components/layout/navbar';

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

  return (
    <html lang="en" className="dark">
      <head>
        <title>DevAura Labs</title>
        <meta name="description" content="Master. Build. Secure — All in One Platform." />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-body antialiased bg-background text-foreground">
        <svg style={{ display: 'none' }}>
          <filter id="liquid-glass" colorInterpolationFilters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
              <feTurbulence type="fractalNoise" baseFrequency="0.01 0.04" numOctaves="3" result="NOISE" />
              <feDisplacementMap in="SourceGraphic" in2="NOISE" scale="10" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </svg>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
