'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, Package, Scissors, Star, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

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
  cuttingStyles: string[];
  featured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

const CUTTING_STYLE_LABELS: Record<string, string> = {
  WHOLE: 'שלם',
  SLICED: 'פרוסות',
  FILLET_SKIN: 'פילה עם עור',
  FILLET_SKINLESS: 'פילה בלי עור',
  BUTTERFLIED: 'פתוח',
  LENGTHWISE_CUTS: 'חריצים לאורך',
  HEAD_TAIL: 'ראש זנב',
  GROUND: 'טחון',
};

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = use(params);
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedCuttingStyle, setSelectedCuttingStyle] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${slug}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
      if (data.hasCuttingOptions && data.cuttingStyles.length > 0) {
        setSelectedCuttingStyle(data.cuttingStyles[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product || !product.inStock) return;

    setIsAdding(true);

    const price = parseFloat(product.price);
    const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
    const currentPrice = salePrice && salePrice < price ? salePrice : price;

    addItem(
      {
        productId: product.id,
        name: product.name,
        image: product.image,
        price: currentPrice,
        originalPrice: price,
        unit: product.unit,
        cuttingStyle: product.hasCuttingOptions ? selectedCuttingStyle : null,
      },
      quantity
    );

    showToast(`${product.name} נוסף לסל`, 'success');

    // Brief visual feedback then open cart
    setTimeout(() => {
      setIsAdding(false);
      openCart();
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">המוצר לא נמצא</h1>
        <Link href="/" className="text-brand-500 hover:underline">
          חזרה לדף הבית
        </Link>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const salePrice = product.salePrice ? parseFloat(product.salePrice) : null;
  const isOnSale = salePrice && salePrice < price;
  const currentPrice = isOnSale ? salePrice : price;
  const unitLabel = product.unit === 'KG' ? 'ק"ג' : 'יחידה';

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700 transition-colors">
            ראשי
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-slate-700 transition-colors"
          >
            {product.category.name}
          </Link>
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-slate-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-[3/2] relative bg-slate-100 rounded-2xl overflow-hidden">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-24 h-24 text-slate-300" />
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {isOnSale && (
                <span className="bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  מבצע
                </span>
              )}
              {product.featured && (
                <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  מומלץ
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {product.description && (
              <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              {isOnSale ? (
                <>
                  <span className="text-4xl font-black text-red-600">
                    {formatPrice(salePrice)}
                  </span>
                  <span className="text-xl text-slate-400 line-through">
                    {formatPrice(price)}
                  </span>
                </>
              ) : (
                <span className="text-4xl font-black text-slate-900">
                  {formatPrice(price)}
                </span>
              )}
              <span className="text-lg text-slate-500">/ {unitLabel}</span>
            </div>

            {/* Stock Status */}
            <div className="mt-4">
              {product.inStock ? (
                <span className="inline-flex items-center gap-2 text-emerald-600 font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  במלאי
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-red-600 font-medium">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  אזל מהמלאי
                </span>
              )}
            </div>

            {/* Cutting Options */}
            {product.hasCuttingOptions && product.cuttingStyles.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  <Scissors className="w-4 h-4 inline-block ml-1" />
                  בחר סגנון חיתוך
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.cuttingStyles.map((style) => (
                    <button
                      key={style}
                      onClick={() => setSelectedCuttingStyle(style)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCuttingStyle === style
                          ? 'bg-slate-900 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {CUTTING_STYLE_LABELS[style] || style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                כמות ({unitLabel})
              </label>
              <div className="inline-flex items-center bg-white border border-slate-200 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-lg font-bold text-slate-900 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">סה"כ:</span>
                <span className="text-2xl font-black text-slate-900">
                  {formatPrice(currentPrice * quantity)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isAdding}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-4 font-bold rounded-xl transition-all duration-300 ${
                isAdding
                  ? 'bg-emerald-500 text-white'
                  : 'bg-brand-500 text-white hover:bg-brand-600 disabled:bg-slate-300 disabled:cursor-not-allowed'
              }`}
            >
              {isAdding ? (
                <>
                  <Check className="w-5 h-5" />
                  נוסף לסל!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  הוסף לסל
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
