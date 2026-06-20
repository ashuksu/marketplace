import { notFound } from 'next/navigation';

import { products } from '@/entities/product/model/data';

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-6 py-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="bg-muted flex aspect-square items-center justify-center rounded-xl">
          <span className="text-muted-foreground text-sm">Product image</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">{product.category}</p>

            <h1 className="text-3xl font-semibold">{product.title}</h1>

            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="text-2xl font-semibold">${product.price}</div>

          <div className="text-sm">
            Rating: ⭐ {product.rating} · Stock: {product.stock}
          </div>
        </div>
      </div>
    </main>
  );
}
