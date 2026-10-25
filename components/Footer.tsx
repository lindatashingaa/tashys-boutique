import Link from 'next/link';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return <footer className="site-footer">
    <div className="footer-top"><div><Link className="footer-brand" href="/">TASHY'S BOUTIQUE</Link><p>Wear what makes you feel like you.</p><span className="footer-location"><MapPin size={14} />Harare, Zimbabwe</span></div><div className="footer-links"><Link href="/products">Shop all</Link><Link href="/orders">Your orders</Link><Link href="/login">My account</Link><a href="https://wa.me/263711692134"><Phone size={13} />0711692134</a><a href="mailto:tashys.boutique@gmail.com">tashys.boutique@gmail.com</a></div><div className="footer-social"><a aria-label="Instagram" href="https://instagram.com"><Instagram size={19} /></a><a aria-label="Email Tashy's Boutique" href="mailto:tashys.boutique@gmail.com"><Mail size={19} /></a></div></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} TASHY'S BOUTIQUE</span><span>Made for your main-character moments.</span></div>
  </footer>;
}