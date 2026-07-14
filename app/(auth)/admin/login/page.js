'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAuthData } from "@/lib/redux/authSlice";
import { BASE_API_URL, BASE_API_KEY } from "@/lib/api";
import { RiLockLine, RiUserLine, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import Link from "next/link";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.username.trim()) {
      setError("Username wajib diisi!");
      setLoading(false);
      return;
    }
    if (!form.password) {
      setError("Password wajib diisi!");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${BASE_API_URL}/api/auth/login`, form, {
        headers: {
          "P3RT-HMTI-API-KEY": BASE_API_KEY,
          "Content-Type": "application/json",
        },
      });
      dispatch(
        setAuthData({
          email: res.data.data.user?.email || "",
          id: res.data.data.user?.id || "",
          token: res.data.data.access_token,
          username: res.data.data.user?.name || res.data.data.user?.username || "Admin",
          role: res.data.data.user?.role || "sub_admin",
        })
      );
      router.push("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Username atau password salah. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-50 flex items-center justify-center p-4 font-[Poppins]">
      {/* Subtle clean background decorative gradient */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-3xl p-8 shadow-2xl">
          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8">
            <img src="/assets/img/hmti-logo2.png" alt="HMTI Logo" className="h-16 w-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {/* Username */}
            <div className="relative">
              <RiUserLine
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                size={18}
              />
              <input
                id="admin-username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username admin"
                required
                autoComplete="username"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <RiLockLine
                className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                size={18}
              />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                autoComplete="current-password"
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
              </button>
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Back link */}
          <p className="text-center mt-6 text-blue-600 text-xs">
            <Link href="/" className="hover:text-blue-800 underline transition-colors">
              ← Kembali ke website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
