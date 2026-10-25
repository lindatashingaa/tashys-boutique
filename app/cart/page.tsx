import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { CartView } from '@/components/CartView';
export const metadata = { title: 'Your bag' };
export default async function CartPage() { if (!(await getSession())) redirect('/login?next=/cart'); return <section className="page-shell"><div className="page-heading"><div><span className="eyebrow">THE GOOD CHOICES</span><h1>Your bag.</h1><p>A few lovely things, all in one place.</p></div></div><CartView /></section>; }