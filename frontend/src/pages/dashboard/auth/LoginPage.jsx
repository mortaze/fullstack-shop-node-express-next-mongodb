"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        document.cookie = `token=${data.token}; path=/; max-age=7200`;
        router.push("/dashboard");
      } else {
        setError(data.error || "نام کاربری یا رمز عبور اشتباه است");
      }
    } catch (err) {
      setError("ارتباط با سرور برقرار نشد");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          ورود به پنل مدیریت
        </h2>

        {error && (
          <div className="text-red-400 mb-4 text-sm text-center">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <InputField
            id="username"
            label="نام کاربری"
            type="text"
            value={username}
            onChange={setUsername}
            placeholder="نام کاربری خود را وارد کنید"
          />
          <InputField
            id="password"
            label="رمز عبور"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="رمز عبور خود را وارد کنید"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition-colors text-white py-2 rounded-xl font-semibold"
          >
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}

function InputField({ id, label, type, value, onChange, placeholder }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );
}
