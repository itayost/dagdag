import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single product by slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
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

    if (!product) {
      return NextResponse.json(
        { error: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'שגיאה בטעינת המוצר' },
      { status: 500 }
    );
  }
}
