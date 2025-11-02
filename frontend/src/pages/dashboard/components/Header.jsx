"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaBars } from "react-icons/fa";

export default function Header({ onOpenSidebar }) {
  const [showProfileInfo, setShowProfileInfo] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileInfo(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex items-center justify-between mb-2">
      {/* منوی موبایل */}
      <div className="md:hidden flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="text-green-400 text-2xl"
          aria-label="باز کردن منو"
        >
          <FaBars />
        </button>
        <div className="text-white font-bold text-lg">پنل فروشگاه</div>
      </div>

      {/* عنوان دسکتاپ */}
      <div className="hidden lg:flex flex-col">
        <h2 className="text-2xl font-bold">داشبورد فروشگاه</h2>
        <p className="text-sm text-gray-400 mt-1">
          خوش آمدید! امروز <span className="text-green-400">۵ اعلان جدید</span>{" "}
          دارید.
        </p>
      </div>

      {/* پروفایل */}
      <div ref={profileRef} className="relative flex flex-col items-end">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowProfileInfo(!showProfileInfo)}
        >
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            width={40}
            height={40}
            alt="User"
            className="rounded-full border-2 border-green-400"
            unoptimized
          />
          <span className="font-semibold text-sm hidden sm:inline">
            حسن خسروجردی
          </span>
        </div>

        {/* نمایش اطلاعات فقط در موبایل */}
        {showProfileInfo && (
          <div className="md:hidden absolute mt-10 bg-gray-700 p-3 rounded-lg shadow text-sm w-40 text-right z-50">
            <div>نام: حسن خسروجردی</div>
            <div className="text-green-400 mt-1">مشتری ویژه</div>
          </div>
        )}
      </div>
    </header>
  );
}
