import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DiabetesLessAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
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
    historyHighSugar: "",
    bmiOver25: "",
    lackExercise: "",
    highWaist: "",
    highPressure: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRadio = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    navigate("/assessment/diabetes/result", { state: form });
  };

  const radioQuestions = [
    { name: "familyHistory", label: "มีบิดา มารดา หรือพี่น้องสายตรงเป็นโรคเบาหวานหรือไม่" },
    { name: "historyHighSugar", label: "คุณมีประวัติน้ำตาลในเลือดสูงหรือเคยได้รับการวินิจฉัยว่าเป็นเบาหวานหรือไม่" },
    { name: "bmiOver25", label: "คุณมีค่าดัชนีมวลกาย (BMI) ตั้งแต่ 25 ขึ้นไปหรือไม่" },
    { name: "lackExercise", label: "คุณออกกำลังกายน้อยกว่าสัปดาห์ละ 3 วันหรือไม่" },
    { name: "highWaist", label: "คุณมีรอบเอวมากกว่าที่กำหนดหรือไม่" },
    { name: "highPressure", label: "คุณมีความดันโลหิตสูง หรือเคยได้รับการวินิจฉัยว่าเป็นความดันสูงหรือไม่" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 flex justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center text-white mb-5">
          <button onClick={() => navigate(-1)} className="text-xl mr-2">
            &larr;
          </button>
          <h1 className="text-lg font-bold">โรคเบาหวาน</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <h2 className="text-sm font-bold text-gray-800 leading-snug">
            แบบประเมินความเสี่ยงโรคเบาหวาน<br />ผู้ที่มีอายุระหว่าง 15 - 34 ปีขึ้นไป
          </h2>

          <input
            type="number"
            name="age"
            onChange={handleChange}
            placeholder="อายุ"
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
          />

          {/* Gender */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">เพศ</p>
            <div className="flex space-x-6 text-sm">
              <label>
                <input type="radio" name="gender" onChange={() => handleRadio("gender", "male")} /> ชาย
              </label>
              <label>
                <input type="radio" name="gender" onChange={() => handleRadio("gender", "female")} /> หญิง
              </label>
            </div>
          </div>

          {/* Basic Inputs */}
          <input name="weight" type="number" onChange={handleChange} placeholder="น้ำหนัก" className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm" />
          <input name="height" type="number" onChange={handleChange} placeholder="ส่วนสูง" className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm" />
          <input name="waist" type="number" onChange={handleChange} placeholder="รอบเอว วัดในระดับสะดือ" className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm" />

          {/* Blood Pressure */}
          <h2 className="text-sm font-bold text-gray-800 mt-4">ค่าความดัน</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="systolic" type="number" onChange={handleChange} placeholder="ค่าความดันตัวบน" className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm" />
            <input name="diastolic" type="number" onChange={handleChange} placeholder="ค่าความดันตัวล่าง" className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm" />
          </div>

          {/* Blood Sugar */}
          <h2 className="text-sm font-bold text-gray-800 mt-4">ระดับน้ำตาลในเลือด</h2>
          <input
            name="bloodSugar"
            type="number"
            onChange={handleChange}
            placeholder="ระดับน้ำตาลในเลือดขณะอดอาหาร"
            className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
          />

          {/* Radio Questions */}
          {radioQuestions.map((item) => (
            <div key={item.name}>
              <p className="text-sm font-medium text-gray-700 mt-4">{item.label}</p>
              <div className="flex space-x-4 text-sm mt-1">
                <label><input type="radio" name={item.name} onChange={() => handleRadio(item.name, "yes")} /> มี</label>
                <label><input type="radio" name={item.name} onChange={() => handleRadio(item.name, "no")} /> ไม่มี</label>
                <label><input type="radio" name={item.name} onChange={() => handleRadio(item.name, "unknown")} /> ไม่ทราบ</label>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition"
          >
            ประเมินผล
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiabetesLessAssessmentPage;
