'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, Package, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  cuttingStyle: string | null;
  product: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: string;
  city: string;
  notes: string | null;
  subtotal: string;
  deliveryFee: string;
  total: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: string;
}

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'ממתין', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'CONFIRMED', label: 'אושר', color: 'bg-blue-100 text-blue-700' },
  { value: 'PREPARING', label: 'בהכנה', color: 'bg-purple-100 text-purple-700' },
  { value: 'READY', label: 'מוכן', color: 'bg-green-100 text-green-700' },
  { value: 'DELIVERED', label: 'נמסר', color: 'bg-gray-100 text-gray-700' },
  { value: 'CANCELLED', label: 'בוטל', color: 'bg-red-100 text-red-700' },
];

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

export default function OrderDetailPage({ params }: OrderPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${id}`);

      if (!response.ok) {
        throw new Error('ההזמנה לא נמצאה');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בטעינת ההזמנה');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('שגיאה בעדכון הסטטוס');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'שגיאה בעדכון הסטטוס');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-8">
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-red-600">{error || 'ההזמנה לא נמצאה'}</p>
          <Link
            href="/admin/orders"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה להזמנות
          </Link>
        </div>
      </div>
    );
  }

  const currentStatus = STATUS_OPTIONS.find(s => s.value === order.status);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה להזמנות
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              הזמנה #{order.orderNumber}
            </h1>
            <p className="text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${currentStatus?.color}`}
          >
            {currentStatus?.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">פריטים בהזמנה</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  {item.product.image ? (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{item.productName}</h3>
                    {item.cuttingStyle && (
                      <p className="text-sm text-gray-500">
                        חיתוך: {CUTTING_STYLE_LABELS[item.cuttingStyle] || item.cuttingStyle}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      {Number(item.quantity)} × {formatPrice(Number(item.unitPrice))}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(Number(item.totalPrice))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>סיכום ביניים</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>משלוח</span>
                <span>{formatPrice(Number(order.deliveryFee))}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>סה"כ לתשלום</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">הערות</h2>
              </div>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">עדכון סטטוס</h2>
            <div className="space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  disabled={isUpdating || order.status === status.value}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    order.status === status.value
                      ? status.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">פרטי לקוח</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900">{order.customerName}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <a href={`tel:${order.customerPhone}`} className="hover:text-blue-600">
                  {order.customerPhone}
                </a>
              </div>
              {order.customerEmail && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${order.customerEmail}`} className="hover:text-blue-600">
                    {order.customerEmail}
                  </a>
                </div>
              )}
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>
                  <p>{order.address}</p>
                  <p>{order.city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
