import { apiSlice } from "../api/apiSlice";

export const brandApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    
    // 1️⃣ گرفتن همه برندهای فعال
    getActiveBrands: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_URL}/brand/active`,
      transformResponse: (response) => Array.isArray(response?.result) ? response.result : response || [],
      providesTags: (result) => {
        if (!result || !Array.isArray(result)) return [{ type: 'Brand', id: 'LIST' }];
        return [
          ...result.map(b => ({ type: 'Brand', id: b._id })),
          { type: 'Brand', id: 'LIST' }
        ];
      },
    }),

    // 2️⃣ افزودن برند جدید
    addBrand: builder.mutation({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/brand/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    // 3️⃣ ویرایش برند
    updateBrand: builder.mutation({
      query: ({ id, formData }) => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/brand/edit/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    // 4️⃣ حذف برند
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/brand/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    // 5️⃣ گرفتن برند تکی بر اساس ID
    getBrandById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_URL}/brand/get/${id}`,
      transformResponse: (response) => response || {},
      providesTags: (result, error, id) => [{ type: 'Brand', id }],
    }),

  }),
});

export const {
  useGetActiveBrandsQuery,
  useAddBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandByIdQuery,
} = brandApi;
