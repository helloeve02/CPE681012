// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   ArrowLeft, 
//   Calculator, 
//   Heart, 
//   Activity, 
//   Ruler, 
//   Scale, 
//   Droplets,
//   User,
//   CheckCircle,
//   AlertCircle
// } from "lucide-react";

// const BMICalculatorFormPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     smoking: "",
//     drinking: "",
//     weight: "",
//     height: "",
//     waist: "",
//     systolic: "",
//     diastolic: "",
//     bloodSugar: "",
//     bloodSugarAfter: "",
//   });

//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 4;

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleRadio = (name: string, value: string) => {
//     setForm({ ...form, [name]: value });
//   };

//   const handleSubmit = () => {
//     navigate("/assessment/bmiresult", { state: form });
//   };

//   const getStepCompletion = (step: number) => {
//     switch (step) {
//       case 1:
//         return form.smoking && form.drinking;
//       case 2:
//         return form.weight && form.height && form.waist;
//       case 3:
//         return form.systolic && form.diastolic;
//       case 4:
//         return form.bloodSugar && form.bloodSugarAfter;
//       default:
//         return false;
//     }
//   };

//   const isFormComplete = () => {
//     return Object.values(form).every(value => value !== "");
//   };

//   const renderRadioGroup = (name: string, label: string, options: {value: string, label: string}[]) => (
//     <div className="bg-white rounded-xl border border-gray-200 p-4">
//       <label className="block text-sm font-semibold text-gray-700 mb-3">{label}</label>
//       <div className="flex gap-3">
//         {options.map((option) => (
//           <label
//             key={option.value}
//             className={`flex-1 relative cursor-pointer rounded-lg border-2 p-3 text-center transition-all duration-200 ${
//               form[name as keyof typeof form] === option.value
//                 ? "border-blue-500 bg-blue-50 text-blue-700"
//                 : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
//             }`}
//           >
//             <input
//               type="radio"
//               name={name}
//               value={option.value}
//               checked={form[name as keyof typeof form] === option.value}
//               onChange={() => handleRadio(name, option.value)}
//               className="sr-only"
//             />
//             <span className="text-sm font-medium">{option.label}</span>
//             {form[name as keyof typeof form] === option.value && (
//               <CheckCircle className="absolute -top-2 -right-2 text-blue-500 bg-white rounded-full" size={18} />
//             )}
//           </label>
//         ))}
//       </div>
//     </div>
//   );

//   const renderInput = (name: string, placeholder: string, icon: React.ElementType, unit?: string) => (
//     <div className="relative">
//       <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
//         {React.createElement(icon, { size: 18 })}
//       </div>
//       <input
//         name={name}
//         type="number"
//         value={form[name as keyof typeof form]}
//         onChange={handleChange}
//         placeholder={placeholder}
//         className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//       />
//       {unit && (
//         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
//           {unit}
//         </span>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
//         <div className="absolute inset-0 bg-black/20"></div>
//         <div className="relative max-w-7xl mx-auto px-6 py-12">
//           {/* Header Navigation */}
//           <div className="flex items-center mb-8">
//             <button
//               onClick={() => navigate(-1)}
//               className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
//             >
//               <ArrowLeft size={22} />
//             </button>
//             <h1 className="flex-1 text-center text-white font-bold text-xl tracking-wide">
//               คำนวณดัชนีมวลกาย
//             </h1>
//             <div className="w-12" />
//           </div>

//           {/* Hero Content */}
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
//               <Calculator className="text-white" size={32} />
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
//               ประเมินสุขภาพ
//             </h2>
//             <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
//               กรอกข้อมูลเพื่อคำนวณดัชนีมวลกายและประเมินความเสี่ยงด้านสุขภาพ
//             </p>
//           </div>
//         </div>

//         {/* Wave Bottom */}
//         <div className="absolute bottom-0 left-0 right-0">
//           <svg className="w-full h-12 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
//             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
//           </svg>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
//         {/* Progress Bar */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-bold text-gray-800">ความคืบหน้า</h3>
//             <span className="text-sm text-gray-600">
//               {Object.values(form).filter(v => v !== "").length} / {Object.keys(form).length} ข้อมูล
//             </span>
//           </div>
//           <div className="flex gap-2">
//             {Array.from({ length: totalSteps }, (_, i) => (
//               <div
//                 key={i}
//                 className={`flex-1 h-2 rounded-full transition-all duration-300 ${
//                   getStepCompletion(i + 1)
//                     ? "bg-green-500"
//                     : currentStep > i + 1
//                     ? "bg-blue-500"
//                     : "bg-gray-200"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Main Form */}
//         <div className="space-y-8 mb-12">
//           {/* Step 1: Lifestyle */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
//                   <User className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-white mb-1">พฤติกรรมสุขภาพ</h3>
//                   <p className="text-purple-100 text-sm">ข้อมูลพื้นฐานเกี่ยวกับไลฟ์สไตล์</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 space-y-4">
//               {renderRadioGroup(
//                 "smoking",
//                 "คุณสูบบุหรี่หรือไม่?",
//                 [
//                   { value: "yes", label: "สูบ" },
//                   { value: "no", label: "ไม่สูบ" }
//                 ]
//               )}
//               {renderRadioGroup(
//                 "drinking",
//                 "คุณดื่มสุราหรือไม่?",
//                 [
//                   { value: "yes", label: "ดื่ม" },
//                   { value: "no", label: "ไม่ดื่ม" }
//                 ]
//               )}
//             </div>
//           </div>

//           {/* Step 2: Body Measurements */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
//                   <Scale className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-white mb-1">ข้อมูลร่างกาย</h3>
//                   <p className="text-green-100 text-sm">น้ำหนัก ส่วนสูง และรอบเอว</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6 space-y-4">
//               {renderInput("weight", "น้ำหนัก", Scale, "กก.")}
//               {renderInput("height", "ส่วนสูง", Ruler, "ซม.")}
//               {renderInput("waist", "รอบเอว (วัดในระดับสะดือ)", Activity, "ซม.")}
//             </div>
//           </div>

//           {/* Step 3: Blood Pressure */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
//                   <Heart className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-white mb-1">ความดันโลหิต</h3>
//                   <p className="text-red-100 text-sm">ค่าความดันตัวบนและตัวล่าง</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {renderInput("systolic", "ค่าความดันตัวบน", Heart, "mmHg")}
//                 {renderInput("diastolic", "ค่าความดันตัวล่าง", Heart, "mmHg")}
//               </div>
//             </div>
//           </div>

//           {/* Step 4: Blood Sugar */}
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//             <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
//               <div className="flex items-center gap-4">
//                 <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
//                   <Droplets className="text-white" size={24} />
//                 </div>
//                 <div>
//                   <h3 className="text-2xl font-bold text-white mb-1">ระดับน้ำตาลในเลือด</h3>
//                   <p className="text-orange-100 text-sm">ค่าน้ำตาลก่อนและหลังอาหาร</p>
//                 </div>
//               </div>
//             </div>
//             <div className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {renderInput("bloodSugar", "น้ำตาลขณะอดอาหาร", Droplets, "mg/dL")}
//                 {renderInput("bloodSugarAfter", "น้ำตาลหลังอาหาร 2 ชม.", Droplets, "mg/dL")}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-12">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h3 className="text-lg font-bold text-gray-800">พร้อมคำนวณแล้ว?</h3>
//               <p className="text-gray-600 text-sm">ตรวจสอบข้อมูลและคลิกเพื่อดูผลลัพธ์</p>
//             </div>
//             {isFormComplete() ? (
//               <CheckCircle className="text-green-500" size={24} />
//             ) : (
//               <AlertCircle className="text-orange-500" size={24} />
//             )}
//           </div>
          
//           <button
//             onClick={handleSubmit}
//             disabled={!isFormComplete()}
//             className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
//               isFormComplete()
//                 ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
//                 : "bg-gray-300 cursor-not-allowed"
//             }`}
//           >
//             {isFormComplete() ? (
//               <div className="flex items-center justify-center gap-2">
//                 <Calculator size={20} />
//                 <span>คำนวณดัชนีมวลกาย</span>
//               </div>
//             ) : (
//               "กรุณากรอกข้อมูลให้ครบถ้วน"
//             )}
//           </button>
//         </div>

//         {/* Info Card */}
//         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-12">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30">
//               <span className="text-2xl">💡</span>
//             </div>
//             <h3 className="text-2xl font-bold mb-2">เคล็ดลับ</h3>
//             <p className="text-indigo-100 max-w-2xl mx-auto leading-relaxed">
//               ควรวัดน้ำหนักและส่วนสูงในตอนเช้าหลังตื่นนอน และวัดรอบเอวในขณะหายใจออกปกติ 
//               เพื่อความแม่นยำของผลลัพธ์
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BMICalculatorFormPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calculator, 
  Activity, 
  Ruler, 
  Scale,
  CheckCircle,
  AlertCircle,
  Target,
  TrendingUp,
  BarChart3
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

  const handleSubmit = () => {
    navigate("/assessment/bmiresult", { state: form });
  };

  const isFormComplete = () => {
    return form.weight && form.height && form.waist;
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
        value={form[name as keyof typeof form]}
        onChange={handleChange}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
            </div>
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
                {getCompletedFields()}/5
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
                
                <div className="grid grid-cols-1 gap-6">
                  {renderInput("waist", "รอบเอว (วัดในระดับสะดือ)", Activity, "ซม.", true)}
                </div>
              </div>

              {/* Additional Measurements */}
              <div className="space-y-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <h4 className="text-xl font-bold text-gray-800">ข้อมูลเสริม (ไม่บังคับ)</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput("chest", "รอบอก", Activity, "ซม.")}
                  {renderInput("hip", "รอบสะโพก", Activity, "ซม.")}
                </div>
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
              className={`w-full max-w-md py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${
                isFormComplete()
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