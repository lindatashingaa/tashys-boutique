import { listProducts } from '@/lib/catalog';
import { ProductBrowser } from '@/components/ProductBrowser';

export const metadata = { title: 'Shop Clothes & Shoes' };
export const dynamic = 'force-dynamic';

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  const products = await listProducts();
  return <section className="page-shell"><div className="page-heading"><div><span className="eyebrow">THE TASHY'S EDIT</span><h1>Clothes & Shoes.</h1><p>Dresses, suits, skirts, and shoes, all in one place.</p></div></div><ProductBrowser products={products} initialCategory={searchParams.category || ''} /></section>;
}