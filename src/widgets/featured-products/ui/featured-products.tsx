import { getProducts } from '@/entities/product/api/get-products';
import { ProductCard } from '@/entities/product/ui/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';

export async function FeaturedProducts() {
  const products = await getProducts();

  return (
    <section>
      <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold">Featured products</h2>
              <p className="text-muted-foreground mt-2">A few products available right now.</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <CarouselPrevious className="static my-0 size-8" aria-label="Previous products" />
              <CarouselNext className="static my-0 size-8" aria-label="Next products" />
            </div>
          </div>

          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
