import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
const schema = z.object({ status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']) });
type Context = { params: { id: string } };
export async function PATCH(request: Request, { params }: Context) {
  if ((await getSession())?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid order status.' }, { status: 400 });
  try { return NextResponse.json(await prisma.order.update({ where: { id: params.id }, data: { status: parsed.data.status } })); }
  catch { return NextResponse.json({ error: 'Could not update order.' }, { status: 400 }); }
}