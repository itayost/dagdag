import Link from 'next/link';
import Image from 'next/image';
import { FolderOpen } from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    _count: {
      products: number;
    };
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative bg-white rounded-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
    >
      {/* Image */}
      <div className="aspect-[4/3] relative bg-slate-100">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <FolderOpen className="w-12 h-12 text-slate-300" />
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {category.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          {category._count.products} מוצרים
        </p>
      </div>
    </Link>
  );
}
