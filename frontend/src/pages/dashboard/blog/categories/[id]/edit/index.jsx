"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import DashboardLayout from "../../../../layout";
import {
  useGetBlogCategoryByIdQuery,
  useUpdateBlogCategoryMutation,
  useGetBlogCategoriesQuery,
} from "../../../../../../redux/features/blogCategoryApi";

export default function EditBlogCategoryPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: categoryData, isLoading: isLoadingCategory } = useGetBlogCategoryByIdQuery(id, { skip: !id });
  const { data: allCategoriesData, isLoading: isLoadingAll } = useGetBlogCategoriesQuery();

  const [updateCategory, { isLoading: isUpdating }] = useUpdateBlogCategoryMutation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Show");

  const categories = allCategoriesData?.data || [];

  // پر کردن فیلدها بعد از دریافت دیتا
  useEffect(() => {
    if (categoryData?.data) {
      const cat = categoryData.data;
      setName(cat.name || "");
      setSlug(cat.slug || "");
      setParentId(cat.parent || "");
      setDescription(cat.description || "");
      setStatus(cat.status || "Show");
    }
  }, [categoryData]);

  // تولید خودکار slug از name
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "")
        .replace(/\s+/g, "-")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("⚠️ لطفاً نام دسته را وارد کنید.");
    if (!slug.trim()) return alert("⚠️ لطفاً اسلاگ معتبر وارد کنید.");

    try {
      await updateCategory({
        id,
        data: {
          name: name.trim(),
          slug: slug.trim(),
          parentId: parentId || null,
          description: description.trim() || "",
          status,
        },
      }).unwrap();

      alert("✅ دسته‌بندی با موفقیت به‌روزرسانی شد");
      router.push("/dashboard/blog/categories");
    } catch (err) {
      console.error(err);
      alert("❌ خطا در به‌روزرسانی دسته‌بندی: " + (err?.data?.error || err?.data?.message || err.message));
    }
  };

  if (isLoadingCategory || isLoadingAll)
    return <p className="text-center text-white mt-10">در حال بارگذاری...</p>;

  return (
    <DashboardLayout>
      <Head>
        <title>ویرایش دسته‌بندی وبلاگ</title>
      </Head>

      <div className="pt-6 max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          ویرایش دسته‌بندی وبلاگ
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-8 rounded-3xl shadow space-y-6"
        >
          {/* نام دسته */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              نام دسته‌بندی
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              required
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            />
          </div>

          {/* اسلاگ */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              اسلاگ (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            />
            <p className="text-gray-400 text-sm mt-1">
              🔤 می‌توانید تغییر دهید یا از نام دسته تولید شود.
            </p>
          </div>

          {/* زیر دسته مادر */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              زیر دسته مادر
            </label>
            <select
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            >
              <option value="">-- بدون والد --</option>
              {categories
                .filter((cat) => cat._id !== id) // حذف خود دسته از لیست والد
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* توضیحات */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              توضیحات
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white resize-none"
            />
          </div>

          {/* وضعیت */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              وضعیت نمایش
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            >
              <option value="Show">نمایش</option>
              <option value="Hide">عدم نمایش</option>
            </select>
          </div>

          {/* دکمه ذخیره */}
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-3xl shadow transition"
          >
            {isUpdating ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
