"use client";

import React from "react";

export default function ProductTitleBox({ product = {}, setProduct = () => {} }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newProduct = { ...product, [name]: value };

    // تولید خودکار Slug از عنوان
    if (name === "title") {
      newProduct.slug = value
        .trim()
        .toLowerCase()
        .replace(/[\s‌]+/g, "-")
        .replace(/[^\w\-]+/g, "");
    }

    setProduct(newProduct);
  };

  return (
    <div className="mb-6">
      {/* ورودی عنوان محصول */}
      <input
        type="text"
        name="title"
        value={product?.title || ""}
        onChange={handleInputChange}
        className="w-full p-3 text-2xl font-bold bg-[#2d3748] border-r-4 border-indigo-600 rounded-lg shadow-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="عنوان محصول را اینجا وارد کنید"
        maxLength="200"
      />

      {/* شمارنده کاراکترها */}
      <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
        <span>حداکثر ۲۰۰ کاراکتر</span>
        <span>{product?.title?.length || 0}/200</span>
      </div>

      {/* نمایش Slug */}
      <p className="text-sm text-gray-400 mt-2">
        <span className="text-gray-500">آدرس کوتاه:</span>{" "}
        <span className="bg-[#1e293b] text-indigo-400 px-2 py-0.5 rounded font-mono">
          {product?.slug || "slug-placeholder"}
        </span>
      </p>
    </div>
  );
}
