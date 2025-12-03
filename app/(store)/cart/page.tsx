'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingCart, Truck, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart, FREE_DELIVERY_THRESHOLD, DELIVERY_FEE } from '@/contexts/CartContext';
import CartItem from '@/components/store/CartItem';

export default function CartPage() {
  const { items, subtotal, deliveryFee, total, clearCart, itemCount } = useCart();

  const amountForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לחנות
          </Link>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-black text-slate-900">סל הקניות</h1>
            {itemCount > 0 && (
              <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {itemCount} פריטים
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              רוקן סל
            </button>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <ShoppingCart className="w-20 h-20 text-slate-200 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-3">הסל שלך ריק</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              נראה שעדיין לא הוספת מוצרים לסל. גלה את המבחר הטרי שלנו והתחל לקנות!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              התחל לקנות
              <ArrowRight className="w-5 h-5 rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
                <h2 className="font-bold text-lg text-slate-900 mb-6">סיכום הזמנה</h2>

                {/* Free Delivery Progress */}
                {amountForFreeDelivery > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                      <Truck className="w-5 h-5" />
                      <span className="font-medium">
                        חסרים {formatPrice(amountForFreeDelivery)} למשלוח חינם!
                      </span>
                    </div>
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      משלוח חינם בהזמנות מעל {formatPrice(FREE_DELIVERY_THRESHOLD)}
                    </p>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">סכום ביניים</span>
                    <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">משלוח</span>
                    <span className={deliveryFee === 0 ? 'text-emerald-600 font-medium' : 'text-slate-900'}>
                      {deliveryFee === 0 ? 'חינם!' : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-slate-500">
                      משלוח {formatPrice(DELIVERY_FEE)} | חינם מעל {formatPrice(FREE_DELIVERY_THRESHOLD)}
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-200 mb-6">
                  <span className="font-bold text-lg text-slate-900">סה"כ לתשלום</span>
                  <span className="font-black text-2xl text-slate-900">{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  className="block w-full py-4 bg-blue-600 text-white font-bold text-center rounded-xl hover:bg-blue-700 transition-colors"
                >
                  המשך לתשלום
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/"
                  className="block w-full py-3 text-slate-600 font-medium text-center mt-3 hover:text-slate-900 transition-colors"
                >
                  המשך בקניות
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
