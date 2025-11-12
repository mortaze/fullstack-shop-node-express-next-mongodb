"use client";

import { useState, useRef } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../layout";
import TitleInput from "../components/TitleInput";
import SlugInput from "../components/SlugInput";
import ExcerptInput from "../components/ExcerptInput";
import EditorSection from "../components/EditorSection";
import PublishSection from "../components/PublishSection";
import CategorySelect from "../components/CategorySelect";
import TagsSection from "../components/TagsSection";
import CoverImageUpload from "../components/CoverImageUpload";

import { useGetAllCategoriesQuery, useGetAllTagsQuery, useCreateBlogMutation } from '@/redux/features/blogApi';

export default function BlogPostCreatePage() {
  const router = useRouter();

  const { data: categories = [] } = useGetAllCategoriesQuery();
  const { data: allTags = [] } = useGetAllTagsQuery();
  const [createBlog] = useCreateBlogMutation();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    categoryId: "",
    status: "draft",
    scheduledAt: "",
    tags: [],
    coverImage: "",
  });

  const [coverFile, setCoverFile] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: "<p>شروع نوشتن مقاله...</p>",
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-3 rounded bg-white text-black focus:outline-none",
      },
    },
  });

  // نویسنده ثابت برای تمام مقالات
  const FIXED_AUTHOR_ID = "64f9c123456789abcdef0000"; // هر مقدار ثابت و معتبر که سرور می‌پذیرد

  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const showNotification = (msg) => alert(msg);

  // آپلود تصویر کاور قبل از ارسال
  const uploadCoverImage = async (file) => {
    if (!file) return "";
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error(err);
      showNotification("خطا در آپلود تصویر کاور");
      return "";
    }
  };

  const handleSave = async () => {
    const title = form.title.trim();
    const content = editor?.getHTML()?.trim();
    const slug = form.slug.trim() !== '' ? form.slug.trim() : generateSlug(title);

    if (title.length < 5) return showNotification("عنوان باید حداقل 5 کاراکتر باشد");
    if (!content) return showNotification("محتوای مقاله الزامی است");

    // اگر فایل آپلود شده باشد، URL آپلود شده را بگیر، در غیر اینصورت لینک مستقیم فرم
    const coverUrl = coverFile
      ? await uploadCoverImage(coverFile)
      : form.coverImage || "";

    const payload = {
      title,
      slug,
      excerpt: form.excerpt || "",
      content,
      categoryId: form.categoryId || "",
      status: form.status,
      scheduledAt: form.scheduledAt || "",
      tags: form.tags || [],
      author: FIXED_AUTHOR_ID, // همیشه نویسنده مشخص
      coverImage: coverUrl,
    };

    try {
      const result = await createBlog(payload).unwrap();
      showNotification('مقاله با موفقیت ایجاد شد');
      router.push(`/dashboard/blog/${result._id}/edit`);
    } catch (err) {
      console.error('خطا در ایجاد پست:', err);
      const msg = err.data?.message || err.message || "خطا در ایجاد پست";
      showNotification(msg);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      editor.chain().focus().setImage({ src: data.url }).run();
    } catch (err) {
      console.error(err);
      showNotification("خطا در آپلود عکس");
    }
  };

  const handleCoverImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCoverFile(file);

    const reader = new FileReader();
    reader.onload = () => setCoverImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return showNotification('نام برچسب نمی‌تواند خالی باشد');
    setForm(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
    setNewTag("");
  };

  return (
    <DashboardLayout>
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
        <div className="lg:col-span-2 space-y-4">
          <TitleInput form={form} setForm={setForm} generateSlug={generateSlug} />
          <SlugInput form={form} setForm={setForm} />
          <ExcerptInput form={form} setForm={setForm} />
          <EditorSection
            editor={editor}
            fileInputRef={fileInputRef}
            handleImageUploadClick={() => fileInputRef.current?.click()}
            handleFileChange={handleFileChange}
          />
        </div>

        <div className="space-y-4">
          <PublishSection
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onPreview={() => console.log(editor.getHTML())}
          />

          <CategorySelect
            categories={categories}
            selectedCategoryId={form.categoryId}
            onChange={(id) => setForm(prev => ({ ...prev, categoryId: id }))}
          />

          <TagsSection
            tags={allTags}
            selectedTags={form.tags}
            setSelectedTags={(tags) => setForm(prev => ({ ...prev, tags }))}
            newTag={newTag}
            setNewTag={setNewTag}
            onAddTag={handleAddTag}
          />

          <CoverImageUpload
            coverImage={form.coverImage}
            setCoverImage={(url) => setForm(prev => ({ ...prev, coverImage: url }))}
            coverImageInputRef={coverImageInputRef}
            handleCoverImageUploadClick={() => coverImageInputRef.current?.click()}
            handleCoverImageFileChange={handleCoverImageFileChange}
          />
        </div>
      </form>
    </DashboardLayout>
  );
}
