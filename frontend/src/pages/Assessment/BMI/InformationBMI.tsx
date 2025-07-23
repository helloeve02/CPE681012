import React from "react";
import { useNavigate } from "react-router-dom";

const GeneralHealthIntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 px-4 py-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-xl text-white mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-2xl hover:scale-110 transition transform"
        >
          &larr;
        </button>
        <h1 className="text-xl font-bold text-center flex-1 -ml-6">คำนวณดัชนีมวลกาย</h1>
        <div className="w-6" /> {/* For spacing balance */}
      </div>

      {/* Content Box */}
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 flex flex-col items-center space-y-6">
        {/* Title & Description */}
        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold text-gray-800">สุขภาพทั่วไป</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            กรอกข้อมูลเพื่อคำนวณดัชนีมวลกายอย่างแม่นยำ<br />
            ระบบจะแสดงผลลัพธ์เกี่ยวกับภาวะสุขภาพเบื้องต้นของคุณ
          </p>
        </div>

        {/* Illustration */}
        <img
          src="https://undraw.co/api/illustrations/856038bd-f5cb-4d80-8d7f-96c5dfd8971d"
          alt="intro illustration"
          className="w-48 h-auto"
        />

        {/* CTA Button */}
        <button
          onClick={() => navigate("/assessment/bmi")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-semibold shadow-md transition"
        >
          คำนวณดัชนีมวลกาย
        </button>
      </div>
    </div>
  );
};

export default GeneralHealthIntroPage;
