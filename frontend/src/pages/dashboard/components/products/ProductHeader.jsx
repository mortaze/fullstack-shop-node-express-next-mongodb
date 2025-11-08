"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export default function ProductHeader({
  title = "افزودن محصول جدید",
  isLoading = false,
  handleSubmit = () => {},
}) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-700 pb-4" dir="rtl">
      {/* عنوان صفحه */}
      <h1 className="text-3xl font-bold text-white mb-3 sm:mb-0">{title}</h1>

      {/* دکمه‌های عملیات */}
      <div className="flex space-x-2 space-x-reverse">
        <button
          onClick={(e) => handleSubmit(e, "draft")}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-transparent border border-gray-500 rounded-lg hover:bg-gray-700 transition"
          disabled={isLoading}
        >
          ذخیره پیش‌نویس
        </button>

        <button
          onClick={(e) => handleSubmit(e, "publish")}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-md shadow-indigo-500/50 flex items-center"
          disabled={isLoading}
        >
          {isLoading ? "در حال ثبت..." : "انتشار محصول"}
          <FaCheckCircle className="mr-2" />
        </button>
      </div>
    </header>
  );
}
