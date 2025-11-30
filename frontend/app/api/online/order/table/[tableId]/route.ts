import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableId: string }> }
) {
  const { tableId } = await params;
  
  try {
    const backendRes = await fetch(`${API_BASE}/api/online/order/table/${tableId}`);

    if (!backendRes.ok) {
      if (backendRes.status === 404) {
        return NextResponse.json(null, { status: 404 });
      }
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching order by table:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}
