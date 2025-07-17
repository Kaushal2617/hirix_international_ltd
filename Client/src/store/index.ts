import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import categoryReducer from './categorySlice';
import productReducer from './productSlice';
import bannerReducer from './bannerSlice';
import usersReducer from './usersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    categories: categoryReducer,
    products: productReducer,
    banners: bannerReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 