import type { Metadata } from 'next';
import DashboardClient from '@/components/DashboardClient';
import { getPortfolio } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: false
  }
};

export default async function AdminDashboardPage() {
  const portfolio = await getPortfolio();

  return <DashboardClient initialPortfolio={portfolio} />;
}
