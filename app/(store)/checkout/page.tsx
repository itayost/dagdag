'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, ShoppingCart, CheckCircle, Package, Scissors } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCart, FREE_DELIVERY_THRESHOLD } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';

const CUTTING_STYLE_LABELS: Record<string, string> = {
  WHOLE: 'שלם',
  SLICED: 'פרוסות',
  FILLET_SKIN: 'פילה עם עור',
  FILLET_SKINLESS: 'פילה בלי עור',
  BUTTERFLIED: 'פתוח',
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, deliveryFee, total, clearCart, itemCount } = useCart();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'שם מלא נדרש';
    }

    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'מספר טלפון נדרש';
    } else if (!/^0\d{9}$/.test(formData.customerPhone.replace(/-/g, ''))) {
      newErrors.customerPhone = 'מספר טלפון לא תקין';
    }

    if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'כתובת אימייל לא תקינה';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'כתובת נדרשת';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'עיר נדרשת';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('יש לתקן את השגיאות בטופס', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('הסל ריק', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            cuttingStyle: item.cuttingStyle,
          })),
          subtotal,
          deliveryFee,
          total,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת ההזמנה');
      }

      // Success!
      setOrderSuccess(data.orderNumber);
      clearCart();
      showToast('ההזמנה נשלחה בהצלחה!', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'שגיאה בשליחת ההזמנה', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Success State
  if (orderSuccess) {
    return (
      <div className="py-16 sm:py-24">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">ההזמנה התקבלה!</h1>
          <p className="text-lg text-slate-600 mb-2">תודה על הזמנתך</p>
          <p className="text-slate-500 mb-8">
            מספר הזמנה: <span className="font-bold text-slate-900">{orderSuccess}</span>
          </p>
          <p className="text-slate-600 mb-8">
            ניצור איתך קשר בהקדם לאישור ההזמנה ותיאום המשלוח.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            חזרה לחנות
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="py-16 sm:py-24">
        <div className="max-w-lg mx-auto px-4 text-center">
          <ShoppingCart className="w-20 h-20 text-slate-200 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 mb-3">הסל ריק</h1>
          <p className="text-slate-500 mb-8">הוסיפו מוצרים לסל כדי להמשיך לתשלום</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            לחנות
            <ArrowRight className="w-5 h-5 rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לסל
          </Link>
        </nav>

        {/* Header */}
        <h1 className="text-3xl font-black text-slate-900 mb-8">השלמת הזמנה</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-bold text-lg text-slate-900 mb-6">פרטי משלוח</h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-1">
                    שם מלא *
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.customerName ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="ישראל ישראלי"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-slate-700 mb-1">
                    טלפון *
                  </label>
                  <input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.customerPhone ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="050-1234567"
                    dir="ltr"
                  />
                  {errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-slate-700 mb-1">
                    אימייל (אופציונלי)
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.customerEmail ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="email@example.com"
                    dir="ltr"
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
                    כתובת למשלוח *
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.address ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="רחוב, מספר בית, דירה"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                    עיר *
                  </label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                      errors.city ? 'border-red-300 bg-red-50' : 'border-slate-200'
                    }`}
                    placeholder="תל אביב"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
                    הערות להזמנה (אופציונלי)
                  </label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="הערות מיוחדות, שעות מועדפות למשלוח..."
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {isSubmitting ? 'שולח הזמנה...' : `שלח הזמנה - ${formatPrice(total)}`}
              </button>

              <p className="text-xs text-slate-500 text-center mt-4">
                בלחיצה על "שלח הזמנה" אתה מאשר את תנאי השימוש שלנו
              </p>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="font-bold text-lg text-slate-900 mb-6">
                סיכום הזמנה ({itemCount} פריטים)
              </h2>

              {/* Items */}
              <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 relative bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Package className="w-6 h-6 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-900 text-sm truncate">{item.name}</h4>
                      {item.cuttingStyle && (
                        <p className="text-xs text-emerald-600 flex items-center gap-1">
                          <Scissors className="w-3 h-3" />
                          {CUTTING_STYLE_LABELS[item.cuttingStyle] || item.cuttingStyle}
                        </p>
                      )}
                      <p className="text-sm text-slate-500">
                        {item.quantity} x {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-left">
                      <span className="font-bold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
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
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="font-bold text-lg text-slate-900">סה"כ</span>
                  <span className="font-black text-2xl text-slate-900">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Free Delivery Note */}
              {subtotal < FREE_DELIVERY_THRESHOLD && (
                <p className="text-xs text-blue-600 mt-4 text-center">
                  חסרים {formatPrice(FREE_DELIVERY_THRESHOLD - subtotal)} למשלוח חינם
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
