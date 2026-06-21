import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { CartItem } from '@/entities/cart/model/cart-slice';

export const cartApi = createApi({
  reducerPath: 'cartApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),

  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => '/cart',
    }),

    addToCart: builder.mutation<CartItem[], { productId: string; quantity: number }>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetCartQuery, useAddToCartMutation } = cartApi;
