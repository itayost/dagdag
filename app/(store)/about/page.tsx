import Image from 'next/image';
import Link from 'next/link';
import { Anchor, Fish, Quote, ArrowLeft } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Fish className="w-4 h-4" />
                הסיפור שלנו
              </div>
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight mb-6">
                <Quote className="w-8 h-8 text-blue-500 mb-2" />
                &ldquo;זו סגירת מעגל שחיכיתי לה 44 שנים&rdquo;
              </blockquote>
              <p className="text-lg text-slate-300">
                אפי אללוף, מייסד ג׳קו דגים
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                <Image
                  src="/images/about/efi.webp"
                  alt="אפי אללוף - מייסד ג׳קו דגים"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-black">44</span>
                <span className="text-sm mr-1">שנים</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none text-slate-700">
            <p className="text-xl leading-relaxed mb-6">
              בגיל 16 אפי אללוף כבר היה בעלים של בסטה לדגים בשוק הטורקי בחיפה. מאז הוא הספיק להאכיל עשרות אלפי סועדים בכ-21 מסעדות שהיו בבעלותו. בימים אלו הוא חזר לשורשים, פתח חנות דגים תל-אביבית בשם &apos;ג׳קו דגים&apos; ומתרגש כמו נער צעיר.
            </p>

            <p className="leading-relaxed mb-6">
              לאחר שחל איסור דיג בתקופת הרבייה בחודשים יולי-אוגוסט, אפי אללוף שוב יכול לנשום לרווחה. ארבע ספינות דיג שהוא שותף להן עושות בכל לילה את המסע אל מעמקי הים התיכון, וחוזרות לפנות בוקר עם שלל דגים טריים היישר אל חנות הדגים החדשה שהוא פתח בתל אביב – &apos;ג׳קו דגים&apos;. בדקות שבהן הסחורה יורדת מהסירות ומגיעה לחנות, אללוף עוצם את עיניו ומחייך חיוך רחב, הוא שוב עשה זאת.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">בעל הבית השתגע?</h2>

            <p className="leading-relaxed mb-6">
              העיתוי לפתיחת חנות הדגים החדשה הגיעה בהפתעה גמורה. רק לפני כשנה אפי אללוף פתח מסעדת דגים ופירות ים חדשה בהרצליה – &apos;לולה מרטין&apos; שמה, והיא זוכה לשבחים רבים. האם בעל הבית השתגע?
            </p>

            <blockquote className="bg-slate-50 border-r-4 border-blue-600 p-6 rounded-lg my-8 not-italic">
              <p className="text-lg text-slate-800 mb-0">
                &ldquo;בכל קריירת המסעדנות שלי ידעתי שיום יבוא ואני אחזור למקורות, להיות בעלים של חנות דגים. זו האהבה הראשונה שלי. כמו בים כך גם בחיים, גל חדש מגיע ומביא עימו הזדמנויות חדשות. ידעתי שיש מחסור בחנויות דגים איכותיות באזור תל אביב, וברגע שנוצרה ההזדמנות לפתוח כזו בלוקיישן מושלם, לא הססתי לרגע.&rdquo;
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Fishing Boats Section */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/images/about/boats.webp"
                  alt="ספינות הדייג שלנו בנמל יפו"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Anchor className="w-4 h-4" />
                ספינות הדייג שלנו
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">
                הידעתם שיש לנו ארבע ספינות דייג שעוגנות בנמל יפו?
              </h2>
              <div className="space-y-4 text-slate-700">
                <p>
                  לפני שהשמש מתחילה לזרוח אנחנו יוצאים עם ספינות הדייג שלנו ומביאים לכם ממי הים התיכון את ההיצע הכי טרי - היישר מנמל יפו לחנות הדגים שלנו בשכונת הגוש הגדול בצפון תל-אביב.
                </p>
                <p>
                  אנו יוצאים לדוג עבורכם את שלל דגי הים האיכותיים ביותר בפיקוח שלנו וללא סוחרים. הדגים שלנו מטופלים בקפידה על ידי צוות מנוסה ומיומן ועם המון אהבה.
                </p>
                <p className="font-medium text-slate-900">
                  אז בואו לגלות מה דגנו לכם היום ותיהנו מארוחה ביתית מופלאה.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                לחנות הדגים
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-blue-400 mb-2">44+</p>
              <p className="text-slate-300">שנות ניסיון</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-blue-400 mb-2">21</p>
              <p className="text-slate-300">מסעדות בבעלות</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-blue-400 mb-2">4</p>
              <p className="text-slate-300">ספינות דייג</p>
            </div>
            <div className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-blue-400 mb-2">100%</p>
              <p className="text-slate-300">טריות מהים</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
