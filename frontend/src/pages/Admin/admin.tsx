// src/pages/Admin/AdminLoginForm.tsx
import React, { useEffect, useMemo, useState } from "react";
import { User, Lock, Key, Eye, EyeOff, Shield, Sparkles, Zap } from "lucide-react";
import type { SignInInterface } from "../../interfaces/SignIn";
import { SignIn } from "../../services/https";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function AdminLoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // trigger entrance animation
    const t = setTimeout(() => setIsLoaded(true), 20);
    return () => clearTimeout(t);
  }, []);

  // สร้างตำแหน่ง particle ครั้งเดียว ไม่สุ่มใหม่ทุก render (ลดจำนวน particles)
  const particles = useMemo(
    () =>
      new Array(12).fill(null).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${i * 0.4}s`,
      })),
    []
  );

  const onFinish = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    const values: SignInInterface = { UserName: username, Password: password };

    try {
      const res = await SignIn(values);
      // ให้พฤติกรรมเหมือนเดิม
      if (res?.status === 200 || res?.status === 204) {
        localStorage.setItem("isLogin", "true");
        message.success("Sign-in successful");
        setTimeout(() => navigate("/admin-home"), 1500);
      } else {
        message.error(res?.data?.error || "An error occurred during sign-in");
      }
    } catch (err) {
      message.error("Unable to connect to the server");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-pass");
  };

  const canSubmit = username.trim().length > 0 && password.trim().length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4 font-kanit relative overflow-hidden">
      {/* Enhanced Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Glows - เพิ่มขนาด */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-300/25 via-sky-200/20 to-blue-300/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-400/30 via-indigo-300/20 to-purple-300/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-gradient-to-tr from-sky-400/25 via-cyan-300/20 to-blue-400/15 rounded-full blur-3xl animate-pulse [animation-delay:2000ms]" />
        
        {/* Secondary Moving Orbs - เพิ่มขนาด */}
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-cyan-400/35 to-transparent rounded-full blur-2xl animate-bounce [animation-duration:3s]" />
        <div className="absolute bottom-1/3 left-1/5 w-40 h-40 bg-gradient-to-tl from-blue-500/30 to-transparent rounded-full blur-2xl animate-bounce [animation-duration:4s] [animation-delay:1s]" />
        
        {/* Floating Light Streaks - เพิ่มขนาด */}
        <div className="absolute top-10 left-10 w-2 h-32 bg-gradient-to-b from-cyan-300/50 to-transparent blur-sm animate-pulse [animation-delay:500ms]" />
        <div className="absolute top-20 right-16 w-24 h-2 bg-gradient-to-r from-sky-300/50 to-transparent blur-sm animate-pulse [animation-delay:1500ms]" />
        <div className="absolute bottom-20 left-20 w-2 h-24 bg-gradient-to-t from-blue-400/50 to-transparent blur-sm animate-pulse [animation-delay:2500ms]" />
        
        {/* Additional Large Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-200/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse [animation-delay:3500ms]" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-blue-300/25 via-transparent to-transparent rounded-full blur-3xl animate-pulse [animation-delay:4000ms]" />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-100/8 to-transparent animate-pulse [animation-duration:4s]" />
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main Particles - เพิ่มขนาด */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-br from-cyan-300/70 to-sky-400/50 rounded-full animate-bounce shadow-lg"
            style={{ left: p.left, top: p.top, animationDelay: p.delay as string }}
          />
        ))}
        
        {/* Large Sparkle Effects - เพิ่มขนาด */}
        <div className="absolute top-1/6 left-1/3 w-2 h-2 bg-white/90 rounded-full animate-ping [animation-delay:0s] [animation-duration:2s]" />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-cyan-200/90 rounded-full animate-ping [animation-delay:1s] [animation-duration:3s]" />
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-sky-300/90 rounded-full animate-ping [animation-delay:2s] [animation-duration:2.5s]" />
        <div className="absolute top-1/2 right-1/6 w-2 h-2 bg-blue-200/90 rounded-full animate-ping [animation-delay:3s] [animation-duration:2s]" />
        
        {/* Medium Sparkles */}
        <div className="absolute top-10 right-10 w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-ping [animation-delay:0.5s] [animation-duration:2.5s]" />
        <div className="absolute bottom-10 left-10 w-1.5 h-1.5 bg-sky-400/80 rounded-full animate-ping [animation-delay:1.5s] [animation-duration:3s]" />
        
        {/* Drifting Dots - เพิ่มขนาด */}
        <div className="absolute top-10 left-1/4 w-2.5 h-2.5 bg-cyan-400/60 rounded-full animate-pulse [animation-duration:3s]" />
        <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-sky-500/60 rounded-full animate-pulse [animation-duration:4s] [animation-delay:1s]" />
        <div className="absolute top-1/3 left-10 w-1.5 h-1.5 bg-blue-400/70 rounded-full animate-pulse [animation-duration:2.5s] [animation-delay:2s]" />
        
        {/* Additional Floating Elements */}
        <div className="absolute top-1/5 right-1/5 w-2 h-2 bg-gradient-to-r from-cyan-300/60 to-blue-400/40 rounded-full animate-bounce [animation-duration:3.5s]" />
        <div className="absolute bottom-1/5 left-1/3 w-1.5 h-1.5 bg-gradient-to-r from-sky-400/60 to-indigo-300/40 rounded-full animate-bounce [animation-duration:4.5s] [animation-delay:1.5s]" />
      </div>

      {/* Main Card - ปรับขนาด */}
      <div
        className={`relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-700 ${
          isLoaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"
        }`}
      >
        {/* Decorative Top Badge - ลดขนาด */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="px-6 pt-10 pb-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full py-1.5 px-4 text-xs font-medium mb-4 shadow-lg">
              <Sparkles className="w-3 h-3" />
              <span>ADMIN LOGIN</span>
              <Sparkles className="w-3 h-3" />
            </div>

            <div className="relative mb-4 flex justify-center">
              <div className="relative w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" strokeWidth={2} />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-cyan-400 to-sky-500 rounded-full flex items-center justify-center shadow-md">
                  <Key className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                </div>
                <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-600 rounded-xl opacity-20 animate-ping" />
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-800 mb-1">ยินดีต้อนรับ</h1>
            <p className="text-gray-600 text-xs">เข้าสู่ระบบจัดการสำหรับผู้ดูแลระบบ</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={onFinish}>
            {/* Username */}
            <div className="space-y-1.5">
              <label className="flex items-center space-x-2 text-gray-700 font-medium text-xs">
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span>ชื่อผู้ใช้</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="กรอกชื่อผู้ใช้"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg py-2.5 px-3 pr-10 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all duration-300 hover:border-gray-300"
                  autoComplete="username"
                  disabled={isLoading}
                  required
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-md">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="flex items-center space-x-2 text-gray-700 font-medium text-xs">
                <Lock className="w-3.5 h-3.5 text-cyan-500" />
                <span>รหัสผ่าน</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="กรอกรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg py-2.5 px-3 pr-16 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all duration-300 hover:border-gray-300"
                  autoComplete="current-password"
                  disabled={isLoading}
                  required
                />
                {/* Eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-500 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                {/* Lock icon */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-md">
                  <Lock className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={navigateToForgotPassword}
                className="text-cyan-500 text-xs hover:text-blue-600 font-medium transition-colors flex items-center space-x-1 hover:underline"
                disabled={isLoading}
              >
                <span>ลืมรหัสผ่าน?</span>
                <Zap className="w-3 h-3" />
              </button>
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={!canSubmit}
                className="relative w-full bg-gradient-to-r from-sky-400 to-blue-600 text-white py-3 rounded-lg font-medium text-base hover:from-sky-500 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-70 disabled:transform-none overflow-hidden group"
              >
                <div className="absolute inset-0 -top-full group-hover:top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-1000 skew-y-12" />
                <div className="relative flex items-center justify-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>กำลังเข้าสู่ระบบ...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>เข้าสู่ระบบ</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-500 text-xs mb-3">ระบบจัดการสำหรับผู้ดูแลระบบเท่านั้น</p>
            <div className="flex justify-center space-x-1.5">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-bounce [animation-delay:100ms]" />
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:200ms]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}