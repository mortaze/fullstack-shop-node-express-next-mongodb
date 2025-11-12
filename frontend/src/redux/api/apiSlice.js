import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// خواندن Base URL از فایل .env
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers, { getState, endpoint }) => {
      try {
        // فقط در سمت کلاینت کوکی بخوان
        if (typeof window !== 'undefined') {
          const userInfo = Cookies.get('userInfo');
          if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user?.accessToken) {
              headers.set("Authorization", `Bearer ${user.accessToken}`);
            }
          }
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Category",
    "Products",
    "Coupon",
    "Product",
    "RelatedProducts",
    "UserOrder",
    "UserOrders",
    "ProductType",
    "OfferProducts",
    "PopularProducts",
    "TopRatedProducts",
    "Blogs" // اضافه شد برای وبلاگ
  ],
  endpoints: (builder) => ({}), // بعداً در فایل جداگانه endpoints وبلاگ یا محصول را inject کن
});

export default apiSlice;
