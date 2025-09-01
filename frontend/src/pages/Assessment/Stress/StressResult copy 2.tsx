import React, { useState } from "react";
import { 
  ArrowLeft, 
  Heart, 
  Brain,
  // CheckCircle,
  AlertTriangle,
  FileText,
  Shield,
  Phone,
  Users,
  Activity,
  Calendar,
  Download,
  Share2,
  ExternalLink
} from "lucide-react";

const StressResultsPage: React.FC = () => {
  // จำลองข้อมูลผลการประเมิน
  const [resultData] = useState({
    answers: {
      q1: true,  // มีความรู้สึกหดหู่ เศร้า
      q2: false  // ไม่มีความรู้สึกเบื่อ
    },
    riskLevel: {
      level: "ความเสี่ยงสูง",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      description: "ควรปรึกษาผู้เชี่ยวชาญด่วน"
    },
    hasRisk: true,
    date: "1 กันยายน 2568",
    timestamp: "2025-09-01T10:30:00.000Z"
  });

  const questions = [
    {
      id: "q1",
      text: "ใน 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านรู้สึก หดหู่ เศร้าหรือท้อแท้สิ้นหวังหรือไม่",
      answer: resultData.answers.q1
    },
    {
      id: "q2", 
      text: "ใน 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านรู้สึกเบื่อ ท่าอะไรก็ไม่แฮงกิดแฮงสิ้นหวังหรือไม่",
      answer: resultData.answers.q2
    }
  ];

  const getRecommendations = () => {
    if (resultData.hasRisk) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 font-kanit">
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${
        resultData.hasRisk 
          ? "bg-gradient-to-r from-red-600 via-orange-600 to-pink-700" 
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
              ผลการประเมินการคิดรบกวนใจอัตชีวิต (2Q)
            </h1>
            <div className="flex gap-3">
              <button className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:scale-105">
                <Share2 size={20} />
              </button>
              <button className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:scale-105">
                <Download size={20} />
              </button>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20 hover:scale-105 transition-transform duration-300`}>
              {resultData.hasRisk ? (
                <AlertTriangle className="text-white" size={40} />
              ) : (
                <Shield className="text-white" size={40} />
              )}
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              {resultData.riskLevel.level}
            </h2>
            <p className="text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
              {resultData.riskLevel.description}
            </p>
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
              <Calendar className="text-white" size={20} />
              <span className="text-white font-medium">ประเมินเมื่อ: {resultData.date}</span>
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
        
        {/* Emergency Alert - แสดงเฉพาะเมื่อมีความเสี่ยงสูง */}
        {resultData.hasRisk && (
          <div className="bg-red-600 rounded-3xl shadow-2xl border border-red-200 mb-10 p-8 text-white">
            <div className="flex items-start gap-4 mb-6">
              <AlertTriangle className="text-white flex-shrink-0 mt-1" size={32} />
              <div>
                <h3 className="text-2xl font-bold mb-3">ต้องการความช่วยเหลือทันที</h3>
                <p className="text-red-100 text-lg mb-6">
                  ผลการประเมินแสดงว่าคุณอาจมีความเสี่ยงต่อการทำร้ายตัวเอง กรุณาติดต่อขอความช่วยเหลือทันที
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
              resultData.hasRisk ? "bg-red-500" : "bg-green-500"
            }`}>
              <Activity className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">สรุปผลการประเมิน</h3>
            
            <div className={`inline-block px-8 py-4 rounded-2xl ${resultData.riskLevel.bg} border-2 ${resultData.riskLevel.border}`}>
              <div className={`text-2xl font-bold ${resultData.riskLevel.color} mb-2`}>
                {resultData.riskLevel.level}
              </div>
              <div className="text-gray-600">
                {resultData.riskLevel.description}
              </div>
            </div>
          </div>

          {/* Questions Review */}
          <div className="border-t pt-8">
            <h4 className="text-xl font-bold text-gray-800 mb-6">รายละเอียดคำตอบ</h4>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800 mb-3 leading-relaxed">{question.text}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">คำตอบ:</span>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          question.answer 
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-green-100 text-green-700 border border-green-200"
                        }`}>
                          {question.answer ? "มี" : "ไม่มี"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Immediate Actions */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">ควรทำทันที</h3>
                <p className="text-gray-600">ขั้นตอนเร่งด่วนที่ควรปฏิบัติ</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {recommendations.immediate.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">การดูแลระยะยาว</h3>
                <p className="text-gray-600">แผนการดูแลต่อเนื่อง</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {recommendations.longterm.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
              <ExternalLink className="text-white" size={32} />
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
          <button className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center gap-3">
              <Phone size={24} />
              <span>ติดต่อขอความช่วยเหลือ</span>
            </div>
          </button>
          
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-center gap-3">
              <FileText size={24} />
              <span>ทำแบบประเมินอื่น</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StressResultsPage;