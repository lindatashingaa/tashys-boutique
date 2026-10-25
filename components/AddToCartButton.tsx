'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';

export function AddToCartButton({ productId, stock }: { productId: string; stock: number }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function add() {
    setBusy(true); setMessage('');
    const response = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) });
    const data = await response.json();
    if (response.status === 401) router.push('/login?next=/cart');
    else if (!response.ok) setMessage(data.error || 'Could not add this item.');
    else {
      setMessage('Added to your bag.');
      window.setTimeout(() => setMessage(''), 3200);
    }
    setBusy(false);
  }
  return <div className="add-cart-group">
    <div className="quantity-picker"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity(quantity - 1)}>−</button><span>{quantity}</span><button aria-label="Increase quantity" disabled={quantity >= stock} onClick={() => setQuantity(quantity + 1)}>+</button></div>
    <button className="button button-primary add-button" disabled={!stock || busy} onClick={add}><ShoppingBag size={17} />{!stock ? 'Sold out' : busy ? 'Adding…' : 'Add to bag'}</button>
    {message && <p className="inline-message toast-message" role="status">{message}</p>}
  </div>;
}