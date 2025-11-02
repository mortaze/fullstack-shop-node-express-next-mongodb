"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaBoxTissue, FaTrash } from "react-icons/fa6";

export default function CreateProductPage() {
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [featureValues, setFeatureValues] = useState([]);

  const [selectedFeatureId, setSelectedFeatureId] = useState("");
  const [selectedValueId, setSelectedValueId] = useState("");

  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));

    fetch("/api/features")
      .then((res) => res.json())
      .then((data) => setFeatures(data.features || []));
  }, []);

  useEffect(() => {
    if (selectedFeatureId) {
      fetch(`/api/features/${selectedFeatureId}/values`)
        .then((res) => res.json())
        .then((data) => setFeatureValues(data.values || []));
    }
  }, [selectedFeatureId]);

  const handleAddFeature = () => {
    if (!selectedFeatureId || !selectedValueId) return;

    const existing = selectedAttributes.find(
      (item) => item.featureId === selectedFeatureId
    );
    if (existing) return;

    const feature = features.find((f) => f.id === parseInt(selectedFeatureId));
    const value = featureValues.find((v) => v.id === parseInt(selectedValueId));

    setSelectedAttributes((prev) => [
      ...prev,
      {
        featureId: selectedFeatureId,
        featureName: feature?.name || "",
        valueId: selectedValueId,
        value: value?.value || "",
      },
    ]);

    setSelectedFeatureId("");
    setSelectedValueId("");
    setFeatureValues([]);
  };

  const handleRemoveAttribute = (featureId) => {
    setSelectedAttributes((prev) =>
      prev.filter((item) => item.featureId !== featureId)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) return alert("لطفاً تصویر محصول را انتخاب کنید.");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("categoryId", formData.categoryId);
    selectedAttributes.forEach((attr) =>
      data.append("attributeValues[]", attr.valueId)
    );
    data.append("mainImage", imageFile);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "خطا در ارسال داده");
        return;
      }

      alert("محصول با موفقیت ایجاد شد!");
      setFormData({
        title: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
      });
      setSelectedAttributes([]);
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      alert("خطا در ارسال درخواست");
    }
  };

  return (
    <>
      <Head>
        <title>ایجاد محصول جدید</title>
      </Head>

      <div className="pt-4 max-w-3xl mx-auto px-4">
        <Link
          href="/dashboard/products"
          className="text-green-400 mb-6 inline-block hover:underline"
        >
          ← بازگشت به لیست محصولات
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-white">ایجاد محصول جدید</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-8 rounded-3xl shadow space-y-5"
        >
          <div>
            <label className="block text-gray-300 mb-1">نام محصول</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">توضیحات</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-1">قیمت (تومان)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">موجودی</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">دسته‌بندی</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white"
              required
            >
              <option value="">انتخاب دسته‌بندی</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-800 p-4 rounded-xl">
            <div className="grid grid-cols-2 gap-4">
              <select
                value={selectedFeatureId}
                onChange={(e) => setSelectedFeatureId(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-700 text-white"
              >
                <option value="">ویژگی</option>
                {features.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedValueId}
                onChange={(e) => setSelectedValueId(e.target.value)}
                className="px-4 py-3 rounded-xl bg-gray-700 text-white"
              >
                <option value="">مقدار</option>
                {featureValues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.value}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddFeature}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              افزودن ویژگی
            </button>

            {selectedAttributes.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-white">
                {selectedAttributes.map((attr) => (
                  <li
                    key={attr.featureId}
                    className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-xl"
                  >
                    <span>
                      {attr.featureName}: {attr.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(attr.featureId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label
              htmlFor="mainImage"
              className="cursor-pointer flex items-center gap-2 text-white px-4 py-3 rounded-xl w-full"
            >
              <FaBoxTissue className="text-green-400" />
              انتخاب تصویر محصول
            </label>
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              required
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="پیش‌نمایش"
                className="mt-3 rounded-xl max-h-48 object-contain border border-green-400"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-3xl"
          >
            ثبت محصول
          </button>
        </form>
      </div>
    </>
  );
}
