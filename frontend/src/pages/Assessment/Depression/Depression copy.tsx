import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const DepressionAssessmentForm: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const questions = [
    {
      id: "q1",
      text: "เบื่อ ไม่สนใจท่าอะไร"
    },
    {
      id: "q2", 
      text: "ไม่สบายใจ ซึมเศร้า ท้อแท้"
    },
    {
      id: "q3",
      text: "หลับยากหรือหลับๆ ตื่นๆ หรือหลับมากไป"
    },
    {
      id: "q4",
      text: "เหนื่อยง่ายหรือไม่ค่อยมีแรง"
    },
    {
      id: "q5",
      text: "เบื่ออาหาร หรือกินมากเกินไป"
    },
    {
      id: "q6",
      text: "รู้สึกไม่ดีกับตัวเอง คิดว่าตัวเองล้มเหลว หรือทำให้ตนเองหรือครอบครัวผิดหวัง"
    },
    {
      id: "q7",
      text: "สมาธิไม่ดีเวลาทำอะไร เช่น ดูโทรทัศน์ฟังวิทยุ หรือทำงานที่ต้องใช้ความตั้งใจ"
    },
    {
      id: "q8",
      text: "พูดช้า ท่าอะไรช้าลง จนคนอื่นสังเกตเห็นได้ หรือกระสับกระส่ายไม่สามารถอยู่นิ่งได้เหมือนที่เคยเป็น"
    },
    {
      id: "q9",
      text: "คิดทำร้ายตนเองหรือคิดว่าตายไปจะดี"
    }
  ];

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const getCompletedQuestions = () => {
    return Object.keys(answers).length;
  };

  const getTotalScore = () => {
    return Object.values(answers).reduce((sum, score) => sum + score, 0);
  };

  const getRiskLevel = () => {
    const totalScore = getTotalScore();
    
    if (totalScore >= 0 && totalScore <= 6) {
      return { 
        level: "ไม่มีภาวะซึมเศร้า", 
        color: "text-green-600", 
        bg: "bg-green-50", 
        border: "border-green-200",
        description: "ระดับอาการปกติ"
      };
    } else if (totalScore >= 7 && totalScore <= 12) {
      return { 
        level: "มีภาวะซึมเศร้าระดับน้อย", 
        color: "text-yellow-600", 
        bg: "bg-yellow-50", 
        border: "border-yellow-200",
        description: "ควรติดตามอาการและดูแลตนเอง"
      };
    } else if (totalScore >= 13 && totalScore <= 18) {
      return { 
        level: "มีภาวะซึมเศร้าระดับปานกลาง", 
        color: "text-orange-600", 
        bg: "bg-orange-50", 
        border: "border-orange-200",
        description: "ควรปรึกษาผู้เชี่ยวชาญ"
      };
    } else {
      return { 
        level: "มีภาวะซึมเศร้าระดับรุนแรง", 
        color: "text-red-600", 
        bg: "bg-red-50", 
        border: "border-red-200",
        description: "ควรพบแพทย์เพื่อรับการรักษาทันที"
      };
    }
  };

  const isFormComplete = () => {
    return Object.keys(answers).length === questions.length;
  };

  const hasHighRisk = () => {
    return getTotalScore() >= 13;
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
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {index + 1}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 leading-relaxed mb-2">
              {question.text}
            </h3>
            <p className="text-sm text-gray-500">ใน 2 สัปดาห์ที่ผ่านมารวมวันนี้ ท่านมีอาการเหล่านี้บ่อยแค่ไหน</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { value: 0, label: "ไม่มีเลย", description: "ไม่เป็นอย่างนั้นเลย" },
          { value: 1, label: "เป็นบางวัน", description: "1-7 วัน" },
          { value: 2, label: "เป็นบ่อย", description: ">7 วัน" },
          { value: 3, label: "เป็นทุกวัน", description: "ทุกวันหรือเกือบทุกวัน" }
        ].map((option) => (
          <label
            key={option.value}
            className={`relative cursor-pointer group ${
              answers[question.id] === option.value
                ? "ring-2 ring-purple-500"
                : ""
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option.value}
              checked={answers[question.id] === option.value}
              onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
              className="sr-only"
            />
            <div className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              answers[question.id] === option.value
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
            }`}>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800 mb-1">
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700">
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
              แบบประเมินโรคซึมเศร้า (9Q)
            </h1>
            <div className="w-16" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20 hover:scale-105 transition-transform duration-300">
              <Shield className="text-white" size={40} />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              ประเมินสภาพจิตใจ
            </h2>
            <p className="text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-8">
              แบบประเมินโรคซึมเศร้า 9 ข้อ เพื่อดูแลสุขภาพจิตของคุณ
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
              <p className="text-gray-600">ตอบคำถาม 9 ข้อเพื่อประเมินระดับภาวะซึมเศร้า</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {getCompletedQuestions()}/9
              </div>
              <div className="text-sm text-gray-500">คำถามที่ตอบแล้ว</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(getCompletedQuestions() / 9) * 100}%` }}
            ></div>
          </div>

          {/* Live Score Preview */}
          {getCompletedQuestions() > 0 && (
            <div className={`mt-6 p-4 rounded-xl ${currentRisk.bg} border-l-4 ${currentRisk.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">คะแนนและระดับปัจจุบัน</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-800">{getTotalScore()} คะแนน</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${currentRisk.color} bg-white/80`}>
                      {currentRisk.level}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{currentRisk.description}</span>
                </div>
                <Heart className="text-purple-500" size={24} />
              </div>
            </div>
          )}
        </div>

        {/* Important Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <FileText className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">การแปลผลแบบประเมิน</h4>
              <div className="text-blue-800 text-sm leading-relaxed space-y-2">
                <div>• <strong>0-6 คะแนน:</strong> ไม่มีภาวะซึมเศร้า</div>
                <div>• <strong>7-12 คะแนน:</strong> มีภาวะซึมเศร้าระดับน้อย</div>
                <div>• <strong>13-18 คะแนน:</strong> มีภาวะซึมเศร้าระดับปานกลาง</div>
                <div>• <strong>19 คะแนนขึ้นไป:</strong> มีภาวะซึมเศร้าระดับรุนแรง</div>
              </div>
              <div className="bg-blue-100 rounded-lg p-3 mt-4">
                <p className="text-sm font-semibold text-blue-900">หมายเหตุ: หากคะแนน ≥ 7 ให้พิจารณาส่งต่อหรือปรึกษาผู้เชี่ยวชาญเพื่อรับการตรวจวินิจฉัยเพิ่มเติม</p>
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