'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardHeader from '@/components/DashboardHeader';

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboard && <Navbar />}
      {isDashboard && <DashboardHeader />}

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {!isDashboard && <Footer />}
    </div>
  );
}