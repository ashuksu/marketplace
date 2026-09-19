'use client';

import { useAddToCartMutation } from '@/entities/cart/api/cart-api';
import { Button } from '@/shared/ui/button';

type AddToCartButtonProps = {
  productId: string;
};

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const handleAddToCart = async () => {
    await addToCart({
      productId,
      quantity: 1,
    });
  };

  return (
    <Button type="button" onClick={handleAddToCart} disabled={isLoading}>
      {isLoading ? 'Adding...' : 'Add to cart'}
    </Button>
  );
}
