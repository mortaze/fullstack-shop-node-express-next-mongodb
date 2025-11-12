"use client";

import DashboardLayout from "../layout";
import Link from "next/link";
import { FaEye, FaCommentDots, FaPen, FaPlusCircle, FaTrash } from "react-icons/fa";
import { useGetAllBlogsQuery, useDeleteBlogMutation } from "@/redux/features/blogApi";

export default function BlogDashboardPage() {
  const { data: response, isLoading } = useGetAllBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();

  // اگر داده‌ها موجود باشند، از کلید data استفاده می‌کنیم
  const posts = Array.isArray(response?.data) ? response.data : [];

  const statusColors = {
    published: "text-green-400",
    draft: "text-yellow-400",
    scheduled: "text-blue-400",
    deleted: "text-red-400",
  };

  const handleDelete = async (id) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این پست را حذف کنید؟")) return;
    try {
      await deleteBlog(id).unwrap();
      alert("پست با موفقیت حذف شد.");
    } catch (err) {
      console.error(err);
      alert("خطا در حذف پست");
    }
  };

  if (isLoading) return <p className="text-white p-4">در حال بارگذاری پست‌ها...</p>;

  return (
    <DashboardLayout>
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">مدیریت وبلاگ</h2>
          <Link
            href="/dashboard/blog/create"
            className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white"
          >
            <FaPlusCircle />
            پست جدید
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-300">هیچ پستی وجود ندارد.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-700 p-5 rounded-xl shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{post.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span>{new Date(post.createdAt).toLocaleDateString("fa-IR")}</span>
                      <span className={statusColors[post.status] || "text-white"}>
                        {post.status || "منتشر شده"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/blog/${post._id}/edit`}
                      className="text-green-400 text-sm hover:underline flex items-center gap-1"
                    >
                      <FaPen /> ویرایش
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-400 text-sm hover:underline flex items-center gap-1"
                    >
                      <FaTrash /> حذف
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 text-sm text-gray-300 mt-2">
                  <span className="flex items-center gap-1">
                    <FaEye className="text-gray-400" /> {post.views || 0} بازدید
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCommentDots className="text-gray-400" /> {post.comments?.length || 0} نظر
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
