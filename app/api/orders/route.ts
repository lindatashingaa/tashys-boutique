import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { withProductImages } from '@/lib/images';
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  try {
    const where = session.role === 'ADMIN' ? {} : { userId: session.id };
    const orders = await prisma.order.findMany({ where, include: { user: { select: { name: true, email: true } }, items: { include: { product: true } }, payment: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(orders.map((order) => ({ ...order, items: order.items.map((item) => ({ ...item, product: withProductImages(item.product) })) })));
  } catch { return NextResponse.json({ error: 'Orders unavailable.' }, { status: 503 }); }
}