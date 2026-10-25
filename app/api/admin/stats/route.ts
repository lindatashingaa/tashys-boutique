import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
export async function GET() {
  if ((await getSession())?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  try {
    const [users, products, orders, revenue] = await Promise.all([prisma.user.count(), prisma.product.count(), prisma.order.count(), prisma.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { totalAmount: true } })]);
    return NextResponse.json({ users, products, orders, revenue: Number(revenue._sum.totalAmount ?? 0) });
  } catch { return NextResponse.json({ error: 'Dashboard data unavailable.' }, { status: 503 }); }
}