import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';

/**
 * POST /api/order/[id]/confirm
 * Confirm an order (update status to confirmed)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const backendRes = await fetch(`${API_BASE}/api/order/${id}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to confirm order' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error confirming order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
