import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CuttingStyle } from '@prisma/client';

// Generate order number: JF-YYYYMMDD-XXXX
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `JF-${year}${month}${day}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      city,
      notes,
      items,
      subtotal,
      deliveryFee,
      total,
    } = body;

    // Validation
    if (!customerName?.trim()) {
      return NextResponse.json({ error: 'שם מלא נדרש' }, { status: 400 });
    }

    if (!customerPhone?.trim()) {
      return NextResponse.json({ error: 'מספר טלפון נדרש' }, { status: 400 });
    }

    if (!address?.trim()) {
      return NextResponse.json({ error: 'כתובת נדרשת' }, { status: 400 });
    }

    if (!city?.trim()) {
      return NextResponse.json({ error: 'עיר נדרשת' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'נדרש לפחות מוצר אחד' }, { status: 400 });
    }

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
      });
      if (!existing) break;
      orderNumber = generateOrderNumber();
      attempts++;
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail?.trim() || null,
        address: address.trim(),
        city: city.trim(),
        notes: notes?.trim() || null,
        subtotal,
        deliveryFee,
        total,
        status: 'PENDING',
        items: {
          create: items.map((item: {
            productId: string;
            productName: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            cuttingStyle?: string | null;
          }) => ({
            product: { connect: { id: item.productId } },
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            cuttingStyle: item.cuttingStyle as CuttingStyle | null,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'שגיאה בשליחת ההזמנה' },
      { status: 500 }
    );
  }
}
