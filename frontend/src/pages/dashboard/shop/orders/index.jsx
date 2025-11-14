"use client";

import DashboardLayout from "../../layout";
import Link from "next/link";
import { useGetAllOrdersQuery } from "../../../../redux/features/order/orderApi";

export default function AdminOrdersPage() {
  const { data: orders = [], isLoading } = useGetAllOrdersQuery();

  if (isLoading) return <p>Loading orders...</p>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">لیست سفارش‌ها</h1>

      <table className="w-full border-collapse bg-gray-800 text-white shadow">
        <thead>
          <tr className="bg-gray-700 text-left border">
            <th className="p-3">سفارش ID</th>
            <th className="p-3">نام مشتری</th>
            <th className="p-3">هزینه</th>
            <th className="p-3">شهر</th>
            <th className="p-3">روش پرداخت</th>
            <th className="p-3">وضعیت</th>
            <th className="p-3">عملیات</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-t hover:bg-gray-700">
              <td className="p-3">{order.invoice}</td>
              <td className="p-3">{order.name}</td>
              <td className="p-3 font-semibold">{order.totalAmount} $</td>
              <td className="p-3">{order.city}</td>
              <td className="p-3">{order.paymentMethod}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-black font-bold ${
                    order.status === "Pending"
                      ? "bg-yellow-400"
                      : order.status === "Processing"
                      ? "bg-blue-400"
                      : order.status === "Completed"
                      ? "bg-green-400"
                      : "bg-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="p-3">
                <Link
                  href={`/dashboard/shop/orders/${order._id}/edit`}
                  className="text-blue-300 hover:underline"
                >
                  ویرایش
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}
