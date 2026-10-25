import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { categorySchema } from '@/lib/schemas';

export async function GET() { try { return NextResponse.json(await prisma.category.findMany({ orderBy: { name: 'asc' } })); } catch { return NextResponse.json([]); } }
export async function POST(request: Request) {
  if ((await getSession())?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const parsed = categorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Category details are invalid.' }, { status: 400 });
  try { return NextResponse.json(await prisma.category.create({ data: parsed.data }), { status: 201 }); } catch { return NextResponse.json({ error: 'Category name or slug already exists.' }, { status: 409 }); }
}