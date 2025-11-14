"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import TitleInput from "../../components/TitleInput";
import SlugInput from "../../components/SlugInput";
import ExcerptInput from "../../components/ExcerptInput";
import EditorSection from "../../components/EditorSection";
import PublishSection from "../../components/PublishSection";
import BlogCategoryBox from "../../components/CategorySelect"; // ✅ نسخه هماهنگ
import TagsSection from "../../components/TagsSection";
import CoverImageUpload from "../../components/CoverImageUpload";
import DashboardLayout from "../../../layout";

import { useGetAllTagsQuery } from "../../../../../redux/features/blogApi";

// تولید اسلاگ فارسی‌ساز
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-");
}

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: tagsData } = useGetAllTagsQuery();
  const allTags = tagsData?.data || [];

  const [categories, setCategories] = useState([]); // دسته‌بندی‌ها از سرور
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    category: { id: "", name: "" }, // ✅ ساختار هماهنگ با BlogCategoryBox
    status: "draft",
    scheduledAt: "",
    tags: [],
    coverImage: "",
    author: "",
    content: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: "<p></p>",
    editorProps: {
      attributes: {
        class:
          "min-h-[250px] p-3 rounded bg-white text-black focus:outline-none border border-gray-200",
      },
    },
  });

  // واکشی دسته‌بندی‌ها و مقاله
  useEffect(() => {
    if (!id || !editor) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // دسته‌بندی‌ها
        const catRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog-category/show`);
        setCategories(catRes.data?.data || []);

        // مقاله
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog/get/${id}`);
        const data = res.data?.data || res.data;

        setForm({
          title: data.title || "",
          slug: data.slug || "",
          excerpt: data.excerpt || "",
          category: data.category
            ? { id: data.category._id, name: data.category.name }
            : { id: "", name: "" },
          status: data.status || "draft",
          scheduledAt: data.scheduledAt ? data.scheduledAt.slice(0, 16) : "",
          tags: Array.isArray(data.tags)
            ? data.tags.map((t) => (typeof t === "object" ? t._id : t))
            : [],
          coverImage: data.coverImage || "",
          author: data.author || "",
          content: data.content || "",
        });

        editor.commands.setContent(data.content || "<p></p>");
      } catch (err) {
        console.error("❌ خطا در واکشی داده‌ها:", err);
        alert("خطا در دریافت اطلاعات مقاله یا دسته‌بندی‌ها");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, editor]);

  // ذخیره تغییرات مقاله
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;

    if (!form.category.id) {
      alert("دسته‌بندی مقاله الزامی است!");
      return;
    }

    const payload = {
      ...form,
      content: editor.getHTML(),
      category: form.category.id, // فقط ID ارسال شود
    };

    try {
      const res = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/blog/update/${id}`, payload);
      if (res.status === 200 || res.data.success) {
        alert("✅ مقاله با موفقیت ویرایش شد!");
        router.push("/dashboard/blog");
      } else {
        alert(res.data.message || "خطا در ویرایش مقاله");
      }
    } catch (err) {
      console.error("❌ خطا در آپدیت مقاله:", err.response?.data || err);
      alert("❌ خطا در ارتباط با سرور یا داده‌های ارسالی");
    }
  };

  // آپلود تصویر کاور
  const handleCoverImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, coverImage: data.url }));
    } catch (err) {
      console.error("❌ خطا در آپلود تصویر:", err);
      alert("خطا در آپلود تصویر کاور");
    }
  };

  if (isLoading || !editor) {
    return <div className="p-6 text-center text-gray-400">در حال بارگذاری مقاله...</div>;
  }

  return (
    <DashboardLayout>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4"
      >
        {/* بخش اصلی */}
        <div className="lg:col-span-2 space-y-4">
          <TitleInput form={form} setForm={setForm} generateSlug={generateSlug} />
          <SlugInput form={form} setForm={setForm} />
          <ExcerptInput form={form} setForm={setForm} />
          <EditorSection
            editor={editor}
            fileInputRef={fileInputRef}
            handleImageUploadClick={() => fileInputRef.current?.click()}
            handleFileChange={handleCoverImageFileChange}
          />
        </div>

        {/* سایدبار */}
        <div className="space-y-4">
          <PublishSection form={form} setForm={setForm} onSave={handleSubmit} />
          
          <BlogCategoryBox blog={form} setBlog={setForm} categories={categories} />
{/* 
          <TagsSection
            tags={allTags}
            selectedTags={form.tags}
            setSelectedTags={(tags) => setForm((prev) => ({ ...prev, tags }))}
          /> */}

          <CoverImageUpload
            coverImage={form.coverImage}
            setCoverImage={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
            coverImageInputRef={coverImageInputRef}
            handleCoverImageUploadClick={() => coverImageInputRef.current?.click()}
            handleCoverImageFileChange={handleCoverImageFileChange}
          />
        </div>
      </form>
    </DashboardLayout>
  );
}
