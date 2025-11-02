// import Cookies from "js-cookie";
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// const NEXT_PUBLIC_API_BASE_URL = 'http://localhost:7000/api';

// export const apiSlice = createApi({
//   reducerPath: "api",
//   baseQuery: fetchBaseQuery({
//     baseUrl:NEXT_PUBLIC_API_BASE_URL,
//     prepareHeaders: async (headers, { getState, endpoint }) => {
//       try {
//         const userInfo = Cookies.get('userInfo');
//         if (userInfo) {
//           const user = JSON.parse(userInfo);
//           if (user?.accessToken) {
//             headers.set("Authorization", `Bearer ${user.accessToken}`);
//           }
//         }
//       } catch (error) {
//         console.error('Error parsing user info:', error);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({}),
//   tagTypes: ["Products","Coupon","Product","RelatedProducts","UserOrder","UserOrders","ProductType","OfferProducts","PopularProducts","TopRatedProducts"]
// });import Cookies from "js-cookie";
import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const NEXT_PUBLIC_API_BASE_URL = 'http://localhost:7000/api';

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers, { getState, endpoint }) => {
      try {
        // FIX: کوکی‌ها فقط باید در سمت کلاینت (مرورگر) خوانده شوند تا از خطای ReferenceError در SSR جلوگیری شود.
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
        console.error('Error parsing user info:', error);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
  // تگ 'Category' برای رفع خطای "Tag type ... not specified" اضافه شد.
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
    "TopRatedProducts"
  ]
});
