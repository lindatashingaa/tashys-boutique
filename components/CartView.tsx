'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { productUrl } from '@/lib/product-url';

type CartItem = { id: string; quantity: number; product: { id: string; name: string; slug: string; price: string | number; stock: number; imageUrl: string[] } };
export function CartView() {
  const [items, setItems] = useState<CartItem[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  const router = useRouter();
  async function load() { const response = await fetch('/api/cart'); const data = await response.json(); if (!response.ok) setError(data.error); else setItems(data.items); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function update(item: CartItem, quantity: number) {
    const response = await fetch('/api/cart', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ itemId: item.id, quantity }) });
    const data = await response.json(); if (!response.ok) setError(data.error); else { setError(''); await load(); }
  }
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  if (loading) return <div className="loading-state">Gathering your lovely things…</div>;
  if (error && !items.length) return <div className="empty-state"><h3>Your bag is waiting</h3><p>{error}</p><Link className="button button-outline" href="/login">Sign in</Link></div>;
  if (!items.length) return <div className="empty-state"><h3>Your bag is taking a little breather</h3><p>There are beautiful things waiting to come home with you.</p><Link className="button button-primary" href="/products">Explore the collection</Link></div>;
  return <div className="cart-layout"><div className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}><Link href={productUrl(item.product.slug)}><img src={item.product.imageUrl[0]} alt={item.product.name} /></Link><div className="cart-item-copy"><Link className="product-name" href={productUrl(item.product.slug)}>{item.product.name}</Link><span className="cart-unit-price">${Number(item.product.price).toFixed(2)}</span><div className="quantity-picker compact"><button aria-label="Decrease quantity" onClick={() => update(item, Math.max(0, item.quantity - 1))}><Minus size={13} /></button><span>{item.quantity}</span><button aria-label="Increase quantity" disabled={item.quantity >= item.product.stock} onClick={() => update(item, item.quantity + 1)}><Plus size={13} /></button></div></div><div className="cart-item-end"><strong>${(Number(item.product.price) * item.quantity).toFixed(2)}</strong><button className="icon-button delete-button" aria-label="Remove item" onClick={() => update(item, 0)}><Trash2 size={16} /></button></div></article>)}</div><aside className="summary-panel"><h2>Order summary</h2><div className="summary-row"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><div className="summary-row"><span>Delivery</span><span>Calculated at checkout</span></div><p className="summary-note">Complimentary delivery over $150.</p><div className="summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div>{error && <p className="form-error">{error}</p>}<button className="button button-primary full-width" onClick={() => router.push('/checkout')}>Continue to checkout</button><Link className="continue-shopping" href="/products">Continue shopping</Link></aside></div>;
}