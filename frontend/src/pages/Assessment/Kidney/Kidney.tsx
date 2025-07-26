import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const KidneyriskAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: "",
    gender: "",
    waist: "",
    diabetes: "",
    bp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ส่งข้อมูลไปหน้าผลลัพธ์
    console.log("Form submitted", form);
    navigate("/assessment/kidney/result", { state: form });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 flex justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center text-white mb-5">
          <button onClick={() => navigate(-1)} className="text-xl mr-2">
            &larr;
          </button>
          <h1 className="text-lg font-bold">โรคไต</h1>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 space-y-5"
        >
          <h2 className="text-sm font-bold text-gray-800 leading-snug">
            แบบประเมินความเสี่ยงโรคไตใน 10 ปีข้างหน้า
          </h2>
          <p className="text-xs text-gray-500">
            โปรดเลือกคำตอบที่ตรงกับท่านที่สุดในแต่ละข้อ
          </p>

          {/* อายุ */}
          <div>
            <label className="text-sm font-medium block mb-1">อายุ</label>
            <select
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
            >
              <option value="">-- เลือกอายุ --</option>
              <option value="0">น้อยกว่า 45 ปี</option>
              <option value="2">45-54 ปี</option>
              <option value="4">มากกว่า 55 ปี</option>
            </select>
          </div>

          {/* เพศ */}
          <div>
            <label className="text-sm font-medium block mb-1">เพศ</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
            >
              <option value="">-- เลือกเพศ --</option>
              <option value="0">หญิง</option>
              <option value="3">ชาย</option>
            </select>
          </div>

          {/* รอบเอว */}
          <div>
            <label className="text-sm font-medium block mb-1">รอบเอว</label>
            <select
              name="waist"
              value={form.waist}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
            >
              <option value="">-- เลือกรอบเอว --</option>
              <option value="0">หญิง &lt; 80 ซม. / ชาย &lt; 90 ซม.</option>
              <option value="1">หญิง ≥ 80 ซม. / ชาย ≥ 90 ซม.</option>
            </select>
          </div>

          {/* เบาหวาน */}
          <div>
            <label className="text-sm font-medium block mb-1">ประวัติโรคเบาหวาน</label>
            <select
              name="diabetes"
              value={form.diabetes}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
            >
              <option value="">-- เลือกคำตอบ --</option>
              <option value="0">มี</option>
              <option value="2">ไม่มี</option>
            </select>
          </div>

          {/* ความดันโลหิต */}
          <div>
            <label className="text-sm font-medium block mb-1">ระดับความดันโลหิต</label>
            <select
              name="bp"
              value={form.bp}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-sm"
            >
              <option value="">-- เลือกระดับ --</option>
              <option value="-2">น้อยกว่า 120 มม.ปรอท</option>
              <option value="0">120-129 มม.ปรอท</option>
              <option value="1">130-139 มม.ปรอท</option>
              <option value="2">140-149 มม.ปรอท</option>
              <option value="3">150-159 มม.ปรอท</option>
              <option value="4">≥ 160 มม.ปรอท</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition"
          >
            ประเมินผล
          </button>
        </form>
      </div>
    </div>
  );
};

export default KidneyriskAssessmentPage;
