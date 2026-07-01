import { NextResponse } from 'next/server';
import { createAdminToken, verifyAdminPassword } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    if (!verifyAdminPassword(String(password))) {
      return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
    }

    return NextResponse.json({ token: createAdminToken() });
  } catch {
    return NextResponse.json({ error: 'Could not complete admin login.' }, { status: 500 });
  }
}
