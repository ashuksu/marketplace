import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type CartItem = {
  productId: string;
  title: string;
  price: number;
  quantity: number;
};

type AddToCartRequest = {
  productId: string;
  quantity: number;
};

export const cartApi = createApi({
  reducerPath: 'cartApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),

  tagTypes: ['Cart'],

  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => '/cart',

      providesTags: ['Cart'],
    }),

    addToCart: builder.mutation<CartItem[], AddToCartRequest>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),

      // invalidatesTags: ['Cart'],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(cartApi.util.updateQueryData('getCart', undefined, () => data));
      },
    }),
  }),
});

export const { useGetCartQuery, useAddToCartMutation } = cartApi;
