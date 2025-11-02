// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useEditor } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Link from "@tiptap/extension-link";
// import Image from "@tiptap/extension-image";
// import TitleInput from "../components/TitleInput";
// import SlugInput from "../components/SlugInput";
// import ExcerptInput from "../components/ExcerptInput";
// import EditorSection from "../components/EditorSection";
// import PublishSection from "../components/PublishSection";
// import CategorySelect from "../components/CategorySelect";
// import TagsSection from "../components/TagsSection";
// import CoverImageUpload from "../components/CoverImageUpload";

// const API_BASE = "http://localhost:5000/api";

// export default function BlogPostCreatePage() {
//   const [form, setForm] = useState({
//     title: "",
//     slug: "",
//     excerpt: "",
//     categoryId: "",
//     status: "DRAFT",
//     scheduledAt: "",
//     tags: [],
//     coverImage: "",
//   });

//   const [tags, setTags] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [newTag, setNewTag] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const fileInputRef = useRef(null);
//   const coverImageInputRef = useRef(null);

//   const editor = useEditor({
//     extensions: [StarterKit, Link, Image],
//     content: "<p>شروع نوشتن مقاله...</p>",
//     editorProps: {
//       attributes: {
//         class: "min-h-[200px] p-3 rounded bg-white text-black focus:outline-none",
//       },
//     },
//   });

