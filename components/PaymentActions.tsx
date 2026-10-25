'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck } from 'lucide-react';

export function PaymentActions({ orderId, total }: { orderId: string; total: number }) {
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const router = useRouter();
  async function pay(success: boolean) {
    setBusy(true); setError('');
    const response = await fetch(`/api/orders/${orderId}/payment`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ success }) });
    const data = await response.json();
    if (response.ok) router.push('/orders'); else { setError(data.error || 'Payment failed. Please retry.'); setBusy(false); }
  }
  return <div className="payment-box"><div className="payment-brand"><CreditCard size={23} /><span>Mock card payment</span><ShieldCheck size={18} /></div><div className="mock-card"><small>DEMO CHECKOUT</small><span>•••• &nbsp;•••• &nbsp;•••• &nbsp;4242</span><div><span>TASHY'S CUSTOMER</span><span>08/28</span></div></div><p className="payment-amount">Amount due <strong>${total.toFixed(2)}</strong></p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary full-width" disabled={busy} onClick={() => pay(true)}>{busy ? 'Processing…' : 'Pay - Simulate Success'}</button><button className="button button-outline full-width failure-button" disabled={busy} onClick={() => pay(false)}>Simulate Failure</button><p className="summary-note">This is a payment simulation. No card details are collected and no real charge is made.</p></div>;
}