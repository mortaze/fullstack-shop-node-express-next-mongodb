"use client";

import { useEffect } from "react";
import Image from "next/image";
import Head from "next/head";
import {
  FaBars,
  FaStore,
  FaTimes,
  FaHome,
  FaUsers,
  FaUserEdit,
  FaTrashAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

export default function UsersPage() {
  const users = [
    {
      name: "علی محمدی",
      email: "ali@example.com",
      phone: "09121234567",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      role: "ادمین",
    },
    {
      name: "سارا احمدی",
      email: "sara@example.com",
      phone: "09351234567",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      role: "کاربر",
    },
    {
      name: "محمد رضایی",
      email: "mohammad@example.com",
      phone: "09101234567",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      role: "پشتیبان",
    },
  ];

  return (
    <>
      <Head>
        <title>مدیریت کاربران</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="lg:mr-56 transition-all p-6 bg-gray-800 min-h-screen text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">مدیریت کاربران</h2>
            <p className="text-sm text-gray-400 mt-1">
              لیست کاربران فعال سیستم
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((user, index) => (
            <div
              key={index}
              className="bg-gray-700 p-4 rounded-xl shadow flex flex-col items-center text-center"
            >
              <Image
                src={user.avatar}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full border-2 border-green-400 mb-4"
                unoptimized
              />
              <h3 className="font-bold text-lg mb-1">{user.name}</h3>
              <p className="text-sm text-green-400 mb-2">{user.role}</p>
              <div className="text-sm text-gray-300 mb-1 flex items-center gap-2">
                <FaEnvelope className="text-sm" /> {user.email}
              </div>
              <div className="text-sm text-gray-300 flex items-center gap-2">
                <FaPhoneAlt className="text-sm" /> {user.phone}
              </div>
              <div className="flex gap-3 mt-4">
                <button className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded-lg text-white">
                  <FaUserEdit />
                </button>
                <button className="bg-red-500 hover:bg-red-600 p-2 rounded-lg text-white">
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
