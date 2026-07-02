'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import Header from './Header';
import InteractiveGrid from './InteractiveGrid';
import type { PortfolioData } from '@/types';

interface DashboardClientProps {
  initialPortfolio: PortfolioData;
}

export default function DashboardClient({ initialPortfolio }: DashboardClientProps) {
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioData>(initialPortfolio);

  const goToPortfolio = () => {
    router.push('/');
  };

  return (
    <div className="site-shell min-h-screen bg-[#fcfcfc] text-slate-900 flex flex-col font-sans selection:bg-black selection:text-white">
      <InteractiveGrid />

      <Header
        currentSection=""
        isDashboardActive
        setIsDashboardActive={goToPortfolio}
        portfolioName={portfolio.name}
        facebook={portfolio.facebook}
        instagram={portfolio.instagram}
      />

      <main className="flex-grow relative z-10 min-w-0">
        <AdminDashboard portfolio={portfolio} onPortfolioUpdate={setPortfolio} />
      </main>
    </div>
  );
}
