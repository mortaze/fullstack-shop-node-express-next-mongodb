"use client";

import { useState } from "react";

const reportsData = [
  {
    id: 1,
    title: "گزارش فروش ماهانه",
    date: "1403/06/01",
    status: "تکمیل شده",
  },
  {
    id: 2,
    title: "گزارش کاربران فعال",
    date: "1403/06/05",
    status: "در حال پردازش",
  },
  {
    id: 3,
    title: "گزارش سفارشات برگشتی",
    date: "1403/06/10",
    status: "منتظر تایید",
  },
  {
    id: 4,
    title: "گزارش موجودی انبار",
    date: "1403/06/12",
    status: "تکمیل شده",
  },
];

export default function Reports() {
  const [reports] = useState(reportsData);

  return (
    <div className="p-4 bg-gray-800 rounded-xl shadow text-white min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-6">گزارشات</h2>

      {/* نمایش جدول در دسکتاپ و کارت‌ها در موبایل */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right table-auto border-collapse">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-3 px-4 text-gray-400">عنوان گزارش</th>
              <th className="py-3 px-4 text-gray-400">تاریخ</th>
              <th className="py-3 px-4 text-gray-400">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td className="py-3 px-4">{report.title}</td>
                <td className="py-3 px-4">{report.date}</td>
                <td
                  className={`py-3 px-4 font-semibold ${
                    report.status === "تکمیل شده"
                      ? "text-green-400"
                      : report.status === "در حال پردازش"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {report.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* کارت‌ها در موبایل */}
      <div className="md:hidden space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-gray-700 p-4 rounded-xl shadow flex flex-col"
          >
            <div className="font-semibold text-lg mb-2">{report.title}</div>
            <div className="text-sm text-gray-400 mb-1">
              تاریخ: {report.date}
            </div>
            <div
              className={`font-semibold ${
                report.status === "تکمیل شده"
                  ? "text-green-400"
                  : report.status === "در حال پردازش"
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              وضعیت: {report.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
