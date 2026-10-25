import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { registerSchema } from '@/lib/schemas';

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Check your name, email, and password. Passwords need at least 8 characters.' }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  try {
    if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    const user = await prisma.user.create({ data: { name: parsed.data.name, email, phone: parsed.data.phone, password: await bcrypt.hash(parsed.data.password, 12), cart: { create: {} } } });
    await createSession({ id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER' });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } }, { status: 201 });
  } catch { return NextResponse.json({ error: 'Could not create your account. Check the database connection.' }, { status: 503 }); }
}