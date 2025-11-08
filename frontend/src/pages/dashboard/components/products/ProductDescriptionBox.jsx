"use client";

import React from "react";
import MetaBox from "../MetaBox"; // مسیر را با ساختار پروژه‌ت تنظیم کن

export default function ProductDescriptionBox({
  product = {},
  setProduct = () => {},
}) {
  // کنترل تغییر مقدار textarea
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <MetaBox title="توضیحات محصول" defaultOpen={true}>
      <div dir="rtl">
        <textarea
          name="description"
          value={product.description || ""}
          onChange={handleInputChange}
          className="w-full h-48 p-3 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500 resize-y"
          placeholder="جزئیات و توضیحات کامل محصول (شبیه ویرایشگر پیشرفته)"
        ></textarea>
      </div>
    </MetaBox>
  );
}
