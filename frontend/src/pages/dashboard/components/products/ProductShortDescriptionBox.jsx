"use client";

import React from "react";
import MetaBox from "../MetaBox"; // مسیر را با ساختار پروژه خودت هماهنگ کن

export default function ProductShortDescriptionBox({
  product = {},
  setProduct = () => {},
}) {
  // هندل تغییر مقدار textarea
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <MetaBox title="توضیحات کوتاه محصول" defaultOpen={true}>
      <div dir="rtl">
        <textarea
          name="shortDescription"
          value={product.shortDescription || ""}
          onChange={handleInputChange}
          className="w-full h-24 p-3 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
          placeholder="توضیحات مختصر محصول برای نمایش در بالای صفحه"
        ></textarea>
      </div>
    </MetaBox>
  );
}
