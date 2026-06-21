'use client';

import { useSelector } from 'react-redux';

import type { RootState } from '@/app/store/store';

export function CartSummary() {
  const items = useSelector((state: RootState) => state.cart.items);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="rounded-lg border p-4">
      <p className="font-medium">Cart</p>
      <p className="text-muted-foreground text-sm">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>
      <p className="mt-2 font-semibold">${totalPrice}</p>
    </div>
  );
}
