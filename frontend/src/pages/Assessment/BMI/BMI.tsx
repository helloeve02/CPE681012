import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calculator,
  Activity,
  Ruler,
  Scale,
  CheckCircle,
  AlertCircle,
  // Target,
  // TrendingUp,
  // BarChart3
} from "lucide-react";

const BMICalculatorFormPage: React.FC = () => {
  const [form, setForm] = useState({
    weight: "",
    height: "",
    waist: "",
    chest: "",
    hip: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "+") {
      e.preventDefault(); // กันไม่ให้พิมพ์เลย
    }
  };

  const handleSubmit = () => {
    navigate("/assessment/bmiresult", { state: form });
  };

  const isFormComplete = () => {
    return form.weight && form.height;
  };

  const getCompletedFields = () => {
    return Object.values(form).filter(value => value !== "").length;
  };

  const renderInput = (name: string, placeholder: string, icon: React.ElementType, unit?: string, required?: boolean) => (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
        {React.createElement(icon, { size: 20 })}
      </div>
      <input
        name={name}
        type="number"
        min={0}
        value={form[name as keyof typeof form]}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full pl-12 pr-16 py-4 rounded-2xl border-2 border-gray-200 bg-white text-lg font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-gray-300"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-bold">
          {unit}
        </span>
      )}
      {required && !form[name as keyof typeof form] && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full"></div>
      )}
    </div>
  );

  const calculateBMI = () => {
    if (form.weight && form.height) {
      const heightInM = parseFloat(form.height) / 100;
      const bmi = parseFloat(form.weight) / (heightInM * heightInM);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: "น้ำหนักน้อย", color: "text-blue-600", bg: "bg-blue-50" };
    if (bmi < 25) return { status: "ปกติ", color: "text-green-600", bg: "bg-green-50" };
    if (bmi < 30) return { status: "น้ำหนักเกิน", color: "text-orange-600", bg: "bg-orange-50" };
    return { status: "อ้วน", color: "text-red-600", bg: "bg-red-50" };
  };

  const bmiValue = calculateBMI();
  const bmiStatus = bmiValue ? getBMIStatus(parseFloat(bmiValue)) : null;
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-kanit">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          {/* Header Navigation */}
          <div className="flex items-center mb-12">
            <button
              onClick={() => window.history.back()}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:scale-105"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="flex-1 text-center text-white font-bold text-2xl tracking-wide">
              คำนวณดัชนีมวลกาย
            </h1>
            <div className="w-16" />
          </div>

          {/* Enhanced Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20 hover:scale-105 transition-transform duration-300">
              <Scale className="text-white" size={40} />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              ประเมินสัดส่วนร่างกาย
            </h2>
            <p className="text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-8">
              วัดและคำนวณดัชนีมวลกายของคุณเพื่อสุขภาพที่ดีขึ้น
            </p>

            {/* Quick Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Target, title: "แม่นยำ", desc: "คำนวณตามมาตรฐาน WHO" },
                { icon: TrendingUp, title: "ติดตาม", desc: "ดูความเปลี่ยนแปลง" },
                { icon: BarChart3, title: "วิเคราะห์", desc: "แนะนำตามสัดส่วน" }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <item.icon className="text-white mx-auto mb-3" size={28} />
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-blue-100 text-sm">{item.desc}</p>
                </div>
              ))}
            </div> */}
          </div>
        </div>

        {/* Enhanced Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        {/* Enhanced Progress Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 mb-10 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">ความคืบหน้าการกรอกข้อมูล</h3>
              <p className="text-gray-600">กรอกข้อมูลร่างกายเพื่อคำนวณ BMI ของคุณ</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {getCompletedFields()}/2
              </div>
              <div className="text-sm text-gray-500">ข้อมูลที่กรอก</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(getCompletedFields() / 5) * 100}%` }}
            ></div>
          </div>

          {/* Live BMI Preview */}
          {bmiValue && (
            <div className={`mt-6 p-4 rounded-xl ${bmiStatus?.bg} border-l-4 border-blue-500`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">BMI ปัจจุบัน</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-800">{bmiValue}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bmiStatus?.color} bg-white/80`}>
                      {bmiStatus?.status}
                    </span>
                  </div>
                </div>
                <Activity className="text-blue-500" size={24} />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Body Measurements Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 hover:scale-105 transition-transform duration-300">
                <Scale className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">ข้อมูลร่างกาย</h3>
                <p className="text-green-100 text-lg">วัดสัดส่วนต่างๆ ของร่างกายอย่างแม่นยำ</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Essential Measurements */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-teal-600 rounded-full"></div>
                  <h4 className="text-xl font-bold text-gray-800">ข้อมูลหลัก (จำเป็น)</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("weight", "น้ำหนักปัจจุบัน", Scale, "กก.", true)}
                  {renderInput("height", "ส่วนสูง", Ruler, "ซม.", true)}
                </div>

                {/* <div className="grid grid-cols-1 gap-6">
                  {renderInput("waist", "รอบเอว (วัดในระดับสะดือ)", Activity, "ซม.", true)}
                </div> */}
              </div>
            </div>

            {/* Measurement Tips */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <span className="text-xl">📏</span>
                เทคนิคการวัดที่แม่นยำ
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>• วัดน้ำหนักตอนเช้าหลังตื่นนอน</div>
                <div>• วัดส่วนสูงโดยไม่ใส่รองเท้า</div>
                <div>• วัดรอบเอวขณะหายใจออกปกติ</div>
                <div>• ใช้เทปวัดที่มีความแม่นยำ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Submit Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              {isFormComplete() ? (
                <CheckCircle className="text-white" size={32} />
              ) : (
                <Calculator className="text-white" size={32} />
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {isFormComplete() ? "พร้อมคำนวณแล้ว!" : "เกือบเสร็จแล้ว"}
            </h3>

            <p className="text-gray-600 mb-8 text-lg">
              {isFormComplete()
                ? "ข้อมูลครบถ้วนแล้ว คลิกเพื่อดูผลลัพธ์ BMI และคำแนะนำ"
                : "กรุณากรอกข้อมูลน้ำหนัก ส่วนสูง และรอบเอวให้ครบถ้วน"
              }
            </p>

            <button
              onClick={handleSubmit}
              disabled={!isFormComplete()}
              className={`w-full max-w-md py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${isFormComplete()
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {isFormComplete() ? (
                <div className="flex items-center justify-center gap-3">
                  <Calculator size={24} />
                  <span>คำนวณ BMI และวิเคราะห์</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <AlertCircle size={24} />
                  <span>กรุณากรอกข้อมูลให้ครบถ้วน</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Info Section */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-3xl p-10 text-white mb-12 shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
              <span className="text-4xl">💪</span>
            </div>
            <h3 className="text-3xl font-bold mb-4">เข้าใจ BMI ของคุณ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-purple-100">ช่วง BMI มาตรฐาน</h4>
                <div className="space-y-2 text-purple-100">
                  <div>• น้อยกว่า 18.5: น้ำหนักน้อย</div>
                  <div>• 18.5 - 24.9: ปกติ</div>
                  <div>• 25.0 - 29.9: น้ำหนักเกิน</div>
                  <div>• 30.0 ขึ้นไป: อ้วน</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-purple-100">ประโยชน์ของการทราบ BMI</h4>
                <div className="space-y-2 text-purple-100">
                  <div>• ประเมินความเสี่ยงต่อโรค</div>
                  <div>• วางแผนการออกกำลังกาย</div>
                  <div>• ติดตามความเปลี่ยนแปลง</div>
                  <div>• ปรับพฤติกรรมสุขภาพ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculatorFormPage;