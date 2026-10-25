import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ success: z.boolean() });
type Context = { params: { id: string } };
export async function POST(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payment simulation.' }, { status: 400 });
  try {
    const order = await prisma.order.findFirst({ where: { id: params.id, userId: session.id }, include: { items: true, payment: true } });
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    if (order.status === 'PAID') return NextResponse.json({ ok: true, orderId: order.id });
    if (!parsed.data.success) {
      await prisma.payment.upsert({ where: { orderId: order.id }, update: { status: 'FAILED', transactionId: null }, create: { orderId: order.id, amount: order.totalAmount, status: 'FAILED' } });
      return NextResponse.json({ error: 'Payment was not completed. Your order is saved so you can retry.' }, { status: 402 });
    }
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        const changed = await tx.product.updateMany({ where: { id: item.productId, stock: { gte: item.quantity } }, data: { stock: { decrement: item.quantity } } });
        if (!changed.count) throw new Error('STOCK_CHANGED');
      }
      await tx.payment.upsert({ where: { orderId: order.id }, update: { status: 'SUCCESS', transactionId: randomUUID() }, create: { orderId: order.id, amount: order.totalAmount, status: 'SUCCESS', transactionId: randomUUID() } });
      await tx.order.update({ where: { id: order.id }, data: { status: 'PAID' } });
      await tx.cartItem.deleteMany({ where: { cart: { userId: session.id } } });
    });
    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error && error.message === 'STOCK_CHANGED' ? 'Stock changed while checking out. Please contact the boutique.' : 'Payment could not be completed.' }, { status: 409 });
  }
}