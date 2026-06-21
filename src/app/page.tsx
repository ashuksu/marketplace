import { HomeHero } from '@/widgets/home-hero/ui/home-hero';
import { products } from '@/entities/product/model/data';
import { ProductList } from '@/widgets/product-list/ui/product-list';

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <section>
        <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">Featured products</h2>
            <p className="text-muted-foreground mt-2">A few products available right now.</p>
          </div>

          <ProductList products={products} />
        </div>
      </section>
    </>
  );
}
