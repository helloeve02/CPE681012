import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const DiabetesMoreAssessmentPage: React.FC = () => {
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRadio = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    // ส่งข้อมูลไปหน้าผลลัพธ์
    navigate("/assessment/diabetes/result", { state: form });
  };

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
            แบบประเมินความเสี่ยงโรคเบาหวาน<br />ผู้ที่มีอายุ 35 ปีขึ้นไป
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
              <label><input type="radio" name="gender" onChange={() => handleRadio("gender", "male")} /> ชาย</label>
              <label><input type="radio" name="gender" onChange={() => handleRadio("gender", "female")} /> หญิง</label>
            </div>
          </div>

          {/* Basic Inputs */}
          <input name="weight" type="number" onChange={handleChange} placeholder="น้ำหนัก" className="input-field" />
          <input name="height" type="number" onChange={handleChange} placeholder="ส่วนสูง" className="input-field" />
          <input name="waist" type="number" onChange={handleChange} placeholder="รอบเอว วัดในระดับสะดือ" className="input-field" />

          {/* Blood Pressure */}
          <h2 className="text-sm font-bold text-gray-800 mt-4">ค่าความดัน</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="systolic" type="number" onChange={handleChange} placeholder="ค่าความดันตัวบน" className="input-field" />
            <input name="diastolic" type="number" onChange={handleChange} placeholder="ค่าความดันตัวล่าง" className="input-field" />
          </div>

          {/* Blood Sugar */}
          <h2 className="text-sm font-bold text-gray-800 mt-4">ระดับน้ำตาลในเลือด</h2>
          <input
            name="bloodSugar"
            type="number"
            onChange={handleChange}
            placeholder="ระดับน้ำตาลในเลือดขณะอดอาหาร"
            className="input-field"
          />

          {/* Family History */}
          <div>
            <p className="text-sm font-medium text-gray-700 mt-4">
              มีบิดา มารดา หรือพี่น้องสายตรงเป็นโรคเบาหวานหรือไม่
            </p>
            <div className="flex space-x-4 text-sm mt-1">
              <label><input type="radio" name="familyHistory" onChange={() => handleRadio("familyHistory", "yes")} /> มี</label>
              <label><input type="radio" name="familyHistory" onChange={() => handleRadio("familyHistory", "no")} /> ไม่มี</label>
              <label><input type="radio" name="familyHistory" onChange={() => handleRadio("familyHistory", "unknown")} /> ไม่ทราบ</label>
            </div>
          </div>

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

export default DiabetesMoreAssessmentPage;
