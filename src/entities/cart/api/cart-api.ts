import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type ServerCartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

export const cartApi = createApi({
  reducerPath: 'cartApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),

  tagTypes: ['Cart'],

  endpoints: (builder) => ({
    getCart: builder.query<ServerCartItem[], void>({
      query: () => '/cart',

      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<ServerCartItem[], { productId: string; quantity: number }>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),

      invalidatesTags: ['Cart'],
    }),
  }),
});

export const { useGetCartQuery, useAddToCartMutation } = cartApi;
