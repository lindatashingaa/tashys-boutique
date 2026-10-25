import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Enter a valid email and password.' }, { status: 400 });
  try {
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (!user || !(await bcrypt.compare(parsed.data.password, user.password))) return NextResponse.json({ error: 'Email or password is incorrect.' }, { status: 401 });
    if (user.role !== 'ADMIN' && user.role !== 'CUSTOMER') return NextResponse.json({ error: 'This account has an invalid role.' }, { status: 403 });
    await createSession({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch { return NextResponse.json({ error: 'Could not sign in. Check the database connection.' }, { status: 503 }); }
}