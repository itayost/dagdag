'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, Search, SearchX } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  salePrice: string | null;
  image: string | null;
  inStock: boolean;
  unit: 'KG' | 'UNIT';
  hasCuttingOptions: boolean;
  featured: boolean;
  category: {
    name: string;
    slug: string;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query.trim().length >= 2) {
      searchProducts();
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, [query]);

  const searchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-white min-h-[60vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Search className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              תוצאות חיפוש
            </h1>
          </div>
          {query && (
            <p className="text-slate-500">
              חיפוש עבור: <span className="font-medium text-slate-700">"{query}"</span>
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Empty Query State */}
        {!isLoading && query.trim().length < 2 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              הזן מילת חיפוש
            </h2>
            <p className="text-slate-500 mb-6">
              הזן לפחות 2 תווים כדי לחפש מוצרים
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
            >
              חזרה לדף הבית
            </Link>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && query.trim().length >= 2 && products.length === 0 && (
          <div className="text-center py-16">
            <SearchX className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold text-slate-700 mb-2">
              לא נמצאו מוצרים
            </h2>
            <p className="text-slate-500 mb-6">
              לא מצאנו מוצרים התואמים ל-"{query}"
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
            >
              חזרה לכל המוצרים
            </Link>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && products.length > 0 && (
          <>
            <p className="text-sm text-slate-500 mb-6">
              נמצאו {products.length} מוצרים
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
