import { NextResponse } from 'next/server';
import menu from '@/public/menu.json';

export async function GET() {
  return NextResponse.json(menu);
}
