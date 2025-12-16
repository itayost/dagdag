import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image
                src="/images/dagdag-logo.webp"
                alt="ג׳קו דגים"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <span className="text-2xl font-black tracking-tight">
                ג׳קו דגים
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              דגים טריים ואיכותיים ישירות מהים לצלחת שלכם.
              מגוון רחב של דגי ים ומים מתוקים, עם אפשרויות חיתוך לבחירתכם.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">יצירת קשר</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">יאשה חפץ 9, תל אביב</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <div className="text-slate-300">
                  <a href="tel:0502175277" className="hover:text-white transition-colors">
                    050-2175277
                  </a>
                  <span className="mx-2">|</span>
                  <a href="tel:039197734" className="hover:text-white transition-colors">
                    03-9197734
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <a
                  href="mailto:jackodagim1@gmail.com"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  jackodagim1@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">שעות פתיחה</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-brand-400 flex-shrink-0" />
                <div className="text-slate-300">
                  <p>א׳-ה׳: 8:00-20:00</p>
                  <p>ו׳: 8:00-15:30</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">עקבו אחרינו</h3>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=100085391018039"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-brand-500 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/jackodagim/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} ג׳קו דגים - כל הזכויות שמורות</p>
        </div>
      </div>
    </footer>
  );
}
