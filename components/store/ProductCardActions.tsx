'use client';

import { useState, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/Toast';
import CuttingStyleModal from './CuttingStyleModal';
import QuantityControl from './QuantityControl';

interface ProductCardActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: string | number;
    salePrice: string | number | null;
    unit: 'KG' | 'UNIT';
    hasCuttingOptions: boolean;
    cuttingStyles?: string[];
    image: string | null;
    inStock: boolean;
  };
}

export default function ProductCardActions({ product }: ProductCardActionsProps) {
  const { items, addItem, updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate effective price
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const salePrice = product.salePrice
    ? typeof product.salePrice === 'string'
      ? parseFloat(product.salePrice)
      : product.salePrice
    : null;
  const currentPrice = salePrice && salePrice < price ? salePrice : price;

  // Find if product is already in cart (for products without cutting options)
  // For products with cutting options, we show "Add" button since each cutting style is separate
  const cartItem = !product.hasCuttingOptions
    ? items.find(item => item.productId === product.id && item.cuttingStyle === null)
    : null;

  const handleDirectAdd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) return;

    // Only open modal if product has cutting options AND has cutting styles defined
    if (product.hasCuttingOptions && product.cuttingStyles && product.cuttingStyles.length > 0) {
      setIsModalOpen(true);
      return;
    }

    // Direct add for products without cutting options
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: currentPrice,
      originalPrice: price,
      unit: product.unit,
      cuttingStyle: null,
    }, 1);

    showToast(`${product.name} נוסף לסל`, 'success');
  }, [product, addItem, showToast, currentPrice, price]);

  const handleModalAdd = useCallback((cuttingStyle: string, quantity: number) => {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: currentPrice,
      originalPrice: price,
      unit: product.unit,
      cuttingStyle,
    }, quantity);

    showToast(`${product.name} נוסף לסל`, 'success');
    setIsModalOpen(false);
  }, [product, addItem, showToast, currentPrice, price]);

  const handleIncrement = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  }, [cartItem, updateQuantity]);

  const handleDecrement = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      if (cartItem.quantity <= 1) {
        removeItem(cartItem.id);
        showToast(`${product.name} הוסר מהסל`, 'info');
      } else {
        updateQuantity(cartItem.id, cartItem.quantity - 1);
      }
    }
  }, [cartItem, updateQuantity, removeItem, product.name, showToast]);

  // Prevent event propagation on action area click
  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  if (!product.inStock) {
    return (
      <div onClick={handleActionClick} className="mt-3">
        <button
          disabled
          className="w-full bg-slate-200 text-slate-500 font-medium py-2.5 px-4 rounded-lg cursor-not-allowed text-sm"
        >
          אזל מהמלאי
        </button>
      </div>
    );
  }

  return (
    <>
      <div onClick={handleActionClick} className="mt-3">
        {cartItem ? (
          <QuantityControl
            quantity={cartItem.quantity}
            unit={product.unit}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            variant="compact"
          />
        ) : (
          <button
            onClick={handleDirectAdd}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            הוסף לסל
          </button>
        )}
      </div>

      {product.hasCuttingOptions && product.cuttingStyles && (
        <CuttingStyleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={{
            id: product.id,
            name: product.name,
            price: currentPrice,
            originalPrice: price,
            unit: product.unit,
            cuttingStyles: product.cuttingStyles,
            image: product.image,
          }}
          onAddToCart={handleModalAdd}
        />
      )}
    </>
  );
}
