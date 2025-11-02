// Converted Next.js page to TailwindCSS version preserving style and layout
"use client";

import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import DashboardLayout from "../../layout";

export default function CategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category/show`
        );
        if (!res.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
        const data = await res.json();
        setCategories(data.result || []);
      } catch (error) {
        console.error("❌ خطا در دریافت دسته‌بندی‌ها:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>
      <DashboardLayout>
        <Head>
          <title>لیست دسته‌بندی‌ها</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>

        <div className="pt-4 px-3 mx-auto max-w-6xl">
          <h1 className="text-white text-center font-bold text-2xl mb-4">
            لیست دسته‌بندی‌ها
          </h1>
          <Link
            href={`/dashboard/shop/categories/create`}
            title="افزودن دسته بندی جدید"
            className="block mx-auto my-5 w-fit bg-green-600 p-2 rounded-2xl"
          >
            افزودن دسته بندی جدید
          </Link>
          {loading ? (
            <p className="text-center text-gray-400">در حال بارگذاری...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-400">
              دسته‌بندی‌ای موجود نیست.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-500/25 shadow-[0_8px_20px_rgba(0,0,0,0.35)] rounded-xl p-3 relative transition-all hover:-translate-y-1 hover:shadow-[0_12px_26px_rgba(0,0,0,0.55)] hover:border-green-500/60"
                >
                  {/* دکمه ویرایش */}
                  <Link
                    href={`/dashboard/shop/categories/${cat._id}/edit`}
                    title="ویرایش"
                    className="absolute top-0 left-0 m-2 p-2 text-gray-300 hover:text-green-400"
                  >
                    <FaEdit size={18} />
                  </Link>

                  <div className="flex items-center gap-3">
                    {/* تصویر سمت راست */}
                    <img
                      src={
                        cat.img || "https://via.placeholder.com/120?text=Image"
                      }
                      alt={cat.parent}
                      className="w-[90px] h-[100px] object-contain p-1 bg-slate-900 rounded-lg"
                    />

                    {/* متن سمت چپ */}
                    <div className="flex-1 text-right">
                      <h3 className="text-white font-bold text-sm mb-1">
                        {cat.parent}
                      </h3>
                      {cat.children && cat.children.length > 0 && (
                        <ul className="text-gray-300 text-xs list-none m-0 p-0">
                          {cat.children.map((child, idx) => (
                            <li key={idx}>زیر دسته: {child}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
