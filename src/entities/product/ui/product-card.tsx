import Link from 'next/link';

import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardFooter } from '@/shared/ui/card';
import type { Product } from '../model/types';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <Link
        href={`/products/${product.id}`}
        className="bg-muted flex aspect-square items-center justify-center"
      >
        <span className="text-muted-foreground text-sm">Product image</span>
      </Link>

      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-medium">{product.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{product.category}</p>
          </div>

          <Badge variant="secondary" className="h-auto px-2 py-1">
            ⭐ {product.rating}
          </Badge>
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p>

        <p className="text-lg font-semibold">${product.price}</p>
      </CardContent>

      <CardFooter className="mt-auto p-4">
        <Link
          href={`/products/${product.id}`}
          className="text-sm font-medium underline-offset-4 hover:underline"
        >
          View product
        </Link>
      </CardFooter>
    </Card>
  );
}
