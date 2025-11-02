"use client";
import { useEffect, useState } from "react";

export default function CategorySelect({ selectedCategoryId, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:5000/api/blog-categories");
        if (!res.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-700 p-4 rounded-xl">
      <label className="block text-gray-300 mb-2">دسته‌بندی</label>
      <select
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={selectedCategoryId || ""}
        onChange={(e) => onChange(e.target.value)} // رشته دریافت میشه
      >
        <option value="">-- انتخاب کنید --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
