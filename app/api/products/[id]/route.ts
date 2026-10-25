import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { productSchema } from '@/lib/schemas';
import { encodeImageUrls, withProductImages } from '@/lib/images';

type Context = { params: { id: string } };
export async function PATCH(request: Request, { params }: Context) {
  if ((await getSession())?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Product details are invalid.' }, { status: 400 });
  try { return NextResponse.json(withProductImages(await prisma.product.update({ where: { id: params.id }, data: { ...parsed.data, imageUrl: encodeImageUrls(parsed.data.imageUrl) } }))); }
  catch { return NextResponse.json({ error: 'Could not update product.' }, { status: 400 }); }
}
export async function DELETE(_request: Request, { params }: Context) {
  if ((await getSession())?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  try { await prisma.product.delete({ where: { id: params.id } }); return NextResponse.json({ ok: true }); }
  catch { return NextResponse.json({ error: 'Product is linked to an order and cannot be deleted.' }, { status: 409 }); }
}