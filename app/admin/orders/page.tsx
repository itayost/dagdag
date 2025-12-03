'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Loader2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface OrderItem {
  id: string;
  productName: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  cuttingStyle: string | null;
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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'כל ההזמנות' },
  { value: 'PENDING', label: 'ממתין' },
  { value: 'CONFIRMED', label: 'אושר' },
  { value: 'PREPARING', label: 'בהכנה' },
  { value: 'READY', label: 'מוכן' },
  { value: 'DELIVERED', label: 'נמסר' },
  { value: 'CANCELLED', label: 'בוטל' },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'ממתין', color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'אושר', color: 'bg-blue-100 text-blue-700' },
  PREPARING: { label: 'בהכנה', color: 'bg-purple-100 text-purple-700' },
  READY: { label: 'מוכן', color: 'bg-green-100 text-green-700' },
  DELIVERED: { label: 'נמסר', color: 'bg-gray-100 text-gray-700' },
  CANCELLED: { label: 'בוטל', color: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, currentPage]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      });
      if (selectedStatus !== 'ALL') {
        params.set('status', selectedStatus);
      }

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">הזמנות</h1>
          <p className="text-gray-500 mt-1">ניהול הזמנות לקוחות</p>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין הזמנות</h3>
          <p className="text-gray-500">לא נמצאו הזמנות בסטטוס זה</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">מס׳ הזמנה</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">לקוח</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">עיר</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">פריטים</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">סה"כ</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">סטטוס</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">תאריך</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">פעולות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <span className="font-mono font-medium text-gray-900">
                        {order.orderNumber}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.customerName}</p>
                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{order.city}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{order.items.length}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">
                        {formatPrice(Number(order.total))}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          STATUS_LABELS[order.status].color
                        }`}
                      >
                        {STATUS_LABELS[order.status].label}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 text-sm">
                        {formatDate(order.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                מציג {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} מתוך{' '}
                {pagination.total} הזמנות
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm">
                  עמוד {pagination.page} מתוך {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