//   // دریافت تگ‌ها و دسته‌بندی‌ها
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const [tagsRes, categoriesRes] = await Promise.all([
//           fetch(`${API_BASE}/tags`),
//           fetch(`${API_BASE}/blog-categories`),
//         ]);

//         if (tagsRes.ok) setTags(await tagsRes.json());
//         if (categoriesRes.ok) {
//           const data = await categoriesRes.json();
//           setCategories(data.categories || []);
//         }
//       } catch (err) {
//         console.error("خطا در دریافت اطلاعات:", err);
//       }
//     }

//     fetchData();
//   }, []);

//   const generateSlug = (text) =>
//     text
//       .toLowerCase()
//       .trim()
//       .replace(/[\s\W-]+/g, "-")
//       .replace(/^-+|-+$/g, "");

//   // ذخیره مقاله
//   const handleSave = async () => {
//     const fullContent = editor?.getHTML() || "";

//     try {
//       const res = await fetch(`${API_BASE}/posts`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...form, content: fullContent }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "خطا در ایجاد مقاله");
//       }

//       const createdPost = await res.json();
//       alert("مقاله با موفقیت ایجاد شد!");
//       window.location.href = `/dashboard/blog/${createdPost.id}/edit`;
//     } catch (err) {
//       console.error(err);
//       alert(`خطا در ایجاد مقاله: ${err.message}`);
//     }
//   };

//   // آپلود تصویر داخل محتوا
//   const handleFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
//       if (!res.ok) throw new Error("Upload failed");
//       const data = await res.json();
//       editor.chain().focus().setImage({ src: data.url }).run();
//     } catch (err) {
//       console.error(err);
//       alert("خطا در آپلود عکس");
//     }
//   };

//   // آپلود تصویر شاخص
//   const handleCoverImageFileChange = async (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
//       if (!res.ok) throw new Error("Upload failed");
//       const data = await res.json();
//       setForm((prev) => ({ ...prev, coverImage: data.url }));
//     } catch (err) {
//       console.error(err);
//       alert("خطا در آپلود تصویر شاخص");
//     }
//   };

//   // مدیریت انتخاب/حذف تگ‌ها
//   const toggleTag = (tag) => {
//     setForm((prev) => ({
//       ...prev,
//       tags: prev.tags.includes(tag)
//         ? prev.tags.filter((t) => t !== tag)
//         : [...prev.tags, tag],
//     }));
//   };

//   // افزودن تگ جدید
//   const handleAddTag = async () => {
//     if (!newTag.trim()) return alert("نام برچسب نمی‌تواند خالی باشد");

//     try {
//       const res = await fetch(`${API_BASE}/tags`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: newTag }),
//       });
//       if (!res.ok) throw new Error("خطا در افزودن برچسب");

//       const createdTag = await res.json();
//       setTags((prev) => [...prev, createdTag]);
//       setForm((prev) => ({ ...prev, tags: [...prev.tags, createdTag.name] }));
//       setNewTag("");
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error(err);
//       alert("خطا در افزودن برچسب");
//     }
//   };

//   return (
//     <form
//       onSubmit={(e) => {
//         e.preventDefault();
//         handleSave();
//       }}
//       className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4"
//     >
//       <div className="lg:col-span-2 space-y-4">
//         <TitleInput form={form} setForm={setForm} generateSlug={generateSlug} />
//         <SlugInput form={form} setForm={setForm} />
//         <ExcerptInput form={form} setForm={setForm} />
//         <EditorSection
//           editor={editor}
//           fileInputRef={fileInputRef}
//           handleImageUploadClick={() => fileInputRef.current?.click()}
//           handleFileChange={handleFileChange}
//         />
//       </div>

//       <div className="space-y-4">
//         <PublishSection form={form} setForm={setForm} onSave={handleSave} onPreview={() => {
//           const fullContent = editor?.getHTML() || "";
//           console.log("پیش‌نمایش مقاله:", { ...form, content: fullContent });
//           alert("پیش‌نمایش در console.log چاپ شد");
//         }} />

//         <CategorySelect
//           categories={categories}
//           selectedCategoryId={form.categoryId}
//           onChange={(id) => setForm((prev) => ({ ...prev, categoryId: id }))}
//         />
//         <TagsSection
//           tags={tags}
//           selectedTags={form.tags}
//           setSelectedTags={(tags) => setForm((prev) => ({ ...prev, tags }))}
//           setTags={setTags}
//         />
//         <CoverImageUpload
//           coverImage={form.coverImage}
//           setCoverImage={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
//           coverImageInputRef={coverImageInputRef}
//           handleCoverImageUploadClick={() => coverImageInputRef.current?.click()}
//           handleCoverImageFileChange={handleCoverImageFileChange}
//         />
//       </div>
//     </form>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TitleInput from "../components/TitleInput";
import SlugInput from "../components/SlugInput";
import ExcerptInput from "../components/ExcerptInput";
import EditorSection from "../components/EditorSection";
import PublishSection from "../components/PublishSection";
import CategorySelect from "../components/CategorySelect";
import TagsSection from "../components/TagsSection";
import CoverImageUpload from "../components/CoverImageUpload";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:5000/api";

export default function BlogPostCreatePage() {
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

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");

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

  // دریافت تگ‌ها و دسته‌بندی‌ها
  useEffect(() => {
    async function fetchData() {
      try {
        const [tagsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/tags`),
          fetch(`${API_BASE}/blog-categories`),
        ]);

        if (tagsRes.ok) setTags(await tagsRes.json());
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("خطا در دریافت اطلاعات:", err);
      }
    }

    fetchData();
  }, []);

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const showNotification = (msg) => {
    console.log("Notification:", msg);
  };

  // ذخیره مقاله با FormData برای هماهنگی با بک‌اند
  const handleSave = async () => {
    if (!form.title.trim() || !editor?.getText().trim()) {
      return showNotification("عنوان و محتوا الزامی هستند");
    }

    const finalSlug =
      form.slug && form.slug.trim() !== "" ? form.slug.trim() : generateSlug(form.title);

    const fullContent = editor?.getHTML() || "";

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("slug", finalSlug);
    formData.append("excerpt", form.excerpt);
    formData.append("content", fullContent);
    formData.append("categoryId", form.categoryId);
    formData.append("status", form.status);
    formData.append("scheduledAt", form.scheduledAt || "");
    formData.append("tags", JSON.stringify(form.tags));

    if (coverFile) formData.append("coverImage", coverFile);

    try {
      const res = await fetch(`${API_BASE}/posts`, { method: "POST", body: formData });

      if (!res.ok) {
        let errorData = null;
        try {
          errorData = await res.json();
        } catch {
          const text = await res.text();
          throw new Error(text || "خطا در ایجاد مقاله");
        }
        throw new Error(errorData?.message || "خطا در ایجاد مقاله");
      }

      const createdPost = await res.json();
      showNotification("مقاله با موفقیت ایجاد شد!");
      router.push(`/dashboard/blog/${createdPost._id}/edit`);
    } catch (err) {
      console.error("Create post failed:", err);
      showNotification(`خطا در ایجاد پست: ${err.message}`);
    }
  };

  // آپلود تصویر داخل محتوا
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
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
      alert("خطا در آپلود عکس");
    }
  };

  // آپلود تصویر شاخص
  const handleCoverImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCoverFile(file);

    const reader = new FileReader();
    reader.onload = () => setCoverImageUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // مدیریت انتخاب/حذف تگ‌ها
  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // افزودن تگ جدید
  const handleAddTag = async () => {
    if (!newTag.trim()) return alert("نام برچسب نمی‌تواند خالی باشد");

    try {
      const res = await fetch(`${API_BASE}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTag }),
      });
      if (!res.ok) throw new Error("خطا در افزودن برچسب");

      const createdTag = await res.json();
      setTags((prev) => [...prev, createdTag]);
      setForm((prev) => ({ ...prev, tags: [...prev.tags, createdTag.name] }));
      setNewTag("");
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("خطا در افزودن برچسب");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSave();
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
          handleFileChange={handleFileChange}
        />
      </div>

      <div className="space-y-4">
        <PublishSection
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onPreview={() => {
            const fullContent = editor?.getHTML() || "";
            console.log("پیش‌نمایش مقاله:", { ...form, content: fullContent });
            alert("پیش‌نمایش در console.log چاپ شد");
          }}
        />

        <CategorySelect
          categories={categories}
          selectedCategoryId={form.categoryId}
          onChange={(id) => setForm((prev) => ({ ...prev, categoryId: id }))}
        />
        <TagsSection
          tags={tags}
          selectedTags={form.tags}
          setSelectedTags={(tags) => setForm((prev) => ({ ...prev, tags }))}
          setTags={setTags}
        />
        <CoverImageUpload
          coverImage={coverImageUrl}
          setCoverImage={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
          coverImageInputRef={coverImageInputRef}
          handleCoverImageUploadClick={() => coverImageInputRef.current?.click()}
          handleCoverImageFileChange={handleCoverImageFileChange}
        />
      </div>
    </form>
  );
}

