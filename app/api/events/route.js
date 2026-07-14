import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const result = await db.execute('SELECT * FROM events ORDER BY tanggal DESC, created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
