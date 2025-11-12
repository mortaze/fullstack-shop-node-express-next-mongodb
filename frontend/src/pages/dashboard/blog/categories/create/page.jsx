"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

export default function CreateBlogCategoryPage() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(""); // زیر دسته
  const [categories, setCategories] = useState([]); // گرفتن دسته‌ها برای انتخاب زیر دسته

  // گرفتن دسته‌های وبلاگ برای انتخاب زیر دسته
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:7000/api/blog-categories");
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("خطا در دریافت دسته‌های وبلاگ:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("لطفاً نام دسته‌بندی را وارد کنید.");
      return;
    }

    try {
      const body = {
        name: name.trim(),
        parentId: parentId || null,
      };

      const res = await fetch("http://localhost:7000/api/blog-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "خطا در ایجاد دسته‌بندی");
      }

      alert("✅ دسته‌بندی وبلاگ با موفقیت ثبت شد");
      setName("");
      setParentId("");
    } catch (err) {
      alert("❌ خطا: " + err.message);
    }
  };

  return (
    <>
      <Head>
        <title>ایجاد دسته‌بندی جدید وبلاگ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="pt-4 max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          ایجاد دسته‌بندی جدید وبلاگ
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-8 rounded-3xl shadow space-y-6"
          noValidate
        >
          {/* نام دسته‌بندی */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-gray-300 font-semibold"
            >
              نام دسته‌بندی
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-green-400 transition"
              placeholder="مثلاً فناوری"
              autoComplete="off"
            />
          </div>

          {/* انتخاب زیر دسته */}
          <div>
            <label
              htmlFor="parentId"
              className="block mb-2 text-gray-300 font-semibold"
            >
              زیر دسته مادر
            </label>
            <select
              id="parentId"
              name="parentId"
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white focus:outline-none focus:ring-4 focus:ring-green-400 transition"
            >
              <option value="">-- بدون زیر دسته --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* دکمه ثبت */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-3xl shadow transition"
          >
            ثبت دسته‌بندی وبلاگ
          </button>
        </form>
      </div>
    </>
  );
}
