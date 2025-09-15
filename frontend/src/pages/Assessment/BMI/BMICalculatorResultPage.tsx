import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Scale, 
  Activity, 
  Heart, 
  Target, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Droplets,
  Cigarette,
  Wine,
  User,
  Home,
  Ruler
} from "lucide-react";

const BMICalculatorResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const {
    weight,
    height,
    // waist,
    chest,
    hip,
    systolic,
    diastolic,
    bloodSugar,
    bloodSugarAfter,
    smoking,
    drinking,
  } = state || {};

  const heightM = height / 100;
  const bmi = (weight / (heightM * heightM)).toFixed(1);

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "น้ำหนักน้อย";
    if (bmi < 25) return "ปกติ";
    if (bmi < 30) return "น้ำหนักเกิน";
    return "อ้วน";
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return { bg: "bg-blue-500", text: "text-blue-600", light: "bg-blue-50" };
    if (bmi < 25) return { bg: "bg-green-500", text: "text-green-600", light: "bg-green-50" };
    if (bmi < 30) return { bg: "bg-orange-500", text: "text-orange-600", light: "bg-orange-50" };
    return { bg: "bg-red-500", text: "text-red-600", light: "bg-red-50" };
  };

  const getAdviceFromBMI = (bmi: number): { title: string; description: string; recommendations: string[] } => {
    if (bmi < 18.5) return {
      title: "น้ำหนักต่ำกว่าเกณฑ์",
      description: "คุณมีน้ำหนักต่ำกว่าเกณฑ์ปกติ ควรเพิ่มน้ำหนักให้อยู่ในช่วงที่เหมาะสม",
      recommendations: [
        "รับประทานอาหารให้ครบ 5 หมู่",
        "เพิ่มแคลอรี่จากอาหารมีประโยชน์",
        "ออกกำลังกายเพื่อเพิ่มกล้ามเนื้อ",
        "ตรวจสุขภาพสม่ำเสมอ"
      ]
    };
    if (bmi < 25) return {
      title: "น้ำหนักปกติ",
      description: "ยินดีด้วย! คุณมีน้ำหนักอยู่ในเกณฑ์ปกติ ควรรักษาไว้",
      recommendations: [
        "ออกกำลังกายสม่ำเสมอ",
        "รับประทานอาหารสมดุล",
        "ดื่มน้ำให้เพียงพอ",
        "ตรวจสุขภาพประจำปี"
      ]
    };
    if (bmi < 30) return {
      title: "น้ำหนักเกิน",
      description: "คุณมีน้ำหนักเกิน ควรเริ่มควบคุมน้ำหนักเพื่อสุขภาพที่ดีขึ้น",
      recommendations: [
        "ลดแคลอรี่ที่ได้รับ 300-500 แคลอรี่ต่อวัน",
        "เพิ่มการออกกำลังกาย 150 นาที/สัปดาห์",
        "หลีกเลี่ยงอาหารที่มีน้ำตาลและไขมันสูง",
        "ติดตามน้ำหนักสัปดาห์ละครั้ง"
      ]
    };
    return {
      title: "อ้วน",
      description: "คุณอยู่ในภาวะอ้วน ควรพบแพทย์เพื่อวางแผนลดน้ำหนักอย่างปลอดภัย",
      recommendations: [
        "ปรึกษาแพทย์หรือนักโภชนาการ",
        "วางแผนลดน้ำหนัก 0.5-1 กก./สัปดาห์",
        "ออกกำลังกายภายใต้คำแนะนำผู้เชี่ยวชาญ",
        "ตรวจสุขภาพอย่างสม่ำเสมอ"
      ]
    };
  };

  const bmiValue = parseFloat(bmi);
  const bmiCategory = getBMICategory(bmiValue);
  const bmiColors = getBMIColor(bmiValue);
  const advice = getAdviceFromBMI(bmiValue);

  const getBMIPercentage = (bmi: number) => {
    if (bmi < 18.5) return (bmi / 18.5) * 20;
    if (bmi < 25) return 20 + ((bmi - 18.5) / 6.5) * 30;
    if (bmi < 30) return 50 + ((bmi - 25) / 5) * 30;
    return Math.min(90, 80 + ((bmi - 30) / 10) * 20);
  };

  const getHealthStatus = () => {
    const healthFactors = [];
    
    // BMI
    if (bmiValue >= 18.5 && bmiValue < 25) healthFactors.push("BMI ปกติ");
    
    // Blood pressure (if provided)
    if (systolic && diastolic) {
      if (systolic < 130 && diastolic < 85) healthFactors.push("ความดันโลหิตปกติ");
    }
    
    // Blood sugar (if provided)
    if (bloodSugar && bloodSugar < 100) healthFactors.push("น้ำตาลในเลือดปกติ");
    
    // Lifestyle
    if (smoking === "no") healthFactors.push("ไม่สูบบุหรี่");
    if (drinking === "no") healthFactors.push("ไม่ดื่มสุรา");

    return healthFactors;
  };

  const healthFactors = getHealthStatus();
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
        
        <div className="relative max-w-6xl mx-auto px-6 py-2">
          {/* Header Navigation */}
          <div className="flex items-center mb-12">
            <button
              onClick={() => navigate(-1)}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:scale-105"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="flex-1 text-center text-white font-bold text-2xl tracking-wide">
              ผลการคำนวณ BMI
            </h1>
            <div className="w-16" />
          </div>

          {/* Enhanced Hero Content */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-28 h-28 ${bmiColors.bg} backdrop-blur-sm rounded-3xl mb-8 border border-white/20 hover:scale-105 transition-transform duration-300 shadow-2xl`}>
              <Scale className="text-white" size={40} />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              BMI {bmi}
            </h2>
            <p className="text-2xl text-blue-100 mb-2">
              {bmiCategory}
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              {advice.description}
            </p>
          </div>
        </div>

        {/* Enhanced Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          {/* <svg className="w-full h-20 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg> */}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        {/* BMI Visualization Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 mb-10 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">แผนภูมิ BMI ของคุณ</h3>
            
            {/* BMI Scale */}
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="w-full bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 h-6 rounded-full mb-4 relative overflow-hidden">
                <div 
                  className="absolute top-0 w-1 h-6 bg-white border-2 border-gray-800 rounded-full shadow-lg transition-all duration-1000 ease-out"
                  style={{ left: `${getBMIPercentage(bmiValue)}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                    {bmi}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 px-2">
                <span>น้ำหนักน้อย<br/>&lt;18.5</span>
                <span>ปกติ<br/>18.5-24.9</span>
                <span>น้ำหนักเกิน<br/>25-29.9</span>
                <span>อ้วน<br/>≥30</span>
              </div>
            </div>

            {/* BMI Status Badge */}
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${bmiColors.light} border-2 border-current ${bmiColors.text} mt-6`}>
              {bmiValue >= 18.5 && bmiValue < 25 ? (
                <CheckCircle size={24} />
              ) : (
                <AlertCircle size={24} />
              )}
              <span className="font-bold text-lg">{bmiCategory}</span>
            </div>
          </div>
        </div>

        {/* Body Measurements Summary */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 p-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <User className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">สรุปข้อมูลร่างกาย</h3>
                <p className="text-purple-100 text-lg">ข้อมูลการวัดสัดส่วนของคุณ</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="p-3 bg-blue-500 rounded-xl">
                  <Scale className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">น้ำหนัก</p>
                  <p className="text-xl font-bold text-gray-800">{weight} กก.</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="p-2 bg-green-500 rounded-xl">
                  <Ruler className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">ส่วนสูง</p>
                  <p className="text-xl font-bold text-gray-800">{height} ซม.</p>
                </div>
              </div>

              

              {chest && (
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-200">
                  <div className="p-3 bg-orange-500 rounded-xl">
                    <Activity className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">รอบอก</p>
                    <p className="text-xl font-bold text-gray-800">{chest} ซม.</p>
                  </div>
                </div>
              )}

              {hip && (
                <div className="flex items-center gap-4 p-4 bg-pink-50 rounded-2xl border border-pink-200">
                  <div className="p-3 bg-pink-500 rounded-xl">
                    <Activity className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">รอบสะโพก</p>
                    <p className="text-xl font-bold text-gray-800">{hip} ซม.</p>
                  </div>
                </div>
              )}

              {(systolic && diastolic) && (
                <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-200">
                  <div className="p-3 bg-red-500 rounded-xl">
                    <Heart className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ความดันโลหิต</p>
                    <p className="text-xl font-bold text-gray-800">{systolic}/{diastolic}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Health Data */}
            {(bloodSugar || bloodSugarAfter || smoking || drinking) && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-6">ข้อมูลสุขภาพเพิ่มเติม</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {bloodSugar && (
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                      <div className="p-3 bg-amber-500 rounded-xl">
                        <Droplets className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">น้ำตาลในเลือด</p>
                        <p className="text-xl font-bold text-gray-800">{bloodSugar} mg/dL</p>
                      </div>
                    </div>
                  )}

                  {bloodSugarAfter && (
                    <div className="flex items-center gap-4 p-4 bg-teal-50 rounded-2xl border border-teal-200">
                      <div className="p-3 bg-teal-500 rounded-xl">
                        <Droplets className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">น้ำตาลหลังอาหาร</p>
                        <p className="text-xl font-bold text-gray-800">{bloodSugarAfter} mg/dL</p>
                      </div>
                    </div>
                  )}

                  {smoking && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                      <div className="p-3 bg-gray-500 rounded-xl">
                        <Cigarette className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">สูบบุหรี่</p>
                        <p className="text-xl font-bold text-gray-800">{smoking === "yes" ? "สูบ" : "ไม่สูบ"}</p>
                      </div>
                    </div>
                  )}

                  {drinking && (
                    <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-2xl border border-violet-200">
                      <div className="p-3 bg-violet-500 rounded-xl">
                        <Wine className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">ดื่มสุรา</p>
                        <p className="text-xl font-bold text-gray-800">{drinking === "yes" ? "ดื่ม" : "ไม่ดื่ม"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Health Recommendations */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-10">
          <div className={`bg-gradient-to-r ${bmiColors.bg === 'bg-green-500' ? 'from-green-500 to-emerald-600' : bmiColors.bg === 'bg-blue-500' ? 'from-blue-500 to-indigo-600' : bmiColors.bg === 'bg-orange-500' ? 'from-orange-500 to-red-600' : 'from-red-500 to-red-700'} p-8`}>
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                <Target className="text-white" size={32} />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{advice.title}</h3>
                <p className="text-white/90 text-lg">{advice.description}</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <h4 className="text-xl font-bold text-gray-800 mb-6">คำแนะนำสำหรับคุณ</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advice.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`p-2 ${bmiColors.bg} rounded-lg flex-shrink-0 mt-1`}>
                    <CheckCircle className="text-white" size={16} />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Score */}
        {healthFactors.length > 0 && (
          <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-10 text-white mb-12 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
                <TrendingUp className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-4">คะแนนสุขภาพของคุณ</h3>
              
              <p className="text-xl text-green-100 mb-6">ปัจจัยสุขภาพที่ดี</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {healthFactors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                    <CheckCircle className="text-green-200" size={20} />
                    <span className="text-green-100">{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
          <div className="text-center space-y-4">
            <button
              onClick={() => navigate("/assessment/bmi")}
              className="w-full max-w-md py-5 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-center gap-3">
                <ArrowLeft size={24} />
                <span>คำนวณใหม่</span>
              </div>
            </button>
            
            <button
              className="w-full max-w-md py-5 rounded-2xl font-bold text-lg text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transform hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/")}
            >
              <div className="flex items-center justify-center gap-3">
                <span><Home size={24} /></span>
                <span>หน้าหลัก</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculatorResultPage;