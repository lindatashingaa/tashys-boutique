import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login?next=/admin');
  if (session.role !== 'ADMIN') redirect('/login?next=/admin');
  return <section className="admin-shell"><aside className="admin-sidebar"><span className="eyebrow">TASHY'S BOUTIQUE</span><strong>Studio</strong><nav><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/categories">Categories</Link><Link href="/admin/orders">Orders</Link><Link href="/admin/users">Customers</Link></nav><Link className="storefront-link" href="/">← Back to storefront</Link></aside><div className="admin-content">{children}</div></section>;
}