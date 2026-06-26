'use client';

import { useGetCartQuery } from '@/entities/cart/api/cart-api';
import { useGetProductsQuery } from '@/entities/product/api/product-api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';

export function CartSummary() {
  const {
    data: cartItems = [],
    isLoading: isCartLoading,
    isError: isCartError,
  } = useGetCartQuery();

  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsQuery();

  const isLoading = isCartLoading || isProductsLoading;
  const isError = isCartError || isProductsError;

  const items = cartItems.flatMap((cartItem) => {
    const product = products.find((product) => product.id === cartItem.productId);

    if (!product) {
      return [];
    }

    return [
      {
        ...cartItem,
        title: product.title,
        price: product.price,
      },
    ];
  });

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cart</CardTitle>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading cart...</p>
        ) : isError ? (
          <p className="text-destructive text-sm">Failed to load cart.</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground text-sm">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => {
              const itemTotal = item.price * item.quantity;

              return (
                <div
                  key={item.productId}
                  className="flex items-end justify-between gap-3 border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium">{item.title}</p>

                    <p className="text-muted-foreground text-sm">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <p className="font-medium">${itemTotal.toFixed(2)}</p>
                  {/*<div className="flex flex-col items-center gap-3">*/}
                  {/*    <div className="flex items-center rounded-md border">*/}
                  {/*        <Button*/}
                  {/*            variant="ghost"*/}
                  {/*            size="icon"*/}
                  {/*            onClick={() => {*/}
                  {/*                if (item.quantity === 1) {*/}
                  {/*                    dispatch(removeItem(item.productId));*/}
                  {/*                    return;*/}
                  {/*                }*/}

                  {/*                dispatch(*/}
                  {/*                    updateQuantity({*/}
                  {/*                        productId: item.productId,*/}
                  {/*                        quantity: item.quantity - 1,*/}
                  {/*                    }),*/}
                  {/*                );*/}
                  {/*            }}*/}
                  {/*        >*/}
                  {/*            -*/}
                  {/*        </Button>*/}

                  {/*        <span className="w-8 text-center text-sm">{item.quantity}</span>*/}

                  {/*        <Button*/}
                  {/*            variant="ghost"*/}
                  {/*            size="icon"*/}
                  {/*            onClick={() =>*/}
                  {/*                dispatch(*/}
                  {/*                    updateQuantity({*/}
                  {/*                        productId: item.productId,*/}
                  {/*                        quantity: item.quantity + 1,*/}
                  {/*                    }),*/}
                  {/*                )*/}
                  {/*            }*/}
                  {/*        >*/}
                  {/*            +*/}
                  {/*        </Button>*/}
                  {/*    </div>*/}

                  {/*    <div className="w-24 space-y-1 text-right">*/}
                  {/*        <Button*/}
                  {/*            variant="link"*/}
                  {/*            size="sm"*/}
                  {/*            className="text-muted-foreground h-auto cursor-pointer p-0"*/}
                  {/*            onClick={() => dispatch(removeItem(item.productId))}*/}
                  {/*        >*/}
                  {/*            Remove*/}
                  {/*        </Button>*/}

                  {/*        <p className="font-medium">${itemTotal.toFixed(2)}</p>*/}
                  {/*    </div>*/}
                  {/*</div>*/}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {items.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <span className="font-medium">Total</span>

          <span className="text-lg font-semibold">${totalPrice.toFixed(2)}</span>
        </CardFooter>
      )}
    </Card>
  );
}
