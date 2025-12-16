'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Scissors, Package } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import QuantityControl from './QuantityControl';

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

interface CuttingStyleModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    unit: 'KG' | 'UNIT';
    cuttingStyles: string[];
    image: string | null;
  };
  onAddToCart: (cuttingStyle: string, quantity: number) => void;
}

export default function CuttingStyleModal({
  isOpen,
  onClose,
  product,
  onAddToCart,
}: CuttingStyleModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Initialize selected style when modal opens
  useEffect(() => {
    if (isOpen && product.cuttingStyles.length > 0) {
      setSelectedStyle(product.cuttingStyles[0]);
      setQuantity(1);
    }
  }, [isOpen, product.cuttingStyles]);

  // Handle mount for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleAdd = () => {
    if (selectedStyle) {
      onAddToCart(selectedStyle, quantity);
    }
  };

  const unitLabel = product.unit === 'KG' ? 'ק"ג' : 'יחידה';

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cutting-modal-title"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 id="cutting-modal-title" className="text-lg font-bold text-slate-900">בחר אפשרות חיתוך</h2>
          <button
            onClick={onClose}
            aria-label="סגור"
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex gap-4">
            <div className="w-24 h-16 relative bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
              {product.image ? (
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 line-clamp-2">{product.name}</h3>
              <div className="flex items-baseline gap-2 mt-1">
                {product.originalPrice > product.price ? (
                  <>
                    <span className="text-lg font-bold text-red-600">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-slate-900">
                    {formatPrice(product.price)}
                  </span>
                )}
                <span className="text-sm text-slate-500">/ {unitLabel}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cutting Styles */}
        <div className="px-5 py-5">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-3">
            <Scissors className="w-4 h-4" />
            סגנון חיתוך
          </label>
          <div className="grid grid-cols-2 gap-2">
            {product.cuttingStyles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedStyle === style
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {CUTTING_STYLE_LABELS[style] || style}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="px-5 py-4 border-t border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-3">
            כמות ({unitLabel})
          </label>
          <QuantityControl
            quantity={quantity}
            unit={product.unit}
            onIncrement={() => setQuantity(quantity + 1)}
            onDecrement={() => setQuantity(Math.max(1, quantity - 1))}
            variant="full"
          />
        </div>

        {/* Total & Actions */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600 font-medium">סה"כ:</span>
            <span className="text-2xl font-black text-slate-900">
              {formatPrice(product.price * quantity)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors"
            >
              ביטול
            </button>
            <button
              onClick={handleAdd}
              disabled={!selectedStyle}
              className="flex-1 bg-brand-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              הוסף לסל
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
