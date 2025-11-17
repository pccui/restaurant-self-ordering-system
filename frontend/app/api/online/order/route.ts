import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received order:', body);
    
    return NextResponse.json(
      { 
        id: 'stub-order-' + Date.now(), 
        status: 'pending' 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
