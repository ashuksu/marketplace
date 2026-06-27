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

type UpdateCartItemRequest = {
  productId: string;
  quantity: number;
};

export const cartApi = createApi({
  reducerPath: 'cartApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),

  endpoints: (builder) => ({
    getCart: builder.query<CartItem[], void>({
      query: () => '/cart',
    }),

    addToCart: builder.mutation<CartItem[], AddToCartRequest>({
      query: (body) => ({
        url: '/cart',
        method: 'POST',
        body,
      }),

      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(cartApi.util.updateQueryData('getCart', undefined, () => data));
      },
    }),

    updateCartItem: builder.mutation<CartItem[], UpdateCartItemRequest>({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: 'PATCH',
        body: {
          quantity,
        },
      }),

      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(cartApi.util.updateQueryData('getCart', undefined, () => data));
      },
    }),

    removeFromCart: builder.mutation<CartItem[], string>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: 'DELETE',
      }),

      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        dispatch(cartApi.util.updateQueryData('getCart', undefined, () => data));
      },
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} = cartApi;
