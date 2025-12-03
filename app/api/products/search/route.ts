import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        name: {
          contains: query.trim(),
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        image: true,
        inStock: true,
        unit: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { name: 'asc' },
      ],
      take: 10,
    });

    return NextResponse.json({
      products: products.map(p => ({
        ...p,
        price: p.price.toString(),
        salePrice: p.salePrice?.toString() || null,
      })),
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json(
      { error: 'שגיאה בחיפוש' },
      { status: 500 }
    );
  }
}
