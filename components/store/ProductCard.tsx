import Link from 'next/link';
import Image from 'next/image';
import { Package, Scissors, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    salePrice: string | number | null;
    image: string | null;
    inStock: boolean;
    unit: 'KG' | 'UNIT';
    hasCuttingOptions: boolean;
    featured: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const salePrice = product.salePrice
    ? typeof product.salePrice === 'string'
      ? parseFloat(product.salePrice)
      : product.salePrice
    : null;
  const isOnSale = salePrice && salePrice < price;
  const unitLabel = product.unit === 'KG' ? 'ק"ג' : 'יחידה';

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative bg-white rounded-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
        {isOnSale && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            מבצע
          </span>
        )}
        {product.featured && (
          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            מומלץ
          </span>
        )}
        {!product.inStock && (
          <span className="bg-slate-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            אזל
          </span>
        )}
      </div>

      {/* Image */}
      <div className="aspect-square relative bg-slate-100">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-300" />
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight line-clamp-1">
          {product.name}
        </h3>

        {/* Cutting Options Badge */}
        {product.hasCuttingOptions && (
          <div className="flex items-center gap-1 mt-2 text-emerald-600">
            <Scissors className="w-4 h-4" />
            <span className="text-xs font-medium">אפשרויות חיתוך</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          {isOnSale ? (
            <>
              <span className="text-xl font-black text-red-600">
                {formatPrice(salePrice)}
              </span>
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-xl font-black text-slate-900">
              {formatPrice(price)}
            </span>
          )}
          <span className="text-sm text-slate-500">/ {unitLabel}</span>
        </div>
      </div>
    </Link>
  );
}
