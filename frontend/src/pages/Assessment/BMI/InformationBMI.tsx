import React, { useEffect } from "react";
import { 
  ArrowLeft, 
  Calculator, 
  Activity, 
  // Heart,
  Info,
  TrendingUp,
  Scale,
  Target,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const GeneralHealthIntroPage: React.FC = () => {
  
const navigate = useNavigate();

  const features = [
    {
      icon: Calculator,
      title: "คำนวณแม่นยำ",
      description: "ระบบคำนวณ BMI ตามมาตรฐานสากล",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: Activity,
      title: "ประเมินสุขภาพ",
      description: "วิเคราะห์ภาวะสุขภาพเบื้องต้น",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: TrendingUp,
      title: "ติดตามผล",
      description: "บันทึกและติดตามความคืบหน้า",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const bmiRanges = [
    { range: "< 18.5", status: "น้ำหนักน้อย", color: "text-blue-600", bg: "bg-blue-50" },
    { range: "18.5-24.9", status: "น้ำหนักปกติ", color: "text-green-600", bg: "bg-green-50" },
    { range: "25.0-29.9", status: "น้ำหนักเกิน", color: "text-yellow-600", bg: "bg-yellow-50" },
    { range: "≥ 30.0", status: "โรคอ้วน", color: "text-red-600", bg: "bg-red-50" }
  ];
 useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
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
              <span className="text-4xl">⚖️</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              สุขภาพทั่วไป
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              คำนวณดัชนีมวลกายและประเมินภาวะสุขภาพของคุณ
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

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Scale className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">ดัชนีมวลกาย (BMI)</h3>
                <p className="text-white/80 text-sm">
                  เครื่องมือประเมินภาวะสุขภาพเบื้องต้น
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl mb-6">
                <Calculator size={48} className="text-indigo-600" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-4">เริ่มต้นการประเมิน</h4>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                กรอกข้อมูลเพื่อคำนวณดัชนีมวลกายอย่างแม่นยำ 
                ระบบจะแสดงผลลัพธ์เกี่ยวกับภาวะสุขภาพเบื้องต้นของคุณ
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button
                onClick={() => navigate("/assessment/bmi")}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <Calculator size={24} />
                คำนวณดัชนีมวลกาย
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Target className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">คุณสมบัติเด่น</h3>
                <p className="text-white/80 text-sm">
                  ระบบคำนวณและประเมินสุขภาพที่ครอบคลุม
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-4`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h4>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* BMI Reference Chart */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">ตารางอ้างอิง BMI</h3>
                <p className="text-white/80 text-sm">
                  เกณฑ์การแปลผลดัชนีมวलกายตามมาตรฐานสากล
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bmiRanges.map((range, index) => (
                <div key={index} className={`${range.bg} rounded-xl p-4 border border-gray-200`}>
                  <div className="text-center">
                    <div className={`text-xl font-bold ${range.color} mb-1`}>{range.range}</div>
                    <div className="text-sm text-gray-700 font-medium">{range.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0">
              <Info className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">ข้อมูลสำคัญ</h3>
              <p className="text-amber-100 leading-relaxed mb-4">
                ดัชนีมวลกาย (BMI) เป็นเครื่องมือประเมินภาวะสุขภาพเบื้องต้น <span className="font-bold text-white">ไม่ใช่การวินิจฉัยทางการแพทย์</span>
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-amber-100">
                  <CheckCircle size={16} className="text-white/80" />
                  <span>เหมาะสำหรับบุคคลทั่วไปอายุ 18-65 ปี</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-amber-100">
                  <CheckCircle size={16} className="text-white/80" />
                  <span>ควรปรึกษาแพทย์สำหรับการประเมินที่ครอบคลุม</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralHealthIntroPage;