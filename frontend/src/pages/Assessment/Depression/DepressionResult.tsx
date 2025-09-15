import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Heart, 
  Brain,
  AlertTriangle,
  FileText,
  Shield,
  Phone,
  Users,
  Activity,
  Home,
  // CheckCircle
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const DepressionResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resultData, setResultData] = useState<any>(null);

  // รับข้อมูลจาก state ที่ส่งมาจากหน้าประเมิน
  useEffect(() => {
    if (location.state) {
      const data = location.state;
      // คำนวณข้อมูลเพิ่มเติม
      const hasHighRisk = data.riskLevel && (
        data.riskLevel.level.includes("รุนแรง") || 
        data.riskLevel.level.includes("ปานกลาง") ||
        Object.values(data.answers || {}).some(() => 
          data.answers?.q9 >= 1  // คำถามเกี่ยวกับการทำร้ายตัวเอง
        )
      );
      
      const suicidalThoughts = data.answers?.q9 >= 1;
      
      setResultData({
        ...data,
        totalScore: Object.values(data.answers || {}).reduce((sum: number, score: any) => sum + score, 0),
        hasHighRisk,
        suicidalThoughts
      });
    } else {
      // หากไม่มีข้อมูล ให้กลับไปหน้าประเมิน
      navigate("/assessment/depression", { replace: true });
    }
  }, [location.state, navigate]);
 useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  // แสดง loading หากยังไม่มีข้อมูล
  if (!resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 font-kanit flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดผลการประเมิน...</p>
        </div>
      </div>
    );
  }

  const questions = [
    { id: "q1", text: "เบื่อ ไม่สนใจทำอะไร" },
    { id: "q2", text: "ไม่สบายใจ ซึมเศร้า ท้อแท้" },
    { id: "q3", text: "หลับยากหรือหลับๆ ตื่นๆ หรือหลับมากไป" },
    { id: "q4", text: "เหนื่อยง่ายหรือไม่ค่อยมีแรง" },
    { id: "q5", text: "เบื่ออาหาร หรือกินมากเกินไป" },
    { id: "q6", text: "รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้ตนเองหรือครอบครัวผิดหวัง" },
    { id: "q7", text: "สมาธิไม่ดีเวลาทำอะไร เช่น ดูโทรทัศน์ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ" },
    { id: "q8", text: "พูดช้า ท่าอะไรช้าลง จนคนอื่นสังเกตเห็นได้ หรือกระสับกระส่ายไม่สามารถอยู่นิ่งได้เหมือนที่เคยเป็น" },
    { id: "q9", text: "คิดทำร้ายตนเองหรือคิดว่าตายไปจะดี" }
  ];

  const getAnswerLabel = (score: number) => {
    switch(score) {
      case 0: return "ไม่มีเลย";
      case 1: return "เป็นบางวัน";
      case 2: return "เป็นบ่อย";
      case 3: return "เป็นทุกวัน";
      default: return "ไม่ระบุ";
    }
  };

  const getAnswerColor = (score: number) => {
    switch(score) {
      case 0: return "bg-green-100 text-green-700 border border-green-200";
      case 1: return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      case 2: return "bg-orange-100 text-orange-700 border border-orange-200";
      case 3: return "bg-red-100 text-red-700 border border-red-200";
      default: return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const getRecommendations = () => {
    if (resultData.hasHighRisk) {
      return {
        immediate: [
          "ติดต่อผู้เชี่ยวชาญทางสุขภาพจิตทันที",
          "โทร 1323 หรือ 1300 เพื่อขอความช่วยเหลือ",
          "แจ้งให้ครอบครัวหรือคนใกล้ชิดทราบ",
          "หลีกเลี่ยงการอยู่คนเดียว"
        ],
        longterm: [
          "นัดพบจิตแพทย์หรือนักจิตวิทยา",
          "เข้าร่วมกลุ่มสนับสนุน",
          "ปรับเปลี่ยนวิถีชีวิตให้เหมาะสม",
          "ติดตามอาการอย่างสม่ำเสมอ"
        ]
      };
    } else if (resultData.totalScore >= 7) {
      return {
        immediate: [
          "สังเกตอาการและบันทึกความรู้สึก",
          "พูดคุยกับคนที่ไว้ใจ",
          "ปรับกิจกรรมประจำวัน",
          "ดูแลสุขภาพร่างกายให้ดี"
        ],
        longterm: [
          "พิจารณาปรึกษาผู้เชี่ยวชาญ",
          "ทำแบบประเมินซ้ำในอีก 2-4 สัปดาห์",
          "สร้างกิจกรรมที่ทำให้มีความสุข",
          "พัฒนาทักษะการจัดการความเครียด"
        ]
      };
    } else {
      return {
        immediate: [
          "ดูแลสุขภาพจิตอย่างต่อเนื่อง",
          "สร้างเครือข่ายสนับสนุนที่แข็งแกร่ง",
          "ออกกำลังกายเป็นประจำ",
          "รักษาสุขภาพร่างกายให้แข็งแรง"
        ],
        longterm: [
          "ทำแบบประเมินอีกครั้งในอนาคต",
          "สร้างกิจกรรมที่มีความหมาย",
          "พัฒนาทักษะการจัดการความเครียด",
          "สร้างสมดุลในชีวิตและการทำงาน"
        ]
      };
    }
  };

  const recommendations = getRecommendations();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRetakeTest = () => {
    navigate("/assessment/depression");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 font-kanit">
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${
        resultData.hasHighRisk 
          ? "bg-gradient-to-r from-red-600 via-orange-600 to-pink-700" 
          : resultData.totalScore >= 7
          ? "bg-gradient-to-r from-orange-600 via-yellow-600 to-red-600"
          : "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700"
      }`}>
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
              ผลการประเมินโรคซึมเศร้า PHQ-9
            </h1>
            <div className="w-16" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20 hover:scale-105 transition-transform duration-300">
              {resultData.hasHighRisk ? (
                <AlertTriangle className="text-white" size={40} />
              ) : resultData.totalScore >= 7 ? (
                <Activity className="text-white" size={40} />
              ) : (
                <Shield className="text-white" size={40} />
              )}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              {resultData.riskLevel.level}
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-6">
              {resultData.riskLevel.description}
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4 inline-block border border-white/30">
              <div className="text-white/90 text-sm mb-1">คะแนนรวม</div>
              <div className="text-4xl font-bold text-white">{resultData.totalScore}/27</div>
              <div className="text-white/90 text-sm">วันที่ประเมิน: {resultData.date}</div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        
        {/* Emergency Alert - แสดงเมื่อมีความคิดทำร้ายตัวเอง */}
        {resultData.suicidalThoughts && (
          <div className="bg-red-600 rounded-3xl shadow-2xl border border-red-200 mb-10 p-8 text-white">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="text-white flex-shrink-0 mt-1" size={32} />
              <div>
                <h3 className="text-2xl font-bold mb-3">ต้องการความช่วยเหลือทันที</h3>
                <p className="text-red-100 text-lg mb-6">
                  คุณได้ระบุว่ามีความคิดทำร้ายตัวเองหรือคิดว่าตายไปจะดี กรุณาติดต่อขอความช่วยเหลือทันที
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="text-white" size={24} />
                  <h4 className="font-bold text-xl text-white">สายด่วนฉุกเฉิน</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-red-100">สุขภาพจิต</span>
                    <span className="font-bold text-2xl">1323</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-100">ศูนย์ช่วยเหลือ</span>
                    <span className="font-bold text-2xl">1300</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-white" size={24} />
                  <h4 className="font-bold text-xl text-white">ติดต่อคนใกล้ชิด</h4>
                </div>
                <div className="space-y-2 text-red-100">
                  <div>• แจ้งครอบครัวหรือเพื่อนที่ไว้ใจ</div>
                  <div>• ขอให้คนอื่นอยู่ด้วย</div>
                  <div>• หาคนคุยเมื่อรู้สึกไม่ดี</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 mb-10 p-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg ${
              resultData.hasHighRisk ? "bg-red-500" : 
              resultData.totalScore >= 7 ? "bg-orange-500" : "bg-green-500"
            }`}>
              <Activity className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">สรุปผลการประเมิน</h3>
            
            <div className={`inline-block px-8 py-4 rounded-2xl ${resultData.riskLevel.bg} border-2 ${resultData.riskLevel.border} mb-4`}>
              <div className={`text-2xl font-bold ${resultData.riskLevel.color} mb-2`}>
                {resultData.riskLevel.level}
              </div>
              <div className="text-gray-600">
                คะแนนรวม: {resultData.totalScore} จาก 27 คะแนน
              </div>
            </div>
            
            <p className="text-gray-600">{resultData.riskLevel.description}</p>
          </div>

          {/* Score Breakdown */}
          <div className="border-t pt-8">
            <h4 className="text-xl font-bold text-gray-800 mb-6">รายละเอียดคำตอบ</h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {questions.map((question, index) => {
                const score = resultData.answers[question.id as keyof typeof resultData.answers];
                return (
                  <div key={question.id} className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        score === 0 ? "bg-green-500" :
                        score === 1 ? "bg-yellow-500" :
                        score === 2 ? "bg-orange-500" : "bg-red-500"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 mb-3 leading-relaxed text-sm">{question.text}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">คะแนน:</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAnswerColor(score)}`}>
                            {score} - {getAnswerLabel(score)}
                          </span>
                        </div>
                        {question.id === "q9" && score >= 1 && (
                          <div className="mt-2 text-xs text-red-600 font-medium">
                            ⚠️ ต้องการความช่วยเหลือทันที
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Immediate Actions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                resultData.hasHighRisk ? "bg-gradient-to-r from-red-500 to-orange-600" : 
                "bg-gradient-to-r from-blue-500 to-purple-600"
              }`}>
                <AlertTriangle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">ควรทำทันที</h3>
                <p className="text-gray-600">ขั้นตอนที่ควรปฏิบัติในทันที</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {recommendations.immediate.map((item, index) => (
                <div key={index} className={`flex items-start gap-4 p-4 rounded-xl border ${
                  resultData.hasHighRisk ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                    resultData.hasHighRisk ? "bg-red-500" : "bg-blue-500"
                  }`}>
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-800 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Long-term Care */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">การดูแลระยะยาว</h3>
                <p className="text-gray-600">แผนการดูแลต่อเนื่อง</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {recommendations.longterm.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <span className="text-gray-800 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-10 text-white mb-12 shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
              <Phone className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-4">แหล่งข้อมูลและความช่วยเหลือ</h3>
            <p className="text-purple-100 text-lg">ช่องทางติดต่อและแหล่งข้อมูลเพิ่มเติม</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <Phone className="text-white mb-4" size={32} />
              <h4 className="text-xl font-bold mb-3">สายด่วนสุขภาพจิต</h4>
              <div className="text-purple-100 space-y-2">
                <div className="flex justify-between">
                  <span>กรมสุขภาพจิต</span>
                  <span className="font-bold">1323</span>
                </div>
                <div className="text-sm">24 ชั่วโมง ทุกวัน</div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <Users className="text-white mb-4" size={32} />
              <h4 className="text-xl font-bold mb-3">ศูนย์ช่วยเหลือ</h4>
              <div className="text-purple-100 space-y-2">
                <div className="flex justify-between">
                  <span>สายด่วนช่วยเหลือ</span>
                  <span className="font-bold">1300</span>
                </div>
                <div className="text-sm">ให้คำปรึกษาและช่วยเหลือ</div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
              <Brain className="text-white mb-4" size={32} />
              <h4 className="text-xl font-bold mb-3">โรงพยาบาลใกล้เคียง</h4>
              <div className="text-purple-100 space-y-2">
                <div className="text-sm">• แผนกจิตเวช</div>
                <div className="text-sm">• คลินิกสุขภาพจิต</div>
                <div className="text-sm">• ศูนย์ให้คำปรึกษา</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Home size={20} />
            <span>หน้าหลัก</span>
          </button>
          <button 
            onClick={handleRetakeTest}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <FileText size={24} />
            <span>ทำแบบประเมินอีกครั้ง</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepressionResultsPage;