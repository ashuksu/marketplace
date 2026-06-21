import Link from 'next/link';

import { products } from '@/entities/product/model/data';
import { ProductList } from '@/widgets/product-list/ui/product-list';
import { Button } from '@/shared/ui/button';

export default function HomePage() {
  return (
    <div>
      <section>
        <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm font-medium">Marketplace</p>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Find products from independent sellers.
              </h1>

              <p className="text-muted-foreground text-lg">
                Browse products, compare options and find what you need.
              </p>
            </div>

            <Button asChild>
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section>
        <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Featured products</h2>
            <p className="text-muted-foreground mt-2">A few products available right now.</p>
          </div>

          <ProductList products={products} />
        </div>
      </section>
    </div>
  );
}
