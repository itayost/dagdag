import { Cormorant_Garamond, Heebo } from 'next/font/google';
import Link from 'next/link';

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

const primaryAreas = [
  'אזורי חן',
  'רמת אביב',
  'רמת אביב החדשה',
  'רמת אביב ג׳',
  'נווה אביבים',
  'כוכב הצפון',
  'תוכנית ל׳',
  'למד החדשה',
  'נופי ים (הגוש הגדול)',
];

const preOrderAreas = [
  'רמת שרון',
  'כפר שמריהו',
  'הרצליה',
];

export default function DeliveryAreasPage() {
  return (
    <div className={`${cormorant.variable} ${heebo.variable} bg-[#F5F1EB] min-h-screen`}>
      {/* Hero Section */}
      <section className="relative bg-[#0A1628] pt-16 pb-32 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4A574]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#D4A574]/10 rounded-full blur-3xl translate-x-1/2" />

        {/* Wave Pattern */}
        <div className="absolute top-0 left-0 right-0 h-full opacity-5">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 560">
            <path fill="currentColor" className="text-[#D4A574]" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="font-[var(--font-heebo)] text-[#D4A574] tracking-[0.3em] text-sm mb-4 uppercase">
            משלוחים טריים
          </p>
          <h1 className="font-[var(--font-cormorant)] text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-6">
            אזורי החלוקה
            <br />
            <span className="text-[#D4A574]">ושעות הפעילות</span>
          </h1>
          <p className="font-[var(--font-heebo)] text-lg text-white/60 max-w-xl mx-auto">
            מביאים לכם את הדגים הטריים ביותר ישירות מנמל יפו עד לפתח הבית
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

      {/* Delivery Areas Grid */}
      <section className="py-16 sm:py-24 -mt-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Primary Areas */}
            <div className="relative">
              <div className="bg-white p-8 sm:p-10 shadow-sm">
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A574]/10" />
                <div className="absolute top-2 right-2 w-20 h-20 border border-[#D4A574]/30" />

                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#0A1628] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#D4A574]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-[var(--font-cormorant)] text-2xl text-[#0A1628]">
                        אזורי חלוקה
                      </h2>
                      <p className="font-[var(--font-heebo)] text-sm text-[#0A1628]/50">
                        משלוחים יומיים
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {primaryAreas.map((area, index) => (
                      <li
                        key={area}
                        className="flex items-center gap-3 font-[var(--font-heebo)] text-[#0A1628]/80"
                      >
                        <span
                          className="w-6 h-6 bg-[#D4A574]/10 text-[#D4A574] text-xs flex items-center justify-center font-medium"
                        >
                          {index + 1}
                        </span>
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Pre-order Areas */}
            <div className="relative">
              <div className="bg-[#0A1628] p-8 sm:p-10 text-white h-full">
                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4A574]/10" />
                <div className="absolute top-2 right-2 w-20 h-20 border border-[#D4A574]/30" />

                <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-[#D4A574] flex items-center justify-center">
                      <svg className="w-6 h-6 text-[#0A1628]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-[var(--font-cormorant)] text-2xl">
                        משלוחים בהזמנה מראש
                      </h2>
                      <p className="font-[var(--font-heebo)] text-sm text-white/50">
                        בימי חמישי ושישי
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {preOrderAreas.map((area, index) => (
                      <li
                        key={area}
                        className="flex items-center gap-3 font-[var(--font-heebo)] text-white/80"
                      >
                        <span
                          className="w-6 h-6 bg-[#D4A574] text-[#0A1628] text-xs flex items-center justify-center font-medium"
                        >
                          {index + 1}
                        </span>
                        {area}
                      </li>
                    ))}
                  </ul>

                  <div className="bg-white/5 border border-white/10 p-4">
                    <p className="font-[var(--font-heebo)] text-sm text-white/70">
                      לתיאום משלוח לאזורים אלו, אנא צרו קשר מראש בטלפון או דרך האתר.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="font-[var(--font-heebo)] text-[#D4A574] tracking-[0.3em] text-sm mb-4 uppercase">
              מתי אנחנו פתוחים
            </p>
            <h2 className="font-[var(--font-cormorant)] text-3xl sm:text-4xl text-[#0A1628]">
              שעות פעילות
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {/* Sunday-Thursday */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#D4A574]/5 transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative p-8 text-center border border-[#D4A574]/20">
                <p className="font-[var(--font-heebo)] text-[#0A1628]/60 mb-2">ראשון - חמישי</p>
                <p className="font-[var(--font-cormorant)] text-3xl text-[#0A1628]">08:00</p>
                <div className="w-8 h-px bg-[#D4A574] mx-auto my-2" />
                <p className="font-[var(--font-cormorant)] text-3xl text-[#0A1628]">20:00</p>
              </div>
            </div>

            {/* Friday */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#D4A574]/5 transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative p-8 text-center border border-[#D4A574]/20">
                <p className="font-[var(--font-heebo)] text-[#0A1628]/60 mb-2">שישי</p>
                <p className="font-[var(--font-cormorant)] text-3xl text-[#0A1628]">08:00</p>
                <div className="w-8 h-px bg-[#D4A574] mx-auto my-2" />
                <p className="font-[var(--font-cormorant)] text-3xl text-[#0A1628]">15:30</p>
              </div>
            </div>

            {/* Saturday */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#0A1628] transform group-hover:scale-105 transition-transform duration-300" />
              <div className="relative p-8 text-center border border-[#0A1628]">
                <p className="font-[var(--font-heebo)] text-white/60 mb-2">שבת</p>
                <p className="font-[var(--font-cormorant)] text-3xl text-white mt-6">סגור</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 sm:py-20 bg-[#F5F1EB]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="font-[var(--font-cormorant)] text-2xl sm:text-3xl text-[#0A1628] mb-4">
            יש שאלות לגבי משלוחים?
          </h3>
          <p className="font-[var(--font-heebo)] text-[#0A1628]/60 mb-8">
            נשמח לעזור ולתאם את המשלוח המושלם עבורכם
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0502175277"
              className="group inline-flex items-center justify-center gap-3 font-[var(--font-heebo)] bg-[#0A1628] text-white px-8 py-4 hover:bg-[#0A1628]/90 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              050-2175277
            </a>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 font-[var(--font-heebo)] bg-[#D4A574] text-[#0A1628] px-8 py-4 hover:bg-[#E5B685] transition-colors"
            >
              צרו קשר
              <svg className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
