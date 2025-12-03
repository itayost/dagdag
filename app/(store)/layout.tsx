import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';
import CartDrawer from '@/components/store/CartDrawer';
import AnnouncementBar from '@/components/store/AnnouncementBar';
import CategoryPills from '@/components/store/CategoryPills';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/components/ui/Toast';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <ToastProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <AnnouncementBar />
          <Header />
          <CategoryPills />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </ToastProvider>
    </CartProvider>
  );
}
