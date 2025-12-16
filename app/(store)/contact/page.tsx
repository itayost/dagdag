'use client';

import { useState } from 'react';
import { Cormorant_Garamond, Heebo } from 'next/font/google';
import { useToast } from '@/components/ui/Toast';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cormorant',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-heebo',
});

export default function ContactPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'שם מלא נדרש';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'מספר טלפון נדרש';
    } else if (!/^0\d{9}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = 'מספר טלפון לא תקין';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'הודעה נדרשת';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('יש לתקן את השגיאות בטופס', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת ההודעה');
      }

      setIsSuccess(true);
      showToast('ההודעה נשלחה בהצלחה!', 'success');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'שגיאה בשליחת ההודעה', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${cormorant.variable} ${heebo.variable} bg-[#F5F1EB] min-h-screen`}>
      {/* Hero Section */}
      <section className="relative bg-[#0A1628] pt-16 pb-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4A574]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#D4A574]/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-[var(--font-heebo)] text-[#D4A574] tracking-[0.3em] text-sm mb-4 uppercase">
            נשמח לשמוע מכם
          </p>
          <h1 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
            צרו איתנו
            <br />
            <span className="text-[#D4A574]">קשר</span>
          </h1>
          <p className="font-[var(--font-heebo)] text-lg text-white/60 max-w-xl mx-auto">
            יש לכם שאלה? שלחו לנו הודעה ונחזור אליכם בהקדם האפשרי
          </p>
        </div>

        {/* Bottom Wave */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100'%3E%3Cpath fill='%23F5F1EB' d='M0,50 C360,100 720,0 1080,50 C1260,75 1350,75 1440,50 L1440,100 L0,100 Z'/%3E%3C/svg%3E") no-repeat bottom`,
            backgroundSize: 'cover',
          }}
        />
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <h2 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl text-[#0A1628] mb-8">
                  פרטי התקשרות
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-[var(--font-heebo)] text-[#0A1628]/50 text-sm mb-1">כתובת</p>
                      <p className="font-[var(--font-heebo)] text-[#0A1628]">יאשה חפץ 9, תל אביב</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-[var(--font-heebo)] text-[#0A1628]/50 text-sm mb-1">טלפון</p>
                      <div className="space-y-1">
                        <a href="tel:0502175277" className="block font-[var(--font-heebo)] text-[#0A1628] hover:text-[#D4A574] transition-colors">
                          050-2175277
                        </a>
                        <a href="tel:039197734" className="block font-[var(--font-heebo)] text-[#0A1628] hover:text-[#D4A574] transition-colors">
                          03-9197734
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-[var(--font-heebo)] text-[#0A1628]/50 text-sm mb-1">אימייל</p>
                      <a href="mailto:jackodagim1@gmail.com" className="font-[var(--font-heebo)] text-[#0A1628] hover:text-[#D4A574] transition-colors">
                        jackodagim1@gmail.com
                      </a>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#0A1628] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-[var(--font-heebo)] text-[#0A1628]/50 text-sm mb-1">שעות פעילות</p>
                      <div className="font-[var(--font-heebo)] text-[#0A1628]">
                        <p>א׳-ה׳: 08:00-20:00</p>
                        <p>ו׳: 08:00-15:30</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="mt-10 relative">
                  <div className="absolute -inset-2 border border-[#D4A574]/20" />
                  <div className="h-[200px] bg-[#0A1628]/5 overflow-hidden">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.8!2d34.7944!3d32.1234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDA3JzI0LjMiTiAzNMKwNDcnMzkuOCJF!5e0!3m2!1she!2sil!4v1"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="מפת הגעה לג׳קו דגים"
                      className="grayscale-[30%] contrast-[1.1]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {isSuccess ? (
                <div className="bg-white p-10 sm:p-12 text-center relative">
                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A574]/10" />
                  <div className="absolute top-2 right-2 w-20 h-20 border border-[#D4A574]/30" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D4A574]/10" />
                  <div className="absolute bottom-2 left-2 w-20 h-20 border border-[#D4A574]/30" />

                  <div className="relative">
                    <div className="w-20 h-20 bg-[#D4A574] flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-[#0A1628]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="font-[var(--font-cormorant)] text-3xl text-[#0A1628] mb-4">
                      ההודעה נשלחה!
                    </h2>
                    <p className="font-[var(--font-heebo)] text-[#0A1628]/60 mb-8">
                      תודה שפנית אלינו. נחזור אליך בהקדם האפשרי.
                    </p>
                    <button
                      onClick={() => setIsSuccess(false)}
                      className="font-[var(--font-heebo)] bg-[#0A1628] text-white px-8 py-4 hover:bg-[#0A1628]/90 transition-colors"
                    >
                      שלח הודעה נוספת
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 sm:p-12 relative">
                  {/* Corner Accents */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A574]/10" />
                  <div className="absolute top-2 right-2 w-20 h-20 border border-[#D4A574]/30" />

                  <div className="relative">
                    <h2 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl text-[#0A1628] mb-8">
                      שלחו לנו הודעה
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block font-[var(--font-heebo)] text-sm text-[#0A1628]/60 mb-2">
                          שם מלא <span className="text-[#D4A574]">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full px-0 py-3 bg-transparent border-0 border-b-2 font-[var(--font-heebo)] text-[#0A1628] placeholder-[#0A1628]/30 focus:outline-none focus:ring-0 transition-colors ${
                            errors.name ? 'border-red-400' : 'border-[#0A1628]/10 focus:border-[#D4A574]'
                          }`}
                          placeholder="ישראל ישראלי"
                        />
                        {errors.name && (
                          <p className="font-[var(--font-heebo)] text-red-500 text-sm mt-2">{errors.name}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label htmlFor="phone" className="block font-[var(--font-heebo)] text-sm text-[#0A1628]/60 mb-2">
                          טלפון <span className="text-[#D4A574]">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-0 py-3 bg-transparent border-0 border-b-2 font-[var(--font-heebo)] text-[#0A1628] placeholder-[#0A1628]/30 focus:outline-none focus:ring-0 transition-colors ${
                            errors.phone ? 'border-red-400' : 'border-[#0A1628]/10 focus:border-[#D4A574]'
                          }`}
                          placeholder="050-1234567"
                          dir="ltr"
                        />
                        {errors.phone && (
                          <p className="font-[var(--font-heebo)] text-red-500 text-sm mt-2">{errors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label htmlFor="email" className="block font-[var(--font-heebo)] text-sm text-[#0A1628]/60 mb-2">
                          אימייל <span className="text-[#0A1628]/30">(אופציונלי)</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-0 py-3 bg-transparent border-0 border-b-2 font-[var(--font-heebo)] text-[#0A1628] placeholder-[#0A1628]/30 focus:outline-none focus:ring-0 transition-colors ${
                            errors.email ? 'border-red-400' : 'border-[#0A1628]/10 focus:border-[#D4A574]'
                          }`}
                          placeholder="email@example.com"
                          dir="ltr"
                        />
                        {errors.email && (
                          <p className="font-[var(--font-heebo)] text-red-500 text-sm mt-2">{errors.email}</p>
                        )}
                      </div>

                      {/* Message */}
                      <div>
                        <label htmlFor="message" className="block font-[var(--font-heebo)] text-sm text-[#0A1628]/60 mb-2">
                          הודעה <span className="text-[#D4A574]">*</span>
                        </label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          rows={5}
                          className={`w-full px-0 py-3 bg-transparent border-0 border-b-2 font-[var(--font-heebo)] text-[#0A1628] placeholder-[#0A1628]/30 focus:outline-none focus:ring-0 resize-none transition-colors ${
                            errors.message ? 'border-red-400' : 'border-[#0A1628]/10 focus:border-[#D4A574]'
                          }`}
                          placeholder="איך נוכל לעזור לכם?"
                        />
                        {errors.message && (
                          <p className="font-[var(--font-heebo)] text-red-500 text-sm mt-2">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group w-full flex items-center justify-center gap-3 font-[var(--font-heebo)] bg-[#D4A574] text-[#0A1628] px-8 py-5 hover:bg-[#E5B685] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 mt-8"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            שולח...
                          </>
                        ) : (
                          <>
                            <span className="font-medium">שלח הודעה</span>
                            <svg className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
