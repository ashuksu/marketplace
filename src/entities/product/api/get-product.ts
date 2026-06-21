import type { Product } from '@/entities/product/model/types';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

export async function getProduct(id: string): Promise<Product | null> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    cache: 'no-store',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }

  return response.json();
}
