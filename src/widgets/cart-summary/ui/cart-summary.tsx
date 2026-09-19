'use client';

import { useSelector } from 'react-redux';

import type { RootState } from '@/app/store/store';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';

export function CartSummary() {
  const items = useSelector((state: RootState) => state.cart.items);

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cart</CardTitle>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={item.productId}
                  className="flex items-end justify-between gap-3 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.title}</p>

                    <p className="text-muted-foreground mt-1 text-sm">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <p className="shrink-0 font-medium">${itemTotal.toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {items.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <span className="font-medium">Total</span>
          <span className="text-lg font-semibold">${totalPrice.toFixed(2)}</span>
        </CardFooter>
      )}
    </Card>
  );
}
