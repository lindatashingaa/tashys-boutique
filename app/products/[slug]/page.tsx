import { ProductDetailContent } from '@/components/ProductDetailContent';

export const dynamic = 'force-dynamic';
export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  return <ProductDetailContent slug={params.slug} />;
}