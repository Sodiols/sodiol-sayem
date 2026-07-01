import { NextResponse } from 'next/server';
import { getPortfolio, savePortfolio } from '@/lib/data';
import { requireAdmin } from '@/lib/adminAuth';
import type { PortfolioData } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const portfolio = await getPortfolio();
    return NextResponse.json(portfolio);
  } catch {
    return NextResponse.json({ error: 'Failed to load portfolio data.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const portfolio = (await request.json()) as PortfolioData;

    if (!portfolio.name || !portfolio.title || !portfolio.email) {
      return NextResponse.json(
        { error: 'Name, title, and email are required.' },
        { status: 400 }
      );
    }

    await savePortfolio(portfolio);
    return NextResponse.json({ success: true, portfolio });
  } catch {
    return NextResponse.json({ error: 'Failed to update portfolio.' }, { status: 500 });
  }
}
