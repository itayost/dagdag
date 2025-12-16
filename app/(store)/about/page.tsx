import Image from 'next/image';
import Link from 'next/link';
import { Cormorant_Garamond, Heebo } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-heebo',
});

export default function AboutPage() {
  return (
    <div className={`${cormorant.variable} ${heebo.variable} bg-[#F5F1EB] min-h-screen overflow-hidden`}>
      {/* Hero Section - Cinematic */}
      <section className="relative min-h-[85vh] flex items-end">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/about/boats.webp"
            alt="ספינות הדייג בנמל יפו"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628] via-[#0A1628]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full pb-16 sm:pb-24 px-6 sm:px-12">
          <div className="max-w-6xl mx-auto">
            <p className="font-[var(--font-heebo)] text-[#D4A574] tracking-[0.3em] text-sm mb-4 uppercase">
              מאז 1980
            </p>
            <h1 className="font-[var(--font-cormorant)] text-5xl sm:text-7xl lg:text-8xl text-white leading-[0.9] mb-6">
              הסיפור
              <br />
              <span className="text-[#D4A574]">שלנו</span>
            </h1>
            <p className="font-[var(--font-heebo)] text-xl sm:text-2xl text-white/80 max-w-xl font-light leading-relaxed">
              מסע של 44 שנים מהשוק הטורקי בחיפה
              <br className="hidden sm:block" />
              אל מעמקי הים התיכון
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/50 to-white/80 animate-pulse" />
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="relative">
            {/* Large Quote Mark */}
            <span className="font-[var(--font-cormorant)] text-[12rem] sm:text-[16rem] text-[#D4A574]/10 absolute -top-20 sm:-top-28 right-0 sm:right-10 leading-none select-none">
              ״
            </span>

            <blockquote className="font-[var(--font-cormorant)] text-3xl sm:text-4xl lg:text-5xl text-[#0A1628] leading-snug relative z-10">
              זו סגירת מעגל
              <br />
              שחיכיתי לה 44 שנים
            </blockquote>

            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#D4A574]" />
              <p className="font-[var(--font-heebo)] text-[#0A1628]/60 tracking-wider">
                אפי אללוף
              </p>
              <span className="h-px w-12 bg-[#D4A574]" />
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            {/* Image Column */}
            <div className="lg:col-span-5">
              <div className="relative lg:sticky lg:top-24">
                {/* Decorative Frame */}
                <div className="absolute -inset-4 border border-[#D4A574]/30 -z-10" />
                <div className="absolute -inset-8 border border-[#D4A574]/10 -z-10" />

                <div className="aspect-[3/4] relative overflow-hidden">
                  <Image
                    src="/images/about/efi.webp"
                    alt="אפי אללוף"
                    fill
                    className="object-cover grayscale-[20%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/30 to-transparent" />
                </div>

                {/* Caption */}
                <div className="absolute -bottom-6 -left-6 bg-[#0A1628] text-white px-6 py-4">
                  <p className="font-[var(--font-cormorant)] text-lg">אפי אללוף</p>
                  <p className="font-[var(--font-heebo)] text-sm text-white/60">מייסד ג׳קו דגים</p>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className="lg:col-span-7 py-12 lg:py-24">
              <div className="max-w-xl">
                <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl text-[#0A1628] mb-12 leading-tight">
                  ההתחלה
                  <br />
                  <span className="text-[#D4A574]">בגיל 16</span>
                </h2>

                <div className="font-[var(--font-heebo)] text-lg text-[#0A1628]/80 leading-relaxed space-y-6">
                  <p>
                    בגיל 16 אפי אללוף כבר היה בעלים של בסטה לדגים בשוק הטורקי בחיפה. מאז הוא הספיק להאכיל עשרות אלפי סועדים בכ-21 מסעדות שהיו בבעלותו.
                  </p>
                  <p>
                    בימים אלו הוא חזר לשורשים, פתח חנות דגים תל-אביבית בשם ג׳קו דגים ומתרגש כמו נער צעיר.
                  </p>
                </div>

                {/* Divider */}
                <div className="my-12 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#D4A574]/30" />
                  <span className="w-2 h-2 rounded-full bg-[#D4A574]" />
                  <span className="h-px flex-1 bg-[#D4A574]/30" />
                </div>

                <h3 className="font-[var(--font-cormorant)] text-3xl text-[#0A1628] mb-8">
                  בעל הבית השתגע?
                </h3>

                <div className="font-[var(--font-heebo)] text-lg text-[#0A1628]/80 leading-relaxed space-y-6">
                  <p>
                    העיתוי לפתיחת חנות הדגים החדשה הגיע בהפתעה גמורה. רק לפני כשנה אפי אללוף פתח מסעדת דגים ופירות ים חדשה בהרצליה – לולה מרטין שמה, והיא זוכה לשבחים רבים.
                  </p>

                  <blockquote className="relative pr-8 py-4 border-r-2 border-[#D4A574] bg-white/50">
                    <p className="font-[var(--font-cormorant)] text-xl text-[#0A1628] italic leading-relaxed">
                      ״בכל קריירת המסעדנות שלי ידעתי שיום יבוא ואני אחזור למקורות, להיות בעלים של חנות דגים. זו האהבה הראשונה שלי.״
                    </p>
                  </blockquote>

                  <p>
                    כמו בים כך גם בחיים, גל חדש מגיע ומביא עימו הזדמנויות חדשות. ידעתי שיש מחסור בחנויות דגים איכותיות באזור תל אביב, וברגע שנוצרה ההזדמנות לפתוח כזו בלוקיישן מושלם, לא הססתי לרגע.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boats Section - Full Bleed */}
      <section className="relative mt-24 py-24 sm:py-32 bg-[#0A1628] overflow-hidden">
        {/* Wave Pattern Top */}
        <div
          className="absolute top-0 left-0 right-0 h-24 rotate-180"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100'%3E%3Cpath fill='%23F5F1EB' d='M0,50 C360,100 720,0 1080,50 C1260,75 1350,75 1440,50 L1440,100 L0,100 Z'/%3E%3C/svg%3E") no-repeat bottom`,
            backgroundSize: 'cover',
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#D4A574]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A574]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Section Label */}
          <p className="font-[var(--font-heebo)] text-[#D4A574] tracking-[0.3em] text-sm mb-6 uppercase">
            ישירות מהים
          </p>

          <h2 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-8">
            ארבע ספינות דייג
            <br />
            <span className="text-[#D4A574]">בנמל יפו</span>
          </h2>

          <div className="font-[var(--font-heebo)] text-lg sm:text-xl text-white/70 leading-relaxed space-y-6 max-w-2xl mx-auto">
            <p>
              לפני שהשמש מתחילה לזרוח אנחנו יוצאים עם ספינות הדייג שלנו ומביאים לכם ממי הים התיכון את ההיצע הכי טרי — היישר מנמל יפו לחנות הדגים שלנו בשכונת הגוש הגדול.
            </p>
            <p>
              אנו יוצאים לדוג עבורכם את שלל דגי הים האיכותיים ביותר בפיקוח שלנו וללא סוחרים. הדגים שלנו מטופלים בקפידה על ידי צוות מנוסה ומיומן ועם המון אהבה.
            </p>
          </div>

          {/* Highlight Text */}
          <p className="font-[var(--font-cormorant)] text-2xl sm:text-3xl text-white mt-12 mb-12">
            בואו לגלות מה דגנו לכם היום
          </p>

          <Link
            href="/"
            className="group inline-flex items-center gap-3 font-[var(--font-heebo)] text-[#0A1628] bg-[#D4A574] px-8 py-4 hover:bg-[#E5B685] transition-all duration-300"
          >
            <span className="font-medium">לחנות הדגים</span>
            <svg
              className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Wave Pattern Bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 100'%3E%3Cpath fill='%23F5F1EB' d='M0,50 C360,100 720,0 1080,50 C1260,75 1350,75 1440,50 L1440,100 L0,100 Z'/%3E%3C/svg%3E") no-repeat bottom`,
            backgroundSize: 'cover',
          }}
        />
      </section>

      {/* Bottom Spacer */}
      <div className="h-24 bg-[#F5F1EB]" />
    </div>
  );
}
