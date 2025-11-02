"use client";

import { useState } from "react";
import DashboardLayout from "../../../layout";

export default function CreateCategoryPage() {
  const [parent, setParent] = useState("");
  const [img, setImg] = useState("");
  const [children, setChildren] = useState([""]);
  const [productType, setProductType] = useState("");
  const [status, setStatus] = useState("Show");

  const handleChildChange = (index, value) => {
    const updated = [...children];
    updated[index] = value;
    setChildren(updated);
  };

  const addChildField = () => setChildren([...children, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      parent,
      img,
      children: children.filter((c) => c.trim() !== ""),
      productType,
      status,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/category/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) throw new Error("خطا در ثبت دسته‌بندی");

      alert("✅ دسته‌بندی با موفقیت ثبت شد");
      setParent("");
      setImg("");
      setChildren([""]);
      setProductType("");
      setStatus("Show");
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="pt-4 max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          ایجاد دسته‌بندی جدید
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-8 rounded-3xl shadow space-y-6"
        >
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              نام دسته‌بندی (parent)
            </label>
            <input
              type="text"
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
              placeholder="مثلاً Mobile Tablets"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              لینک تصویر دسته‌بندی
            </label>
            <input
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
              placeholder="https://example.com/image.png"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              نوع محصول (productType)
            </label>
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
              placeholder="مثلاً electronics"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              زیر دسته‌ها (children)
            </label>
            {children.map((child, idx) => (
              <input
                key={idx}
                type="text"
                value={child}
                onChange={(e) => handleChildChange(idx, e.target.value)}
                className="w-full px-5 py-3 mb-2 rounded-2xl bg-gray-800 text-white"
                placeholder={`زیر دسته ${idx + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={addChildField}
              className="text-green-400 text-sm mt-1 hover:underline"
            >
              + افزودن زیر دسته
            </button>
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-semibold">
              وضعیت نمایش
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl bg-gray-800 text-white"
            >
              <option value="Show">Show</option>
              <option value="Hide">Hide</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-3xl"
          >
            ثبت دسته‌بندی
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
