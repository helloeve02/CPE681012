import React, { useState } from "react";
import { 
  ArrowLeft, 
  User, 
  // Calendar,
  Ruler,
  Droplets,
  Heart,
  Stethoscope,
  Info,
  // Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const KidneyRiskAssessmentPage: React.FC = () => {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    waist: "",
    diabetes: "",
    bp: "",
  });
const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Kidney assessment data:", form);
    alert("การประเมินเสร็จสิ้น!");
  };

  const assessmentSections = [
    {
      title: "ข้อมูลทั่วไป",
      icon: User,
      color: "from-blue-500 to-blue-600",
      fields: [
        {
          name: "age",
          label: "อายุ",
          options: [
            { value: "", label: "-- เลือกอายุ --" },
            { value: "0", label: "น้อยกว่า 45 ปี" },
            { value: "2", label: "45-54 ปี" },
            { value: "4", label: "มากกว่า 55 ปี" }
          ],
          gridCols: "md:col-span-1"
        },
        {
          name: "gender",
          label: "เพศ",
          options: [
            { value: "", label: "-- เลือกเพศ --" },
            { value: "0", label: "หญิง" },
            { value: "3", label: "ชาย" }
          ],
          gridCols: "md:col-span-1"
        }
      ]
    },
    {
      title: "การวัดร่างกาย",
      icon: Ruler,
      color: "from-purple-500 to-purple-600",
      fields: [
        {
          name: "waist",
          label: "รอบเอว",
          options: [
            { value: "", label: "-- เลือกรอบเอว --" },
            { value: "0", label: "หญิง < 80 ซม. / ชาย < 90 ซม." },
            { value: "1", label: "หญิง ≥ 80 ซม. / ชาย ≥ 90 ซม." }
          ],
          gridCols: "md:col-span-2"
        }
      ]
    },
    {
      title: "ประวัติสุขภาพ",
      icon: Droplets,
      color: "from-green-500 to-emerald-600",
      fields: [
        {
          name: "diabetes",
          label: "ประวัติโรคเบาหวาน",
          options: [
            { value: "", label: "-- เลือกคำตอบ --" },
            { value: "0", label: "มี" },
            { value: "2", label: "ไม่มี" }
          ],
          gridCols: "md:col-span-2"
        }
      ]
    },
    {
      title: "ความดันโลหิต",
      icon: Heart,
      color: "from-red-500 to-red-600",
      fields: [
        {
          name: "bp",
          label: "ระดับความดันโลหิต",
          options: [
            { value: "", label: "-- เลือกระดับ --" },
            { value: "-2", label: "น้อยกว่า 120 มม.ปรอท" },
            { value: "0", label: "120-129 มม.ปรอท" },
            { value: "1", label: "130-139 มม.ปรอท" },
            { value: "2", label: "140-149 มม.ปรอท" },
            { value: "3", label: "150-159 มม.ปรอท" },
            { value: "4", label: "≥ 160 มม.ปรอท" }
          ],
          gridCols: "md:col-span-2"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600">
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
              โรคไต
            </h1>
            <div className="w-12" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
              <span className="text-4xl">🫘</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              ประเมินความเสี่ยง
            </h2>
            <p className="text-xl text-cyan-100 max-w-2xl mx-auto leading-relaxed">
              โรคไตใน 10 ปีข้างหน้า
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
        {/* Instructions Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0">
              <Info className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">คำแนะนำการประเมิน</h3>
              <p className="text-purple-100 leading-relaxed">
                โปรดเลือกคำตอบที่ตรงกับท่านที่สุดในแต่ละข้อ เพื่อให้ผลการประเมินมีความแม่นยำ
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Form */}
        <div className="space-y-8 mb-12">
          {assessmentSections.map((section, sectionIdx) => {
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
                        เลือกคำตอบที่เหมาะสมกับคุณ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Fields */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {section.fields.map((field, fieldIdx) => (
                      <div key={fieldIdx} className={field.gridCols}>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          {field.label}
                        </label>
                        <select
                          name={field.name}
                          value={form[field.name as keyof typeof form]}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-gray-50 hover:bg-white text-gray-700"
                        >
                          {field.options.map((option, optionIdx) => (
                            <option key={optionIdx} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Submit Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                  <Stethoscope className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">ประเมินผลลัพธ์</h3>
                  <p className="text-white/80 text-sm">
                    ตรวจสอบข้อมูลและกดปุ่มเพื่อดูผลการประเมิน
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                ประเมินผลลัพธ์
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-2xl mb-4">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">เกี่ยวกับการประเมินนี้</h3>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
              การประเมินความเสี่ยงโรคไตนี้จะช่วยคาดการณ์ความเป็นไปได้ในการเกิดโรคไตเรื้อรังใน 10 ปีข้างหน้า
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-xl font-bold text-blue-600 mb-1">5 ปัจจัย</div>
                <div className="text-sm text-blue-700">หลักในการประเมิน</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-xl font-bold text-green-600 mb-1">10 ปี</div>
                <div className="text-sm text-green-700">ระยะเวลาพยากรณ์</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-xl font-bold text-purple-600 mb-1">ป้องกัน</div>
                <div className="text-sm text-purple-700">ได้หากรู้เร็ว</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0">
              <Info className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">ข้อมูลสำคัญ</h3>
              <p className="text-amber-100 leading-relaxed mb-3">
                การประเมินนี้เป็นเพียงแนวทางเบื้องต้น <span className="font-bold text-white">ไม่ใช่การวินิจฉัยทางการแพทย์</span>
              </p>
              <div className="flex items-center gap-2 text-sm text-amber-100">
                <span className="w-2 h-2 bg-white/60 rounded-full"></span>
                <span>หากมีความเสี่ยงสูง ควรปรึกษาแพทย์เพื่อการตรวจวินิจฉัยที่แม่นยำ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KidneyRiskAssessmentPage;