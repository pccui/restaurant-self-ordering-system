import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

// Force dynamic rendering to prevent caching issues
export const dynamic = 'force-dynamic';

/**
 * PATCH /api/order/[id]/items
 * Update order items (for customers adding items during edit window)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(`[API Route] PATCH /api/order/${id}/items - Proxying to ${API_BASE}/api/order/${id}/items`);

  if (!id || id.trim() === '') {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    console.log(`[API Route] Request body:`, JSON.stringify(body));

    const backendRes = await fetch(`${API_BASE}/api/order/${id}/items`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`[API Route] Backend response status: ${backendRes.status}`);

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({ message: 'Failed to update order items' }));
      console.log(`[API Route] Backend error:`, errorData);
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating order items:', error);
    return NextResponse.json(
      { error: 'Failed to update order items' },
      { status: 500 }
    );
  }
}
