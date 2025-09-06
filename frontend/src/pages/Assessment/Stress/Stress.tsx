import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
//   Activity, 
  Brain,
  CheckCircle,
  AlertCircle,
  FileText,
//   BarChart3
} from "lucide-react";

const StressAssessmentForm: React.FC = () => {
    const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const questions = [
    {
      id: "q1",
      text: "มีปัญหาการนอน นอนไม่หลับหรือนอนมาก"
    },
    {
      id: "q2", 
      text: "มีสมาธิน้อยลง"
    },
    {
      id: "q3",
      text: "หงุดหงิด / กระวนกระวาย / วิตกกังวล"
    },
    {
      id: "q4",
      text: "รู้สึกเบื่อ เซ็ง"
    },
    {
      id: "q5",
      text: "ไม่อยากพบปะผู้คน"
    }
  ];

  const options = [
    { value: 0, label: "ไม่เลย", description: "ไม่เป็นอย่างเเก่วข้องแนวไม่มี" },
    { value: 1, label: "บางครั้ง", description: "เป็นบางครั้ง" },
    { value: 2, label: "บ่อยครั้ง", description: "เป็นบ่อยครั้ง" },
    { value: 3, label: "ประจำ", description: "เป็นประจำ" }
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

  const getScoreInterpretation = (score: number) => {
    if (score <= 4) return { level: "ความเศร้าน้อย", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (score <= 7) return { level: "ความเศร้าปานกลาง", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    if (score <= 9) return { level: "ความเศร้ามาก", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { level: "ความเศร้ามากที่สุด", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  };

  const isFormComplete = () => {
    return Object.keys(answers).length === questions.length;
  };

  const handleSubmit = () => {
    if (isFormComplete()) {
      const totalScore = getTotalScore();
      const interpretation = getScoreInterpretation(totalScore);
      const resultData = {
        answers,
        totalScore,
        interpretation,
        date: new Date().toLocaleDateString('th-TH'),
        timestamp: new Date().toISOString()
      };
      
      // ในการใช้งานจริงอาจจะใช้ React Router หรือ state management
      navigate("/assessment/stress-result", { state: resultData });
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
            <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
              {question.text}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map((option) => (
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

  const currentScore = getTotalScore();
  const scoreInterpretation = getScoreInterpretation(currentScore);

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
              แบบประเมินความเศร้า (ST-5)
            </h1>
            <div className="w-16" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20 hover:scale-105 transition-transform duration-300">
              <Brain className="text-white" size={40} />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              ประเมินสภาพจิตใจ
            </h2>
            <p className="text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-8">
              แบบประเมินความเศร้าใจ เพื่อดูแลสุขภาพจิตของคุณ
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
              <p className="text-gray-600">ตอบคำถาม 5 ข้อเพื่อประเมินระดับความเศร้าของคุณ</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {getCompletedQuestions()}/5
              </div>
              <div className="text-sm text-gray-500">คำถามที่ตอบแล้ว</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(getCompletedQuestions() / 5) * 100}%` }}
            ></div>
          </div>

          {/* Live Score Preview */}
          {getCompletedQuestions() > 0 && (
            <div className={`mt-6 p-4 rounded-xl ${scoreInterpretation.bg} border-l-4 ${scoreInterpretation.border}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">คะแนนปัจจุบัน</span>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-800">{currentScore} คะแนน</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${scoreInterpretation.color} bg-white/80`}>
                      {scoreInterpretation.level}
                    </span>
                  </div>
                </div>
                <Heart className="text-purple-500" size={24} />
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex items-start gap-4">
            <FileText className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">คำแนะนำการทำแบบประเมิน</h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                ความเศร้าเกิดขึ้นได้กับทุกคน สำหรับที่ให้ใช้เกิดความเศร้ามีลักษณะอย่างใด เช่น รายได้ไม่เพียงพอหรือ เซ็ง ร้อนใจ ที่ให้ใช้เกิดความต้องใจ้ เป็นต้น ความเศร้าอีกชนิดประเจียนคนเฮงใช้ไหล์ ช่วยให้การ
              </p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-10">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">คำถามประเมิน</h3>
            <p className="text-gray-600 text-lg">กรุณาเลือกคำตอบที่ตรงกับความรู้สึกของคุณมากที่สุด</p>
          </div>
          
          {questions.map((question, index) => renderQuestion(question, index))}
        </div>


        {/* Submit Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
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
                ? `คะแนนรวมของคุณ: ${currentScore} คะแนน (${scoreInterpretation.level})`
                : `คุณได้ตอบคำถามไปแล้ว ${getCompletedQuestions()} จาก 5 ข้อ`
              }
            </p>
            
            <button
              onClick={handleSubmit}
              disabled={!isFormComplete()}
              className={`w-full max-w-md py-5 rounded-2xl font-bold text-lg text-white transition-all duration-300 ${
                isFormComplete()
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 transform hover:scale-105 shadow-xl hover:shadow-2xl"
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
                  <span>กรุณาตอบคำถามให้ครบ 5 ข้อ</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-3xl p-10 text-white mb-12 shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-6">การดูแลสุขภาพจิต</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-purple-100">เมื่อมีความเศร้า</h4>
                <div className="space-y-2 text-purple-100">
                  <div>• พูดคุยกับคนที่ไว้ใจได้</div>
                  <div>• ออกกำลังกายเบาๆ</div>
                  <div>• ทำกิจกรรมที่ชื่นชอบ</div>
                  <div>• รับประทานอาหารที่มีประโยชน์</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-purple-100">เมื่อไหร่ควรพบแพทย์</h4>
                <div className="space-y-2 text-purple-100">
                  <div>• อาการเศร้านานเกิน 2 สัปดาห์</div>
                  <div>• รบกวนการทำงาน/เรียน</div>
                  <div>• มีความคิดทำร้ายตัวเอง</div>
                  <div>• ไม่สามารถทำกิจวัตรได้</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressAssessmentForm;