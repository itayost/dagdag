'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderOpen,
  ShoppingBag,
  TrendingUp,
  Clock,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { formatPrice, formatDate } from '@/lib/utils';

interface Stats {
  overview: {
    totalProducts: number;
    totalCategories: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    todayRevenue: number;
    monthRevenue: number;
  };
  orderStats: {
    today: number;
    week: number;
    month: number;
    byStatus: Record<string, number>;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: string;
    status: string;
    createdAt: string;
  }>;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'ממתין', color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'אושר', color: 'bg-blue-100 text-blue-700' },
  PREPARING: { label: 'בהכנה', color: 'bg-purple-100 text-purple-700' },
  READY: { label: 'מוכן', color: 'bg-green-100 text-green-700' },
  DELIVERED: { label: 'נמסר', color: 'bg-gray-100 text-gray-700' },
  CANCELLED: { label: 'בוטל', color: 'bg-red-100 text-red-700' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-red-600">שגיאה בטעינת הנתונים</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">לוח בקרה</h1>
        <p className="text-gray-500 mt-1">סקירה כללית של החנות</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">הכנסות החודש</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(stats.overview.monthRevenue)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            היום: {formatPrice(stats.overview.todayRevenue)}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">הזמנות ממתינות</p>
          <p className="text-2xl font-bold text-gray-900">{stats.overview.pendingOrders}</p>
          <p className="text-sm text-gray-500 mt-2">
            סה"כ הזמנות: {stats.overview.totalOrders}
          </p>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">מוצרים</p>
          <p className="text-2xl font-bold text-gray-900">{stats.overview.totalProducts}</p>
          <p className="text-sm text-gray-500 mt-2">
            קטגוריות: {stats.overview.totalCategories}
          </p>
        </div>

        {/* Orders This Month */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">הזמנות החודש</p>
          <p className="text-2xl font-bold text-gray-900">{stats.orderStats.month}</p>
          <p className="text-sm text-gray-500 mt-2">
            השבוע: {stats.orderStats.week} | היום: {stats.orderStats.today}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">הזמנות אחרונות</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              צפה בכל ההזמנות
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">אין הזמנות</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      #{order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">{order.customerName}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(Number(order.total))}
                    </p>
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                        STATUS_LABELS[order.status]?.color || 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {STATUS_LABELS[order.status]?.label || order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">פעולות מהירות</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/products/new"
              className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
            >
              <Package className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-700">הוסף מוצר</span>
            </Link>
            <Link
              href="/admin/categories/new"
              className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
            >
              <FolderOpen className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-700">הוסף קטגוריה</span>
            </Link>
            <Link
              href="/admin/orders?status=PENDING"
              className="flex flex-col items-center justify-center p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors"
            >
              <Clock className="w-8 h-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-yellow-700">הזמנות ממתינות</span>
            </Link>
            <Link
              href="/admin/products"
              className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
            >
              <ShoppingBag className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-700">נהל מוצרים</span>
            </Link>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">הזמנות לפי סטטוס</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(STATUS_LABELS).map(([status, { label, color }]) => (
              <Link
                key={status}
                href={`/admin/orders?status=${status}`}
                className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${color}`}
                >
                  {label}
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.orderStats.byStatus[status] || 0}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
