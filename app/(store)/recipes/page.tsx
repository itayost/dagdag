import Link from 'next/link';
import { ChefHat, ArrowLeft } from 'lucide-react';

export default function RecipesPage() {
  return (
    <div className="py-16 sm:py-24 bg-white min-h-[60vh]">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ChefHat className="w-10 h-10 text-amber-600" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">
          מתכונים
        </h1>
        <p className="text-lg text-slate-600 mb-2">
          בקרוב!
        </p>
        <p className="text-slate-500 mb-8">
          אנחנו עובדים על אוסף מתכונים טעימים לדגים טריים.
          <br />
          חזרו בקרוב לגלות מתכונים מיוחדים!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors"
        >
          לחנות הדגים
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
