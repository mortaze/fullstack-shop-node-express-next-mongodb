"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaTrash, FaSave, FaImage } from "react-icons/fa";
import DashboardLayout from "../../../../layout";

export default function EditCategoryPage({ params }) {
  const categoryId = params?.id;

  // States
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  // const fetchData = async () => {
  //   try {
  //     setLoading(true);

  //     const [allRes, catRes] = await Promise.all([
  //       fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/show`),
  //       fetch(`${process.env.NEXT_PUBLIC_API_URL}/category/get/${categoryId}`),
  //     ]);

  //     const allData = await allRes.json();
  //     const catData = await catRes.json();

  //     setCategories(allData.result || []);
  //     setCategory(catData);
  //   } catch (err) {
  //     console.error("Error:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    if (!categoryId) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category/get/${categoryId}`
        );
        const data = await res.json();
        setCategory(data.result || data);
      } catch (error) {
        console.error("خطا:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        console.log(
          "Fetching:",
          `${process.env.NEXT_PUBLIC_API_URL}/category/get/${categoryId}`
        );

        const catRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/category/get/${categoryId}`
        );
        console.log("Status:", catRes.status);

        const catData = await catRes.json();
        console.log("Response:", catData);

        // اگر API دیتارو داخل result برگردوند
        setCategory(catData.result || catData);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // Image change
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!category?.parent?.trim()) return alert("نام دسته را وارد کنید");

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("parent", category.parent);
      form.append("parentId", category.parentId || "");
      form.append("children", JSON.stringify(category.children || []));
      if (imageFile) form.append("img", imageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/edit/${categoryId}`,
        { method: "PATCH", body: form }
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      alert("✅ دسته‌بندی با موفقیت ذخیره شد");
    } catch (err) {
      alert("❌ خطا: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // delete
  const deleteHandler = async () => {
    if (!confirm("آیا مطمئنید؟")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/delete/${categoryId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("خطا در حذف");

      alert("✅ دسته حذف شد");
      window.location.href = "/dashboard/shop/categories";
    } catch (err) {
      alert("❌ خطا: " + err.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-center text-gray-400">در حال بارگذاری...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-bold text-white text-center mb-6">
          ویرایش دسته
        </h1>

        <form
          onSubmit={submitHandler}
          className="bg-gray-800 p-5 rounded-xl space-y-5"
        >
          <label className="text-white">نام دسته</label>
          <input
            className="input input-bordered w-full bg-gray-700 text-white p-3 rounded-xl"
            value={category?.parent || ""}
            onChange={(e) =>
              setCategory({ ...category, parent: e.target.value })
            }
          />

          <label className="text-white">انتخاب دسته مادر</label>
          <select
            className="w-full bg-gray-700 text-white p-3 rounded-xl"
            value={category?.parentId || ""}
            onChange={(e) =>
              setCategory({ ...category, parentId: e.target.value })
            }
          >
            <option value="">بدون دسته مادر</option>
            {categories
              .filter((c) => c._id !== categoryId)
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.parent}
                </option>
              ))}
          </select>

          <label className="text-white block">تصویر دسته</label>
          <div
            className="bg-gray-700 p-3 rounded-xl cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          >
            <FaImage className="inline mr-2" /> انتخاب تصویر
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {(imagePreview || category?.img) && (
            <img
              src={imagePreview || category?.img}
              className="w-full rounded-xl mt-3"
            />
          )}

          <button
            disabled={isSubmitting}
            className="w-full bg-green-600 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
          >
            <FaSave /> ذخیره تغییرات
          </button>

          <button
            type="button"
            onClick={deleteHandler}
            className="w-full bg-red-600 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2"
          >
            <FaTrash /> حذف دسته
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
