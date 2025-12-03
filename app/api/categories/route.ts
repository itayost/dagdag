import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all active categories (public)
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        _count: {
          select: { products: { where: { isActive: true } } }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת הקטגוריות' },
      { status: 500 }
    );
  }
}
