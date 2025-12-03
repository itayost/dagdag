import { Truck, Clock, MapPin, Calendar } from 'lucide-react';

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

const openingHours = [
  { day: 'ראשון - חמישי', hours: '08:00 - 20:00' },
  { day: 'שישי', hours: '08:00 - 15:30' },
  { day: 'שבת', hours: 'סגור' },
];

export default function DeliveryAreasPage() {
  return (
    <div className="py-8 sm:py-12 bg-white min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Truck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            אזורי חלוקה ושעות פעילות
          </h1>
          <p className="text-lg text-slate-600">
            משלוחים טריים ישירות מהים אליכם הביתה
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Primary Delivery Areas */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">אזורי חלוקה</h2>
                <p className="text-sm text-slate-500">משלוחים יומיים</p>
              </div>
            </div>
            <ul className="space-y-2">
              {primaryAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-2 text-slate-700"
                >
                  <span className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {/* Pre-order Areas */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">משלוחים בהזמנה מראש</h2>
                <p className="text-sm text-slate-500">בימי חמישי ושישי</p>
              </div>
            </div>
            <ul className="space-y-2 mb-6">
              {preOrderAreas.map((area) => (
                <li
                  key={area}
                  className="flex items-center gap-2 text-slate-700"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-blue-800">
                לתיאום משלוח לאזורים אלו, אנא צרו קשר מראש בטלפון או דרך האתר.
              </p>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="mt-8 bg-slate-900 rounded-2xl p-6 sm:p-8 text-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold">שעות פעילות</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {openingHours.map((item) => (
              <div
                key={item.day}
                className="bg-white/5 rounded-xl p-4 text-center"
              >
                <p className="font-medium text-slate-300 mb-1">{item.day}</p>
                <p className="text-lg font-bold">{item.hours}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 mb-4">
            יש שאלות לגבי משלוחים? נשמח לעזור!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0502175277"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              050-2175277
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              צרו קשר
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
