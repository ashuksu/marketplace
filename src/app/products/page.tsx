import { ProductList } from '@/widgets/product-list/ui/product-list';
import { products } from '@/entities/product/model/data';

export default function ProductsPage() {
  return (
    <main className="container mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Products</h1>
        <p className="text-muted-foreground mt-2">Find products from independent sellers.</p>
      </div>

      <ProductList products={products} />
    </main>
  );
}
