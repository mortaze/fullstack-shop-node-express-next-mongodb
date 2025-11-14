"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "../../../../layout";
import {
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
} from "../../../../../../redux/features/order/orderApi";
import Link from "next/link";
import { FaTrash, FaSave, FaFileCsv } from "react-icons/fa";

export default function EditOrderPage() {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: orderResponse,
    isLoading,
    isError,
    refetch,
  } = useGetOrderByIdQuery(id, { skip: !id });

  const order = orderResponse?.data || orderResponse;

  const [updateOrder] = useUpdateOrderMutation();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  // local form state for editable fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
    paymentMethod: "",
    shippingOption: "",
    totalAmount: 0,
    shippingCost: 0,
    status: "",
    invoice: "",
    notes: "",
  });

  useEffect(() => {
    if (order) {
      setForm((f) => ({
        ...f,
        name: order.name || "",
        email: order.email || "",
        contact: order.contact || "",
        address: order.address || "",
        city: order.city || "",
        country: order.country || "",
        zipCode: order.zipCode || "",
        paymentMethod: order.paymentMethod || "",
        shippingOption: order.shippingOption || "",
        totalAmount: order.totalAmount || 0,
        shippingCost: order.shippingCost || 0,
        status: order.status || "",
        invoice: order.invoice || "",
        notes: order.notes || "",
      }));
    }
  }, [order]);

  if (!id) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">در حال بارگذاری سفارش...</div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="p-6 text-red-400">خطا در دریافت سفارش. دوباره تلاش کنید.</div>
      </DashboardLayout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateOrder({ id, data: form }).unwrap();
      alert("تغییرات با موفقیت ذخیره شد.");
      refetch();
    } catch (err) {
      console.error(err);
      alert("خطا در ذخیره‌سازی");
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setForm((p) => ({ ...p, status: newStatus }));
    try {
      await updateOrderStatus({ id, status: newStatus }).unwrap();
      alert("وضعیت با موفقیت تغییر کرد");
      refetch();
    } catch (err) {
      console.error(err);
      alert("خطا در تغییر وضعیت");
    }
  };

  const handleDelete = async () => {
    const ok = confirm("آیا از حذف این سفارش مطمئن هستید؟ این کار قابل بازگشت نیست.");
    if (!ok) return;
    try {
      await deleteOrder(id).unwrap();
      alert("سفارش حذف شد.");
      router.push("/dashboard/shop/orders");
    } catch (err) {
      console.error(err);
      alert("خطا در حذف سفارش");
    }
  };

  const exportCSV = () => {
    const rows = [];
    // header
    rows.push([
      "invoice",
      "name",
      "email",
      "contact",
      "city",
      "totalAmount",
      "status",
    ]);

    rows.push([
      order.invoice,
      order.name,
      order.email,
      order.contact,
      order.city,
      order.totalAmount,
      order.status,
    ]);

    const csvContent = rows.map((r) => r.map((c) => `"${c ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${order.invoice || order._id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">ویرایش سفارش #{order.invoice}</h1>
          <div className="flex gap-3">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700 text-white rounded"
            >
              <FaFileCsv />
              Export CSV
            </button>

            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded"
            >
              <FaTrash /> حذف
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left: order items */}
          <div className="col-span-2 bg-gray-800 text-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">محصولات سفارش</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-300">
                  <th className="p-2">محصول</th>
                  <th className="p-2">قیمت</th>
                  <th className="p-2">تعداد</th>
                  <th className="p-2">جمع</th>
                </tr>
              </thead>
              <tbody>
                {order.cart?.map((item) => (
                  <tr key={item._id} className="border-t border-gray-700">
                    <td className="p-2 flex items-center gap-3">
                      <img src={item.img} alt={item.title} className="w-14 h-14 object-cover rounded" />
                      <div>
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-xs text-gray-400">SKU: {item.sku}</div>
                      </div>
                    </td>
                    <td className="p-2">${item.price}</td>
                    <td className="p-2">{item.orderQuantity || item.quantity}</td>
                    <td className="p-2">${(item.price * (item.orderQuantity || item.quantity)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">زیرمجموعه</div>
                <div className="font-semibold">${order.subTotal}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400">هزینه ارسال</div>
                <div className="font-semibold">${order.shippingCost}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400">جمع کل</div>
                <div className="text-2xl font-bold">${order.totalAmount}</div>
              </div>
            </div>
          </div>

          {/* right: editable details */}
          <div className="bg-gray-800 text-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-3">اطلاعات سفارش</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-300">نام مشتری</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
              </div>

              <div>
                <label className="block text-sm text-gray-300">ایمیل</label>
                <input name="email" value={form.email} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
              </div>

              <div>
                <label className="block text-sm text-gray-300">موبایل</label>
                <input name="contact" value={form.contact} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
              </div>

              <div>
                <label className="block text-sm text-gray-300">آدرس</label>
                <input name="address" value={form.address} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-300">شهر</label>
                  <input name="city" value={form.city} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">کشور</label>
                  <input name="country" value={form.country} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm text-gray-300">کد پستی</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">روش پرداخت</label>
                  <input name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300">گزینه ارسال</label>
                <input name="shippingOption" value={form.shippingOption} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" />
              </div>

              <div>
                <label className="block text-sm text-gray-300">یادداشت مدیر</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700" rows={4} />
              </div>

              <div>
                <label className="block text-sm text-gray-300">وضعیت</label>
                <select name="status" value={form.status} onChange={handleStatusChange} className="w-full mt-1 p-2 rounded bg-gray-900 text-white border border-gray-700">
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-green-600 rounded text-white">
                  <FaSave /> ذخیره تغییرات
                </button>

                <Link href="/dashboard/shop/orders" className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 rounded text-white">
                  بازگشت به لیست
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* activity / history */}
        <div className="mt-6 bg-gray-800 text-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">تاریخچه وضعیت و فعالیت‌ها</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>زمان ایجاد: {new Date(order.createdAt).toLocaleString()}</li>
            <li>آخرین بروزرسانی: {new Date(order.updatedAt).toLocaleString()}</li>
            <li>فاکتور: {order.invoice}</li>
            <li>روش پرداخت: {order.paymentMethod}</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
