import { listProducts } from '@/lib/catalog';
import { ProductBrowser } from '@/components/ProductBrowser';

export const metadata = { title: 'Shop the collection' };
export const dynamic = 'force-dynamic';
export default async function ProductsPage({ searchParams }: { searchParams: { category?: string } }) {
  const products = await listProducts();
  return <section className="page-shell"><div className="page-heading"><div><span className="eyebrow">THE TASHY’S EDIT</span><h1>Find your feeling.</h1><p>Pieces that look like you, on your very best day.</p></div></div><ProductBrowser products={products} initialCategory={searchParams.category || ''} /></section>;
}