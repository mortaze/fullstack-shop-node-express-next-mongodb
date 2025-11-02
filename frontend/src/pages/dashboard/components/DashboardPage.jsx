"use client";

import Head from "next/head";
import {
  FaCircle,
  FaBox,
  FaUserPlus,
  FaShoppingCart,
  FaCreditCard,
  FaComment,
  FaTruck,
} from "react-icons/fa";

export default function DashboardPage() {
  const stats = [
    {
      title: "مجموع فروش امروز",
      value: "۲,۳۵۰,۰۰۰ تومان",
      desc: "+۹% نسبت به دیروز",
    },
    { title: "تعداد سفارشات", value: "۸۷", desc: "+۵ سفارش جدید" },
    { title: "کاربران جدید", value: "۲۳", desc: "+۳ کاربر امروز" },
    { title: "بازدید امروز", value: "۱۲,۴۰۰", desc: "+۲% نسبت به دیروز" },
  ];

  const notifications = [
    "کاربر جدید ثبت نام کرد",
    "سفارش جدید ثبت شد",
    "محصول جدید به فروشگاه اضافه شد",
    "پرداخت موفق انجام شد",
    "نظر جدید ثبت شد",
  ];

  const activities = [
    {
      icon: <FaBox />,
      title: "محصول جدید: هدفون بی‌سیم",
      time: "۵ دقیقه پیش",
      detail: "موجودی: ۲۵ عدد",
    },
    {
      icon: <FaUserPlus />,
      title: "ثبت نام کاربر جدید: علی محمدی",
      time: "۱۰ دقیقه پیش",
      detail: "سطح: مشتری ویژه",
    },
    {
      icon: <FaShoppingCart />,
      title: "سفارش جدید: #۱۲۳۴۵",
      time: "۲۰ دقیقه پیش",
      detail: "مبلغ: ۱,۲۵۰,۰۰۰ تومان",
    },
    {
      icon: <FaCreditCard />,
      title: "پرداخت موفق: #۹۸۷۶۵",
      time: "۴۰ دقیقه پیش",
      detail: "درگاه: زرین‌پال",
    },
    {
      icon: <FaComment />,
      title: "نظر جدید: عالی بود!",
      time: "۱ ساعت پیش",
      detail: "کاربر: سارا احمدی",
    },
    {
      icon: <FaTruck />,
      title: "ارسال سفارش: #۱۲۳۴۵",
      time: "۲ ساعت پیش",
      detail: "وضعیت: ارسال شد",
    },
  ];

  return (
    <>
      <Head>
        <title>داشبورد پنل مدیریت</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((item, i) => (
            <div key={i} className="bg-gray-700 p-4 rounded-xl shadow">
              <h3 className="text-sm text-gray-400 mb-1">{item.title}</h3>
              <div className="text-xl font-bold">{item.value}</div>
              <div className="text-green-400 text-sm mt-1">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 bg-gray-700 p-4 rounded-xl shadow">
            <div className="flex justify-between mb-2">
              <span className="text-green-400 font-semibold">
                نمودار فروش هفتگی
              </span>
              <span className="text-sm text-gray-400">۱۴۰۳</span>
            </div>
            <div className="h-48 flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg text-gray-400">
              (جایگاه نمودار فروش)
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-xl shadow">
            <h4 className="text-green-400 font-semibold mb-2">اعلانات اخیر</h4>
            <ul className="space-y-2">
              {notifications.map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <FaCircle className="text-green-400 text-xs" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((item, i) => (
            <div key={i} className="bg-gray-700 p-4 rounded-xl shadow">
              <div className="flex items-center gap-3 mb-2">
                {item.icon}
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.time}</div>
                </div>
              </div>
              <div className="text-green-400 text-sm">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
