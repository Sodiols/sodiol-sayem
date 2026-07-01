import { NextResponse } from 'next/server';
import { deleteInquiry, updateInquiryStatus } from '@/lib/data';
import { requireAdmin } from '@/lib/adminAuth';
import type { Inquiry } from '@/types';

type Context = {
  params: Promise<{ id: string }>;
};

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, context: Context) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const { status } = await request.json();

    if (!['new', 'read', 'archived'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const success = await updateInquiryStatus(id, status as Inquiry['status']);

    if (!success) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update inquiry.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: Context) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized admin access.' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const success = await deleteInquiry(id);

    if (!success) {
      return NextResponse.json({ error: 'Inquiry not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete inquiry.' }, { status: 500 });
  }
}
