import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listProducts } from '@/lib/catalog';
import { AddToCartButton } from '@/components/AddToCartButton';

export async function ProductDetailContent({ slug }: { slug: string }) {
  const product = (await listProducts()).find((item) => item.slug === slug);
  if (!product) notFound();
  return <section className="page-shell detail-shell"><nav className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href={`/shop?category=${product.category.slug}`}>{product.category.name}</Link><span>/</span><span>{product.name}</span></nav><div className="product-detail"><div className="detail-image"><img src={product.imageUrl[0]} alt={product.name} /></div><div className="detail-copy"><span className="eyebrow">{product.category.name.toUpperCase()}</span><h1>{product.name}</h1><p className="detail-price">${product.price.toFixed(2)}</p><div className="detail-rule" /><p className="detail-description">{product.description}</p><p className={`detail-stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>{product.stock === 0 ? 'Currently sold out' : product.stock <= 3 ? `Only ${product.stock} left — don't wait` : 'In stock and ready for you'}</p><AddToCartButton productId={product.id} stock={product.stock} /><div className="detail-assurance"><span>Thoughtfully selected</span><span>Harare, Zimbabwe · Delivery available</span><span><a href="https://wa.me/263711692134">WhatsApp 0711692134</a></span><span><a href="mailto:tashys.boutique@gmail.com">tashys.boutique@gmail.com</a></span></div></div></div></section>;
}