import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calculator, 
  Heart, 
  Activity, 
  Ruler, 
  Scale, 
  Droplets,
  User,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const BMICalculatorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    smoking: "",
    drinking: "",
    weight: "",
    height: "",
    waist: "",
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    bloodSugarAfter: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRadio = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    navigate("/assessment/bmiresult", { state: form });
  };

  const getStepCompletion = (step: number) => {
    switch (step) {
      case 1:
        return form.smoking && form.drinking;
      case 2:
        return form.weight && form.height && form.waist;
      case 3:
        return form.systolic && form.diastolic;
      case 4:
        return form.bloodSugar && form.bloodSugarAfter;
      default:
        return false;
    }
  };

  const isFormComplete = () => {
    return Object.values(form).every(value => value !== "");
  };

  const renderRadioGroup = (name: string, label: string, options: {value: string, label: string}[]) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
      <div className="flex gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex-1 relative cursor-pointer rounded-lg border-2 p-3 text-center transition-all duration-200 ${
              form[name as keyof typeof form] === option.value
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={form[name as keyof typeof form] === option.value}
              onChange={() => handleRadio(name, option.value)}
              className="sr-only"
            />
            <span className="text-sm font-medium">{option.label}</span>
            {form[name as keyof typeof form] === option.value && (
              <CheckCircle className="absolute -top-2 -right-2 text-blue-500 bg-white rounded-full" size={18} />
            )}
          </label>
        ))}
      </div>
    </div>
  );

  const renderInput = (name: string, placeholder: string, icon: React.ElementType, unit?: string) => (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {React.createElement(icon, { size: 18 })}
      </div>
      <input
        name={name}
        type="number"
        value={form[name as keyof typeof form]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      {unit && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
          {unit}
        </span>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Header Navigation */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="flex-1 text-center text-white font-bold text-xl tracking-wide">
              คำนวณดัชนีมวลกาย
            </h1>
            <div className="w-12" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
              <Calculator className="text-white" size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              ประเมินสุขภาพ
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              กรอกข้อมูลเพื่อคำนวณดัชนีมวลกายและประเมินความเสี่ยงด้านสุขภาพ
            </p>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">ความคืบหน้า</h3>
            <span className="text-sm text-gray-600">
              {Object.values(form).filter(v => v !== "").length} / {Object.keys(form).length} ข้อมูล
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  getStepCompletion(i + 1)
                    ? "bg-green-500"
                    : currentStep > i + 1
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Form */}
        <div className="space-y-8 mb-12">
          {/* Step 1: Lifestyle */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">พฤติกรรมสุขภาพ</h3>
                  <p className="text-purple-100 text-sm">ข้อมูลพื้นฐานเกี่ยวกับไลฟ์สไตล์</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {renderRadioGroup(
                "smoking",
                "คุณสูบบุหรี่หรือไม่?",
                [
                  { value: "yes", label: "สูบ" },
                  { value: "no", label: "ไม่สูบ" }
                ]
              )}
              {renderRadioGroup(
                "drinking",
                "คุณดื่มสุราหรือไม่?",
                [
                  { value: "yes", label: "ดื่ม" },
                  { value: "no", label: "ไม่ดื่ม" }
                ]
              )}
            </div>
          </div>

          {/* Step 2: Body Measurements */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Scale className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">ข้อมูลร่างกาย</h3>
                  <p className="text-green-100 text-sm">น้ำหนัก ส่วนสูง และรอบเอว</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {renderInput("weight", "น้ำหนัก", Scale, "กก.")}
              {renderInput("height", "ส่วนสูง", Ruler, "ซม.")}
              {renderInput("waist", "รอบเอว (วัดในระดับสะดือ)", Activity, "ซม.")}
            </div>
          </div>

          {/* Step 3: Blood Pressure */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">ความดันโลหิต</h3>
                  <p className="text-red-100 text-sm">ค่าความดันตัวบนและตัวล่าง</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput("systolic", "ค่าความดันตัวบน", Heart, "mmHg")}
                {renderInput("diastolic", "ค่าความดันตัวล่าง", Heart, "mmHg")}
              </div>
            </div>
          </div>

          {/* Step 4: Blood Sugar */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Droplets className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">ระดับน้ำตาลในเลือด</h3>
                  <p className="text-orange-100 text-sm">ค่าน้ำตาลก่อนและหลังอาหาร</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInput("bloodSugar", "น้ำตาลขณะอดอาหาร", Droplets, "mg/dL")}
                {renderInput("bloodSugarAfter", "น้ำตาลหลังอาหาร 2 ชม.", Droplets, "mg/dL")}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">พร้อมคำนวณแล้ว?</h3>
              <p className="text-gray-600 text-sm">ตรวจสอบข้อมูลและคลิกเพื่อดูผลลัพธ์</p>
            </div>
            {isFormComplete() ? (
              <CheckCircle className="text-green-500" size={24} />
            ) : (
              <AlertCircle className="text-orange-500" size={24} />
            )}
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete()}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isFormComplete()
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isFormComplete() ? (
              <div className="flex items-center justify-center gap-2">
                <Calculator size={20} />
                <span>คำนวณดัชนีมวลกาย</span>
              </div>
            ) : (
              "กรุณากรอกข้อมูลให้ครบถ้วน"
            )}
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">เคล็ดลับ</h3>
            <p className="text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              ควรวัดน้ำหนักและส่วนสูงในตอนเช้าหลังตื่นนอน และวัดรอบเอวในขณะหายใจออกปกติ 
              เพื่อความแม่นยำของผลลัพธ์
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculatorFormPage;