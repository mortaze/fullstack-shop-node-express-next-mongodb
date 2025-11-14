"use client";

import React, { useRef, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";

export default function EditorSection({ editor, setContent }) {
  const fileInputRef = useRef(null);

  // اگر ادیتور هنوز آماده نیست، نمایش پیام بارگذاری
  if (!editor) return <div className="text-gray-400">در حال بارگذاری ادیتور...</div>;

  // آپلود تصویر به ادیتور
  const handleImageUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const imageUrl = data.url;
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.error("❌ خطا در آپلود عکس:", error);
      alert("خطا در آپلود عکس");
    }
  };

  // کنترل‌ها و ابزارک‌ها
  const controls = [
    { label: "Bold", action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive("bold") },
    { label: "Italic", action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive("italic") },
    { label: "Underline", action: () => editor.chain().focus().toggleUnderline().run(), isActive: editor.isActive("underline") },
    { label: "Strike", action: () => editor.chain().focus().toggleStrike().run(), isActive: editor.isActive("strike") },
    { label: "H1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive("heading", { level: 1 }) },
    { label: "H2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive("heading", { level: 2 }) },
    { label: "H3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: editor.isActive("heading", { level: 3 }) },
    { label: "Bullet", action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive("bulletList") },
    { label: "Numbered", action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive("orderedList") },
    { label: "Blockquote", action: () => editor.chain().focus().toggleBlockquote().run(), isActive: editor.isActive("blockquote") },
    { label: "Code", action: () => editor.chain().focus().toggleCodeBlock().run(), isActive: editor.isActive("codeBlock") },
    { label: "Divider", action: () => editor.chain().focus().setHorizontalRule().run(), isActive: false },
    { label: "Left", action: () => editor.chain().focus().setTextAlign('left').run(), isActive: editor.isActive({ textAlign: 'left' }) },
    { label: "Center", action: () => editor.chain().focus().setTextAlign('center').run(), isActive: editor.isActive({ textAlign: 'center' }) },
    { label: "Right", action: () => editor.chain().focus().setTextAlign('right').run(), isActive: editor.isActive({ textAlign: 'right' }) },
    {
      label: "Link",
      action: () => {
        const url = prompt("آدرس لینک؟");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
      isActive: editor.isActive("link"),
    },
    { label: "Unlink", action: () => editor.chain().focus().unsetLink().run(), isActive: false },
    {
      label: "Image",
      action: handleImageUploadClick,
      isActive: false,
    },
    {
      label: "Clear",
      action: () => editor.chain().focus().unsetAllMarks().clearNodes().run(),
      isActive: false,
    },
  ];

  return (
    <div className="bg-gray-700 p-4 rounded-xl">
      <label className="block text-gray-300 mb-2">محتوای مقاله</label>

      <div className="flex flex-wrap gap-2 mb-3">
        {controls.map(({ label, action, isActive }, i) => (
          <button
            key={i}
            type="button"
            onClick={action}
            className={`px-2 py-1 rounded text-sm ${isActive ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
          >
            {label}
          </button>
        ))}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
