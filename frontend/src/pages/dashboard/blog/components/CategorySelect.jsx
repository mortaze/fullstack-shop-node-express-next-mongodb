"use client";

import React, { useEffect } from "react";
import { FaTags } from "react-icons/fa";
import MetaBox from "../../components/MetaBox";
import { useGetBlogCategoriesQuery } from "../../../../redux/features/blogCategoryApi";

export default function BlogCategoryBox({ blog = {}, setBlog = () => {} }) {
  const { data, isLoading, error } = useGetBlogCategoriesQuery();

  // دسته‌ها از API
  const categories = data?.data || [];

  const handleChange = (e) => {
  const selectedId = e.target.value;
  const selectedCategory = categories.find(cat => cat._id === selectedId);

  const newCategory = selectedCategory
    ? { id: selectedCategory._id, name: selectedCategory.name }
    : { id: "", name: "" };

  setBlog(prev => ({ ...prev, category: newCategory }));

  console.log("📂 دسته‌بندی جدید که داریم میفرستیم:", newCategory);
};



  useEffect(() => {
    if (error) console.error("خطا در دریافت دسته‌بندی‌های وبلاگ:", error);
  }, [error]);

  return (
    <MetaBox title="دسته‌بندی وبلاگ" defaultOpen={true}>
      {isLoading ? (
        <p className="text-gray-400 text-sm">در حال بارگذاری دسته‌بندی‌ها...</p>
      ) : (
        <div dir="rtl" className="space-y-4">
          <div>
            <label className="mb-2 text-gray-300 font-medium flex items-center gap-2">
              <FaTags className="text-gray-400" /> دسته‌بندی
            </label>

            <select
              name="blog-category"
              value={blog?.category?.id || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white 
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="" className="text-gray-200">
                یک دسته‌بندی انتخاب کنید
              </option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id} className="text-gray-200">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </MetaBox>
  );
}
