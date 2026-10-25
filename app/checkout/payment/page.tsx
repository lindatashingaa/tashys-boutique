import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { PaymentActions } from '@/components/PaymentActions';
export const metadata = { title: 'Payment' };
export default async function PaymentPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const session = await getSession(); if (!session) redirect('/login?next=/checkout');
  if (!searchParams.orderId) redirect('/checkout');
  let order;
  try { order = await prisma.order.findFirst({ where: { id: searchParams.orderId, userId: session.id }, include: { items: { include: { product: true } } } }); } catch { order = null; }
  if (!order) redirect('/cart');
  return <section className="page-shell payment-page"><div className="page-heading"><div><span className="eyebrow">ONE LAST LITTLE STEP</span><h1>Payment.</h1><p>Your pieces are waiting.</p></div></div><div className="payment-layout"><div className="payment-summary"><h2>Your order</h2>{order.items.map((item) => <div className="checkout-line" key={item.id}><span>{item.product.name} <small>× {item.quantity}</small></span><strong>${(Number(item.price) * item.quantity).toFixed(2)}</strong></div>)}<div className="summary-total"><span>Total</span><strong>${Number(order.totalAmount).toFixed(2)}</strong></div></div><PaymentActions orderId={order.id} total={Number(order.totalAmount)} /></div></section>;
}