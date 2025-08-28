import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  User, 
  Scale, 
  Ruler, 
  Activity, 
  Droplets,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  ClipboardList,
  Target,
  TrendingUp
} from "lucide-react";

const DiabetesLessAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    waist: "",
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    familyHistory: "",
    historyHighSugar: "",
    bmiOver25: "",
    lackExercise: "",
    highWaist: "",
    highPressure: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRadio = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    navigate("/assessment/diabetes/result", { state: form });
  };

  const radioQuestions = [
    { 
      name: "familyHistory", 
      label: "มีบิดา มารดา หรือพี่น้องสายตรงเป็นโรคเบาหวานหรือไม่",
      icon: Users,
      description: "ประวัติครอบครัวเป็นปัจจัยเสี่ยงสำคัญ"
    },
    { 
      name: "historyHighSugar", 
      label: "คุณมีประวัติน้ำตาลในเลือดสูงหรือเคยได้รับการวินิจฉัยว่าเป็นเบาหวานหรือไม่",
      icon: Droplets,
      description: "ประวัติการมีน้ำตาลในเลือดสูง"
    },
    { 
      name: "bmiOver25", 
      label: "คุณมีค่าดัชนีมวลกาย (BMI) ตั้งแต่ 25 ขึ้นไปหรือไม่",
      icon: Scale,
      description: "น้ำหนักเกินเพิ่มความเสี่ยง"
    },
    { 
      name: "lackExercise", 
      label: "คุณออกกำลังกายน้อยกว่าสัปดาห์ละ 3 วันหรือไม่",
      icon: Activity,
      description: "การออกกำลังกายช่วยลดความเสี่ยง"
    },
    { 
      name: "highWaist", 
      label: "คุณมีรอบเอวมากกว่าที่กำหนดหรือไม่",
      icon: Target,
      description: "รอบเอวใหญ่เป็นสัญญาณเตือน"
    },
    { 
      name: "highPressure", 
      label: "คุณมีความดันโลหิตสูง หรือเคยได้รับการวินิจฉัยว่าเป็นความดันสูงหรือไม่",
      icon: Heart,
      description: "ความดันสูงสัมพันธ์กับเบาหวาน"
    },
  ];

  const getCompletionPercentage = () => {
    const totalFields = Object.keys(form).length;
    const completedFields = Object.values(form).filter(value => value !== "").length;
    return Math.round((completedFields / totalFields) * 100);
  };

  const isFormComplete = () => {
    return Object.values(form).every(value => value !== "");
  };

  const renderRadioGroup = (question: any) => {
    const Icon = question.icon;
    const options = [
      { value: "yes", label: "มี", color: "border-red-200 bg-red-50 text-red-700" },
      { value: "no", label: "ไม่มี", color: "border-green-200 bg-green-50 text-green-700" },
      { value: "unknown", label: "ไม่ทราบ", color: "border-gray-200 bg-gray-50 text-gray-700" }
    ];

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Icon className="text-blue-600" size={18} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 leading-relaxed mb-1">
              {question.label}
            </h4>
            <p className="text-xs text-gray-500">{question.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {options.map((option) => (
            <label
              key={option.value}
              className={`relative cursor-pointer rounded-lg border-2 p-3 text-center transition-all duration-200 text-xs font-medium ${
                form[question.name as keyof typeof form] === option.value
                  ? option.color
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name={question.name}
                value={option.value}
                checked={form[question.name as keyof typeof form] === option.value}
                onChange={() => handleRadio(question.name, option.value)}
                className="sr-only"
              />
              <span>{option.label}</span>
              {form[question.name as keyof typeof form] === option.value && (
                <CheckCircle className="absolute -top-1 -right-1 bg-white rounded-full" size={16} />
              )}
            </label>
          ))}
        </div>
      </div>
    );
  };

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
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600">
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
              โรคเบาหวาน
            </h1>
            <div className="w-12" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
              <span className="text-4xl">🩺</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              ประเมินความเสี่ยง
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              แบบประเมินสำหรับผู้ที่มีอายุระหว่าง 15-34 ปี
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
            <h3 className="text-lg font-bold text-gray-800">ความคืบหน้าการประเมิน</h3>
            <span className="text-sm text-gray-600">{getCompletionPercentage()}% สมบูรณ์</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Form Sections */}
        <div className="space-y-8 mb-12">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">ข้อมูลพื้นฐาน</h3>
                  <p className="text-blue-100 text-sm">อายุ เพศ และข้อมูลร่างกาย</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {renderInput("age", "อายุ", Calendar, "ปี")}
              
              {/* Gender Selection */}
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">เพศ</label>
                <div className="flex gap-3">
                  {[
                    { value: "male", label: "ชาย" },
                    { value: "female", label: "หญิง" }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex-1 relative cursor-pointer rounded-lg border-2 p-3 text-center transition-all duration-200 ${
                        form.gender === option.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={form.gender === option.value}
                        onChange={() => handleRadio("gender", option.value)}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                      {form.gender === option.value && (
                        <CheckCircle className="absolute -top-2 -right-2 text-blue-500 bg-white rounded-full" size={18} />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {renderInput("weight", "น้ำหนัก", Scale, "กก.")}
              {renderInput("height", "ส่วนสูง", Ruler, "ซม.")}
              {renderInput("waist", "รอบเอว (วัดในระดับสะดือ)", Activity, "ซม.")}
            </div>
          </div>

          {/* Blood Pressure */}
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

          {/* Blood Sugar */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Droplets className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">ระดับน้ำตาลในเลือด</h3>
                  <p className="text-orange-100 text-sm">ค่าน้ำตาลขณะอดอาหาร</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {renderInput("bloodSugar", "ระดับน้ำตาลในเลือดขณะอดอาหาร", Droplets, "mg/dL")}
            </div>
          </div>

          {/* Risk Assessment Questions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <ClipboardList className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">แบบสอบถามความเสี่ยง</h3>
                  <p className="text-purple-100 text-sm">ปัจจัยเสี่ยงต่างๆ ที่เกี่ยวข้อง</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {radioQuestions.map((question) => renderRadioGroup(question))}
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">พร้อมดูผลการประเมินแล้ว?</h3>
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
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isFormComplete() ? (
              <div className="flex items-center justify-center gap-2">
                <TrendingUp size={20} />
                <span>ประเมินผลความเสี่ยง</span>
              </div>
            ) : (
              "กรุณากรอกข้อมูลให้ครบถ้วน"
            )}
          </button>
        </div>

        {/* Information Card */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-8 text-white mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">แบบประเมินสำหรับวัยหนุ่มสาว</h3>
            <p className="text-teal-100 max-w-2xl mx-auto leading-relaxed">
              การประเมินนี้เหมาะสำหรับผู้ที่มีอายุ 15-34 ปี เพื่อคัดกรองความเสี่ยงเบื้องต้น 
              หากมีข้อสงสัยควรปรึกษาแพทย์เพิ่มเติม
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiabetesLessAssessmentPage;