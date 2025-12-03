'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2, Package, Scissors } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { CartItem as CartItemType, useCart } from '@/contexts/CartContext';

const CUTTING_STYLE_LABELS: Record<string, string> = {
  WHOLE: 'שלם',
  SLICED: 'פרוסות',
  FILLET_SKIN: 'פילה עם עור',
  FILLET_SKINLESS: 'פילה בלי עור',
  BUTTERFLIED: 'פתוח',
};

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export default function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const unitLabel = item.unit === 'KG' ? 'ק"ג' : 'יח\'';
  const isOnSale = item.originalPrice > item.price;

  if (compact) {
    // Compact version for drawer
    return (
      <div className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
        {/* Image */}
        <div className="w-16 h-16 relative bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
          {item.image ? (
            <Image src={item.image} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-6 h-6 text-slate-300" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-900 text-sm truncate">{item.name}</h4>
          {item.cuttingStyle && (
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
              <Scissors className="w-3 h-3" />
              {CUTTING_STYLE_LABELS[item.cuttingStyle] || item.cuttingStyle}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1.5 text-slate-500 hover:text-slate-700"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-medium text-slate-900 w-6 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1.5 text-slate-500 hover:text-slate-700"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <span className="font-bold text-slate-900 text-sm">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        </div>

        {/* Remove */}
        <button
          onClick={() => removeItem(item.id)}
          className="p-1 text-slate-400 hover:text-red-500 transition-colors self-start"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Full version for cart page
  return (
    <div className="flex gap-4 py-4 border-b border-slate-200 last:border-0">
      {/* Image */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 relative bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-300" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
            {item.cuttingStyle && (
              <p className="text-sm text-emerald-600 flex items-center gap-1 mt-1">
                <Scissors className="w-4 h-4" />
                {CUTTING_STYLE_LABELS[item.cuttingStyle] || item.cuttingStyle}
              </p>
            )}
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className={isOnSale ? 'text-red-600 font-bold' : 'text-slate-700 font-medium'}>
            {formatPrice(item.price)}
          </span>
          {isOnSale && (
            <span className="text-sm text-slate-400 line-through">
              {formatPrice(item.originalPrice)}
            </span>
          )}
          <span className="text-sm text-slate-500">/ {unitLabel}</span>
        </div>

        {/* Quantity & Total */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold text-slate-900 w-10 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-left">
            <p className="text-sm text-slate-500">סה"כ</p>
            <p className="text-xl font-black text-slate-900">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
