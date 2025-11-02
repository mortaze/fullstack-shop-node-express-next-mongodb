"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TitleInput from "../../components/TitleInput";
import SlugInput from "../../components/SlugInput";
import ExcerptInput from "../../components/ExcerptInput";
import EditorSection from "../../components/EditorSection";
import PublishSection from "../../components/PublishSection";
import CategorySelect from "../../components/CategorySelect";
import TagsSection from "../../components/TagsSection";
import CoverImageUpload from "../../components/CoverImageUpload";

// از استفاده از window.alert() اجتناب کنید و یک تابع موقتی برای نمایش خطا ایجاد کنید
const showNotification = (message) => {
  console.log(`Notification: ${message}`);
  // در یک برنامه واقعی، در اینجا از Toast یا Modal استفاده کنید
  // alert(message); 
};

const API_BASE = "http://localhost:5000/api";

export default function EditBlogPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    categoryId: "",
    status: "DRAFT",
    scheduledAt: "",
    tags: [],
    coverImage: "",
  });

  const [categories, setCategories] = useState([]);
  const fileInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, Link, Image],
    content: "<p>در حال بارگذاری...</p>",
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-3 rounded bg-white text-black focus:outline-none",
      },
    },
  });

  // گرفتن اطلاعات پست از MongoDB
  useEffect(() => {
    async function fetchPost() {
      if (!id || !editor) return; // اطمینان از وجود ID و Editor
      try {
        const res = await fetch(`${API_BASE}/posts/${id}`);
        if (!res.ok) throw new Error("خطا در دریافت پست");
        const postData = await res.json();

        setForm({
          title: postData.title || "",
          slug: postData.slug || "",
          excerpt: postData.excerpt || "",
          categoryId: postData.categoryId || "",
          status: postData.status || "DRAFT",
          scheduledAt: postData.scheduledAt?.slice(0,16) || "",
          tags: postData.tags || [],
          coverImage: postData.coverImage || "",
        });

        editor?.commands.setContent(postData.content || "<p></p>");
      } catch (err) {
        console.error("Error fetching post data:", err);
        showNotification("خطا در بارگذاری اطلاعات پست");
      }
    }

    fetchPost();
  }, [id, editor]);

  // دریافت دسته‌بندی‌ها (افزوده شده برای کامل بودن)
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE}/blog-categories`);
        if (!res.ok) throw new Error("خطا در دریافت دسته‌بندی‌ها");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);


  const handleSubmit = async () => {
    const content = editor?.getHTML() || "";

    // 💡 رفع مشکل: استفاده از FormData برای سازگاری با multer در بک‌اند
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", form.slug);
    formData.append("excerpt", form.excerpt);
    formData.append("content", content);
    formData.append("categoryId", form.categoryId);
    formData.append("status", form.status);
    formData.append("scheduledAt", form.scheduledAt || "");
    
    // تگ‌ها باید به صورت رشته (String) ذخیره شوند تا در بک‌اند parse شوند
    formData.append("tags", JSON.stringify(form.tags)); 
    
    // اگر فایل کاور ایمیج جدیدی انتخاب شده است، آن را اضافه می‌کنیم
    // توجه: اگر کاور ایمیج جدیدی انتخاب نشده باشد، این فیلد خالی می‌ماند.
    // اما multer همچنان انتظار FormData را دارد.

    try {
      const res = await fetch(`${API_BASE}/posts/${id}`, {
        method: "PUT",
        // ❌ حذف 'Content-Type': 'application/json' برای FormData
        body: formData, 
      });

      if (!res.ok) {
        // خواندن پیام خطا از بک‌اند برای دیباگ بهتر
        const errorData = await res.json();
        console.error("Backend Error Response:", errorData);
        throw new Error(errorData.message || "خطا در ذخیره مقاله");
      }

      showNotification("مقاله با موفقیت به‌روزرسانی شد!");
      router.push("/dashboard/blog");
    } catch (err) {
      console.error(err);
      showNotification(`خطا در ذخیره مقاله: ${err.message}`);
    }
  };

  const handleCoverImageFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 💡 نکته: اگر تصویر کاور را جداگانه آپلود می‌کنید، باید آن را در همین متد به عنوان یک فیلد به درخواست اصلی PUT اضافه کنید
    // یا URL آن را در فرم ذخیره کنید و در handleSubmit ارسال کنید (که روش فعلی شماست).
    
    // منطق آپلود تصویر کاور به API/UPLOAD
    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setForm((prev) => ({ ...prev, coverImage: data.url }));
    } catch (err) {
      console.error(err);
      showNotification("خطا در آپلود تصویر شاخص");
    }
  };
  
  // ... (سایر توابع کمکی)
  const generateSlug = (text) =>
    text.toLowerCase().trim().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, "");

  if (!editor || !id) return <div className="p-6 text-center text-gray-500">در حال بارگذاری ویرایشگر...</div>;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4"
    >
      <div className="lg:col-span-2 space-y-4">
        <TitleInput form={form} setForm={setForm} generateSlug={generateSlug} />
        <SlugInput form={form} setForm={setForm} />
        <ExcerptInput form={form} setForm={setForm} />
        <EditorSection
          editor={editor}
          fileInputRef={fileInputRef}
          handleImageUploadClick={() => fileInputRef.current?.click()}
          handleFileChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const formData = new FormData();
            formData.append("file", file);

            try {
              const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
              if (!res.ok) throw new Error("Upload failed");
              const data = await res.json();
              editor.chain().focus().setImage({ src: data.url }).run();
            } catch (err) {
              console.error(err);
              showNotification("خطا در آپلود عکس داخلی");
            }
          }}
        />
      </div>

      <div className="space-y-4">
        <PublishSection
          form={form}
          setForm={setForm}
          onSave={handleSubmit}
          onPreview={() => showNotification(editor?.getHTML() || "")}
        />
        <CategorySelect
          categories={categories}
          selectedCategoryId={form.categoryId}
          onChange={(id) => setForm((prev) => ({ ...prev, categoryId: id }))}
        />
        <TagsSection
          tags={form.tags}
          selectedTags={form.tags}
          setSelectedTags={(tags) => setForm((prev) => ({ ...prev, tags }))}
          setTags={setForm}
        />
        <CoverImageUpload
          coverImage={form.coverImage}
          setCoverImage={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
          coverImageInputRef={coverImageInputRef}
          handleCoverImageUploadClick={() => coverImageInputRef.current?.click()}
          handleCoverImageFileChange={handleCoverImageFileChange}
        />
      </div>
    </form>
  );
}
