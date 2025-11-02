"use client";

import Link from "next/link";
import {
  FaShoppingCart,
  FaTags,
  FaBoxOpen,
  FaSearch,
  FaArrowLeft,
} from "react-icons/fa";

export default function ShopDashboard() {
  const categories = [
    { id: 1, name: "تلویزیون", icon: <FaBoxOpen /> },
    { id: 2, name: "جاروبرقی", icon: <FaBoxOpen /> },
    { id: 3, name: "یخچال", icon: <FaBoxOpen /> },
    { id: 4, name: "لباس‌شویی", icon: <FaBoxOpen /> },
  ];

  const products = [
    {
      id: 1,
      name: "جاروبرقی ۲۰۰۰ وات",
      price: 2850000,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      name: "تلویزیون ۵۵ اینچ 4K",
      price: 18500000,
      image: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      name: "یخچال دوقلو",
      price: 32000000,
      image: "https://via.placeholder.com/300x200",
    },
  ];

  return (
    <div className="px-6 py-6">
      {/* سرصفحه فروشگاه */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          فروشگاه لوازم خانگی
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          اینجا می‌تونی جدیدترین محصولات رو ببینی، بین دسته‌بندی‌ها بچرخی و خرید
          راحت‌تری داشته باشی.
        </p>
      </div>

      {/* نوار جستجو */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex items-center bg-gray-800 rounded-xl overflow-hidden border">
          <input
            type="text"
            placeholder="جستجوی محصول..."
            className="flex-grow p-3 bg-transparent text-white  focus:outline-none"
          />
          <button className="px-4 text-green-400">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="mb-12">
        <h2 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
          <FaTags />
          دسته‌بندی‌ها
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/dashboard/shop/categories/${cat.id}`}
              className="bg-gray-700 hover:bg-gray-500 p-4 rounded-xl flex flex-col items-center justify-center text-white text-sm shadow-lg "
            >
              <div className="text-2xl mb-2 text-green-400">{cat.icon}</div>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* محصولات اخیر */}
      <div>
        <h2 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
          <FaShoppingCart />
          جدیدترین محصولات
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-800 p-4 rounded-xl shadow-lg text-white border border-green-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg w-full h-48 object-cover mb-4"
              />
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-green-400 font-bold text-sm mb-3">
                {product.price.toLocaleString()} تومان
              </p>
              <Link
                href={`/dashboard/shop/products/${product.id}`}
                className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-xl"
              >
                مشاهده محصول
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* بازگشت */}
      <div className="mt-10 text-center">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-400 hover:text-green-400 gap-2"
        >
          <FaArrowLeft />
          بازگشت به داشبورد
        </Link>
      </div>
    </div>
  );
}
