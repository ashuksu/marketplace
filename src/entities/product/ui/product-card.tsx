import Link from 'next/link';

import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardFooter } from '@/shared/ui/card';
import type { Product } from '../model/types';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-muted flex aspect-square items-center justify-center">
        <span className="text-muted-foreground text-sm">Product image</span>
      </div>

      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-medium">{product.title}</h2>
            <p className="text-muted-foreground mt-1 text-sm">{product.category}</p>
          </div>

          <Badge variant="secondary">{product.rating}</Badge>
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm">{product.description}</p>

        <p className="text-lg font-semibold">${product.price}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Link
          href={`/products/${product.id}`}
          className="text-sm font-medium underline underline-offset-4"
        >
          View product
        </Link>
      </CardFooter>
    </Card>
  );
}
