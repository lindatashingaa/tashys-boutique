'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PackageCheck } from 'lucide-react';
type Order = { id: string; status: string; totalAmount: string | number; createdAt: string; items: { id: string; quantity: number; product: { name: string } }[] };
export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { fetch('/api/orders').then((r) => r.json()).then((d) => Array.isArray(d) ? setOrders(d) : setError(d.error || 'Could not load orders.')).catch(() => setError('Could not load orders.')).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="loading-state">Finding your orders…</div>;
  if (error) return <div className="empty-state"><p>{error}</p></div>;
  if (!orders.length) return <div className="empty-state"><PackageCheck size={30} /><h3>Your story starts here</h3><p>Your orders will appear here after your first checkout.</p><Link className="button button-primary" href="/shop">Explore the collection</Link></div>;
  return <div className="order-list">{orders.map((order) => <Link href={`/orders/${order.id}`} className="order-row" key={order.id}><div><span className="eyebrow">ORDER {order.id.slice(-8).toUpperCase()}</span><strong>{order.items.map((item) => item.product.name).join(', ')}</strong><small>{new Date(order.createdAt).toLocaleDateString()}</small></div><div className="order-right"><span className={`status-pill status-${order.status.toLowerCase()}`}>{order.status}</span><strong>${Number(order.totalAmount).toFixed(2)}</strong></div></Link>)}</div>;
}