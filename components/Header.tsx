'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Heart, Menu, ShoppingBag, UserRound, X } from 'lucide-react';
import { signOutAction } from '@/app/actions';

type User = { name: string; role: string } | null;
export function Header() {
  const [user, setUser] = useState<User>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { fetch('/api/auth/me').then((r) => r.json()).then((d) => setUser(d.user)).catch(() => setUser(null)); }, [pathname]);
  async function signOut() { await signOutAction(); setUser(null); router.push('/'); router.refresh(); }
  return <>
    <div className="announcement">A little something lovely: complimentary delivery on orders over $150</div>
    <header className="site-header">
      <button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setOpen(!open)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      <nav className={`nav-left ${open ? 'nav-open' : ''}`} aria-label="Main navigation">
        <Link href="/" onClick={() => setOpen(false)}>Home</Link>
        <Link href="/shop" onClick={() => setOpen(false)}>Clothes</Link>
        <Link href="/shop?category=shoes" onClick={() => setOpen(false)}>Shoes</Link>
        <Link href="/orders" onClick={() => setOpen(false)}>Orders</Link>
      </nav>
      <Link className="wordmark" href="/" aria-label="Tashy's Boutique home"><span>TASHY'S</span><small>BOUTIQUE</small></Link>
      <nav className="nav-right" aria-label="Account navigation">
        {user?.role === 'ADMIN' && <Link href="/admin">Admin</Link>}
        {user ? <><Link href="/orders" className="account-link">Hi, {user.name.split(' ')[0]}</Link><button className="text-button signout" onClick={signOut}>Sign out</button></> : <Link className="sign-in-link" href="/login"><UserRound size={18} strokeWidth={1.5} /><span>Login</span></Link>}
        <Link href="/shop" aria-label="Browse favorites"><Heart size={19} strokeWidth={1.5} /></Link>
        <Link href="/cart" aria-label="Shopping bag"><ShoppingBag size={20} strokeWidth={1.5} /></Link>
      </nav>
    </header>
  </>;
}