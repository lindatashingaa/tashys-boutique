import Link from 'next/link';
import { ArrowRight, MoveUpRight } from 'lucide-react';
import { listProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';

export const dynamic = 'force-dynamic';

const collections = [
  { title: 'Clothes', label: '01 / COLLECTION', description: 'Dresses, Suits & Skirts', href: '/shop', image: '/images/elegent%20white%20dress.jpeg' },
  { title: 'Shoes', label: '02 / COLLECTION', description: 'Heels, Boots & More', href: '/shop?category=shoes', image: '/images/pink%20heels.jpeg' }
];

export default async function HomePage() {
  const products = await listProducts();
  const featured = products.filter((product) => product.isFeatured).slice(0, 6);
  return <>
    <section className="hero-band"><div className="hero-copy"><span className="eyebrow">A LITTLE MORE YOU</span><h1>Welcome to<br /><em>TASHY'S BOUTIQUE</em><br />- Slay Every Day</h1><p>For the plans you make, the moments you find, and the feeling you keep.</p><Link className="button button-primary" href="/shop">Shop the collection <ArrowRight size={17} /></Link><span className="hero-note">DRESS LIKE YOU MEAN IT · HARARE, ZIMBABWE</span></div><div className="hero-image"><img src="/images/denim%20dress.jpeg" alt="Tashy's Boutique denim dress" /><span className="hero-image-caption">THE NEW MOOD <MoveUpRight size={15} /></span></div><div className="hero-index">01 <span>/</span> 03</div></section>
    <section className="section-shell category-section"><div className="section-heading"><div><span className="eyebrow">FIND YOUR FEELING</span><h2>Made for your kind of day.</h2></div><Link className="text-link" href="/shop">Explore everything <ArrowRight size={15} /></Link></div><div className="category-grid">{collections.map((collection) => <Link href={collection.href} className="category-tile" key={collection.title}><img src={collection.image} alt={collection.title} loading="lazy" /><div className="category-overlay"><span>{collection.label}</span><strong>{collection.title}</strong><span className="category-description">{collection.description}</span><span className="category-arrow"><ArrowRight size={17} /></span></div></Link>)}</div></section>
    <section className="section-shell featured-section"><div className="section-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h2>Currently on our minds.</h2></div><Link className="text-link" href="/shop">Shop all pieces <ArrowRight size={15} /></Link></div><div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section className="promo-band"><div className="promo-image"><img src="/images/blazer%20dresss.jpeg" alt="Red blazer dress from Tashy's Boutique" loading="lazy" /></div><div className="promo-copy"><span className="eyebrow">A NOTE FROM TASHY</span><h2>Wear the feeling.<br /><em>Keep the moment.</em></h2><p>Thoughtful details, feel-good fits, and little luxuries picked to make getting dressed the best part of your day.</p><Link className="text-link" href="/shop">Find your next favorite <ArrowRight size={15} /></Link><span className="promo-stamp">LOVE<br />YOUR<br />LOOK</span></div></section>
    <section className="home-contact"><div><span className="eyebrow">COME SAY HELLO</span><h2>Your boutique, right here in Harare.</h2><p>Need a size check or a little styling advice? Tashy's team is one WhatsApp away.</p></div><div className="home-contact-actions"><a className="button button-primary" href="https://wa.me/263711692134">WhatsApp 0711692134 <MoveUpRight size={16} /></a><a href="mailto:tashys.boutique@gmail.com">tashys.boutique@gmail.com</a><span>Harare, Zimbabwe</span></div></section>
    <section className="newsletter-strip"><span>Good style. Good energy. Always you.</span><Link href="/register">Join the Tashy’s circle <ArrowRight size={15} /></Link></section>
  </>;
}