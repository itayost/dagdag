'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, ShoppingCart, Search, X, Loader2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/utils';
import MobileMenu from './MobileMenu';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice: string | null;
  image: string | null;
  category: {
    name: string;
    slug: string;
  };
}

export default function Header() {
  const router = useRouter();
  const { itemCount, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data.products || []);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
      setMobileSearchOpen(false);
    }
  };

  const handleResultClick = (slug: string) => {
    setShowSearchResults(false);
    setSearchQuery('');
    setMobileSearchOpen(false);
    router.push(`/product/${slug}`);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Mobile: Hamburger & Search */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 text-slate-700 hover:text-slate-900 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="p-2 text-slate-700 hover:text-blue-600 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <Image
                src="/images/dagdag-logo.webp"
                alt="ג׳קו דגים"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <div className="hidden sm:block">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight block leading-none">
                  ג׳קו דגים
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
                  Premium Fish Market
                </span>
              </div>
              <span className="sm:hidden text-xl font-black text-slate-900 tracking-tight">
                ג׳קו דגים
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-auto relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 2 && setShowSearchResults(true)}
                    placeholder="חיפוש מוצרים..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pr-5 pl-12 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute left-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-sm"
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50">
                  {searchResults.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.slug)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-right"
                    >
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.category.name}</p>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPrice(parseFloat(product.salePrice || product.price))}
                      </span>
                    </button>
                  ))}
                  {searchResults.length > 5 && (
                    <button
                      onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                        setShowSearchResults(false);
                      }}
                      className="w-full p-3 text-center text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium border-t border-slate-100"
                    >
                      הצג את כל {searchResults.length} התוצאות
                    </button>
                  )}
                </div>
              )}

              {showSearchResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-xl p-6 text-center z-50">
                  <p className="text-slate-500">לא נמצאו מוצרים עבור "{searchQuery}"</p>
                </div>
              )}
            </div>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-700 hover:text-blue-600 transition-colors flex items-center gap-2"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6" strokeWidth={2} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white animate-in zoom-in duration-200">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col items-start leading-none">
                <span className="text-xs font-bold">העגלה</span>
                <span className="text-[10px] text-slate-500">שלך</span>
              </div>
            </button>
          </div>

          {/* Mobile Search Bar (expandable) */}
          {mobileSearchOpen && (
            <div className="md:hidden pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  placeholder="חיפוש מוצרים..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pr-4 pl-12 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  className="absolute left-1.5 top-1.5 p-1.5 bg-blue-600 text-white rounded-full"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>

              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                  {searchResults.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleResultClick(product.slug)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors text-right border-b border-slate-50 last:border-0"
                    >
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate text-sm">{product.name}</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {formatPrice(parseFloat(product.salePrice || product.price))}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
