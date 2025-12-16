'use client';

import { Plus, Minus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  unit: 'KG' | 'UNIT';
  onIncrement: (e: React.MouseEvent) => void;
  onDecrement: (e: React.MouseEvent) => void;
  variant?: 'compact' | 'full';
  disabled?: boolean;
}

export default function QuantityControl({
  quantity,
  unit,
  onIncrement,
  onDecrement,
  variant = 'compact',
  disabled = false,
}: QuantityControlProps) {
  const unitLabel = unit === 'KG' ? 'ק"ג' : 'יח\'';

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center gap-1 bg-slate-100 rounded-lg p-1">
        <button
          onClick={onDecrement}
          disabled={disabled}
          aria-label="הפחת כמות"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 min-w-[50px] justify-center">
          <span className="text-sm font-bold text-slate-900">{quantity}</span>
          <span className="text-xs text-slate-500">{unitLabel}</span>
        </div>
        <button
          onClick={onIncrement}
          disabled={disabled}
          aria-label="הוסף כמות"
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Full variant (for larger displays)
  return (
    <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
      <button
        onClick={onDecrement}
        disabled={disabled}
        aria-label="הפחת כמות"
        className="p-3 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
      >
        <Minus className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-1.5 min-w-[70px] justify-center">
        <span className="text-lg font-bold text-slate-900">{quantity}</span>
        <span className="text-sm text-slate-500">{unitLabel}</span>
      </div>
      <button
        onClick={onIncrement}
        disabled={disabled}
        aria-label="הוסף כמות"
        className="p-3 text-slate-500 hover:text-slate-700 hover:bg-white rounded-lg transition-colors disabled:opacity-50"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
