'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { CatalogProduct } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';

export function ProductBrowser({ products, initialCategory = '' }: { products: CatalogProduct[]; initialCategory?: string }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState('featured');
  const categories = [...new Map(products.map((item) => [item.category.slug, item.category])).values()];
  const filtered = useMemo(() => {
    const list = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) && (!category || product.category.slug === category));
    if (sort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, products, search, sort]);
  return <>
    <div className="catalog-toolbar"><label className="search-field"><Search size={17} /><input placeholder="Find your next favorite" value={search} onChange={(event) => setSearch(event.target.value)} /></label><div className="catalog-filters"><label><SlidersHorizontal size={16} /><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All collections</option>{categories.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label><select aria-label="Sort products" value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></div></div>
    <p className="result-count">{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} to love</p>
    {filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><h3>Nothing found just yet</h3><p>Try another search or collection.</p></div>}
  </>;
}