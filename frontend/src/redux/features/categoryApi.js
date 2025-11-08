
import { apiSlice } from "../api/apiSlice"; // مسیر apiSlice

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // 1️⃣ افزودن دسته‌بندی جدید
    addCategory: builder.mutation({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/category/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    // 2️⃣ گرفتن همه دسته‌ها برای نمایش یا dropdown
    getShowCategory: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_URL}/category/show`,
      transformResponse: (response) => Array.isArray(response?.result) ? response.result : response || [],
      providesTags: (result) => {
        if (!result || !Array.isArray(result)) return [{ type: 'Category', id: 'LIST' }];
        return [
          ...result.map(c => ({ type: 'Category', id: c._id })),
          { type: 'Category', id: 'LIST' }
        ];
      },
    }),

    // 3️⃣ گرفتن دسته‌ها بر اساس productType
    getProductTypeCategory: builder.query({
      query: (type) => `${process.env.NEXT_PUBLIC_API_URL}/category/show`,
      transformResponse: (response, meta, type) => {
        // فیلتر productType در front-end تا با هر API جواب دهد
        const all = Array.isArray(response?.result) ? response.result : response || [];
        return all.filter(c => c.productType === type);
      },
      providesTags: (result) => {
        if (!result || !Array.isArray(result)) return [{ type: 'Category', id: 'LIST' }];
        return [
          ...result.map(c => ({ type: 'Category', id: c._id })),
          { type: 'Category', id: 'LIST' }
        ];
      },
    }),

    // 4️⃣ گرفتن دسته‌بندی تکی بر اساس ID
    getCategoryById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_URL}/category/get/${id}`,
      transformResponse: (response) => response || {}, // هیچ وقت null نیست، حداقل {} برمی‌گردد
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    // 5️⃣ ویرایش دسته‌بندی

updateCategory: builder.mutation({
  async queryFn({ id, formData }, _queryApi, _extraOptions, fetchWithBQ) {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/category/edit/${id}`;
      const res = await fetch(url, {
        method: 'PATCH',
        // نه هدر Content-Type بذار، بذار مرورگر خودش boundary بزنه:
        body: formData,
        // credentials: 'include' // اگر auth/cookie لازمه، فعال کن
      });

      const data = await res.json();
      if (!res.ok) return { error: data || { status: res.status, message: 'Update failed' } };
      return { data };
    } catch (err) {
      return { error: { status: 'FETCH_ERROR', message: err.message } };
    }
  },
  invalidatesTags: [{ type: 'Category', id: 'LIST' }],
}),

    // 6️⃣ حذف دسته‌بندی
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `${process.env.NEXT_PUBLIC_API_URL}/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

  }),
});

export const {
  useAddCategoryMutation,
  useGetShowCategoryQuery,
  useGetProductTypeCategoryQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
