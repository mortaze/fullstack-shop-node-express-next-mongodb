"use client";

import React from "react";
import {
  useGetActiveBrandsQuery,
  useDeleteBrandMutation,
} from "../../../../redux/features/brandApi";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaLink,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Link from "next/link";
import DashboardLayout from "../../layout";

export default function BrandsPage() {
  const { data: brands = [], isLoading, isError } = useGetActiveBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();

  const handleDelete = async (id) => {
    if (window.confirm("آیا از حذف این برند مطمئن هستید؟")) {
      try {
        await deleteBrand(id).unwrap();
        alert("✅ برند با موفقیت حذف شد");
      } catch (err) {
        console.error(err);
        alert("❌ خطا در حذف برند");
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-10 text-blue-600 font-semibold text-lg">
        در حال بارگذاری برندها...
      </div>
    );

  if (isError)
    return (
      <div className="flex justify-center py-10 text-red-600 font-semibold text-lg">
        خطا در دریافت اطلاعات برندها
      </div>
    );

  return (
    <DashboardLayout>
      <div className="p-5 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            مدیریت برندها
          </h2>

          <Link
            href="/dashboard/brands/create"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm transition-all"
          >
            <FaPlus /> افزودن برند جدید
          </Link>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <table className="min-w-full text-sm text-gray-800 dark:text-gray-200">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr className="text-center">
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">لوگو</th>
                <th className="py-3 px-2">نام برند</th>
                <th className="py-3 px-2">توضیحات</th>
                <th className="py-3 px-2">وضعیت</th>
                <th className="py-3 px-2">اطلاعات تماس</th>
      
                <th className="py-3 px-2">عملیات</th>
              </tr>
            </thead>

            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8 text-gray-400 dark:text-gray-300 font-medium"
                  >
                    هیچ برندی یافت نشد.
                  </td>
                </tr>
              ) : (
                brands.map((brand, index) => (
                  <tr
                    key={brand._id}
                    className="text-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="py-3">{index + 1}</td>

                    <td className="py-3 flex justify-center">
                      <img
                        src={brand.logo || "/no-image.png"}
                        alt={brand.name}
                        className="w-12 h-12 object-contain rounded-lg"
                      />
                    </td>

                    <td className="font-semibold">{brand.name}</td>

                    <td className="max-w-xs truncate">{brand.description || "-"}</td>

                    <td>
                      {brand.status === "active" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          فعال
                        </span>
                      ) : (
                        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                          غیرفعال
                        </span>
                      )}
                    </td>

                    {/* Contact Info Column */}
                    <td className="text-left py-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-500" />
                        <span className="truncate max-w-[150px]">{brand.email || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaLink className="text-gray-500" />
                        {brand.website ? (
                          <a
                            href={`https://${brand.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline truncate max-w-[150px]"
                          >
                            {brand.website}
                          </a>
                        ) : (
                          "-"
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span className="truncate max-w-[180px]">{brand.location || "-"}</span>
                      </div>
                    </td>

              

                    <td>
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/dashboard/shop/brands/${brand._id}/edit`}
                          className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                        >
                          <FaEdit /> ویرایش
                        </Link>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition-all"
                        >
                          <FaTrash /> حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Responsive note */}
        <p className="text-xs text-gray-500 mt-3 text-center md:hidden">
          برای مشاهده کامل جدول، صفحه را به چپ و راست بکشید ↔️
        </p>
      </div>
    </DashboardLayout>
  );
}
