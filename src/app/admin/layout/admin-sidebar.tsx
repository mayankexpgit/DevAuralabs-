
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Settings, LogOut, BookCopy, Award, List, Users, View, Cpu, TicketPercent, Mail, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/context/admin-context';
import Logo from '../logo';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/content', label: 'Content', icon: List },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/website-requests', label: 'Web Requests', icon: Mail },
  { href: '/admin/add-course', label: 'Add Course', icon: BookCopy },
  { href: '/admin/add-skill', label: 'Add Skill', icon: Award },
  { href: '/admin/add-hardware', label: 'Add Hardware', icon: Cpu },
  { href: '/admin/manage-classes', label: 'Manage Classes', icon: View },
  { href: '/admin/promo-codes', label: 'Promo Codes', icon: TicketPercent },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdmin();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-background/80 backdrop-blur-lg border-r border-white/10 p-6 flex-col hidden md:flex">
      <div className="mb-10 w-40 h-auto mx-auto">
        <Logo />
      </div>
      <nav className="flex flex-col gap-2 flex-grow">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start text-base gap-3 h-12',
                pathname.startsWith(link.href) && (link.href !== '/admin' || pathname === '/admin')
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <Button variant="destructive" className="w-full justify-start text-base gap-3 h-12" onClick={handleLogout}>
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
