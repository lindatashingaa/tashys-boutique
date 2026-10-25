import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { OrderDetail } from '@/components/OrderDetail';
export default async function OrderPage({ params }: { params: { id: string } }) { if (!(await getSession())) redirect('/login?next=/orders'); return <section className="page-shell"><OrderDetail id={params.id} /></section>; }