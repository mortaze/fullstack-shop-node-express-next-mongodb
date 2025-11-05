"use client";

import React from "react";
import MetaBox from "../MetaBox";

export default function CategoryBrandBox({
  product,
  setProduct,
  categories = [],
  brands = [],
  isLoading = false,
  error = null,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  return (
    <MetaBox title="دسته‌بندی و برند" defaultOpen={true}>
      {isLoading ? (
        <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
      ) : error ? (
        <p className="text-red-400 text-sm">خطا در دریافت داده‌ها</p>
      ) : (
        <div className="space-y-4">
          {/* انتخاب دسته‌بندی */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              انتخاب دسته‌بندی
            </label>
            <select
              name="category"
              value={product?.category || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white 
              focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="">انتخاب دسته‌بندی...</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* انتخاب برند */}
          <div>
            <label className="block text-sm mb-2 text-gray-300">
              انتخاب برند
            </label>
            <select
              name="brand"
              value={product?.brand || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white 
              focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="">انتخاب برند...</option>
              {brands.map((brand) => (
                <option key={brand._id || brand.id} value={brand._id || brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </MetaBox>
  );
}
