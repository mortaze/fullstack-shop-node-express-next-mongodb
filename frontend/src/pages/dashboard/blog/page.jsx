"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaEye, FaCommentDots, FaPen, FaPlusCircle, FaTrash } from "react-icons/fa";

export default function BlogDashboardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    "منتشر شده": "text-green-400",
    پیش‌نویس: "text-yellow-400",
    "زمان‌بندی شده": "text-blue-400",
    "حذف شده": "text-red-400",
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/posts");
      const data = await res.json();
      if (res.ok) setPosts(data);
      else console.error("خطا در دریافت پست‌ها:", data.message);
    } catch (err) {
      console.error("خطا در اتصال به سرور:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
  if (!confirm("آیا مطمئن هستید که می‌خواهید این پست را حذف کنید؟")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: "DELETE",
    });

    const data = await res.json(); // حالا JSON معتبر داریم

    if (!res.ok) throw new Error(data.message || "خطا در حذف پست");

    // حذف پست از state بدون نیاز به fetch مجدد
    setPosts((prev) => prev.filter((p) => p._id !== id));
    alert(data.message);
  } catch (err) {
    console.error("خطا در حذف پست:", err);
    alert(`خطا در حذف پست: ${err.message}`);
  }
};


  if (loading) return <p className="text-white p-4">در حال بارگذاری پست‌ها...</p>;

  return (
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-gray-700 p-4 rounded-xl shadow hover:shadow-lg transition"
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
                  <FaPen />
                  ویرایش
                </Link>

                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-400 text-sm hover:underline flex items-center gap-1"
                >
                  <FaTrash />
                  حذف
                </button>
              </div>
            </div>

            <div className="flex gap-4 text-sm text-gray-300 mt-2">
              <span className="flex items-center gap-1">
                <FaEye className="text-gray-400" />
                {post.views || 0} بازدید
              </span>
              <span className="flex items-center gap-1">
                <FaCommentDots className="text-gray-400" />
                {post.comments || 0} نظر
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
