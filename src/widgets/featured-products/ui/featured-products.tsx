import { products } from '@/entities/product/model/data';
import { ProductCard } from '@/entities/product/ui/product-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/carousel';

export function FeaturedProducts() {
  return (
    <section>
      <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Featured products</h2>
          <p className="text-muted-foreground mt-2">A few products available right now.</p>
        </div>

        <Carousel
          opts={{
            align: 'start',
          }}
          className="px-12"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
