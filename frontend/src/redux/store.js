import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
import authSlice from "./features/auth/authSlice";
import cartSlice from "./features/cartSlice";
import compareSlice from "./features/compareSlice";
import productModalSlice from "./features/productModalSlice";
import shopFilterSlice from "./features/shop-filter-slice";
import wishlistSlice from "./features/wishlist-slice";
import couponSlice from "./features/coupon/couponSlice";
import orderSlice from "./features/order/orderSlice";

// ✳️ اضافه کردن APIهای جدید
import { blogApi } from "./features/blogApi";
import { blogCategoryApi } from "./features/blogCategoryApi";

const store = configureStore({
  reducer: {
    // Reducerهای RTK Query
    [apiSlice.reducerPath]: apiSlice.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [blogCategoryApi.reducerPath]: blogCategoryApi.reducer,

    // Reducerهای معمولی
    auth: authSlice,
    productModal: productModalSlice,
    shopFilter: shopFilterSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    compare: compareSlice,
    coupon: couponSlice,
    order: orderSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(blogApi.middleware)
      .concat(blogCategoryApi.middleware),
});

export default store;
