import { notFound } from 'next/navigation';

import { getProduct } from '@/entities/product/api/get-product';
import { ProductDetails } from '@/widgets/product-details/ui/product-details';

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <section>
      <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <ProductDetails product={product} />
      </div>
    </section>
  );
}
