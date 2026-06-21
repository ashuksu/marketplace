import type { Product } from '@/entities/product/model/types';
import { ProductCard } from '@/entities/product/ui/product-card';

type ProductListProps = {
  products: Product[];
};

export function ProductList({ products }: ProductListProps) {
  return (
    // <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
    <div className="grid grid-cols-1 gap-4 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
