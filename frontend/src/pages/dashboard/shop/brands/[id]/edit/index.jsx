"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; 
import { useGetBrandByIdQuery, useUpdateBrandMutation } from "../../../../../../redux/features/brandApi";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "../../../../layout";

export default function EditBrandPage() {
  const router = useRouter();
  const { id: brandId } = router.query;

  const { data: brand, isLoading, isError } = useGetBrandByIdQuery(brandId, { skip: !brandId });
  const [updateBrand] = useUpdateBrandMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    website: "",
    location: "",
    status: "active",
    logo: "",
  });

  // وقتی دیتای برند دریافت شد فرم را پر کن
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || "",
        description: brand.description || "",
        email: brand.email || "",
        website: brand.website || "",
        location: brand.location || "",
        status: brand.status || "active",
        logo: brand.logo || "",
      });
    }
  }, [brand]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandId) return;
    try {
      await updateBrand({ id: brandId, formData }).unwrap();
      alert("✅ برند با موفقیت به‌روزرسانی شد");
      router.push("/dashboard/shop/brands");
    } catch (err) {
      console.error(err);
      alert("❌ خطا در بروزرسانی برند");
    }
  };

  // اگر brandId هنوز موجود نیست یا داده در حال بارگذاری است
  if (!brandId || isLoading) {
    return (
      <div className="flex justify-center py-10 text-blue-600 font-semibold text-lg">
        در حال بارگذاری اطلاعات برند...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center py-10 text-red-600 font-semibold text-lg">
        خطا در دریافت اطلاعات برند
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-5 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <Link href="/dashboard/brands" className="text-blue-600 hover:underline flex items-center gap-2">
            <FaArrowLeft /> بازگشت به برندها
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">ویرایش برند</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">نام برند</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 text-gray-800"
              rows={4}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">ایمیل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 text-gray-800"
            />
          </div>

          {/* Website */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">وب‌سایت</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 text-gray-800"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">موقعیت</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 text-gray-800"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">وضعیت</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 text-gray-800"
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>

          {/* Logo */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-200">لوگو (URL)</label>
            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 text-gray-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
          >
            <FaSave /> ذخیره تغییرات
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
