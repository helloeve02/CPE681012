import React, { useState, useEffect, useMemo } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle, AlertCircle, Sparkles, Star, Heart, Zap, Key } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ResetPassword } from "../../services/https";

export default function PasswordResetForm() {

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');


  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 20);
    return () => clearTimeout(t);
  }, []);

  // สร้างตำแหน่ง particle ครั้งเดียว ไม่สุ่มใหม่ทุก render
  const particles = useMemo(
    () =>
      new Array(15).fill(null).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${i * 0.3}s`,
      })),
    []
  );

  const passwordsMatch = confirmPassword && newPassword === confirmPassword;
  const passwordsDontMatch = confirmPassword && newPassword !== confirmPassword;

const handleReset = async () => {
  if (!passwordsMatch) return;

  setIsLoading(true);
  try {

    const res = await ResetPassword(username, newPassword);

    if (res.status === 200) {
      console.log("Reset success:", res.data);
      navigate("/admin"); // กลับไปหน้า login
      window.location.reload();
    } else {
      console.error("Reset failed:", res.data);
    }
  } catch (err) {
    console.error("Error while resetting password:", err);
  } finally {
    setIsLoading(false);
  }
};


  const navigate= useNavigate();
    

    const isFormValid = username && newPassword && confirmPassword && passwordsMatch;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center p-4 font-kanit relative overflow-hidden">
      {/* Enhanced Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-cyan-300/25 via-sky-200/20 to-blue-300/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tl from-blue-400/30 via-indigo-300/20 to-purple-300/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-1/2 w-72 h-72 bg-gradient-to-tr from-sky-400/25 via-cyan-300/20 to-blue-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2000ms'}} />
        
        {/* Secondary Moving Orbs */}
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-cyan-400/35 to-transparent rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}} />
        <div className="absolute bottom-1/3 left-1/5 w-40 h-40 bg-gradient-to-tl from-blue-500/30 to-transparent rounded-full blur-2xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}} />
        
        {/* Floating Light Streaks */}
        <div className="absolute top-10 left-10 w-2 h-32 bg-gradient-to-b from-cyan-300/50 to-transparent blur-sm animate-pulse" style={{animationDelay: '500ms'}} />
        <div className="absolute top-20 right-16 w-24 h-2 bg-gradient-to-r from-sky-300/50 to-transparent blur-sm animate-pulse" style={{animationDelay: '1500ms'}} />
        <div className="absolute bottom-20 left-20 w-2 h-24 bg-gradient-to-t from-blue-400/50 to-transparent blur-sm animate-pulse" style={{animationDelay: '2500ms'}} />
        
        {/* Additional Large Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-200/20 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '3500ms'}} />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-blue-300/25 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '4000ms'}} />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-100/8 to-transparent animate-pulse" style={{animationDuration: '4s'}} />
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main Particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-gradient-to-br from-cyan-300/70 to-sky-400/50 rounded-full animate-bounce shadow-lg"
            style={{ left: p.left, top: p.top, animationDelay: p.delay }}
          />
        ))}
        
        {/* Large Sparkle Effects */}
        <div className="absolute top-1/6 left-1/3 w-2 h-2 bg-white/90 rounded-full animate-ping" style={{animationDelay: '0s', animationDuration: '2s'}} />
        <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-cyan-200/90 rounded-full animate-ping" style={{animationDelay: '1s', animationDuration: '3s'}} />
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-sky-300/90 rounded-full animate-ping" style={{animationDelay: '2s', animationDuration: '2.5s'}} />
        <div className="absolute top-1/2 right-1/6 w-2 h-2 bg-blue-200/90 rounded-full animate-ping" style={{animationDelay: '3s', animationDuration: '2s'}} />
        
        {/* Medium Sparkles */}
        <div className="absolute top-10 right-10 w-1.5 h-1.5 bg-cyan-400/80 rounded-full animate-ping" style={{animationDelay: '0.5s', animationDuration: '2.5s'}} />
        <div className="absolute bottom-10 left-10 w-1.5 h-1.5 bg-sky-400/80 rounded-full animate-ping" style={{animationDelay: '1.5s', animationDuration: '3s'}} />
        
        {/* Drifting Dots */}
        <div className="absolute top-10 left-1/4 w-2.5 h-2.5 bg-cyan-400/60 rounded-full animate-pulse" style={{animationDuration: '3s'}} />
        <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-sky-500/60 rounded-full animate-pulse" style={{animationDuration: '4s', animationDelay: '1s'}} />
        <div className="absolute top-1/3 left-10 w-1.5 h-1.5 bg-blue-400/70 rounded-full animate-pulse" style={{animationDuration: '2.5s', animationDelay: '2s'}} />
        
        {/* Additional Floating Elements */}
        <div className="absolute top-1/5 right-1/5 w-2 h-2 bg-gradient-to-r from-cyan-300/60 to-blue-400/40 rounded-full animate-bounce" style={{animationDuration: '3.5s'}} />
        <div className="absolute bottom-1/5 left-1/3 w-1.5 h-1.5 bg-gradient-to-r from-sky-400/60 to-indigo-300/40 rounded-full animate-bounce" style={{animationDuration: '4.5s', animationDelay: '1.5s'}} />
      </div>

      {/* Main Container */}
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden transform transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
        
        {/* Left Illustration Side */}
        <div className="flex-1 bg-gradient-to-br from-sky-50/80 via-cyan-50/60 to-blue-50/80 p-12 flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 30px 30px, #0ea5e9 3px, transparent 0)', 
              backgroundSize: '60px 60px' 
            }}></div>
          </div>

          {/* Floating Stars */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${25 + (i * 12)}%`,
                top: `${20 + (i * 10)}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: '5s'
              }}
            >
              <Star className="w-4 h-4 text-sky-300 opacity-60" />
            </div>
          ))}

          <div className="relative z-10">
            {/* Main Lock Illustration */}
            <div className="relative">
              {/* Lock Body */}
              <div className="relative">
                <div className="w-32 h-40 bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 rounded-2xl shadow-xl relative overflow-hidden">
                  {/* Lock Face */}
                  <div className="absolute inset-4 bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-500 rounded-xl shadow-inner">
                    {/* Keyhole */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-sky-100 rounded-full shadow-lg">
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-2 h-4 bg-sky-100 rounded-b-full"></div>
                    </div>
                    
                    {/* Digital Display */}
                    <div className="absolute top-2 left-2 right-2 h-4 bg-black/20 rounded-md flex items-center justify-center">
                      <div className="flex space-x-0.5">
                        <div className="w-1 h-1 bg-cyan-300 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-sky-300 rounded-full animate-pulse delay-200"></div>
                        <div className="w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shine Effects */}
                  <div className="absolute top-3 left-3 w-4 h-8 bg-white/30 rounded-full blur-sm"></div>
                  <div className="absolute bottom-3 right-3 w-3 h-6 bg-white/20 rounded-full blur-sm"></div>
                </div>
                
                {/* Lock Shackle */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 w-12 h-12 border-4 border-sky-400 rounded-t-full bg-transparent shadow-lg"></div>
              </div>

              {/* Floating Email Icon */}
              <div className="absolute -right-12 top-8 group">
                <div className="w-16 h-12 bg-gradient-to-br from-cyan-400 via-sky-400 to-blue-500 rounded-2xl shadow-xl transform rotate-12 hover:rotate-6 transition-transform duration-500 relative overflow-hidden">
                  <div className="absolute inset-2 bg-white/95 rounded-xl flex items-center justify-center shadow-inner">
                    <Mail className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Zap className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Floating Shield Icon */}
              <div className="absolute -left-16 bottom-6 group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-2xl shadow-xl transform -rotate-12 hover:rotate-0 transition-transform duration-500 relative overflow-hidden">
                  <div className="absolute inset-2 bg-white/95 rounded-xl flex items-center justify-center shadow-inner">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              {/* Heart Icon */}
              <div className="absolute -top-8 -left-10 group">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-red-400 to-rose-500 rounded-xl shadow-lg transform rotate-45 hover:rotate-12 transition-transform duration-500 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white transform -rotate-45" />
                </div>
              </div>

              {/* Floating Sparkles */}
              <div className="absolute -top-10 -left-12 text-sky-300 animate-pulse">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-6 -right-8 text-cyan-300 animate-pulse delay-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="absolute top-20 -left-12 text-blue-300 animate-pulse delay-1000">
                <Sparkles className="w-4 h-4" />
              </div>

              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin" style={{animationDuration: '12s'}}>
                <div className="w-3 h-3 bg-sky-400 rounded-full absolute -top-4 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full absolute top-1/2 -right-6 transform -translate-y-1/2 shadow-lg"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full absolute -bottom-4 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                <div className="w-2.5 h-2.5 bg-sky-400 rounded-full absolute top-1/2 -left-6 transform -translate-y-1/2 shadow-lg"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="flex-1 p-8">
          <div className="max-w-sm mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white rounded-xl py-2 px-4 text-sm font-bold mb-6 shadow-lg">
                <Shield className="w-4 h-4 animate-pulse" />
                <span>PASSWORD RESET</span>
                <Sparkles className="w-4 h-4 animate-pulse delay-500" />
              </div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent mb-3">
                รีเซ็ตรหัสผ่าน
              </h2>
              <p className="text-gray-600 font-semibold text-sm">กรอกข้อมูลเพื่อตั้งรหัสผ่านใหม่</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Email Field */}
              <div className="group">
        <label className="block text-gray-700 font-bold mb-3 text-sm flex items-center space-x-2">
          <Mail className="w-4 h-4 text-sky-600" />
          <span>ชื่อผู้ใช้</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white/80 backdrop-blur border-2 border-sky-200 rounded-xl py-3 px-4 pr-12 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 hover:border-sky-300 hover:shadow-lg group-hover:shadow-lg text-sm font-medium shadow-md"
            placeholder="กรอกชื่อผู้ใช้"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg shadow-md">
            <Mail className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

              {/* New Password Field */}
              <div className="group">
                <label className="block text-gray-700 font-bold mb-3 text-sm flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-sky-600" />
                  <span>รหัสผ่านใหม่</span>
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/80 backdrop-blur border-2 border-sky-200 rounded-xl py-3 px-4 pr-16 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:bg-white transition-all duration-300 hover:border-sky-300 hover:shadow-lg group-hover:shadow-lg text-sm font-medium shadow-md"
                    placeholder="กรอกรหัสผ่านใหม่"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-600 transition-colors p-1 hover:bg-sky-50 rounded-md"
                  >
                    {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-gradient-to-r from-sky-500 to-cyan-500 rounded-lg shadow-md">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label className="block text-gray-700 font-bold mb-3 text-sm flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-sky-600" />
                  <span>ยืนยันรหัสผ่าน</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-white/80 backdrop-blur border-2 rounded-xl py-3 px-4 pr-16 text-gray-800 placeholder-gray-400 focus:outline-none transition-all duration-300 hover:shadow-lg group-hover:shadow-lg text-sm font-medium shadow-md ${
                      passwordsDontMatch
                        ? 'border-red-400 focus:border-red-500 focus:bg-red-50/80'
                        : passwordsMatch
                        ? 'border-green-400 focus:border-green-500 focus:bg-green-50/80'
                        : 'border-sky-200 focus:border-sky-500 focus:bg-white hover:border-sky-300'
                    }`}
                    placeholder="ยืนยันรหัสผ่าน"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-sky-600 transition-colors p-1 hover:bg-sky-50 rounded-md"
                  >
                    {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg shadow-md ${
                    passwordsDontMatch
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : passwordsMatch
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-sky-500 to-cyan-500'
                  }`}>
                    {passwordsDontMatch ? (
                      <AlertCircle className="w-4 h-4 text-white" />
                    ) : passwordsMatch ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Lock className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
                {passwordsDontMatch && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>รหัสผ่านไม่ตรงกัน</span>
                  </p>
                )}
                {passwordsMatch && (
                  <p className="text-green-500 text-sm mt-2 flex items-center space-x-1 font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>รหัสผ่านตรงกัน</span>
                  </p>
                )}
              </div>

              {/* Reset Button */}
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  disabled={!isFormValid || isLoading}
                  className="group relative w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold text-base hover:shadow-xl hover:shadow-sky-500/25 transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed overflow-hidden"
                >
                  {/* Button Background Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Button Content */}
                  <div className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>กำลังรีเซ็ต...</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span>รีเซ็ตรหัสผ่าน</span>
                        <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </div>

                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 -top-full group-hover:top-full bg-gradient-to-b from-transparent via-white/20 to-transparent transition-all duration-1000 skew-y-12"></div>
                </button>
              </div>
            </div>

            {/* Back to Login */}
            <div className="text-center mt-6 pt-6 border-t border-sky-100">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="group inline-flex items-center space-x-2 text-gray-600 hover:text-sky-600 transition-colors font-bold text-sm"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>กลับสู่หน้าเข้าสู่ระบบ</span>
              </button>
              <div className="flex justify-center mt-4 space-x-1.5">
                <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce shadow-md"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce shadow-md" style={{animationDelay: '100ms'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce shadow-md" style={{animationDelay: '200ms'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


