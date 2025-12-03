import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    // Check authentication
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'לא מורשה' },
        { status: 401 }
      );
    }

    // Get current date info
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get counts and stats in parallel
    const [
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      todayOrders,
      weekOrders,
      monthOrders,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfWeek } } }),
      prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          total: true,
          status: true,
          createdAt: true,
        }
      }),
    ]);

    // Get total revenue
    const totalRevenueResult = await prisma.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true },
    });

    const todayRevenueResult = await prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startOfToday },
      },
      _sum: { total: true },
    });

    const monthRevenueResult = await prisma.order.aggregate({
      where: {
        status: { not: 'CANCELLED' },
        createdAt: { gte: startOfMonth },
      },
      _sum: { total: true },
    });

    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const statusCounts = ordersByStatus.reduce((acc, item) => {
      acc[item.status] = item._count.status;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      overview: {
        totalProducts,
        totalCategories,
        totalOrders,
        pendingOrders,
        totalRevenue: totalRevenueResult._sum.total?.toNumber() || 0,
        todayRevenue: todayRevenueResult._sum.total?.toNumber() || 0,
        monthRevenue: monthRevenueResult._sum.total?.toNumber() || 0,
      },
      orderStats: {
        today: todayOrders,
        week: weekOrders,
        month: monthOrders,
        byStatus: statusCounts,
      },
      recentOrders,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הסטטיסטיקות' },
      { status: 500 }
    );
  }
}
