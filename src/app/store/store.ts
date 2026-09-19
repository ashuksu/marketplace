import { configureStore } from '@reduxjs/toolkit';

import { cartApi } from '@/entities/cart/api/cart-api';
import { productApi } from '@/entities/product/api/product-api';

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware).concat(cartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
