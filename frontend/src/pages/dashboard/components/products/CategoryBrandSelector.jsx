"use client";

import React, { useEffect } from "react";
import { FaStore, FaTags } from "react-icons/fa";
import MetaBox from "../MetaBox";

export default function CategoryBrandBox({
  product = {},
  setProduct = () => {},
  categories = [],
  brands = [],
  isLoading = false,
  error = null,
}) {
  // تغییر مقدار دسته‌بندی یا برند
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category") {
      const selectedCategory = categories.find(
        (cat) => (cat._id || cat.id) === value
      );
      setProduct((prev) => ({
        ...prev,
        category: selectedCategory
          ? { id: selectedCategory._id || selectedCategory.id, name: selectedCategory.name || selectedCategory.parent }
          : { id: "", name: "" },
      }));
    } else if (name === "brand") {
      const selectedBrand = brands.find(
        (b) => (b._id || b.id) === value
      );
      setProduct((prev) => ({
        ...prev,
        brand: selectedBrand
          ? { id: selectedBrand._id || selectedBrand.id, name: selectedBrand.name }
          : { id: "", name: "" },
      }));
    }
  };

  useEffect(() => {
    if (error) console.error("Error loading categories or brands:", error);
  }, [error]);

  return (
    <MetaBox title="دسته‌بندی و برند محصول" defaultOpen={true}>
      {isLoading ? (
        <p className="text-gray-400 text-sm">در حال بارگذاری اطلاعات...</p>
      ) : (
        <div dir="rtl" className="space-y-5">
          {/* دسته‌بندی */}
          <div>
            <label className=" mb-2 text-gray-300 font-medium flex items-center gap-2">
              <FaTags className="text-gray-400" /> دسته‌بندی
            </label>
            <select
              name="category"
              value={product?.category?.id || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="" className="text-gray-200">یک دسته‌بندی انتخاب کنید</option>
              {categories.map((cat) => (
                <option
                  key={cat._id || cat.id}
                  value={cat._id || cat.id}
                  className="text-gray-200"
                >
                  {cat.name || cat.parent}
                </option>
              ))}
            </select>
          </div>

          {/* برند */}
          <div>
            <label className="block mb-2 text-gray-300 font-medium flex items-center gap-2">
              <FaStore className="text-gray-400" /> برند
            </label>
            <select
              name="brand"
              value={product?.brand?.id || ""}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">یک برند انتخاب کنید</option>
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
