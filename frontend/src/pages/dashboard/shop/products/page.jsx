"use client";

import Head from "next/head";
import Link from "next/link";
import {
  FaBox,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import { useState, useEffect } from "react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-white p-8">در حال بارگذاری محصولات...</p>;
  }

  return (
    <>
      <Head>
        <title>مدیریت محصولات</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="pt-4">
        <div className="flex justify-end mb-6">
          <Link
            href="products/create"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow"
          >
            <FaPlus />
            ایجاد محصول جدید
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-white">لیست محصولات</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.length === 0 && (
            <p className="text-white">محصولی یافت نشد.</p>
          )}

          {products.map((product) => (
            <div
              key={product.id}
              className="relative bg-gray-700 p-4 rounded-xl shadow flex flex-col justify-between"
            >
              <Link
                href={`/products/edit/${product.id}`}
                className="absolute top-3 left-3 p-1 text-gray-300 hover:text-green-400 hover:bg-gray-600 rounded"
                title="ویرایش محصول"
              >
                <FaEdit />
              </Link>

              <div>
                <h3 className="text-lg font-semibold mb-1 text-white">
                  {product.title}
                </h3>
                <p className="text-green-400 font-bold text-xl">
                  {product.price.toLocaleString()} تومان
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {product.description}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-300">
                <span>موجودی: {product.stock}</span>
                <span className="flex items-center gap-1">
                  {product.stock > 0 ? (
                    <>
                      <FaCheckCircle className="text-green-400" />
                      <span className="text-green-400">فعال</span>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-red-500" />
                      <span className="text-red-500">غیرفعال</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
