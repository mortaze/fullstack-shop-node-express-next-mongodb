// blogApi.js
import { apiSlice } from "../api/apiSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const blogApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // دریافت همه بلاگ‌ها
    getAllBlogs: builder.query({
      query: (queryParams = "") => `${API_URL}/blog/all?${queryParams}`,
      providesTags: ['Blogs'],
    }),

    // دریافت یک بلاگ
    getSingleBlog: builder.query({
      query: (id) => `${API_URL}/blog/get/${id}`,
      providesTags: (result, error, arg) => [{ type: "Blog", id: arg }],
      invalidatesTags: (result, error, arg) => [{ type: "RelatedBlogs", id: arg }],
    }),

    // بلاگ‌ها بر اساس دسته‌بندی
    getBlogsByCategory: builder.query({
      query: (categoryId) => `${API_URL}/blog/category/${categoryId}`,
      providesTags: (result, error, arg) => [{ type: "CategoryBlogs", id: arg }],
    }),

    // بلاگ‌ها بر اساس نویسنده
    getBlogsByAuthor: builder.query({
      query: (authorId) => `${API_URL}/blog/author/${authorId}`,
      providesTags: (result, error, arg) => [{ type: "AuthorBlogs", id: arg }],
    }),

    // بلاگ‌های ویژه
    getFeaturedBlogs: builder.query({
      query: () => `${API_URL}/blog/featured`,
      providesTags: ['FeaturedBlogs'],
    }),

    // بلاگ‌های پرطرفدار
    getPopularBlogs: builder.query({
      query: () => `${API_URL}/blog/popular`,
      providesTags: ['PopularBlogs'],
    }),

    // جستجوی بلاگ
    searchBlogs: builder.query({
      query: (searchQuery) => `${API_URL}/blog/search?${searchQuery}`,
      providesTags: ['SearchBlogs'],
    }),

    // بلاگ‌های مرتبط
    getRelatedBlogs: builder.query({
      query: (blogId) => `${API_URL}/blog/related/${blogId}`,
      providesTags: (result, error, arg) => [{ type: "RelatedBlogs", id: arg }],
    }),

    // افزایش بازدید
    incrementViews: builder.mutation({
      query: (blogId) => ({
        url: `${API_URL}/blog/views/${blogId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Blog", id: arg }],
    }),

    // ایجاد بلاگ
    createBlog: builder.mutation({
      query: (blogData) => ({
        url: `${API_URL}/blog/create`,
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ['Blogs'],
    }),

    // بروزرسانی بلاگ
    updateBlog: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `${API_URL}/blog/update/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Blog", id: arg.id }],
    }),

    // حذف بلاگ
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `${API_URL}/blog/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Blogs'],
    }),

    // افزودن کامنت
    addComment: builder.mutation({
      query: ({ blogId, commentData }) => ({
        url: `${API_URL}/blog/comment/${blogId}`,
        method: "POST",
        body: commentData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Blog", id: arg.blogId }],
    }),

    // پاسخ به کامنت
    replyToComment: builder.mutation({
      query: ({ blogId, commentId, replyData }) => ({
        url: `${API_URL}/blog/reply/${blogId}/${commentId}`,
        method: "POST",
        body: replyData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Blog", id: arg.blogId }],
    }),

    // --------- جدید: دسته‌بندی‌ها ---------
    getAllCategories: builder.query({
      query: () => `${API_URL}/blog-category/show`,
      providesTags: ['BlogCategories'],
    }),

    // --------- جدید: تگ‌ها ---------
    getAllTags: builder.query({
      query: () => `${API_URL}/tags`,
      providesTags: ['Tags'],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetSingleBlogQuery,
  useGetBlogsByCategoryQuery,
  useGetBlogsByAuthorQuery,
  useGetFeaturedBlogsQuery,
  useGetPopularBlogsQuery,
  useSearchBlogsQuery,
  useGetRelatedBlogsQuery,
  useIncrementViewsMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useAddCommentMutation,
  useReplyToCommentMutation,
  // hook های جدید
  useGetAllCategoriesQuery,
  useGetAllTagsQuery,
} = blogApi;
