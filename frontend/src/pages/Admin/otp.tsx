import React, { useEffect } from "react";
import { Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OtpPage() {
  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [step, setStep] = React.useState(1); // 1 = กรอกอีเมล, 2 = กรอก OTP
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  // ✅ ล้างค่า canResetPassword ทุกครั้งที่เข้าหน้า OtpPage
  useEffect(() => {
    // ใช้ in-memory storage แทน localStorage เพื่อความปลอดภัย
    localStorage.removeItem("canResetPassword");
  }, []);

  const handleSendOtp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) setStep(2);
    } catch (err) {
      setMessage("❌ ไม่สามารถส่ง OTP ได้");
    } finally {
      setIsLoading(false);
    }
  };

const handleVerifyOtp = async () => {
    try {
      const res = await fetch("http://localhost:8000/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("✅ OTP ถูกต้อง กำลังไปหน้ารีเซ็ตรหัสผ่าน...");

        // ✅ เก็บ flag ว่ายืนยัน OTP แล้ว
        localStorage.setItem("canResetPassword", "true");
        localStorage.setItem("resetEmail", email);

        setTimeout(() => {
          navigate("/forgot-pass");
        }, 1500);
      } else {
        alert("❌ OTP ไม่ถูกต้อง");
        setMessage(data.error || "OTP ไม่ถูกต้อง");
      }
    } catch (err) {
      alert("❌ เกิดข้อผิดพลาดในการตรวจสอบ OTP");
      setMessage("❌ OTP ไม่ถูกต้อง");
    }
  };

  const getMessageIcon = () => {
    if (message.includes("✅") || message.includes("🎉")) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (message.includes("❌")) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    } else if (message.includes("📧")) {
      return <Mail className="w-4 h-4 text-blue-500" />;
    }
    return null;
  };

  const getMessageColor = () => {
    if (message.includes("✅") || message.includes("🎉")) {
      return "text-green-600 bg-green-50 border-green-200";
    } else if (message.includes("❌")) {
      return "text-red-600 bg-red-50 border-red-200";
    } else if (message.includes("📧")) {
      return "text-blue-600 bg-blue-50 border-blue-200";
    }
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 font-kanit">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 -right-4 w-72 h-72 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-pink-100 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              รีเซ็ตรหัสผ่าน
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 1 ? "กรอกอีเมลเพื่อรับรหัส OTP" : "กรอกรหัส OTP ที่ส่งไปยังอีเมล"}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <span className="text-sm font-semibold">1</span>
              </div>
              <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                step >= 2 ? 'bg-blue-500' : 'bg-gray-200'
              }`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <span className="text-sm font-semibold">2</span>
              </div>
            </div>
          </div>

          {/* Step 1: Email input */}
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={!email || isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังส่ง OTP...</span>
                  </>
                ) : (
                  <>
                    <span>ส่ง OTP</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: OTP input */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  รหัส OTP
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-center text-lg font-mono tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center">
                  ส่งไปยัง {email}
                </p>
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>กำลังตรวจสอบ...</span>
                  </>
                ) : (
                  <>
                    <span>ยืนยัน OTP</span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                className="w-full text-gray-600 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 text-sm"
              >
                ← กลับไปแก้ไขอีเมล
              </button>
            </div>
          )}

          {/* Message display */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl border flex items-center space-x-2 animate-in fade-in duration-300 ${getMessageColor()}`}>
              {getMessageIcon()}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}