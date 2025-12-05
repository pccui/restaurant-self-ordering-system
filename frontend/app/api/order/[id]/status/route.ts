import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

/**
 * PATCH /api/order/[id]/status
 * Update order status (used by dashboard)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const backendRes = await fetch(`${API_BASE}/api/order/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({ message: 'Failed to update status' }));
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
