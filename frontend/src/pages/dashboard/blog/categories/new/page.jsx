"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function CreateCategoryPage() {
  const router = useRouter();
  const API_URL = "http://localhost:5000/api/blog-categories";

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // گرفتن دسته‌بندی‌های موجود برای انتخاب زیر دسته
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "خطا در دریافت دسته‌بندی‌ها");
        setCategories(data.categories || []);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "خطا",
          text: err.message || "خطا در بارگذاری داده‌ها",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({ icon: "error", title: "خطا", text: "نام دسته الزامی است" });
      return;
    }

    try {
      // ارسال JSON به سرور
      const body = {
        name: name.trim(),
        parentId: parentId || null,
      };

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        // نمایش خطای دقیق برگشتی از سرور
        throw new Error(data.message || "خطا در ایجاد دسته‌بندی");
      }

      Swal.fire({
        icon: "success",
        title: "موفقیت",
        text: "دسته‌بندی با موفقیت ایجاد شد",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard/blog/categories");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: err.message,
      });
      console.error("جزئیات خطا:", err);
    }
  };

  if (loading)
    return <p className="text-white text-center mt-8">در حال بارگذاری...</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">
        ایجاد دسته‌بندی جدید
      </h1>

      <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-3xl space-y-6">
        <div>
          <label className="block mb-2 text-gray-300 font-semibold">
            نام دسته‌بندی
          </label>
          <input
            type="text"
            className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-300 font-semibold">
            زیر دسته مادر
          </label>
          <select
            className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">-- بدون زیر دسته --</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 py-3 rounded-3xl font-bold text-white hover:bg-green-600 transition"
        >
          ایجاد دسته‌بندی
        </button>
      </form>
    </div>
  );
}
