
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

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
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
