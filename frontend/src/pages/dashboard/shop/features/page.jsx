"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";
export default function FeaturesPage() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [valuesLoading, setValuesLoading] = useState(false);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/features");
      const data = await res.json();
      setFeatures(data.features || []);
    } catch {
      Swal.fire("خطا", "دریافت ویژگی‌ها با مشکل مواجه شد", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchValues = async (feature) => {
    setValuesLoading(true);
    setSelectedFeature(null);
    try {
      setSelectedFeature(feature);
    } catch {
      Swal.fire("خطا", "دریافت مقدارهای ویژگی با مشکل مواجه شد", "error");
    } finally {
      setValuesLoading(false);
    }
  };

  const handleAddValue = async (featureId) => {
    const { value: newValue } = await Swal.fire({
      title: "افزودن مقدار جدید",
      input: "text",
      inputLabel: "مقدار را وارد کنید:",
      inputPlaceholder: "مثلاً Nike یا XXL",
      confirmButtonText: "افزودن",
      cancelButtonText: "انصراف",
      showCancelButton: true,
    });

    if (!newValue || !newValue.trim()) return;

    try {
      const res = await fetch("/api/features/add-value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, value: newValue.trim() }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "خطا در افزودن مقدار");
      }

      Swal.fire("موفق", "مقدار با موفقیت افزوده شد", "success");
      await fetchFeatures();

      if (selectedFeature && selectedFeature.id === featureId) {
        const updatedFeature = features.find((f) => f.id === featureId);
        if (updatedFeature) {
          setSelectedFeature({
            ...updatedFeature,
            values: [
              ...(updatedFeature.values || []),
              { id: Date.now(), value: newValue.trim() },
            ],
          });
        }
      }
    } catch (err) {
      Swal.fire("خطا", err.message, "error");
    }
  };

  const handleDeleteValue = async (valueId) => {
    const confirm = await Swal.fire({
      title: "آیا از حذف این مقدار مطمئن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "لغو",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/features/delete-value/${valueId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "خطا در حذف مقدار");
      }

      Swal.fire("موفق", "مقدار با موفقیت حذف شد", "success");

      // آپدیت کردن selectedFeature.values بدون مقدار حذف شده
      setSelectedFeature((prev) => ({
        ...prev,
        values: prev.values.filter((v) => v.id !== valueId),
      }));

      await fetchFeatures();
    } catch (err) {
      Swal.fire("خطا", err.message, "error");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-white">
        در حال بارگذاری ویژگی‌ها...
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto p-8 text-white flex gap-8">
      {/* سمت راست: لیست ویژگی‌ها */}
      <div className="w-1/3 border border-green-400 rounded-lg bg-gray-800 p-4 overflow-y-auto max-h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">ویژگی‌ها</h1>
        <Link
          href="/dashboard/shop/features/create"
          className="inline-block mb-4 bg-green-700 px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          ایجاد ویژگی جدید
        </Link>

        {features.length === 0 && <p>ویژگی‌ای وجود ندارد.</p>}

        <ul className="space-y-3">
          {features.map((feature) => (
            // داخل return لیست ویژگی‌ها، توی <li> اینطوری تغییر بده:
            <li
              key={feature.id}
              className={`cursor-pointer p-3 rounded flex justify-between items-center ${
                selectedFeature?.id === feature.id
                  ? "bg-green-700"
                  : "hover:bg-green-600"
              }`}
            >
              <div
                onClick={() => fetchValues(feature)}
                className="flex-1"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fetchValues(feature)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{feature.name}</span>
                  <span className="text-sm bg-green-400 text-black rounded-full px-2 py-0.5">
                    {feature.values.length}
                  </span>
                </div>
              </div>

              {/* دکمه حذف ویژگی */}
              <button
                onClick={async (e) => {
                  e.stopPropagation(); // جلوگیری از انتخاب ویژگی هنگام حذف
                  const result = await Swal.fire({
                    title: `آیا از حذف ویژگی "${feature.name}" مطمئن هستید؟`,
                    text: "با حذف این ویژگی، همه مقدارهای آن نیز حذف خواهند شد!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "بله، حذف کن",
                    cancelButtonText: "لغو",
                  });
                  if (result.isConfirmed) {
                    try {
                      const res = await fetch(
                        `/api/features/delete/${feature.id}`,
                        {
                          method: "DELETE",
                        }
                      );
                      if (!res.ok) {
                        const data = await res.json();
                        throw new Error(data.error || "خطا در حذف ویژگی");
                      }
                      Swal.fire("موفق", "ویژگی با موفقیت حذف شد", "success");
                      setSelectedFeature(null);
                      fetchFeatures();
                    } catch (error) {
                      Swal.fire("خطا", error.message, "error");
                    }
                  }
                }}
                className="text-white hover:text-red-500 ml-2 cursor-pointer ms-2"
                title="حذف ویژگی"
                aria-label="حذف ویژگی"
              >
                <MdDelete size={25} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* سمت چپ: مقدارهای ویژگی انتخاب شده */}
      <div className="w-2/3 border border-green-400 rounded-lg bg-gray-800 p-6 max-h-[70vh] overflow-y-auto flex flex-col">
        <h2 className="text-2xl font-bold mb-4">
          {selectedFeature
            ? `مقدارهای ویژگی: ${selectedFeature.name}`
            : "مقدارهای ویژگی"}
        </h2>

        {!selectedFeature && (
          <p className="text-gray-400">
            لطفاً یک ویژگی را از سمت راست انتخاب کنید.
          </p>
        )}

        {valuesLoading && (
          <p className="text-center text-white">در حال بارگذاری مقدارها...</p>
        )}

        {selectedFeature && !valuesLoading && (
          <>
            {selectedFeature.values.length === 0 ? (
              <p>هیچ مقداری برای این ویژگی ثبت نشده است.</p>
            ) : (
              <ul className="space-y-2 mb-4">
                {selectedFeature.values.map((val) => (
                  <li
                    key={val.id}
                    className="p-3 bg-teal-700 rounded text-white flex justify-between items-center"
                  >
                    <span>{val.value}</span>
                    <button
                      onClick={() => handleDeleteValue(val.id)}
                      className="cursor-pointer hover:text-red-500 border-3 border-white rounded-lg p-1 transition"
                      title="حذف مقدار"
                      aria-label="حذف مقدار"
                    >
                      <MdDelete size={25} className="shadow-2xl" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => handleAddValue(selectedFeature.id)}
              className="self-start bg-green-600 hover:bg-green-700 transition rounded py-2 px-6"
            >
              افزودن مقدار جدید
            </button>
          </>
        )}
      </div>
    </div>
  );
}
