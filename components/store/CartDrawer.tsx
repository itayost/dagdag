'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingCart, Truck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart, FREE_DELIVERY_THRESHOLD } from '@/contexts/CartContext';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, deliveryFee, total, itemCount } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [closeCart]);

  const amountForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            <h2 className="font-bold text-lg text-slate-900">סל הקניות</h2>
            {itemCount > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-slate-200 mb-4" />
            <h3 className="font-bold text-slate-900 text-lg mb-2">הסל ריק</h3>
            <p className="text-slate-500 mb-6">הוסיפו מוצרים לסל כדי להתחיל</p>
            <button
              onClick={closeCart}
              className="px-6 py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
            >
              המשך בקניות
            </button>
          </div>
        ) : (
          <>
            {/* Free Delivery Progress */}
            {amountForFreeDelivery > 0 && (
              <div className="p-4 bg-brand-50 border-b border-brand-100">
                <div className="flex items-center gap-2 text-brand-600 mb-2">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    חסרים {formatPrice(amountForFreeDelivery)} למשלוח חינם!
                  </span>
                </div>
                <div className="h-2 bg-brand-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.map(item => (
                <CartItem key={item.id} item={item} compact />
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 p-4 bg-slate-50">
              {/* Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">סכום ביניים</span>
                  <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">משלוח</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : 'text-slate-900'}>
                    {deliveryFee === 0 ? 'חינם!' : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">סה"כ</span>
                  <span className="font-black text-xl text-slate-900">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full py-3 bg-brand-500 text-white font-bold text-center rounded-xl hover:bg-brand-600 transition-colors"
                >
                  לתשלום
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full py-3 bg-white text-slate-700 font-medium text-center rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  צפייה בסל המלא
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
