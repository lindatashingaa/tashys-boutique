import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { cartSchema } from '@/lib/schemas';
import { withProductImages } from '@/lib/images';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  try {
    const cart = await prisma.cart.upsert({ where: { userId: session.id }, update: {}, create: { userId: session.id } });
    const items = await prisma.cartItem.findMany({ where: { cartId: cart.id }, include: { product: { include: { category: true } } }, orderBy: { id: 'asc' } });
    return NextResponse.json({ items: items.map((item) => ({ ...item, product: withProductImages(item.product) })), subtotal: items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0) });
  } catch { return NextResponse.json({ error: 'Cart unavailable.' }, { status: 503 }); }
}
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  const parsed = cartSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Choose a valid quantity.' }, { status: 400 });
  try {
    const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
    if (!product || product.stock < parsed.data.quantity) return NextResponse.json({ error: 'That quantity is not currently available.' }, { status: 409 });
    const cart = await prisma.cart.upsert({ where: { userId: session.id }, update: {}, create: { userId: session.id } });
    const existing = await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId: cart.id, productId: product.id } } });
    const quantity = (existing?.quantity ?? 0) + parsed.data.quantity;
    if (quantity > product.stock || quantity > 20) return NextResponse.json({ error: 'Cart quantity exceeds available stock.' }, { status: 409 });
    await prisma.cartItem.upsert({ where: { cartId_productId: { cartId: cart.id, productId: product.id } }, update: { quantity }, create: { cartId: cart.id, productId: product.id, quantity } });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Could not update your cart.' }, { status: 503 }); }
}
export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please sign in.' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = zodUpdate.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid cart update.' }, { status: 400 });
  try {
    const item = await prisma.cartItem.findFirst({ where: { id: parsed.data.itemId, cart: { userId: session.id } }, include: { product: true } });
    if (!item) return NextResponse.json({ error: 'Cart item not found.' }, { status: 404 });
    if (parsed.data.quantity === 0) await prisma.cartItem.delete({ where: { id: item.id } });
    else if (parsed.data.quantity <= item.product.stock) await prisma.cartItem.update({ where: { id: item.id }, data: { quantity: parsed.data.quantity } });
    else return NextResponse.json({ error: 'Quantity exceeds available stock.' }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ error: 'Could not update your cart.' }, { status: 503 }); }
}
import { z } from 'zod';
const zodUpdate = z.object({ itemId: z.string().min(1), quantity: z.coerce.number().int().min(0).max(20) });