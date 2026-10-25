import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  return <a className="whatsapp-float" href="https://wa.me/263711692134" target="_blank" rel="noreferrer" aria-label="Chat with Tashy's Boutique on WhatsApp at 0711692134">
    <MessageCircle size={21} />
    <span>WhatsApp us</span>
  </a>;
}