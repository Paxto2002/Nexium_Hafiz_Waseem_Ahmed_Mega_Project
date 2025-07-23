// app/dashboard/layout.jsx
import { ensureUserProfile } from '@/app/components/server-only/InsertUserIfNeeded';
import DashboardClientLayout from './dashboard-client-layout';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const user = await ensureUserProfile();
  
  if (!user) {
    redirect('/signin');
  }

  return <DashboardClientLayout>{children}</DashboardClientLayout>;
}