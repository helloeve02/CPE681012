import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Calculator, 
  Activity, 
  Brain, 
  Stethoscope,
  FileText,
  TrendingUp,
  Shield
} from "lucide-react";

const healthSections = [
  {
    title: "สุขภาพทั่วไป",
    icon: Heart,
    color: "from-blue-500 to-blue-600",
    items: [
      { 
        label: "ตรวจสอบสุขภาพและดัชนีมวลกาย", 
        path: "/assessment/information/bmi",
        icon: Calculator,
        description: "ตรวจสอบดัชนีมวลกายและบันทึกข้อมูลสุขภาพส่วนตัว"
      }
    ],
  },
  {
    title: "โรคเสี่ยงพบบ่อย",
    icon: Shield,
    color: "from-red-500 to-red-600",
    items: [
      { 
        label: "โรคเบาหวาน", 
        path: "/assessment/selectagerange",
        icon: Activity,
        description: "ประเมินความเสี่ยงในการเป็นโรคเบาหวานและแนวทางป้องกัน"
      },
      { 
        label: "โรคไต", 
        path: "/assessment/kidneyriskassessmentpage",
        icon: Stethoscope,
        description: "ตรวจสอบปัจจัยเสี่ยงของโรคไตและการดูแลสุขภาพไต"
      },
    ],
  },
  {
    title: "ประเมินสุขภาพใจ",
    icon: Brain,
    color: "from-purple-500 to-purple-600",
    items: [
      { 
        label: "ประเมินความเครียด (ST5)", 
        path: "/assessment/stress",
        icon: TrendingUp,
        description: "ประเมินระดับความเครียดด้วยแบบประเมิน ST5 มาตรฐาน"
      },
      { 
        label: "ประเมินโรคซึมเศร้า (PHQ-9)", 
        path: "/assessment/depression",
        icon: FileText,
        description: "คัดกรองความเสี่ยงโรคซึมเศร้าด้วยแบบประเมิน 2Q"
      },
    ],
  },
];

const HealthAssessmentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Header Navigation */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/")}
              className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 text-white"
            >
              <ArrowLeft size={22} />
            </button>
            <h1 className="flex-1 text-center text-white font-bold text-xl tracking-wide">
              ประเมินสุขภาพ
            </h1>
            <div className="w-12" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
              <span className="text-4xl">🏥</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              ประเมินสุขภาพ
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              ตรวจสอบสุขภาพของคุณอย่างครอบคลุม พร้อมคำแนะนำจากผู้เชี่ยวชาญ
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
        {/* Main Content */}
        <div className="space-y-8 mb-12">
          {healthSections.map((section, sectionIdx) => {
            const SectionIcon = section.icon;
            return (
              <div key={sectionIdx} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Section Header */}
                <div className={`bg-gradient-to-r ${section.color} p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <SectionIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{section.title}</h3>
                      <p className="text-white/80 text-sm">
                        {section.items.length} รายการประเมิน
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {section.items.map((item, itemIdx) => {
                      const ItemIcon = item.icon;
                      return (
                        <button
                          key={itemIdx}
                          onClick={() => navigate(item.path)}
                          className="group bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-3 bg-gradient-to-r ${section.color} rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
                              <ItemIcon size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-blue-700 transition-colors duration-200">
                                {item.label}
                              </h4>
                              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {item.description}
                              </p>
                              
                              {/* Action indicator */}
                              <div className="flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <span>เริ่มประเมิน</span>
                                <ArrowLeft className="ml-2 rotate-180" size={14} />
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Info Card */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 border border-white/30">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">คำแนะนำสำหรับการประเมิน</h3>
            <p className="text-green-100 max-w-2xl mx-auto leading-relaxed">
              ควรทำการประเมินสุขภาพอย่างสม่ำเสมอเพื่อติดตามสุขภาพและป้องกันโรคต่างๆ 
              หากมีข้อสงสัยควรปรึกษาแพทย์หรือผู้เชี่ยวชาญ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessmentPage;