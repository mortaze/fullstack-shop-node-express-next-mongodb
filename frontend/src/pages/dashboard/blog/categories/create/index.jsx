"use client";

import { useState } from "react";
import Head from "next/head";
import {
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
} from "../../../../../redux/features/blogCategoryApi";
import DashboardLayout from "../../../layout";
export default function CreateBlogCategoryPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Show");

  // دریافت دسته‌ها برای لیست والد
  const { data, isLoading } = useGetBlogCategoriesQuery();
 
// درستش اینه:
const categories = data?.data || [];

  // Mutation برای ایجاد دسته
  const [createCategory, { isLoading: isCreating }] =
    useCreateBlogCategoryMutation();

  // تولید خودکار slug از name
  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, "") // حذف کاراکتر غیر مجاز
        .replace(/\s+/g, "-")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return alert("⚠️ لطفاً نام دسته را وارد کنید.");
    if (!slug.trim()) return alert("⚠️ لطفاً اسلاگ معتبر وارد کنید.");

    try {
      const body = {
        name: name.trim(),
        slug: slug.trim(),
        parentId: parentId || null,
        description: description.trim() || "",
        status,
      };

      await createCategory(body).unwrap();
      alert("✅ دسته‌بندی با موفقیت ثبت شد");
      setName("");
      setSlug("");
      setParentId("");
      setDescription("");
      setStatus("Show");
    } catch (err) {
      console.error(err);
      alert(
        "❌ خطا در ثبت دسته‌بندی: " +
          (err?.data?.error || err?.data?.message || err.message)
      );
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>افزودن دسته‌بندی وبلاگ</title>
      </Head>

      <div className="pt-6 max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          ایجاد دسته‌بندی جدید وبلاگ
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
              placeholder="مثلاً فناوری"
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
              placeholder="مثلاً fanavari"
            />
            <p className="text-gray-400 text-sm mt-1">
              🔤 به‌صورت خودکار از نام تولید می‌شود، می‌توانید تغییر دهید.
            </p>
          </div>

          {/* زیر دسته مادر */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              زیر دسته مادر
            </label>
            <select
  value={parentId}
  onChange={(e) => setParentId(e.target.value)}
  className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
>
  <option value="">
    {isLoading ? "در حال بارگذاری..." : "-- بدون والد --"}
  </option>
  {!isLoading &&
    categories.map((cat) => (
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
              placeholder="توضیحی درباره این دسته..."
            />
          </div>

          {/* وضعیت نمایش */}
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

          {/* دکمه ثبت */}
          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-3xl shadow transition"
          >
            {isCreating ? "در حال ثبت..." : "ثبت دسته‌بندی وبلاگ"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
