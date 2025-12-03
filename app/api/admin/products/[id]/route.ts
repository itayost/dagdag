import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true }
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

// PUT update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'לא מורשה' },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }

    // Generate new slug if name changed
    let slug = existingProduct.slug;
    if (name && name !== existingProduct.name) {
      slug = slugify(name);

      // Check if new slug already exists
      const slugExists = await prisma.product.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'מוצר עם שם זה כבר קיים' },
          { status: 400 }
        );
      }
    }

    // Validate category if provided
    if (categoryId && categoryId !== existingProduct.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId }
      });

      if (!category) {
        return NextResponse.json(
          { error: 'הקטגוריה לא נמצאה' },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        categoryId: categoryId ?? existingProduct.categoryId,
        name: name ?? existingProduct.name,
        slug,
        description: description !== undefined ? description : existingProduct.description,
        price: price ?? existingProduct.price,
        salePrice: salePrice !== undefined ? salePrice : existingProduct.salePrice,
        image: image !== undefined ? image : existingProduct.image,
        inStock: inStock ?? existingProduct.inStock,
        unit: unit ?? existingProduct.unit,
        hasCuttingOptions: hasCuttingOptions ?? existingProduct.hasCuttingOptions,
        cuttingStyles: cuttingStyles !== undefined ? cuttingStyles : existingProduct.cuttingStyles,
        featured: featured ?? existingProduct.featured,
        order: order ?? existingProduct.order,
        isActive: isActive ?? existingProduct.isActive,
      },
      include: {
        category: {
          select: { id: true, name: true }
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'שגיאה בעדכון המוצר' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: 'לא מורשה' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'המוצר לא נמצא' },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'שגיאה במחיקת המוצר' },
      { status: 500 }
    );
  }
}
