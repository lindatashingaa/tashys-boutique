import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: { default: "Tashy's Boutique | Slay Every Day", template: "%s | Tashy's Boutique" },
  description: "Discover dresses, shoes, bags, and little luxuries at Tashy's Boutique.",
  applicationName: "Tashy's Boutique"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header /><main>{children}</main><Footer /><WhatsAppButton /></body></html>;
}