import React from "react";
import { useNavigate } from "react-router-dom";
// import { FaArrowLeft, FaYoutube } from "react-icons/fa";

const SelectAgeRange: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 flex flex-col items-center py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-xl text-white mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-white text-2xl hover:scale-110 transition"
        >
          {/* <FaArrowLeft /> */}
        </button>
        <h1 className="text-xl font-bold text-center flex-1 -ml-5">โรคเบาหวาน</h1>
      </div>

      {/* Content Box */}
      <div className="bg-white w-full max-w-xl rounded-t-2xl shadow-lg p-6 space-y-4 min-h-screen">

        <h2 className="text-base font-semibold text-gray-800">คุณอายุเท่าไหร่</h2>

        {/* ปุ่ม: สื่อมัลติมีเดีย */}
        <button
          onClick={() => navigate("/assessment/diabetesmoreassessmentpage")}
          className="flex items-center justify-between bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-xl w-full transition duration-200 shadow-sm"
        >
          <span className="text-gray-700 font-medium">ฉันอายุมากกว่า 35 ปีขึ้นไป</span>
          {/* <FaYoutube className="text-red-600 text-xl" /> */}
        </button>

        {/* ปุ่ม: อินโฟกราฟฟิก */}
        <button
          onClick={() => navigate("#")}
          className="flex items-center justify-between bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-xl w-full transition duration-200 shadow-sm"
        >
          <span className="text-gray-700 font-medium">ฉันอายุระหว่าง 15 - 34 ปี</span>
        </button>
        <h4>ผู้ประเมินต้องมีอายุมากกว่า 15 ปี ขึ้นไป</h4>
      </div>
    </div>
  );
};

export default SelectAgeRange;
