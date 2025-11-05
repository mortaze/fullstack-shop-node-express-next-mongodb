'use client';

import React, { useEffect } from 'react';
import { FaStore, FaTags } from 'react-icons/fa';

export default function CategoryBrandSelector({
  product = {}, // ✅ مقدار پیش‌فرض برای جلوگیری از undefined
  setProduct = () => {},
  categories = [],
  brands = [],
  isLoading = false,
  error = null,
}) {
  // تغییرات فیلدهای select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // لاگ خطاها (در صورت وجود)
  useEffect(() => {
    if (error) console.error('Error loading categories or brands:', error);
  }, [error]);

  return (
    <div
      dir="rtl"
      className="bg-[#2d3748] border border-gray-700/50 rounded-2xl shadow-lg p-5 mb-6"
    >
      <h3 className="text-white text-lg font-semibold flex items-center gap-2 mb-4">
        <FaStore className="text-indigo-400" />
        دسته‌بندی و برند
      </h3>

      {isLoading ? (
        <p className="text-gray-400 text-sm">در حال بارگذاری اطلاعات...</p>
      ) : (
        <>
          {/* دسته‌بندی */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-300 font-medium flex items-center gap-2">
              <FaTags className="text-gray-400" /> دسته‌بندی
            </label>
            <select
              name="category"
              value={product?.category || ''}
              onChange={handleChange}
              className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            >
              <option value="">یک دسته‌بندی انتخاب کنید</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.id} value={cat._id || cat.id}>
                  {cat.name}
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
              value={product?.brand || ''}
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
        </>
      )}
    </div>
  );
}
