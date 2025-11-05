import { apiSlice } from "../api/apiSlice";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/product`;

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // 📦 همه محصولات
    getAllProducts: builder.query({
      query: () => `${BASE_URL}/all`,
      query: () => `${BASE_URL}/show`,
      providesTags: ['Products'],
    }),

    // 📂 محصولات بر اساس نوع
    getProductType: builder.query({
      query: ({ type, query }) => `${BASE_URL}/${type}?${query}`,
      providesTags: ['ProductType'],
    }),

    // 💰 محصولات دارای تخفیف
    getOfferProducts: builder.query({
      query: (type) => `${BASE_URL}/offer?type=${type}`,
      providesTags: ['OfferProducts'],
    }),

    // ⭐ محصولات محبوب بر اساس نوع
    getPopularProductByType: builder.query({
      query: (type) => `${BASE_URL}/popular/${type}`,
      providesTags: ['PopularProducts'],
    }),

    // 🏆 محصولات با بالاترین امتیاز
    getTopRatedProducts: builder.query({
      query: () => `${BASE_URL}/top-rated`,
      providesTags: ['TopRatedProducts'],
    }),

    // 🔍 محصول تکی
    getProduct: builder.query({
      query: (id) => `${BASE_URL}/single-product/${id}`,
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
      invalidatesTags: (result, error, arg) => [
        { type: "RelatedProducts", id: arg },
      ],
    }),

    // 🔗 محصولات مرتبط
    getRelatedProducts: builder.query({
      query: (id) => `${BASE_URL}/related-product/${id}`,
      providesTags: (result, error, arg) => [
        { type: "RelatedProducts", id: arg },
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductTypeQuery,
  useGetOfferProductsQuery,
  useGetPopularProductByTypeQuery,
  useGetTopRatedProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
} = productApi;
