import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type ServerCartItem = {
  productId: string;
  quantity: number;
};

export const cartApi = createApi({
  reducerPath: 'cartApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),

  endpoints: (builder) => ({
    getCart: builder.query<ServerCartItem[], void>({
      query: () => '/cart',
    }),

    addToCart: builder.mutation<ServerCartItem[], { productId: string; quantity: number }>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetCartQuery, useAddToCartMutation } = cartApi;
