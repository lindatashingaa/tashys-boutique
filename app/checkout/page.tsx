import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { CheckoutForm } from '@/components/CheckoutForm';
export const metadata = { title: 'Checkout' };
export default async function CheckoutPage() { const session = await getSession(); if (!session) redirect('/login?next=/checkout'); return <section className="page-shell"><div className="page-heading"><div><span className="eyebrow">ALMOST YOURS</span><h1>Let’s make it official.</h1><p>Where should we send your new favorites?</p></div></div><CheckoutForm name={session.name} email={session.email} phone={session.phone} /></section>; }