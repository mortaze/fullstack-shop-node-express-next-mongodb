"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import MetaBox from "../MetaBox"; 

export default function ProductTagsBox({ product, setProduct }) {
  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      const newTag = e.target.value.trim();

      if (!product.tags.includes(newTag)) {
        setProduct({ ...product, tags: [...product.tags, newTag] });
      }

      e.target.value = "";
    }
  };

  const removeTag = (tagToRemove) => {
    setProduct({
      ...product,
      tags: product.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <MetaBox title="برچسب‌های محصول" defaultOpen={true}>
      <input
        type="text"
        onKeyDown={handleTagAdd}
        className="w-full p-2 bg-[#1e2939] border border-gray-700 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
        placeholder="برچسب را تایپ کنید و Enter بزنید"
      />

      <div className="flex flex-wrap gap-2 mt-3">
    {product?.tags?.length > 0 ? (
  product.tags.map((tag, index) => (
    <span
      key={index}
      className="flex items-center bg-indigo-700 text-indigo-100 text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-600 transition"
      onClick={() => removeTag(tag)}
    >
      {tag}
      <FaTrash className="mr-1 w-3 h-3 text-indigo-200" />
    </span>
  ))
) : (
  <p className="text-gray-500 text-xs">برچسبی اضافه نشده است.</p>
)}

      </div>
    </MetaBox>
  );
}
