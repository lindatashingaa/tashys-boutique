'use server';

import { cookies } from 'next/headers';
import { SESSION_COOKIE } from '@/lib/auth';

export async function signOutAction() {
  cookies().delete(SESSION_COOKIE);
}