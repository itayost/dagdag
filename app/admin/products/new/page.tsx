'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';

interface Category {
  id: string;
  name: string;
}

const CUTTING_STYLES = [
  { value: 'WHOLE', label: 'שלם' },
  { value: 'SLICED', label: 'פרוסות' },
  { value: 'FILLET_SKIN', label: 'פילה עם עור' },
  { value: 'FILLET_SKINLESS', label: 'פילה בלי עור' },
  { value: 'BUTTERFLIED', label: 'פתוח' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    salePrice: '',
    image: '',
    inStock: true,
    unit: 'KG' as 'KG' | 'UNIT',
    hasCuttingOptions: false,
    cuttingStyles: [] as string[],
    featured: false,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: data[0].id }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCuttingStyleToggle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      cuttingStyles: prev.cuttingStyles.includes(style)
        ? prev.cuttingStyles.filter(s => s !== style)
        : [...prev.cuttingStyles, style],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
          cuttingStyles: formData.hasCuttingOptions ? formData.cuttingStyles : [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה ביצירת המוצר');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה ביצירת המוצר');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה למוצרים
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">מוצר חדש</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Category */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              קטגוריה *
            </label>
            <select
              id="categoryId"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">בחר קטגוריה</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              שם המוצר *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="לדוגמה: דניס"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              תיאור
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="תיאור קצר של המוצר"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              תמונה
            </label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
            />
          </div>

          {/* Price & Sale Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                מחיר *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-2">
                מחיר מבצע
              </label>
              <input
                id="salePrice"
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              יחידת מידה
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="unit"
                  value="KG"
                  checked={formData.unit === 'KG'}
                  onChange={() => setFormData({ ...formData, unit: 'KG' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span>ק"ג</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="unit"
                  value="UNIT"
                  checked={formData.unit === 'UNIT'}
                  onChange={() => setFormData({ ...formData, unit: 'UNIT' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span>יחידה</span>
              </label>
            </div>
          </div>

          {/* Cutting Options */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <input
                id="hasCuttingOptions"
                type="checkbox"
                checked={formData.hasCuttingOptions}
                onChange={(e) => setFormData({ ...formData, hasCuttingOptions: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="hasCuttingOptions" className="text-sm font-medium text-gray-700">
                יש אפשרויות חיתוך
              </label>
            </div>
            {formData.hasCuttingOptions && (
              <div className="flex flex-wrap gap-2 mr-8">
                {CUTTING_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => handleCuttingStyleToggle(style.value)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      formData.cuttingStyles.includes(style.value)
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order */}
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
              סדר הצגה
            </label>
            <input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              min="0"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <input
                id="inStock"
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                במלאי
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                מוצר פעיל
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                מוצר מומלץ
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading ? 'שומר...' : 'צור מוצר'}
          </button>
          <Link
            href="/admin/products"
            className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ביטול
          </Link>
        </div>
      </form>
    </div>
  );
}
