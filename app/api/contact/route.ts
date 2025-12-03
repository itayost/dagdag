import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, message } = body;

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'שם מלא נדרש' }, { status: 400 });
    }

    if (!phone?.trim()) {
      return NextResponse.json({ error: 'מספר טלפון נדרש' }, { status: 400 });
    }

    // Validate phone format (Israeli phone)
    const phoneClean = phone.replace(/-/g, '');
    if (!/^0\d{9}$/.test(phoneClean)) {
      return NextResponse.json({ error: 'מספר טלפון לא תקין' }, { status: 400 });
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'הודעה נדרשת' }, { status: 400 });
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'כתובת אימייל לא תקינה' }, { status: 400 });
    }

    // Create contact message
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      id: contactMessage.id,
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'שגיאה בשליחת ההודעה' },
      { status: 500 }
    );
  }
}
