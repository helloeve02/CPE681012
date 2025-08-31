import React, { useState } from "react";
import {
  ArrowLeft,
  User,
  // Weight,
  Ruler,
  Heart,
  Droplets,
  Users,
  Info,
  // Calendar,
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiabetesMoreAssessmentPage: React.FC = () => {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    waist: "",
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    familyHistory: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleRadio = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // ฟังก์ชันคำนวณคะแนนความเสี่ยง
  const calculateRiskScore = () => {
    let totalScore = 0;

    // 1. อายุ
    const age = parseInt(form.age);
    if (age >= 34 && age <= 39) totalScore += 0;
    else if (age >= 40 && age <= 44) totalScore += 0;
    else if (age >= 45 && age <= 49) totalScore += 1;
    else if (age >= 50) totalScore += 2;

    // 2. เพศ
    if (form.gender === "female") totalScore += 0;
    else if (form.gender === "male") totalScore += 2;

    // 3. ดัชนีมวลกาย (BMI)
    const weight = parseFloat(form.weight);
    const height = parseFloat(form.height) / 100; // แปลงซม.เป็นม.
    if (weight && height) {
      const bmi = weight / (height * height);
      if (bmi < 23) totalScore += 0;
      else if (bmi >= 23 && bmi < 27.5) totalScore += 3;
      else if (bmi >= 27.5) totalScore += 5;
    }

    // 4. รอบเอว (ใช้เงื่อนไขจากเพศ)
    const waist = parseFloat(form.waist);
    if (waist) {
      if (form.gender === "female") {
        if (waist < 80) totalScore += 0;
        else if (waist >= 80) totalScore += 2;
      } else if (form.gender === "male") {
        if (waist < 90) totalScore += 0;
        else if (waist >= 90) totalScore += 2;
      }
    }

    // 5. ความดันโลหิต
    const systolic = parseInt(form.systolic);
    const diastolic = parseInt(form.diastolic);
    if (systolic && diastolic) {
      if (systolic < 140 && diastolic < 90) totalScore += 0;
      else totalScore += 2;
    }

    // 6. ประวัติโรคเบาหวานในญาติสายตรง
    if (form.familyHistory === "no") totalScore += 0;
    else if (form.familyHistory === "yes") totalScore += 4;

    return totalScore;
  };

  const getRiskLevel = (score: number) => {
    if (score < 12) {
      return {
        level: "ความเสี่ยงต่ำ",
        description: "คุณมีความเสี่ยงต่ำในการเป็นโรคเบาหวาน",
        color: "green",
        bgColor: "from-green-500 to-emerald-500"
      };
    } else {
      return {
        level: "ความเสี่ยงสูง",
        description: "คุณควรปรึกษาแพทย์เพื่อตรวจวินิจฉัยเพิ่มเติม",
        color: "red",
        bgColor: "from-red-500 to-rose-500"
      };
    }
  };

  const handleSubmit = () => {
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!form.age || !form.gender || !form.weight || !form.height || !form.systolic || !form.diastolic || !form.familyHistory) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const score = calculateRiskScore();
    const risk = getRiskLevel(score);

    console.log("Assessment data:", form);
    console.log("Risk Score:", score);

    // แสดงผลลัพธ์
    alert(`ผลการประเมิน:\nคะแนนรวม: ${score} คะแนน\nระดับความเสี่ยง: ${risk.level}\n${risk.description}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-kanit">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
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
              โรคเบาหวาน
            </h1>
            <div className="w-12" />
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-6 border border-white/20">
              <span className="text-4xl">🩺</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
              แบบประเมินความเสี่ยง
            </h2>
            <p className="text-xl text-green-100 max-w-2xl mx-auto leading-relaxed">
              สำหรับผู้ที่มีอายุ 35 ปีขึ้นไป
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

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        {/* Main Form Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="inline-flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full text-green-700 text-sm font-medium mb-4">
              <Activity size={16} />
              <span>แบบประเมินเข้มข้น</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">ข้อมูลพื้นฐาน</h3>
            <p className="text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อการประเมินที่แม่นยำ</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-blue-500 rounded-lg text-white">
                  <User size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-800">ข้อมูลส่วนตัว</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">อายุ</label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    min={35}
                    onChange={handleChange}
                    placeholder="กรอกอายุของคุณ"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">เพศ</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={form.gender === "male"}
                        onChange={() => handleRadio("gender", "male")}
                        className="text-blue-500"
                      />
                      <span>ชาย</span>
                    </label>
                    <label className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={form.gender === "female"}
                        onChange={() => handleRadio("gender", "female")}
                        className="text-blue-500"
                      />
                      <span>หญิง</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Measurements Section */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-500 rounded-lg text-white">
                  <Ruler size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-800">ข้อมูลทางกาย</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">น้ำหนัก (กก.)</label>
                  <input
                    name="weight"
                    type="number"
                    value={form.weight}
                    onChange={handleChange}
                    placeholder="น้ำหนัก"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ส่วนสูง (ซม.)</label>
                  <input
                    name="height"
                    type="number"
                    value={form.height}
                    onChange={handleChange}
                    placeholder="ส่วนสูง"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">รอบเอว (ซม.)</label>
                  <input
                    name="waist"
                    type="number"
                    value={form.waist}
                    onChange={handleChange}
                    placeholder="วัดในระดับสะดือ"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Blood Pressure Section */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-500 rounded-lg text-white">
                  <Heart size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-800">ความดันโลหิต</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ความดันตัวบน</label>
                  <input
                    name="systolic"
                    type="number"
                    value={form.systolic}
                    onChange={handleChange}
                    placeholder="Systolic"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ความดันตัวล่าง</label>
                  <input
                    name="diastolic"
                    type="number"
                    value={form.diastolic}
                    onChange={handleChange}
                    placeholder="Diastolic"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none transition-colors bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Family History Section */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-teal-500 rounded-lg text-white">
                  <Users size={20} />
                </div>
                <h4 className="text-lg font-bold text-gray-800">ประวัติครอบครัว</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  มีบิดา มารดา หรือพี่น้องสายตรงเป็นโรคเบาหวานหรือไม่
                </label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 hover:border-teal-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="familyHistory"
                      checked={form.familyHistory === "yes"}
                      onChange={() => handleRadio("familyHistory", "yes")}
                      className="text-teal-500"
                    />
                    <span>มี</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 hover:border-teal-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="familyHistory"
                      checked={form.familyHistory === "no"}
                      onChange={() => handleRadio("familyHistory", "no")}
                      className="text-teal-500"
                    />
                    <span>ไม่มี</span>
                  </label>
                  <label className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 border-2 border-gray-200 hover:border-teal-300 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      name="familyHistory"
                      checked={form.familyHistory === "unknown"}
                      onChange={() => handleRadio("familyHistory", "unknown")}
                      className="text-teal-500"
                    />
                    <span>ไม่ทราบ</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={!form.age || parseInt(form.age) < 35} // ✅ ปิดปุ่มถ้าอายุ < 35 หรือยังไม่ได้กรอก
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform
    ${!form.age || parseInt(form.age) < 35
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105 hover:shadow-xl"
                  }`}
              >
                ประเมินผลลัพธ์
              </button>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30 flex-shrink-0">
              <Info className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">ข้อมูลสำคัญ</h3>
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

export default DiabetesMoreAssessmentPage;