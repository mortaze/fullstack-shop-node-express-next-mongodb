"use client";

import React from "react";
import { FaSave, FaEye } from "react-icons/fa";

export default function PublishSection({ form, setForm, onSave, onPreview }) {
  return (
    <div className="bg-gray-700 p-4 rounded-xl">
      <label className="block text-gray-300 mb-2">وضعیت انتشار</label>
      <select
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={form.status}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, status: e.target.value }))
        }
      >
        <option value="DRAFT">پیش‌نویس</option>
        <option value="PUBLISHED">منتشر شده</option>
        <option value="SCHEDULED">زمان‌بندی شده</option>
      </select>

      {form.status === "SCHEDULED" && (
        <div className="mt-2">
          <label className="text-gray-300 text-sm">تاریخ انتشار</label>
          <input
            type="datetime-local"
            className="w-full p-2 mt-1 rounded bg-gray-800 text-white"
            value={form.scheduledAt}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, scheduledAt: e.target.value }))
            }
          />
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={onSave} // ← تابع handleSubmit از BlogPostCreatePage.js
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
        >
          <FaSave />
          ذخیره
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-xl"
        >
          <FaEye />
          پیش‌نمایش
        </button>
      </div>
    </div>
  );
}
