"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router"; // استفاده از useRouter Next/router برای Pages Router
import { FaTrash, FaSave, FaImage, FaTimes } from "react-icons/fa";
import DashboardLayout from "../../../../layout";
import {
  useGetShowCategoryQuery,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../../../../../redux/features/categoryApi"; // مسیردهی صحیح به RTK Query

// تعریف ساختار اولیه State
const initialCategoryState = {
  parent: "",
  parentId: "",
  children: [],
  productType: "general",
  status: "Show",
  img: "",
};

// **خطا رفع شد: دریافت پروپ با نام صحیح categoryId**
export default function EditCategoryForm({ categoryId }) {
  const router = useRouter();

  // State
  const [categoryData, setCategoryData] = useState(initialCategoryState);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: "" });
  const fileInputRef = useRef(null);

  // RTK Query Hooks

  const {
    data: initialCategory,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    error: categoryError,
  } = useGetCategoryByIdQuery(categoryId, { skip: !categoryId });

  const categoryDataFromAPI = initialCategory || null;

  const { data: allCategoriesData, isLoading: isAllCategoriesLoading } =
    useGetShowCategoryQuery(undefined, { skip: !categoryId });

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const allCategories = allCategoriesData?.result || allCategoriesData || [];

  // گرفتن دسته از API
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category/get/${categoryId}`
        );
        const data = await res.json();

        const cat = data.result || data; // 👈 اگر داخل result بود، اون رو بگیر

        setCategoryData({
          parent: cat.parent || "",
          parentId: cat.parentId || "",
          children: cat.children || [],
          productType: cat.productType || "general",
          status: cat.status || "Show",
          img: cat.img || "",
        });
        console.log("✅ categoryData set to:", cat);
        مخل;
        setImagePreview(data.img || "");
      } catch (err) {
        console.error("خطا در گرفتن دسته:", err);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // تابع تغییر ورودی‌ها
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (categoryDataFromAPI && categoryDataFromAPI._id) {
      setCategoryData({
        parent: categoryDataFromAPI.parent || "",
        parentId: categoryDataFromAPI.parentId || "",
        children: categoryDataFromAPI.children || [],
        productType: categoryDataFromAPI.productType || "general",
        status: categoryDataFromAPI.status || "Show",
        img: categoryDataFromAPI.img || null,
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [categoryDataFromAPI?._id]); // 👈 فقط وقتی دسته جدید لود شد، مقداردهی کن

  // --- EFFECT: Image URL Revocation (Memory Leak Fix) ---
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddChild = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      const input = document.getElementById("child-input");
      const childName = input?.value.trim();

      if (childName && !categoryData.children.includes(childName)) {
        setCategoryData((prev) => ({
          ...prev,
          children: [...prev.children, childName],
        }));
        input.value = "";
      }
    }
  };

  const handleRemoveChild = (childToRemove) => {
    setCategoryData((prev) => ({
      ...prev,
      children: prev.children.filter((child) => child !== childToRemove),
    }));
  };

  // --- SUBMISSION HANDLER ---
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!categoryData.parent.trim()) {
      setStatusMessage({
        type: "error",
        text: "لطفاً نام دسته‌بندی را وارد کنید.",
      });
      return;
    }

    setStatusMessage({ type: null, text: "" });

    try {
      const formData = new FormData();
      formData.append("parent", categoryData.parent);
      formData.append("parentId", categoryData.parentId || "");
      formData.append("children", JSON.stringify(categoryData.children));
      formData.append("productType", categoryData.productType);
      formData.append("status", categoryData.status);

      if (imageFile) {
        formData.append("img", imageFile);
      }

      // فقط برای چک کردن محتوا:
      const debugObj = {};
      for (const pair of formData.entries()) {
        debugObj[pair[0]] = pair[1];
      }

      // ارسال به سرور
      const res = await fetch(
        `http://localhost:7000/api/category/edit/${categoryId}`,
        {
          method: "PATCH",
          body: formData, // ❗ هیچ هدر Content-Type اضافه نکن
        }
      );

      const data = await res.json();

      if (data.success) {
        setStatusMessage({
          type: "success",
          text: "✅ دسته‌بندی با موفقیت به‌روزرسانی شد.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: `❌ خطا: ${data.message || "خطا در به‌روزرسانی"}`,
        });
      }
    } catch (err) {
      console.error("Update Error:", err);
      const errMsg =
        err?.data?.message ||
        err?.message ||
        "خطا در به‌روزرسانی دسته‌بندی رخ داد.";
      setStatusMessage({ type: "error", text: `❌ خطا: ${errMsg}` });
    }
  };

  const deleteHandler = async () => {
    const confirmation = window.confirm(
      "آیا مطمئنید که می‌خواهید این دسته‌بندی را حذف کنید؟"
    );
    if (!confirmation) return;

    setStatusMessage({ type: null, text: "" });

    try {
      await deleteCategory(categoryId).unwrap();
      setStatusMessage({
        type: "success",
        text: "✅ دسته‌بندی حذف شد. در حال انتقال...",
      });

      setTimeout(() => {
        router.push("/dashboard/shop/categories"); // ناوبری Pages Router
      }, 1500);
    } catch (err) {
      console.error("Delete Error:", err);
      const errMsg =
        err?.data?.message || err?.message || "خطا در حذف دسته‌بندی رخ داد.";
      setStatusMessage({ type: "error", text: `❌ خطا: ${errMsg}` });
    }
  };

  // --- Loading and Error States ---
  const isDataLoading = isCategoryLoading || isAllCategoriesLoading;

  if (!categoryId) {
    return (
      <DashboardLayout>
        <p className="text-center p-8 text-red-400 font-bold">
          خطا: شناسه دسته‌بندی (ID) در آدرس یافت نشد.
        </p>
      </DashboardLayout>
    );
  }

  if (isDataLoading) {
    return (
      <DashboardLayout>
        <p className="text-center text-gray-400 p-8">
          در حال بارگذاری اطلاعات دسته‌بندی...
        </p>
      </DashboardLayout>
    );
  }

  if (isCategoryError || !initialCategory) {
    const errorMsg = categoryError?.data?.message || "دسته مورد نظر یافت نشد.";
    return (
      <DashboardLayout>
        <div className="text-center p-8 bg-gray-800 rounded-xl max-w-xl mx-auto mt-10 text-white">
          <p className="text-red-400 font-bold">
            خطا در بارگذاری داده: {errorMsg}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // Final Render
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-extrabold text-white text-center mb-8 border-b-2 border-gray-700 pb-4">
          ویرایش دسته‌بندی :{" "}
          <span className="text-green-700">{categoryData.parent}</span>
        </h1>

        <form
          onSubmit={submitHandler}
          className="bg-gray-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl"
        >
          {/* Status Message Display */}
          {statusMessage.text && (
            <div
              className={`p-4 rounded-xl font-medium ${
                statusMessage.type === "success"
                  ? "bg-green-700 text-green-100"
                  : "bg-red-700 text-red-100"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          {/* 1. Parent Category Name */}
          <div>
            <label
              htmlFor="parent-name"
              className="text-gray-300 block mb-2 font-medium"
            >
              نام دسته اصلی
            </label>
            <input
              id="parent-name"
              name="parent"
              className="input input-bordered w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500"
              value={categoryData.parent || ""}
              onChange={handleChange}
              placeholder="مثال: هدفون‌ها"
            />
          </div>

          {/* 2. Parent Category Selector */}
          <div>
            <label
              htmlFor="parent-id"
              className="text-gray-300 block mb-2 font-medium"
            >
              انتخاب دسته مادر (اگر زیردسته است)
            </label>
            <select
              id="parent-id"
              name="parentId"
              className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 appearance-none"
              value={categoryData.parentId || ""}
              onChange={handleChange}
            >
              <option value="">-- بدون دسته مادر (دسته اصلی) --</option>
              {allCategories
                .filter((c) => c._id !== categoryId)
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.parent}
                  </option>
                ))}
            </select>
            {isAllCategoriesLoading && (
              <p className="text-gray-500 text-sm mt-1">
                در حال بارگذاری لیست دسته‌ها...
              </p>
            )}
          </div>

          {/* 3. Product Type and Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-type"
                className="text-gray-300 block mb-2 font-medium"
              >
                نوع محصول (Product Type)
              </label>
              <select
                id="product-type"
                name="productType"
                className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 appearance-none"
                value={categoryData.productType}
                onChange={handleChange}
              >
                <option value="general">عمومی</option>
                <option value="electronics">الکترونیک</option>
                <option value="fashion">مد و پوشاک</option>
                <option value="home">خانه و آشپزخانه</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="text-gray-300 block mb-2 font-medium"
              >
                وضعیت (Status)
              </label>
              <select
                id="status"
                name="status"
                className="w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500 appearance-none"
                value={categoryData.status}
                onChange={handleChange}
              >
                <option value="Show">نمایش</option>
                <option value="Hide">پنهان</option>
              </select>
            </div>
          </div>

          {/* 4. Children (Sub-categories/Tags) Editor */}
          <div>
            <label
              htmlFor="child-input"
              className="text-gray-300 block mb-2 font-medium"
            >
              زیردسته‌ها (Children)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                id="child-input"
                type="text"
                className="input input-bordered w-full bg-gray-700 text-white p-3 rounded-xl border border-gray-600 focus:border-blue-500"
                placeholder="نام زیردسته جدید (Enter)"
                onKeyDown={handleAddChild}
              />
              <button
                type="button"
                onClick={handleAddChild}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition duration-150 shrink-0"
              >
                افزودن
              </button>
            </div>
            <div className="flex flex-wrap gap-2 p-2 bg-gray-700 rounded-xl min-h-10">
              {categoryData.children.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  هیچ زیردسته‌ای اضافه نشده است.
                </p>
              ) : (
                categoryData.children.map((child, index) => (
                  <span
                    key={index}
                    className="bg-gray-600 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-red-500 transition duration-150"
                    onClick={() => handleRemoveChild(child)}
                  >
                    {child}
                    <FaTimes className="text-xs" />
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 5. Image Upload */}
          <div className="pt-2">
            <label className="text-gray-300 block mb-2 font-medium">
              تصویر دسته
            </label>
            <div
              className="bg-gray-700 p-4 rounded-xl cursor-pointer hover:bg-gray-600 transition duration-150 text-white flex items-center justify-center gap-2 border border-gray-600"
              onClick={() => fileInputRef.current.click()}
            >
              <FaImage className="w-5 h-5" />
              <span>
                {" "}
                {imageFile
                  ? `فایل انتخاب شده: ${imageFile.name}`
                  : "برای انتخاب تصویر کلیک کنید"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {(imagePreview || categoryData.img) && (
              <div className="mt-4 relative">
                <p className="text-gray-400 mb-2 text-sm">
                  تصویر فعلی / پیش‌نمایش
                </p>
                <img
                  src={imagePreview || categoryData.img}
                  alt="Category Preview"
                  className="w-full max-h-60 object-contain rounded-xl border border-gray-700"
                />
              </div>
            )}
            {!categoryData.img && !imagePreview && (
              <p className="text-gray-500 text-xs mt-2">
                تصویری برای این دسته ثبت نشده است.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-4">
            <button
              type="submit"
              disabled={isUpdating || isDeleting}
              className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition duration-150 disabled:bg-gray-600"
            >
              {isUpdating ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <FaSave /> ذخیره تغییرات
                </>
              )}
            </button>

            <button
              type="button"
              onClick={deleteHandler}
              disabled={isUpdating || isDeleting}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition duration-150 disabled:bg-gray-600"
            >
              {isDeleting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  در حال حذف...
                </>
              ) : (
                <>
                  <FaTrash /> حذف دسته
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
