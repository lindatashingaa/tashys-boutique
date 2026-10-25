'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Line = { id: string; quantity: number; product: { name: string; price: string | number; imageUrl: string[] } };
export function CheckoutForm({ name, email, phone }: { name: string; email: string; phone: string }) {
  const [items, setItems] = useState<Line[]>([]); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const router = useRouter();
  useEffect(() => { fetch('/api/cart').then((r) => r.json()).then((d) => { if (d.items) setItems(d.items); else setError(d.error || 'Could not load your bag.'); }).catch(() => setError('Could not load your bag.')); }, []);
  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries())) });
    const data = await response.json();
    if (!response.ok) { setError(data.error || 'Please check your details.'); setBusy(false); return; }
    router.push(`/checkout/payment?orderId=${data.orderId}`);
  }
  if (!items.length && !error) return <div className="loading-state">Preparing your checkout…</div>;
  if (error && !items.length) return <div className="empty-state"><h3>We couldn’t load your bag</h3><p>{error}</p><Link href="/cart">Return to bag</Link></div>;
  return <div className="checkout-layout"><form className="form-stack checkout-form" onSubmit={submit}><h2>Delivery details</h2><label>Full name<input name="fullName" defaultValue={name} required minLength={2} autoComplete="name" /></label><label>Email address<input name="email" type="email" defaultValue={email} required autoComplete="email" /></label><label>Phone number<input name="phone" type="tel" defaultValue={phone} required minLength={7} autoComplete="tel" /></label><label>Street address<input name="address" required minLength={5} autoComplete="street-address" /></label><label>City<input name="city" defaultValue="Harare" required minLength={2} autoComplete="address-level2" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary" disabled={busy}>{busy ? 'Preparing order…' : 'Continue to payment'}</button></form><aside className="summary-panel"><h2>Your pieces</h2>{items.map((item) => <div className="checkout-line" key={item.id}><span>{item.product.name} <small>× {item.quantity}</small></span><strong>${(Number(item.product.price) * item.quantity).toFixed(2)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div><p className="summary-note">You’ll review a secure-looking mock payment screen next. No real payment is taken.</p></aside></div>;
}