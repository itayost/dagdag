'use client';

import { Bell, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  adminName?: string;
}

export default function Header({ title, adminName = 'מנהל' }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{adminName}</span>
        </div>
      </div>
    </header>
  );
}
