import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const params = url.searchParams.toString();
    const backendUrl = `${API_BASE}/api/admin/audit${params ? `?${params}` : ''}`;

    // Forward cookies and Authorization header
    const cookies = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('Authorization');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Cookie': cookies,
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(backendUrl, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Audit API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch audit logs', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
