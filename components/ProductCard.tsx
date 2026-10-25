import Link from 'next/link';
import type { CatalogProduct } from '@/lib/catalog';
import { productUrl } from '@/lib/product-url';

export function ProductCard({ product }: { product: CatalogProduct }) {
  return <article className="product-card">
    <Link className="product-image-link" href={productUrl(product.slug)}>
      <img className="product-image" src={product.imageUrl[0]} alt={product.name} loading="lazy" />
      {product.isFeatured && <span className="image-label">TASHY'S PICK</span>}
      {product.stock === 0 && <span className="sold-out-label">SOLD OUT</span>}
    </Link>
    <div className="product-card-info"><div><Link className="product-name" href={productUrl(product.slug)}>{product.name}</Link><span className="product-category">{product.category.name}</span></div><span className="product-price">${product.price.toFixed(2)}</span></div>
    <span className={`stock-note ${product.stock === 0 ? 'out-stock' : product.stock <= 3 ? 'low-stock' : 'in-stock'}`}>
      {product.stock === 0 ? 'Out of stock' : product.stock <= 3 ? `Low stock · ${product.stock} left` : 'In stock'}
    </span>
  </article>;
}