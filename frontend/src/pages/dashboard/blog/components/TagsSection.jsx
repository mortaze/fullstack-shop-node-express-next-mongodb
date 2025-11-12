"use client";

import { useState } from "react";

export default function TagsSection({ tags, form, setForm }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleTag = (tagName) => {
    if (form.tags.includes(tagName)) {
      setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tagName) }));
    } else {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, tagName] }));
    }
  };

  const handleAddTag = async () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) {
      setErrorMsg("نام برچسب نمی‌تواند خالی باشد");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedTag }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.message || "خطا در افزودن برچسب");
        setIsLoading(false);
        return;
      }

      const createdTag = await res.json();
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, createdTag.name],
      }));

      setNewTag("");
      setIsModalOpen(false);
    } catch (error) {
      setErrorMsg("خطا در ارتباط با سرور");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-white mb-2">برچسب‌ها</label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => toggleTag(tag.name)}
            className={`px-3 py-1 rounded-full text-sm ${
              form.tags.includes(tag.name)
                ? "bg-green-600 text-white"
                : "bg-gray-600 text-gray-200"
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
        onClick={() => setIsModalOpen(true)}
      >
        افزودن برچسب جدید
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-5 rounded w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">افزودن برچسب</h2>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="نام برچسب"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
              disabled={isLoading}
              autoFocus
            />
            {errorMsg && <p className="text-red-600 mt-2 text-sm">{errorMsg}</p>}
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setIsModalOpen(false)} disabled={isLoading}>
                انصراف
              </button>
              <button
                type="button"
                onClick={handleAddTag}
                disabled={isLoading}
                className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                {isLoading ? "در حال افزودن..." : "افزودن"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
