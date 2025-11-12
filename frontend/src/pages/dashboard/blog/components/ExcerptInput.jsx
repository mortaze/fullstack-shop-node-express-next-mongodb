"use client";

import React from "react";

export default function ExcerptInput({ form, setForm }) {
  return (
    <div className="bg-gray-700 p-4 rounded-xl">
      <label className="block text-gray-300 mb-1">توضیحات کوتاه (meta)</label>
      <textarea
        rows={2}
        className="w-full p-2 rounded bg-gray-800 text-white resize-none"
        value={form.excerpt}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, excerpt: e.target.value }))
        }
        placeholder="توضیحات کوتاه مقاله را اینجا وارد کنید"
      />
    </div>
  );
}
