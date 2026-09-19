import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Product } from '@/entities/product/model/types';

export const productApi = createApi({
  reducerPath: 'productApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001',
  }),

  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
