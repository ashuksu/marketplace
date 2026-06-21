import { AddToCartButton } from '@/features/add-to-cart/ui/add-to-cart-button';
import { CartSummary } from '@/widgets/cart-summary/ui/cart-summary';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import type { Product } from '@/entities/product/model/types';

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <Card className="p-3">
      <div className="grid gap-5 md:grid-cols-2">
        <div className="bg-muted flex aspect-square items-center justify-center rounded-xl">
          <span className="text-muted-foreground text-sm">Product image</span>
        </div>

        <CardContent className="flex flex-col justify-between gap-4.5 p-6">
          <div className="space-y-2">
            <Badge variant="secondary">{product.category}</Badge>

            <h1 className="text-3xl font-semibold">{product.title}</h1>

            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <div className="text-2xl font-semibold">${product.price}</div>

          <div className="flex items-center gap-3 text-sm">
            <span>Rating: ⭐ {product.rating}</span>
            <span className="text-muted-foreground">•</span>
            <span>Stock: {product.stock}</span>
          </div>

          <AddToCartButton product={product} />
          <CartSummary />
        </CardContent>
      </div>
    </Card>
  );
}
