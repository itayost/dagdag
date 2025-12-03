import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true }
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

// POST new category
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
    const { name, image, order, isActive } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'שם הקטגוריה נדרש' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = slugify(name);

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'קטגוריה עם שם זה כבר קיימת' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        image: image || null,
        order: order ?? 0,
        isActive: isActive ?? true,
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'שגיאה ביצירת הקטגוריה' },
      { status: 500 }
    );
  }
}
