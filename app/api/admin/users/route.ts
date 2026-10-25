import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function GET() {
  if ((await getSession())?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  try { return NextResponse.json(await prisma.user.findMany({ select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true }, orderBy: { createdAt: 'desc' } })); }
  catch { return NextResponse.json({ error: 'Users unavailable.' }, { status: 503 }); }
}