'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function AuthForm({ mode, nextPath }: { mode: 'login' | 'register'; nextPath?: string }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) { setError(result.error || 'Please try again.'); setBusy(false); return; }
    const safeNext = nextPath?.startsWith('/') && !nextPath.startsWith('//') && !nextPath.includes('\\') ? nextPath : null;
    const destination = safeNext || (result.user.role === 'ADMIN' ? '/admin' : '/');
    router.push(destination); router.refresh();
  }
  return <form className="form-stack" onSubmit={submit}>
    {mode === 'register' && <label>Full name<input name="name" autoComplete="name" required minLength={2} /></label>}
    <label>Email address<input name="email" type="email" autoComplete="email" required /></label>
    {mode === 'register' && <label>Phone number<input name="phone" type="tel" autoComplete="tel" required minLength={7} placeholder="0712 345 678" /></label>}
    <label>Password<input name="password" type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required minLength={mode === 'register' ? 8 : 1} /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-primary form-submit" disabled={busy}>{busy ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create account'}</button>
    <p className="form-switch">{mode === 'login' ? 'New to Tashy’s?' : 'Already have an account?'} <Link href={mode === 'login' ? '/register' : '/login'}>{mode === 'login' ? 'Create an account' : 'Sign in'}</Link></p>
  </form>;
}