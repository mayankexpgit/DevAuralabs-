
'use client';

import { useAdmin } from '@/context/admin-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/layout/admin-sidebar';
import { useDemoUser } from '@/context/demo-user-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isLoading: isAdminLoading } = useAdmin();
  const { isDemoMode, isLoading: isDemoLoading } = useDemoUser();
  const router = useRouter();

  const isLoading = isAdminLoading || isDemoLoading;

  useEffect(() => {
    if (!isLoading) {
      // If in demo mode OR not an admin, redirect away from admin pages.
      if (isDemoMode || !isAdmin) {
        router.push('/login?view=admin&error=demo_active');
      }
    }
  }, [isAdmin, isDemoMode, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If the logic above is running, it will redirect, so this state is temporary.
  if (isDemoMode || !isAdmin) {
    return null; // Return null while redirecting
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-8 lg:p-10">{children}</main>
    </div>
  );
}

    