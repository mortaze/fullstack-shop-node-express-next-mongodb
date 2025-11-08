"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useCreateBrandMutation } from "../../../../.././redux/features/brandApi";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "../../../layout";

export default function CreateBrandPage() {
  const router = useRouter();
  const [createBrand] = useCreateBrandMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    website: "",
    location: "",
    status: "active",
    logo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBrand(formData).unwrap();
      alert("✅ برند با موفقیت ایجاد شد");
      router.push("/dashboard/shop/brands");
    } catch (err) {
      console.error(err);
      alert("❌ خطا در ایجاد برند");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-5 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <Link href="/dashboard/shop/brands" className="text-blue-600 hover:underline flex items-center gap-2">
            <FaArrowLeft /> بازگشت به برندها
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">ایجاد برند جدید</h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-xl shadow-md"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">نام برند</label>
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
            <label className="mb-1 font-medium text-gray-700">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
              rows={4}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">ایمیل</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            />
          </div>

          {/* Website */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">وب‌سایت</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">موقعیت</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">وضعیت</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            >
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>

          {/* Logo */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700">لوگو (URL)</label>
            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-all"
          >
            <FaSave /> ایجاد برند
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
