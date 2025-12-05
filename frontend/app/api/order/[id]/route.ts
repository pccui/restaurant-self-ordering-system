import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

/**
 * GET /api/order/[id]
 * Fetch a specific order by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const backendRes = await fetch(`${API_BASE}/api/order/${id}`);

    if (!backendRes.ok) {
      if (backendRes.status === 404) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/order/[id]
 * Update an order
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const backendRes = await fetch(`${API_BASE}/api/order/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({ message: 'Failed to update order' }));
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/order/[id]
 * Delete an order
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id.trim() === '') {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    const backendRes = await fetch(`${API_BASE}/api/order/${id}`, {
      method: 'DELETE',
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({ message: 'Failed to delete order' }));
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
