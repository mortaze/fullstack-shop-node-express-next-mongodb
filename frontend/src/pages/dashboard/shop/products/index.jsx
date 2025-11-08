"use client";

import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import DashboardLayout from "../../layout";
export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000/api";

  // 📦 واکشی محصولات از بک‌اند
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/product/all`);
      // ✅ ساختار درست با توجه به دیتای واقعی
      setProducts(response.data?.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("خطا در دریافت محصولات");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 فیلتر جستجو
  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ❌ حذف محصول
  const handleDelete = async (id, name) => {
    if (window.confirm(`آیا از حذف "${name}" مطمئن هستید؟`)) {
      try {
       await axios.delete(`${API_URL}/product/${id}`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
        alert("✅ محصول حذف شد.");
      } catch (err) {
        alert("❌ خطا در حذف محصول.");
      }
    }
  };

  if (loading)
    return (
      <p className="text-center text-green-400 p-6">در حال بارگذاری محصولات...</p>
    );
  if (error) return <p className="text-center text-red-400 p-6">{error}</p>;

  return (
      <DashboardLayout>
    <div className="p-6 bg-gray-950 min-h-screen rounded-md text-white" dir="rtl">
      {/* 🔹 هدر */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold">مدیریت محصولات</h1>
        <button className="bg-green-600 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700 transition">
          <FaPlus /> افزودن محصول جدید
        </button>
      </div>

      {/* 🔎 سرچ */}
      <div className="mb-5">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجو بر اساس نام یا دسته‌بندی..."
          className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:border-green-500 outline-none"
        />
      </div>

      {/* 📋 جدول */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-400 text-center py-10">هیچ محصولی یافت نشد.</p>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800 shadow-md">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-gray-800 text-gray-300 text-sm uppercase">
                <th className="p-3">تصویر</th>
                <th className="p-3">نام محصول</th>
                <th className="p-3">دسته‌بندی</th>
                <th className="p-3">قیمت</th>
                <th className="p-3">موجودی</th>
                <th className="p-3">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="p-3">
                    <img
                      src={product.img || "/no-image.png"}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3 font-medium">{product.title}</td>
                  <td className="p-3 text-gray-300">
                    {product.category?.name || "—"}
                  </td>
                  <td className="p-3">{product.price?.toLocaleString()} تومان</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3 flex gap-3">
  {/* دکمه ویرایش */}
  <button
    onClick={() => window.location.href = `/dashboard/shop/products/${product._id}/edit`}
    className="bg-blue-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700 transition"
  >
    <FaEdit /> ویرایش
  </button>

  {/* دکمه حذف */}
  <button
    onClick={() => handleDelete(product._id, product.title)}
    className="bg-red-600 px-3 py-1 rounded-md flex items-center gap-1 hover:bg-red-700 transition"
  >
    <FaTrash /> حذف
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div></DashboardLayout>
  );
}
