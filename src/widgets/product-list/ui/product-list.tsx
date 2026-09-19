import type { Product } from '@/entities/product/model/types';
import { ProductCard } from '@/entities/product/ui/product-card';

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
