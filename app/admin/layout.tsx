import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';

export const metadata = {
  title: 'ניהול | ג׳קו דגים',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is on login page
  const isLoginPage = false; // Will be handled by the login page itself

  // Get current admin
  const admin = await getCurrentAdmin();

  // If not logged in and not on login page, redirect to login
  // Note: Login page has its own layout that doesn't require auth

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {admin ? (
        <>
          <Sidebar />
          <main className="mr-64 min-h-screen">
            {children}
          </main>
        </>
      ) : (
        // For unauthenticated users, just show children (login page)
        children
      )}
    </div>
  );
}
