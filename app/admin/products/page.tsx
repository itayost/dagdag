'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Loader2, Package, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  salePrice: string | null;
  image: string | null;
  inStock: boolean;
  unit: 'KG' | 'UNIT';
  hasCuttingOptions: boolean;
  featured: boolean;
  order: number;
  isActive: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const url = selectedCategory
        ? `/api/admin/products?categoryId=${selectedCategory}`
        : '/api/admin/products';
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המוצר?')) {
      return;
    }

    setDeleteId(id);
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'שגיאה במחיקה');
      }

      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : 'שגיאה במחיקה');
    } finally {
      setDeleteId(null);
    }
  };

  const getUnitLabel = (unit: 'KG' | 'UNIT') => {
    return unit === 'KG' ? 'ק"ג' : 'יחידה';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">מוצרים</h1>
          <p className="text-gray-500 mt-1">ניהול מוצרים בחנות</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          מוצר חדש
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין מוצרים</h3>
          <p className="text-gray-500 mb-6">התחל בהוספת מוצר ראשון</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            הוסף מוצר
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">תמונה</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">שם</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">קטגוריה</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">מחיר</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">יחידה</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">מלאי</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">סטטוס</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    {product.image ? (
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
                            <Star className="w-3 h-3" />
                            מומלץ
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{product.slug}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{product.category.name}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      {product.salePrice ? (
                        <>
                          <p className="font-medium text-red-600">{formatPrice(Number(product.salePrice))}</p>
                          <p className="text-sm text-gray-400 line-through">{formatPrice(Number(product.price))}</p>
                        </>
                      ) : (
                        <p className="font-medium text-gray-900">{formatPrice(Number(product.price))}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{getUnitLabel(product.unit)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.inStock
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.inStock ? 'במלאי' : 'אזל'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {product.isActive ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteId === product.id}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleteId === product.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
