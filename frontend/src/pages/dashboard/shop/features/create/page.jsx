"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function CreateFeaturePage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "نام ویژگی را وارد کنید.",
      });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در ایجاد ویژگی");
      }

      Swal.fire({
        icon: "success",
        title: "ویژگی با موفقیت ایجاد شد",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/dashboard/shop/features");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-gray-700 rounded-3xl text-white mt-10">
      <h1 className="text-3xl mb-8 font-bold text-center">ایجاد ویژگی جدید</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-2 font-semibold">نام ویژگی</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثلاً رنگ، اندازه"
          className="w-full p-3 rounded-xl bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-400 mb-6"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 py-4 rounded-3xl font-bold hover:bg-green-600 transition"
        >
          {loading ? "در حال ذخیره..." : "ذخیره ویژگی"}
        </button>
      </form>
    </div>
  );
}
