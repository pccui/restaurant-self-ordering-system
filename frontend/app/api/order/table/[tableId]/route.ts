import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  const { tableId } = await params;

  // Validate tableId - must be a real table ID, not empty or placeholder
  if (!tableId || tableId === 't001' || tableId.trim() === '') {
    return NextResponse.json(null, { status: 404 });
  }

  try {
    const backendRes = await fetch(`${API_BASE}/api/order/table/${tableId}`);

    if (!backendRes.ok) {
      if (backendRes.status === 404) {
        return NextResponse.json(null, { status: 404 });
      }
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: backendRes.status }
      );
    }

    // Handle empty response body
    const text = await backendRes.text();
    if (!text || text.trim() === '') {
      return NextResponse.json(null, { status: 404 });
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch {
      // Invalid JSON response from backend
      return NextResponse.json(null, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching order by table:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
