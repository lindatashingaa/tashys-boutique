import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { shippingSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  const parsed = shippingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Complete all shipping fields with a valid email.' }, { status: 400 });
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: session.id }, include: { items: { include: { product: true } } } });
    if (!cart?.items.length) return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    for (const item of cart.items) if (item.product.stock < item.quantity) return NextResponse.json({ error: `${item.product.name} no longer has enough stock.` }, { status: 409 });
    const totalAmount = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
    const order = await prisma.order.create({ data: {
      userId: session.id, totalAmount, status: 'PENDING', phone: parsed.data.phone, city: parsed.data.city,
      shippingAddress: `${parsed.data.fullName}\n${parsed.data.address}\n${parsed.data.email}`,
      items: { create: cart.items.map(({ product, quantity }) => ({ productId: product.id, quantity, price: product.price })) }
    } });
    return NextResponse.json({ orderId: order.id }, { status: 201 });
  } catch { return NextResponse.json({ error: 'Could not start checkout.' }, { status: 503 }); }
}