'use client';

import { useDispatch } from 'react-redux';

import { addItem } from '@/entities/cart/model/cart-slice';
import type { Product } from '@/entities/product/model/types';
import type { AppDispatch } from '@/app/store/store';
import { Button } from '@/shared/ui/button';

type AddToCartButtonProps = {
  product: Product;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = () => {
    dispatch(
      addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
      }),
    );
  };

  return <Button onClick={handleAddToCart}>Add to cart</Button>;
}
