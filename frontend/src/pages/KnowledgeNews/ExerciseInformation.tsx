import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const ExerciseInformation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("ทั้งหมด");

  const tabs = ["ทั้งหมด", "บทความ", "คลังวิดีโอ", "อินโฟกราฟฟิก"];

  // ข้อมูลตัวอย่าง (มี type สำหรับระบุหมวดหมู่)
  const newsData = [
    {
      type: "บทความ",
      title: "บทความ: หวานรักอันตราย",
      description:
        "นี่คือเนื้อหาบทความเกี่ยวกับโรคเบาหวาน และการป้องกัน...",
    },
    {
      type: "คลังวิดีโอ",
      title: "วิดีโอ: หวานรักอันตราย",
      description:
        "วิดีโออธิบายเกี่ยวกับโรคเบาหวาน และการดูแลสุขภาพ...",
    },
    {
      type: "อินโฟกราฟฟิก",
      title: "อินโฟกราฟฟิก: หวานรักอันตราย",
      description:
        "อินโฟกราฟฟิกข้อมูลเกี่ยวกับโรคเบาหวาน เข้าใจง่าย...",
    },
    {
      type: "บทความ",
      title: "บทความ: โภชนาการที่ดี",
      description:
        "ข้อมูลเกี่ยวกับอาหารที่มีประโยชน์ต่อร่างกาย และสุขภาพ...",
    },
    {
      type: "คลังวิดีโอ",
      title: "วิดีโอ: โภชนาการที่ดี",
      description:
        "วิดีโอแนะนำการเลือกอาหาร และการปรับพฤติกรรมการกิน...",
    },
    {
      type: "อินโฟกราฟฟิก",
      title: "อินโฟกราฟฟิก: โภชนาการที่ดี",
      description:
        "ภาพข้อมูลโภชนาการ และการกินอาหารเพื่อสุขภาพ...",
    },
  ];

  // กรองข้อมูลตาม tab
  const filteredNews =
    activeTab === "ทั้งหมด"
      ? newsData
      : newsData.filter((item) => item.type === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-300 p-4">
      {/* กล่องเนื้อหา */}
      <div className="bg-white rounded-xl shadow-lg max-w-6xl mx-auto pb-8">
        {/* Header */}
        <div className="flex items-center p-4 border-b">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft size={22} />
          </button>
          <h1 className="flex-1 text-center text-blue-700 font-bold text-lg">
            ข่าวสาร
          </h1>
          <div className="w-8" /> {/* เว้นที่ให้เท่ากับปุ่มซ้าย */}
        </div>

        {/* Title */}
        <h2 className="text-center text-cyan-500 font-bold text-2xl mt-4">
          ออกกำลังกาย
        </h2>

        {/* Tabs */}
        <div className="flex mt-4 border-b">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 font-medium text-center border-r last:border-r-0 ${
                activeTab === tab
                  ? "bg-white text-black border-b-2 border-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* News Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 mt-6">
          {filteredNews.map((news, idx) => (
            <div
              key={idx}
              className="bg-white rounded-md shadow border overflow-hidden"
            >
              <div className="bg-gray-300 h-40"></div>
              <div className="p-3">
                <span className="text-xs text-blue-500 font-semibold">
                  {news.type}
                </span>
                <h3 className="font-bold text-sm">{news.title}</h3>
                <p className="text-xs text-gray-600 leading-snug">
                  {news.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseInformation;
