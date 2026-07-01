import { NextResponse } from 'next/server';
import { createInquiry, getInquiries } from '@/lib/data';
import { requireAdmin } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function GET(request: Request) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const inquiries = await getInquiries();
    return NextResponse.json(inquiries);
  } catch {
    return NextResponse.json({ error: 'Failed to read inquiries.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const inquiry = await createInquiry({
      name,
      email,
      message,
      subject: body.subject,
      budget: body.budget
    });

    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to submit inquiry.' }, { status: 500 });
  }
}
