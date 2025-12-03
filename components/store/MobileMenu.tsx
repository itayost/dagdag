'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Phone, MapPin, ChevronLeft, Loader2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
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

  const getActiveSlug = () => {
    if (pathname === '/') return 'all';
    const match = pathname.match(/\/category\/([^/]+)/);
    return match ? match[1] : null;
  };

  const activeSlug = getActiveSlug();

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
        className={`absolute inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
          <div>
            <h2 className="font-bold text-xl">תפריט</h2>
            <p className="text-xs text-slate-400 mt-1">ג׳קו דגים</p>
          </div>
          <button
            onClick={onClose}
            className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* All Products */}
          <Link
            href="/"
            onClick={onClose}
            className={`w-full text-right px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition flex items-center justify-between ${
              activeSlug === 'all' ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700'
            }`}
          >
            כל המוצרים
            {activeSlug === 'all' && <ChevronLeft size={16} />}
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
                className={`w-full text-right px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition flex items-center justify-between ${
                  activeSlug === category.slug
                    ? 'text-blue-600 font-bold bg-blue-50/50'
                    : 'text-slate-700'
                }`}
              >
                {category.name}
                {activeSlug === category.slug && <ChevronLeft size={16} />}
              </Link>
            ))
          )}
        </div>

        {/* Contact Info */}
        <div className="p-6 bg-slate-50 text-sm text-slate-500 space-y-3 border-t border-slate-100">
          <a
            href="tel:0502175277"
            className="flex items-center gap-3 hover:text-blue-600 transition-colors"
          >
            <Phone size={16} className="text-blue-500" />
            050-2175277
          </a>
          <a
            href="tel:039197734"
            className="flex items-center gap-3 hover:text-blue-600 transition-colors"
          >
            <Phone size={16} className="text-blue-500" />
            03-9197734
          </a>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-blue-500" />
            יאשה חפץ 9, תל אביב
          </div>
        </div>
      </div>
    </div>
  );
}
