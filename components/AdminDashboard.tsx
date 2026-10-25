'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Box, CircleDollarSign, PackageCheck, Users } from 'lucide-react';
type Stats = { users: number; products: number; orders: number; revenue: number };
export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null); const [error, setError] = useState('');
  useEffect(() => { fetch('/api/admin/stats').then((r) => r.json()).then((d) => d.users !== undefined ? setStats(d) : setError(d.error || 'Dashboard unavailable.')).catch(() => setError('Dashboard unavailable.')); }, []);
  const items = stats ? [{ label: 'Customers', value: stats.users, icon: Users }, { label: 'Products', value: stats.products, icon: Box }, { label: 'Orders', value: stats.orders, icon: PackageCheck }, { label: 'Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: CircleDollarSign }] : [];
  return <><div className="page-heading admin-heading"><div><span className="eyebrow">YOUR BOUTIQUE, AT A GLANCE</span><h1>Good morning, Tashy.</h1><p>Here’s what’s happening at the boutique.</p></div><Link className="button button-primary" href="/admin/products">Manage collection <ArrowUpRight size={16} /></Link></div>{error && <p className="form-error">{error}</p>}<div className="stats-grid">{items.map(({ label, value, icon: Icon }) => <div className="stat-item" key={label}><span className="stat-icon"><Icon size={19} /></span><span>{label}</span><strong>{value}</strong></div>)}</div><div className="admin-quicklinks"><Link href="/admin/products"><span>01 / CATALOG</span><strong>Manage products</strong><ArrowUpRight size={18} /></Link><Link href="/admin/orders"><span>02 / FULFILLMENT</span><strong>Review orders</strong><ArrowUpRight size={18} /></Link><Link href="/admin/categories"><span>03 / COLLECTIONS</span><strong>Edit categories</strong><ArrowUpRight size={18} /></Link><Link href="/admin/users"><span>04 / COMMUNITY</span><strong>Browse customers</strong><ArrowUpRight size={18} /></Link></div></>;
}