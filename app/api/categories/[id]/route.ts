import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { categorySchema } from '@/lib/schemas';
type Context = { params: { id: string } };
export async function PATCH(request: Request, { params }: Context) {
  if ((await getSession())?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  const parsed = categorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Category details are invalid.' }, { status: 400 });
  try { return NextResponse.json(await prisma.category.update({ where: { id: params.id }, data: parsed.data })); } catch { return NextResponse.json({ error: 'Could not update category.' }, { status: 400 }); }
}
export async function DELETE(_request: Request, { params }: Context) {
  if ((await getSession())?.role !== 'ADMIN') return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  try { await prisma.category.delete({ where: { id: params.id } }); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: 'Move or remove its products before deleting this category.' }, { status: 409 }); }
}