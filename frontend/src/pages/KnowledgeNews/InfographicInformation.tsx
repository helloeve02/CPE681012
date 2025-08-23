 import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const InfographicInformation: React.FC = () => {
  const navigate = useNavigate();

  const tabs = ["ทั้งหมด", "โรคไต", "โรคเบาหวาน", "ออกกำลังกาย", "โภชนาการ"];

  // Mapping tab -> path
  const tabToPath: Record<string, string | null> = {
    "ทั้งหมด": null,         // stay หน้าเดิม
    "โรคไต": "/KidneyInformation",
    "โรคเบาหวาน": "/DiabetesInformation",
    "ออกกำลังกาย": "/ExerciseInformation",
    "โภชนาการ": "/NutritionInformation",
  };

  const handleTabClick = (tab: string) => {
    const path = tabToPath[tab];
    if (path) {
      navigate(path); // ไปหน้าที่ mapping ไว้
    } else {
      console.log("กรองข้อมูลหรือ stay หน้าเดิมสำหรับ:", tab);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl mx-auto pb-8">
        <div className="flex items-center p-4 border-b">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={22} />
          </button>
          <h1 className="flex-1 text-center text-blue-700 font-bold text-lg">
            ข่าวสาร
          </h1>
          <div className="w-8" />
        </div>

        <h2 className="text-center text-cyan-500 font-bold text-2xl mt-4">
          อินโฟกราฟฟิก
        </h2>

        <div className="flex mt-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className="flex-1 py-2 font-medium text-center border-r last:border-r-0 bg-gray-200 text-gray-600"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfographicInformation;

