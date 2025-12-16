import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET products (public)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured') === 'true';
    const categorySlug = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '200');

    const where: {
      isActive: boolean;
      inStock?: boolean;
      featured?: boolean;
      category?: { slug: string };
    } = {
      isActive: true,
    };

    if (featured) {
      where.featured = true;
      where.inStock = true;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { order: 'asc' },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        salePrice: true,
        image: true,
        inStock: true,
        unit: true,
        hasCuttingOptions: true,
        cuttingStyles: true,
        featured: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת המוצרים' },
      { status: 500 }
    );
  }
}
