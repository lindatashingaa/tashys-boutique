import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { productSchema } from '@/lib/schemas';
import { encodeImageUrls, withProductImages } from '@/lib/images';
import { currentCatalogSlugs } from '@/lib/catalog';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim();
  const category = searchParams.get('category');
  const where = { slug: { in: currentCatalogSlugs }, ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}), ...(category ? { category: { slug: category } } : {}) };
  try { return NextResponse.json((await prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: 'desc' } })).map(withProductImages)); }
  catch { return NextResponse.json({ error: 'Products are unavailable until the database is configured.' }, { status: 503 }); }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (session?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const parsed = productSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Product details are invalid.', details: parsed.error.flatten() }, { status: 400 });
  try { return NextResponse.json(withProductImages(await prisma.product.create({ data: { ...parsed.data, imageUrl: encodeImageUrls(parsed.data.imageUrl) } })), { status: 201 }); }
  catch { return NextResponse.json({ error: 'Could not create product. Check that its slug is unique and category exists.' }, { status: 400 }); }
}