import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { withProductImages } from '@/lib/images';
type Context = { params: { id: string } };
export async function GET(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  try {
    const order = await prisma.order.findUnique({ where: { id: params.id }, include: { user: { select: { name: true, email: true } }, items: { include: { product: true } }, payment: true } });
    if (!order || (session.role !== 'ADMIN' && order.userId !== session.id)) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json({ ...order, items: order.items.map((item) => ({ ...item, product: withProductImages(item.product) })) });
  } catch { return NextResponse.json({ error: 'Order unavailable.' }, { status: 503 }); }
}