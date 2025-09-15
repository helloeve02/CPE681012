import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Brain,
  Phone,
  FileText,
  Download,
  RefreshCw,
  Target,
  TrendingUp,
  Shield,
  Lightbulb,
  Users,
  Calendar,
  Activity,
  Home
} from "lucide-react";

const StressResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();


  // รับข้อมูลจาก React Router state หรือใช้ fallback data
  const [results] = useState(() => {
    if (location.state) {
      return location.state;
    }

    // Fallback: ลองดูจาก localStorage
    if (typeof window !== 'undefined') {
      const savedResults = window.localStorage.getItem('st5Results');
      if (savedResults) {
        try {
          return JSON.parse(savedResults);
        } catch (error) {
          console.error('Error parsing saved results:', error);
        }
      }
    }

    // Fallback mock data
    return {
      answers: {
        q1: 2,
        q2: 1,
        q3: 3,
        q4: 2,
        q5: 1
      },
      totalScore: 9,
      date: new Date().toLocaleDateString('th-TH'),
      timestamp: new Date().toISOString()
    };
  });

  const questions = [
    "มีปัญหาการนอน นอนไม่หลับหรือนอนมาก",
    "มีสมาธิน้อยลง",
    "หงุดหงิด / กระวนกระวาย / วิตกกังวล",
    "รู้สึกเบื่อ เซ็ง",
    "ไม่อยากพบปะผู้คน"
  ];

  const answerLabels = ["ไม่เลย", "บางครั้ง", "บ่อยครั้ง", "ประจำ"];

  const getScoreInterpretation = (score: number) => {
    if (score <= 4) return {
      level: "ความเศร้าน้อย",
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      gradient: "from-green-400 to-emerald-500",
      description: "ระดับความเศร้าของคุณอยู่ในเกณฑ์ปกติ",
      recommendation: "ควรดูแลรักษาสุขภาพจิตให้แข็งแรงต่อไป"
    };
    if (score <= 7) return {
      level: "ความเศร้าปานกลาง",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      gradient: "from-yellow-400 to-amber-500",
      description: "คุณมีอาการเศร้าในระดับปานกลาง",
      recommendation: "ควรดูแลตัวเองและหาวิธีจัดการกับความเครียด"
    };
    if (score <= 9) return {
      level: "ความเศร้ามาก",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      gradient: "from-orange-400 to-red-500",
      description: "คุณมีอาการเศร้าในระดับที่ต้องเฝ้าระวัง",
      recommendation: "แนะนำให้ปรึกษาผู้เชี่ยวชาญหรือบุคลากรทางการแพทย์"
    };
    return {
      level: "ความเศร้ามากที่สุด",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      gradient: "from-red-400 to-red-600",
      description: "คุณมีอาการเศร้าในระดับที่ควรได้รับการดูแล",
      recommendation: "ขอแนะนำให้พบแพทย์หรือนักจิตวิทยาโดยเร็วที่สุด"
    };
  };

  const interpretation = getScoreInterpretation(results.totalScore);

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = results.totalScore / 30;
      const animate = () => {
        current += increment;
        if (current <= results.totalScore) {
          setAnimatedScore(Math.floor(current));
          requestAnimationFrame(animate);
        } else {
          setAnimatedScore(results.totalScore);
        }
      };
      animate();
    }, 500);

    return () => clearTimeout(timer);
  }, [results.totalScore]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const getRecommendations = () => {
    const score = results.totalScore;
    if (score <= 4) {
      return [
        { icon: Activity, title: "ออกกำลังกาย", desc: "ออกกำลังกายสม่ำเสมอ 30 นาทีต่อวัน" },
        { icon: Heart, title: "พักผ่อน", desc: "นอนหลับให้เพียงพอ 7-8 ชั่วโมงต่อวัน" },
        { icon: Users, title: "เข้าสังคม", desc: "ทำกิจกรรมกับครอบครัวและเพื่อน" },
        { icon: Lightbulb, title: "ทำสิ่งที่ชอบ", desc: "หาเวลาทำกิจกรรมที่ทำให้มีความสุข" }
      ];
    } else if (score <= 7) {
      return [
        { icon: Brain, title: "จัดการความเครียด", desc: "เรียนรู้เทคนิคการผ่อนคลาย" },
        { icon: Users, title: "พูดคุย", desc: "เปิดใจคุยกับคนใกล้ชิด" },
        { icon: Activity, title: "ปรับกิจวัตร", desc: "สร้างกิจวัตรประจำวันที่เหมาะสม" },
        { icon: Calendar, title: "ติดตามอาการ", desc: "สังเกตอาการและบันทึกการเปลี่ยนแปลง" }
      ];
    } else {
      return [
        { icon: Phone, title: "ขอความช่วยเหลือ", desc: "ปรึกษาผู้เชี่ยวชาญด่านหรือสายด่วน" },
        { icon: Users, title: "หาการสนับสนุน", desc: "ขอการสนับสนุนจากคนใกล้ชิด" },
        { icon: Shield, title: "หลีกเลี่ยงความเสี่ยง", desc: "หลีกเลี่ยงสถานการณ์ที่เพิ่มความเครียด" },
        { icon: Calendar, title: "นัดหมายแพทย์", desc: "นัดพบจิตแพทย์หรือนักจิตวิทยา" }
      ];
    }
  };
  const recommendations = getRecommendations();
  const downloadResults = () => {
    const resultText = `
การประเมินความเศร้า ST-5
วันที่ประเมิน: ${results.date}
คะแนนรวม: ${results.totalScore} คะแนน
ระดับ: ${interpretation.level}

รายละเอียดคำตอบ:
${questions.map((q, i) => {
      const answer = results.answers[`q${i + 1}`];
      return `${i + 1}. ${q}\n   คำตอบ: ${answerLabels[answer]} (${answer} คะแนน)`;
    }).join('\n')}

คำแนะนำ: ${interpretation.recommendation}
    `;

    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ST5_Results_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareWithDoctor = () => {
    navigate("/");

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center mb-12">
            <button
              onClick={() => window.history.back()}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 text-white hover:scale-105"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="flex-1 text-center text-white font-bold text-2xl tracking-wide">
              ผลการประเมินความเศร้า
            </h1>
            <div className="w-16" />
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20">
              <Brain className="text-white" size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              ผลการประเมิน ST-5
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              วันที่ประเมิน: {results.date}
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-20 fill-current text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
        {/* Main Results Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 mb-10 p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            {/* Animated Score Circle */}
            <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(animatedScore / 15) * 251.2} 251.2`}
                  className={`bg-gradient-to-r ${interpretation.gradient} transition-all duration-1000 ease-out`}
                  style={{
                    background: `linear-gradient(45deg, ${interpretation.gradient})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">{animatedScore}</span>
                <span className="text-sm text-gray-500">คะแนน</span>
              </div>
            </div>

            {/* Result Status */}
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${interpretation.bg} ${interpretation.border} border-2 mb-4`}>
              <Heart className={interpretation.color} size={24} />
              <span className={`text-xl font-bold ${interpretation.color}`}>
                {interpretation.level}
              </span>
            </div>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
              {interpretation.description}
            </p>

            <div className={`p-4 rounded-xl ${interpretation.bg} border-l-4 ${interpretation.border}`}>
              <p className={`font-semibold ${interpretation.color}`}>
                💡 {interpretation.recommendation}
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Answers */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 mb-10 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-100 rounded-xl">
              <FileText className="text-purple-600" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">รายละเอียดคำตอบ</h3>
              <p className="text-gray-600">ผลการตอบแบบประเมินแต่ละข้อ</p>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((question, index) => {
              const answerValue = results.answers[`q${index + 1}` as keyof typeof results.answers];
              const answerLabel = answerLabels[answerValue];

              return (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-2">{question}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">คำตอบ:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${answerValue === 0 ? 'bg-green-100 text-green-700' :
                          answerValue === 1 ? 'bg-yellow-100 text-yellow-700' :
                            answerValue === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                        }`}>
                        {answerLabel} ({answerValue} คะแนน)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 mb-10 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-green-100 rounded-xl">
              <Target className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">คำแนะนำสำหรับคุณ</h3>
              <p className="text-gray-600">แนวทางการดูแลสุขภาพจิตตามผลประเมิน</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <rec.icon className="text-purple-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-2">{rec.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{rec.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        {results.totalScore >= 8 && (
          <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-3xl p-8 text-white mb-10 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
                <Phone className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-bold mb-4">หากต้องการความช่วยเหลือเร่งด่วน</h3>
              <p className="text-red-100 text-lg mb-8">อย่าลังเลที่จะขอความช่วยเหลือ</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="text-xl font-semibold mb-3">📞 สายด่วนสุขภาพจิต</h4>
                  <div className="space-y-2 text-red-100">
                    <div>• กรมสุขภาพจิต: 1323</div>
                    <div>• สายด่วนป้องกันการฆ่าตัวตาย: 1393</div>
                    <div>• ศูนย์ช่วยเหลือเด็ก: 1387</div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h4 className="text-xl font-semibold mb-3">🏥 การรักษา</h4>
                  <div className="space-y-2 text-red-100">
                    <div>• โรงพยาบาลใกล้บ้าน</div>
                    <div>• คลินิกจิตเวช</div>
                    <div>• ศูนย์สุขภาพจิตชุมชน</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">จัดการผลการประเมิน</h3>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <button
                onClick={downloadResults}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg">
                <Download size={20} />
                <span>ดาวน์โหลดผล</span>
              </button>

              <button
                onClick={shareWithDoctor}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 hover:scale-105 shadow-lg">
                <Home size={20} />
                <span>หน้าหลัก</span>
              </button>

              <button
                onClick={() => {
                  // ลบข้อมูลเก่าและกลับไปหน้าแบบประเมิน
                  if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('st5Results');
                  }
                  navigate("/assessment/stress"); // หรือ path ที่ถูกต้องสำหรับหน้าแบบประเมิน
                }}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg">
                <RefreshCw size={20} />
                <span>ประเมินใหม่</span>
              </button>
            </div>
          </div>
        </div>

        {/* Follow-up Information */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-700 rounded-3xl p-10 text-white mb-12 shadow-2xl">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
              <TrendingUp className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-6">การติดตามผล</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-purple-100">ควรประเมินซ้ำเมื่อใด</h4>
                <div className="space-y-2 text-purple-100">
                  <div>• ทุก 2 สัปดาห์หากมีอาการเศร้ามาก</div>
                  <div>• ทุกเดือนสำหรับการติดตาม</div>
                  <div>• เมื่อมีเหตุการณ์สำคัญในชีวิต</div>
                  <div>• หลังได้รับการรักษา</div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-purple-100">สิ่งที่ควรบันทึก</h4>
                <div className="space-y-2 text-purple-100">
                  <div>• อารมณ์และความรู้สึกประจำวัน</div>
                  <div>• คุณภาพการนอนหลับ</div>
                  <div>• การทำกิจกรรมต่างๆ</div>
                  <div>• การเปลี่ยนแปลงของอาการ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StressResultsPage;