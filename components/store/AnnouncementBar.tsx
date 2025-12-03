import Link from 'next/link';
import { Truck, Phone } from 'lucide-react';

const navLinks = [
  { href: '/about', label: 'אודות' },
  { href: '/recipes', label: 'מתכונים' },
  { href: '/delivery-areas', label: 'אזורי חלוקה' },
  { href: '/contact', label: 'צרו קשר' },
];

export default function AnnouncementBar() {
  return (
    <div className="bg-slate-900 text-slate-300 text-xs md:text-sm py-3 tracking-wide">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Left: Delivery info */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Truck size={14} className="text-emerald-400" />
          <span>משלוחים לכל גוש דן</span>
        </div>

        {/* Center: Navigation links (hidden on mobile) */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Phone */}
        <a
          href="tel:0502175277"
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <Phone size={14} />
          <span className="font-medium">050-2175277</span>
        </a>
      </div>
    </div>
  );
}
