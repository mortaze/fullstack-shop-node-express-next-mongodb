"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function CategoryForm({ categoryId }) {
  const router = useRouter();
  const API_URL = "http://localhost:5000/api/blog-categories";

  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // گرفتن همه دسته‌ها
        const catRes = await fetch(API_URL);
        const catData = await catRes.json();
        if (catRes.ok) setCategories(catData.categories || []);

        // اگر categoryId وجود داشت، اطلاعات دسته‌بندی را بگیریم (ویرایش)
        if (categoryId) {
          const res = await fetch(`${API_URL}/${categoryId}`);
          const data = await res.json();
          if (res.ok) {
            setName(data.name);
            setParentId(data.parentId || "");
          }
        }
      } catch (err) {
        Swal.fire({ icon: "error", title: "خطا", text: err.message || "خطا در بارگذاری داده‌ها" });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({ icon: "error", title: "خطا", text: "نام دسته الزامی است" });
      return;
    }

    try {
      const payload = { name, parentId: parentId || null };
      const method = categoryId ? "PUT" : "POST";
      const url = categoryId ? `${API_URL}/${categoryId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(categoryId ? "خطا در بروزرسانی دسته‌بندی" : "خطا در ایجاد دسته‌بندی");

      Swal.fire({
        icon: "success",
        title: "موفقیت",
        text: categoryId ? "دسته‌بندی با موفقیت بروزرسانی شد" : "دسته‌بندی با موفقیت ایجاد شد",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard/blog/categories");
    } catch (err) {
      Swal.fire({ icon: "error", title: "خطا", text: err.message });
    }
  };

  const handleDelete = async () => {
    if (!categoryId) return;
    const result = await Swal.fire({
      title: "حذف دسته‌بندی؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "بله، حذف شود!",
      cancelButtonText: "خیر",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${categoryId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("خطا در حذف دسته‌بندی");

      Swal.fire({
        icon: "success",
        title: "حذف شد",
        text: "دسته‌بندی با موفقیت حذف شد",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/dashboard/blog/categories");
    } catch (err) {
      Swal.fire({ icon: "error", title: "خطا", text: err.message });
    }
  };

  if (loading) return <p className="text-white">در حال بارگذاری...</p>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">
        {categoryId ? "ویرایش دسته‌بندی" : "ایجاد دسته‌بندی جدید"}
      </h1>

      <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-3xl space-y-6">
        <div>
          <label className="block mb-2 text-gray-300 font-semibold">نام دسته‌بندی</label>
          <input
            type="text"
            className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-gray-300 font-semibold">زیر دسته مادر</label>
          <select
            className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
          >
            <option value="">-- بدون زیر دسته --</option>
            {categories
              .filter((cat) => cat.id !== categoryId)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-green-500 py-3 rounded-3xl font-bold text-white hover:bg-green-600 transition">
            {categoryId ? "ذخیره تغییرات" : "ایجاد دسته‌بندی"}
          </button>
          {categoryId && (
            <button type="button" onClick={handleDelete} className="flex-1 bg-red-600 py-3 rounded-3xl font-bold text-white hover:bg-red-700 transition">
              حذف دسته‌بندی
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
