import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const blogCategoryApi = createApi({
  reducerPath: "blogCategoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:7000/api/blog-category" }),
  tagTypes: ["BlogCategory"],

  endpoints: (builder) => ({
    // 📘 دریافت همه دسته‌ها
    getBlogCategories: builder.query({
      query: () => "/show",
      providesTags: ["BlogCategory"],
    }),

    // 📗 ایجاد دسته جدید
    createBlogCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/create",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["BlogCategory"],
    }),

    // 📙 حذف دسته
    deleteBlogCategory: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BlogCategory"],
    }),

    // 📕 دریافت یک دسته خاص (برای ویرایش)
    getBlogCategoryById: builder.query({
      query: (id) => `/get/${id}`,
      providesTags: ["BlogCategory"],
    }),

    // 📒 ویرایش دسته
    updateBlogCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["BlogCategory"],
    }),
  }),
});

export const {
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useDeleteBlogCategoryMutation,
  useGetBlogCategoryByIdQuery,
  useUpdateBlogCategoryMutation,
} = blogCategoryApi;
