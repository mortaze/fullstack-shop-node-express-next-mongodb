"use client";

import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";

export default function BlogCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "http://localhost:5000/api/blog-categories";

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <>
      <Head>
        <title>دسته‌بندی‌های وبلاگ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="pt-6 px-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white text-center sm:text-left">
            دسته‌بندی‌های وبلاگ
          </h1>
          <Link
            href="/dashboard/blog/categories/new"
            className="flex items-center gap-2 bg-green-500 px-4 py-2 rounded-2xl text-white hover:bg-green-600 transition"
          >
            <FaPlus /> افزودن دسته‌بندی
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">در حال بارگذاری...</p>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>هیچ دسته‌بندی‌ای موجود نیست.</p>
            <Link
              href="/dashboard/blog/categories/new"
              className="inline-block mt-4 bg-green-500 px-4 py-2 rounded-2xl text-white hover:bg-green-600 transition"
            >
              ایجاد اولین دسته‌بندی
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-gray-700 rounded-2xl shadow p-4 flex flex-col relative"
              >
                <Link
                  href={`/dashboard/blog/categories/${cat.id}/edit`}
                  title="ویرایش"
                  className="absolute top-3 left-3 p-2 text-gray-300 hover:text-green-400"
                >
                  <FaEdit size={18} />
                </Link>

                <h3 className="text-lg font-bold text-white text-center">
                  {cat.name}
                </h3>

                {cat.parent && (
                  <p className="text-sm text-gray-400 text-center mt-1">
                    زیر دسته: {cat.parent.name}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
