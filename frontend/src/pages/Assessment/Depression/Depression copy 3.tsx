import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  // Brain,
  CheckCircle,
  AlertCircle,
  FileText,
  Shield,
  Phone
} from "lucide-react";

const DepressionAssessmentForm: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const questions = [
    {
      id: "q1",
      text: "ใน 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านรู้สึก หดหู่ เศร้าหรือท้อแท้สิ้นหวังหรือไม่"
    },
    {
      id: "q2", 
      text: "ใน 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านรู้สึกเบื่อ ทำอะไรก็ไม่เพลิดเพลินหรือไม่"
    }
  ];

  const handleAnswerChange = (questionId: string, value: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getCompletedQuestions = () => {
    return Object.keys(answers).length;
  };

  const getRiskLevel = () => {
    const positiveAnswers = Object.values(answers).filter(answer => answer).length;
    
    if (positiveAnswers === 0) {
      return { 
        level: "ความเสี่ยงต่ำ", 
        color: "text-green-600", 
        bg: "bg-green-50", 
        border: "border-green-200",
        description: "ไม่พบสัญญาณเตือนภัยในขณะนี้"
      };
    } else {
      return { 
        level: "ความเสี่ยงสูง", 
        color: "text-red-600", 
        bg: "bg-red-50", 
        border: "border-red-200",
        description: "ควรปรึกษาผู้เชี่ยวชาญด่วน"
      };
    }
  };

  const isFormComplete = () => {
    return Object.keys(answers).length === questions.length;
  };

  const hasRisk = () => {
    return Object.values(answers).some(answer => answer);
  };

  const handleSubmit = () => {
    if (isFormComplete()) {
      const riskLevel = getRiskLevel();
      const resultData = {
        answers,
        riskLevel,
        hasRisk: hasRisk(),
        date: new Date().toLocaleDateString('th-TH'),
        timestamp: new Date().toISOString()
      };
      
      navigate("/assessment/depression-result", { state: resultData });
    }
  };

  const renderQuestion = (question: any, index: number) => (
    <div key={question.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {question.text}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { value: false, label: "ไม่มี", description: "ไม่รู้สึกเช่นนั้น" },
          { value: true, label: "มี", description: "รู้สึกเช่นนั้น" }
        ].map((option) => (
          <label
            key={option.value.toString()}
            className={`relative cursor-pointer group ${
              answers[question.id] === option.value
                ? "ring-2 ring-red-500"
                : ""
            }`}
          >
            <input
              type="radio"
              name={question.id}
              checked={answers[question.id] === option.value}
              onChange={() => handleAnswerChange(question.id, option.value)}
              className="sr-only"
            />
            <div className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              answers[question.id] === option.value
                ? option.value 
                  ? "border-red-500 bg-red-50" 
                  : "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-red-300 hover:bg-red-50/50"
            }`}>
              <div className="text-center">
                <div className={`text-lg font-bold mb-1 ${
                  option.value ? "text-red-700" : "text-green-700"
                }`}>
                  {option.label}
                </div>
                <div className="text-sm text-gray-600">
                  {option.description}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );

  const currentRisk = getRiskLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-pink-700">
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
              แบบประเมินโรคซึมเศร้าด้วย 2 คำถาม (2Q)
            </h1>
            <div className="w-16" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20 hover:scale-105 transition-transform duration-300">
              <Shield className="text-white" size={40} />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              ประเมินความเสี่ยง
            </h2>
            <p className="text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed mb-8">
              แบบประเมินเบื้องต้นเพื่อดูแลความปลอดภัยของคุณ
            </p>
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
        {/* Progress Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 mb-10 p-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">ความคืบหน้าการประเมิน</h3>
              <p className="text-gray-600">ตอบคำถาม 2 ข้อเพื่อประเมินความเสี่ยงเบื้องต้น</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {getCompletedQuestions()}/2
              </div>
              <div className="text-sm text-gray-500">คำถามที่ตอบแล้ว</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-red-500 to-orange-600 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(getCompletedQuestions() / 2) * 100}%` }}
            ></div>
          </div>

          {/* Live Risk Preview */}
          {getCompletedQuestions() > 0 && (
            <div className={`mt-6 p-4 rounded-xl ${currentRisk.bg} border-l-4 ${currentRisk.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">ระดับความเสี่ยงปัจจุบัน</span>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentRisk.color} bg-white/80`}>
                      {currentRisk.level}
                    </span>
                    <span className="text-sm text-gray-600">{currentRisk.description}</span>
                  </div>
                </div>
                <Shield className="text-red-500" size={24} />
              </div>
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-white flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-white mb-2">ข้อควรทราบสำคัญ</h4>
              <p className="text-red-100 text-sm leading-relaxed mb-4">
                แบบประเมินนี้เป็นเครื่องมือคัดกรองเบื้องต้นเท่านั้น หากคำตอบ "มี" ใน 2 คำถาม คือว่า ปกติ ไม่เป็นโรคซึมเศร้า หรือแนวโน้มเป็นโรคซึมเศร้า หมายถึง มีความเสี่ยงเป็นโรคซึมเศร้า
              </p>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-sm font-semibold">สำคัญ: หากรู้สึกอยากทำร้ายตัวเองหรือมีความคิดเกี่ยวกับการฆ่าตัวตาย กรุณาติดต่อช่วยเหลือทันที</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <Phone className="text-white" size={24} />
            <h4 className="font-bold text-xl">ช่องทางขอความช่วยเหลือฉุกเฉิน</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/20 rounded-lg p-4">
              <div className="font-semibold mb-1">สายด่วนสุขภาพจิต</div>
              <div className="text-blue-100">1323 (24 ชั่วโมง)</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <div className="font-semibold mb-1">ศูนย์ช่วยเหลือ</div>
              <div className="text-blue-100">1300 (24 ชั่วโมง)</div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-10">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">คำถามประเมิน</h3>
            <p className="text-gray-600 text-lg">กรุณาตอบคำถามอย่างตรงไปตรงมา เพื่อความปลอดภัยของคุณ</p>
          </div>
          
          {questions.map((question, index) => renderQuestion(question, index))}
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
              {isFormComplete() ? (
                <CheckCircle className="text-white" size={32} />
              ) : (
                <FileText className="text-white" size={32} />
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {isFormComplete() ? "เสร็จสมบูรณ์!" : "กรุณาตอบคำถามให้ครบ"}
            </h3>
            
            <p className="text-gray-600 mb-8 text-lg">
              {isFormComplete() 
                ? `ระดับความเสี่ยง: ${currentRisk.level}`
                : `คุณได้ตอบคำถามไปแล้ว ${getCompletedQuestions()} จาก 2 ข้อ`
              }
            </p>
            
            <button
              onClick={handleSubmit}
              disabled={!isFormComplete()}
              className={`w-full max-w-md py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${
                isFormComplete()
                  ? "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isFormComplete() ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle size={24} />
                  <span>ดูผลการประเมินและคำแนะนำ</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <AlertCircle size={24} />
                  <span>กรุณาตอบคำถามให้ครบ 2 ข้อ</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Safety Info Section */}
        <div className="bg-gradient-to-r from-red-600 via-orange-600 to-pink-700 rounded-3xl p-10 text-white mb-12 shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-6">ความปลอดภัยคือสิ่งสำคัญที่สุด</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-red-100">สัญญาณเตือนภัย</h4>
                <div className="space-y-2 text-red-100">
                  <div>• ความรู้สึกสิ้นหวัง</div>
                  <div>• ไม่อยากทำอะไร</div>
                  <div>• แยกตัวจากคนอื่น</div>
                  <div>• นอนไม่หลับหรือนอนมาก</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-red-100">วิธีดูแลตัวเอง</h4>
                <div className="space-y-2 text-red-100">
                  <div>• พูดคุยกับคนที่ไว้ใจ</div>
                  <div>• ขอความช่วยเหลือจากผู้เชี่ยวชาญ</div>
                  <div>• หลีกเลี่ยงการอยู่คนเดียว</div>
                  <div>• ติดต่อสายด่วนเมื่อจำเป็น</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepressionAssessmentForm;