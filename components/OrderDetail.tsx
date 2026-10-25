'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
type Order = { id: string; status: string; totalAmount: string | number; createdAt: string; shippingAddress: string; phone: string; city: string; items: { id: string; quantity: number; price: string | number; product: { name: string; imageUrl: string[] } }[]; payment?: { status: string } | null };
export function OrderDetail({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null); const [error, setError] = useState('');
  useEffect(() => { fetch(`/api/orders/${id}`).then((r) => r.json()).then((d) => d.id ? setOrder(d) : setError(d.error || 'Order not found.')).catch(() => setError('Could not load order.')); }, [id]);
  if (error) return <div className="empty-state"><h3>Order not found</h3><p>{error}</p><Link href="/orders">Back to orders</Link></div>;
  if (!order) return <div className="loading-state">Loading your order…</div>;
  return <div className="order-detail">
    <div className="order-detail-head"><div><span className="eyebrow">ORDER {order.id.slice(-8).toUpperCase()}</span><h2>Thank you for choosing TASHY'S BOUTIQUE</h2><p>Placed {new Date(order.createdAt).toLocaleDateString()}</p></div><span className={`status-pill status-${order.status.toLowerCase()}`}>{order.status}</span></div>
    <div className="order-detail-lines">{order.items.map((item) => <div className="order-detail-line" key={item.id}><img src={item.product.imageUrl[0]} alt="" /><span>{item.product.name}<small>Quantity {item.quantity}</small></span><strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong></div>)}</div>
    <div className="order-detail-meta"><div><span className="eyebrow">DELIVERING TO</span><p>{order.shippingAddress.split('\n').map((line, index) => <span key={index}>{line}<br /></span>)}{order.city}<br />{order.phone}</p></div><div><span className="eyebrow">PAYMENT</span><p>{order.payment?.status || 'Pending'} · Mock card</p></div><div className="summary-total"><span>Total</span><strong>${Number(order.totalAmount).toFixed(2)}</strong></div></div>
    <Link className="button button-outline" href="/orders">Back to your orders</Link>
  </div>;
}