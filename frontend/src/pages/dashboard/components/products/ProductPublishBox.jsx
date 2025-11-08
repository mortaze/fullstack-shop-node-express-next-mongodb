'use client';

import React from "react";
import MetaBox from "../MetaBox"; // مسیر را متناسب با پروژه خود تنظیم کنید

export default function ProductPublishBox({
  product = {},
  setProduct = () => {},
  isLoading = false,
  handleSubmit = () => {},
}) {
  // تغییر فیلدهای تکی (مثل isFeatured)
  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // فرم داخلی که لاگ می‌گیرد
  const onFormSubmit = (e) => {
    e.preventDefault(); // مهم: جلوی رفرش صفحه را می‌گیرد
    console.log("Payload قبل از ارسال:", product); // لاگ کردن داده
    handleSubmit(e, "publish"); // فراخوانی تابع اصلی
  };

  return (
    <MetaBox title="انتشار" defaultOpen={true}>
      <div className="space-y-3" dir="rtl">
        {/* وضعیت انتشار */}
        <p>
          <span className="font-semibold ml-1">وضعیت:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.stockStatus === "in-stock"
                ? "bg-green-700 text-green-100"
                : "bg-red-700 text-red-100"
            }`}
          >
            {product.stockStatus === "in-stock" ? "منتشر شده" : "پیش‌نویس"}
          </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("در محیط واقعی، این گزینه فعال می‌شود.");
            }}
            className="text-indigo-400 hover:text-indigo-300 mr-2 text-xs"
          >
            ویرایش
          </a>
        </p>

        {/* ویژگی ویژه (Featured) */}
        <label className="flex items-center space-x-2 space-x-reverse">
          <input
            type="checkbox"
            name="isFeatured"
            checked={product.isFeatured || false}
            onChange={handleInputChange}
            className="form-checkbox h-4 w-4 text-indigo-600 bg-[#1e2939] border-gray-600 rounded focus:ring-indigo-500"
          />
          <span className="text-gray-300">ویژگی ویژه (Featured)</span>
        </label>

        {/* فرم انتشار */}
        <form onSubmit={onFormSubmit}>
          <div className="flex justify-between border-t border-gray-700 pt-3">
            <button
              type="button"
              className="text-red-500 hover:text-red-400 transition text-sm"
              onClick={() =>
                alert("در محیط واقعی، محصول حذف خواهد شد.")
              }
            >
              انتقال به زباله‌دان
            </button>

            <button
              type="submit"
              className="px-4 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
              disabled={isLoading}
            >
              {isLoading ? "در حال ارسال..." : "انتشار"}
            </button>
          </div>
        </form>
      </div>
    </MetaBox>
  );
}
