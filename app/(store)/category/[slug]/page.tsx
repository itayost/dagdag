'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Package } from 'lucide-react';
import ProductCard from '@/components/store/ProductCard';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

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
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${slug}`);
      const data = await response.json();
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray);

      // Get category info from first product
      if (productsArray.length > 0 && productsArray[0].category) {
        setCategory(productsArray[0].category);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לדף הבית
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {category?.name || 'קטגוריה'}
          </h1>
          <p className="mt-2 text-slate-500">
            {products.length} מוצרים
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-100">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">אין מוצרים</h3>
            <p className="text-slate-500">לא נמצאו מוצרים בקטגוריה זו</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
