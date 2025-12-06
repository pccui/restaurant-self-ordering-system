import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/config';

// Rate limiting: in-memory store (resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 10;

function getClientIP(request: NextRequest): string {
  // Try various headers for IP (works behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  // Fallback - use a generic key if no IP found
  return 'unknown';
}

function checkRateLimit(clientIP: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(clientIP);

  // Clean up expired entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetTime) {
    // Create new record
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const clientIP = getClientIP(request);
    const { allowed, remaining } = checkRateLimit(clientIP);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'Retry-After': '3600',
          },
        }
      );
    }

    const body = await request.json();
    console.log('Received order:', body);

    // Forward auth header if present
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // Forward to backend
    const backendRes = await fetch(`${API_BASE}/api/order`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data, {
      status: 201,
      headers: {
        'X-RateLimit-Remaining': String(remaining),
      },
    });
  } catch (error) {
    console.error('Error forwarding order to backend:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Forward auth header for authentication
    const authHeader = request.headers.get('authorization');
    const headers: HeadersInit = {};
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const backendRes = await fetch(`${API_BASE}/api/order`, {
      headers,
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching orders from backend:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
