"use client";
import Link from "next/link";
import { useState } from "react";
import Head from "next/head";
import {
  useGetBlogCategoriesQuery,
  useDeleteBlogCategoryMutation,
} from "../../../../redux/features/blogCategoryApi";
import DashboardLayout from "../../layout";

export default function BlogCategoryListPage() {
  const { data, isLoading, isError } = useGetBlogCategoriesQuery();
  const categories = data?.data || [];

  const [deleteCategory] = useDeleteBlogCategoryMutation();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این دسته مطمئن هستید؟")) return;
    try {
      setDeletingId(id);
      await deleteCategory(id).unwrap();
      alert("✅ دسته‌بندی با موفقیت حذف شد");
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      alert("❌ خطا در حذف دسته‌بندی");
      setDeletingId(null);
    }
  };

  if (isLoading)
    return <p className="text-center text-white mt-10">در حال بارگذاری...</p>;
  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">خطا در بارگذاری دسته‌ها</p>
    );

  return (
    <DashboardLayout>
      <Head>
        <title>لیست دسته‌بندی‌های وبلاگ</title>
      </Head>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">
          دسته‌بندی‌های وبلاگ
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full table-fixed divide-y divide-gray-700 bg-gray-800 rounded-xl shadow">
            <thead className="bg-gray-900">
              <tr>
                <th className="w-12 px-4 py-3 text-left text-white font-medium">#</th>
                <th className="w-1/5 px-4 py-3 text-left text-white font-medium">نام</th>
                <th className="w-1/5 px-4 py-3 text-left text-white font-medium">اسلاگ</th>
                <th className="w-1/5 px-4 py-3 text-left text-white font-medium">توضیحات</th>
                <th className="w-1/5 px-4 py-3 text-left text-white font-medium">زیر دسته</th>
                <th className="w-1/12 px-4 py-3 text-left text-white font-medium">وضعیت</th>
                <th className="w-1/6 px-4 py-3 text-center text-white font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {categories.map((cat, idx) => (
                <tr key={cat._id} className="hover:bg-gray-700 transition">
                  <td className="px-4 py-3 text-white">{idx + 1}</td>
                  <td className="px-4 py-3 text-white">{cat.name}</td>
                  <td className="px-4 py-3 text-white">{cat.slug}</td>
                  <td className="px-4 py-3 text-white">{cat.description || "—"}</td>
                  <td className="px-4 py-3 text-white">
                    {categories.find((c) => c._id === cat.parent)?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-white">{cat.status}</td>
                  <td className="px-4 py-3 text-center flex justify-center gap-2">
  <button
    onClick={() => handleDelete(cat._id)}
    disabled={deletingId === cat._id}
    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
  >
    {deletingId === cat._id ? "در حال حذف..." : "حذف"}
  </button>

  <Link
    href={`/dashboard/blog/categories/${cat._id}/edit`}
    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
  >
    ویرایش
  </Link>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
