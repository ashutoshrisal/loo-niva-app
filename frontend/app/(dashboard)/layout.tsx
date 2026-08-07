'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider } from '@/context/SidebarContext';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading Loo Niva...
      </div>
    );
  }

return (
  <SidebarProvider>
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      <Sidebar />

      <main className="flex-1 overflow-x-hidden">

        {children}

      </main>

    </div>
  </SidebarProvider>
);
}
