"use client";

import React from "react";

export default function CoverImageUpload({
  coverImage,
  setCoverImage,
  coverImageInputRef,
  handleCoverImageUploadClick,
  handleCoverImageFileChange,
}) {
  return (
    <div className="bg-gray-700 p-4 rounded-xl">
      <label className="block text-gray-300 mb-2">تصویر شاخص</label>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          placeholder="آدرس تصویر (اختیاری)"
          value={coverImage} // <- props درست
          onChange={(e) => setCoverImage(e.target.value)}
        />
        <button
          type="button"
          onClick={handleCoverImageUploadClick}
          className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 text-white"
        >
          آپلود فایل
        </button>
      </div>

      <input
        type="file"
        accept="image/*"
        ref={coverImageInputRef}
        onChange={handleCoverImageFileChange}
        style={{ display: "none" }}
      />

      {coverImage && (
        <img
          src={coverImage}
          alt="تصویر شاخص"
          className="mt-3 rounded-lg border border-gray-500 max-h-48 object-contain"
        />
      )}
    </div>
  );
}
