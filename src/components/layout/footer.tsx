
'use client';

import Link from 'next/link';
import Logo from '@/components/logo';
import SocialIcon from '@/components/social-icon';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

const quickLinks = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact-us', label: 'Contact' },
];

export default function Footer() {
  const firestore = useFirestore();
  const contentRef = useMemoFirebase(() => firestore ? doc(firestore, 'settings', 'content') : null, [firestore]);
  const { data: contentData } = useDoc(contentRef);

  const socialLinks = [
    { name: 'Twitter', href: contentData?.twitterUrl || '#' },
    { name: 'Instagram', href: contentData?.instagramUrl || '#' },
    { name: 'WhatsApp', href: contentData?.whatsappUrl || '#' },
  ];

  return (
    <footer className="bg-transparent">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="w-40 h-auto">
                <Logo />
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {contentData?.websiteName || 'DevAura Labs'}. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <Link key={social.name} href={social.href} target="_blank" rel="noopener noreferrer">
                <SocialIcon name={social.name} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
