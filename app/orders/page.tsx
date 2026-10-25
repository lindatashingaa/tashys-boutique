import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { OrderList } from '@/components/OrderList';
export const metadata = { title: 'Your orders' };
export default async function OrdersPage() { if (!(await getSession())) redirect('/login?next=/orders'); return <section className="page-shell"><div className="page-heading"><div><span className="eyebrow">THE GOOD MEMORIES</span><h1>Your orders.</h1><p>All your boutique moments, right here.</p></div></div><OrderList /></section>; }