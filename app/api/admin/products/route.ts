import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET all products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { order: 'asc' },
      include: {
        category: {
          select: { id: true, name: true }
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

// POST new product
export async function POST(request: Request) {
  try {
    // Check authentication
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'לא מורשה' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      categoryId,
      name,
      description,
      price,
      salePrice,
      image,
      inStock,
      unit,
      hasCuttingOptions,
      cuttingStyles,
      featured,
      order,
      isActive
    } = body;

    if (!categoryId || !name || price === undefined) {
      return NextResponse.json(
        { error: 'חובה למלא שם, קטגוריה ומחיר' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'הקטגוריה לא נמצאה' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = slugify(name);

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'מוצר עם שם זה כבר קיים' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        categoryId,
        name,
        slug,
        description: description || null,
        price,
        salePrice: salePrice || null,
        image: image || null,
        inStock: inStock ?? true,
        unit: unit || 'KG',
        hasCuttingOptions: hasCuttingOptions ?? false,
        cuttingStyles: cuttingStyles || [],
        featured: featured ?? false,
        order: order ?? 0,
        isActive: isActive ?? true,
      },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת המוצר' },
      { status: 500 }
    );
  }
}
