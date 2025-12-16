'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  X,
  Phone,
  MapPin,
  ChevronLeft,
  Loader2,
  ChefHat,
  Info,
  Truck,
  MessageCircle
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const isActive = (path: string) => pathname === path;
  const isCategoryActive = (slug: string) => pathname === `/category/${slug}`;

  return (
    <div
      className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`absolute inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header with Logo */}
        <div className="p-5 bg-gradient-to-l from-brand-600 to-brand-500 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/dagdag-logo.webp"
              alt="דגדג"
              width={40}
              height={40}
              className="rounded-lg bg-white p-1"
            />
            <div>
              <h2 className="font-bold text-lg">ג׳קו דגים</h2>
              <p className="text-xs text-white/70">דגים טריים מהים לצלחת</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Categories Section */}
          <div className="py-2">
            <div className="px-6 py-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">קטגוריות</h3>
            </div>

            {/* Home */}
            <Link
              href="/"
              onClick={onClose}
              className={`flex items-center justify-between px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition ${
                isActive('/') ? 'text-brand-500 font-bold bg-brand-50/50' : 'text-slate-700'
              }`}
            >
              <span className="font-medium">דף הבית</span>
              {isActive('/') && <ChevronLeft size={16} className="text-brand-500" />}
            </Link>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  onClick={onClose}
                  className={`flex items-center justify-between px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition ${
                    isCategoryActive(category.slug)
                      ? 'text-brand-500 font-bold bg-brand-50/50'
                      : 'text-slate-700'
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                  {isCategoryActive(category.slug) && <ChevronLeft size={16} className="text-brand-500" />}
                </Link>
              ))
            )}
          </div>

          {/* Quick Links Section */}
          <div className="py-2 border-t border-slate-100">
            <div className="px-6 py-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">קישורים מהירים</h3>
            </div>

            <Link
              href="/recipes"
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition ${
                isActive('/recipes') ? 'text-brand-500 font-bold' : 'text-slate-600'
              }`}
            >
              <ChefHat size={18} className="text-amber-500" />
              <span>מתכונים</span>
            </Link>

            <Link
              href="/delivery-areas"
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition ${
                isActive('/delivery-areas') ? 'text-brand-500 font-bold' : 'text-slate-600'
              }`}
            >
              <Truck size={18} className="text-emerald-500" />
              <span>אזורי משלוח</span>
            </Link>

            <Link
              href="/about"
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition ${
                isActive('/about') ? 'text-brand-500 font-bold' : 'text-slate-600'
              }`}
            >
              <Info size={18} className="text-brand-500" />
              <span>אודות</span>
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className={`flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition ${
                isActive('/contact') ? 'text-brand-500 font-bold' : 'text-slate-600'
              }`}
            >
              <MessageCircle size={18} className="text-brand-500" />
              <span>צור קשר</span>
            </Link>
          </div>
        </div>

        {/* Contact Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <a
              href="tel:0502175277"
              className="flex items-center gap-2 hover:text-brand-500 transition-colors"
            >
              <Phone size={14} className="text-brand-500" />
              050-2175277
            </a>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-brand-500" />
              <span className="text-xs">יאשה חפץ 9, ת״א</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
