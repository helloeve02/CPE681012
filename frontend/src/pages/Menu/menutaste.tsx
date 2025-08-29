import React, { useState } from "react";

type SeasoningItem = {
  name: string;
  desc: string;
  caution: string;
};

type DataType = {
  เปรี้ยว: SeasoningItem[];
  หวาน: SeasoningItem[];
  เค็ม: SeasoningItem[];
};

type TabKey = keyof DataType;

const data: DataType = {
  เปรี้ยว: [
    {
      name: "มะนาว",
      desc: "นิยมใช้ในการทำอาหารไทยหลายชนิด เช่น ต้มยำ ต้มโคล้ง ส้มตำ น้ำพริก น้ำจิ้ม เป็นต้น",
      caution: "มีกรดสูง ผู้ที่มีปัญหากรดไหลย้อนควรหลีกเลี่ยงปริมาณมาก",
    },
    {
      name: "น้ำส้มสายชู",
      desc: "ได้จากการหมักน้ำตาลหรือน้ำผลไม้ เช่น องุ่น ข้าวเจ้า ข้าวสาลี ข้าวโพด",
      caution: "ผู้ป่วยโรคกระเพาะควรระวังเพราะมีความเป็นกรดสูง",
    },
    {
      name: "น้ำมะขามเปียก",
      desc: "ให้รสเปรี้ยวเฉพาะ ใช้ปรุงอาหารไทย เช่น แกงส้ม แกงเหลือง ผัดไทย",
      caution: "ไม่มีข้อควรระวังรุนแรง แต่ควรใช้ในปริมาณพอเหมาะ",
    },
    {
      name: "ส้มซ่า มะกรูด มะดัน",
      desc: "ใช้เพิ่มรสเปรี้ยวและกลิ่นหอมในอาหารท้องถิ่น",
      caution: "ใช้ในปริมาณเหมาะสม",
    },
  ],
  หวาน: [
    {
      name: "น้ำตาลทราย",
      desc: "ทำให้อาหารมีรสหวาน ใช้ในอาหารและขนมทั่วไป",
      caution: "ผู้ป่วยเบาหวานควรหลีกเลี่ยงเพราะมีผลต่อระดับน้ำตาลในเลือด",
    },
    {
      name: "น้ำตาลปี๊บ",
      desc: "ทำให้อาหารมีรสหวานและมีกลิ่นเฉพาะ ใช้ทำขนมไทย",
      caution: "ผู้ป่วยเบาหวานและผู้ที่มีภาวะอ้วนควรจำกัดปริมาณ",
    },
    {
      name: "น้ำผึ้ง",
      desc: "ให้ความหวานธรรมชาติ มีกลิ่นหอม และใช้ในอาหารและยาพื้นบ้าน",
      caution: "แม้เป็นธรรมชาติแต่ยังมีน้ำตาลสูง ควรใช้พอเหมาะ",
    },
    {
      name: "หญ้าหวาน",
      desc: "ให้รสหวานแต่ไม่มีพลังงาน นิยมใช้ในอาหารเพื่อสุขภาพ",
      caution: "ปลอดภัยกว่าน้ำตาลทั่วไป เหมาะสำหรับผู้ป่วยเบาหวาน",
    },
  ],
  เค็ม: [
    {
      name: "น้ำปลา",
      desc: "เป็นเครื่องปรุงรสหลักของไทย ทำจากการหมักปลาและเกลือ ให้รสเค็มและกลิ่นเฉพาะ",
      caution: "มีโซเดียมสูง ผู้ป่วยโรคไตและความดันโลหิตสูงควรจำกัดการบริโภค",
    },
    {
      name: "ซีอิ๊วขาว",
      desc: "ทำจากถั่วเหลืองหมัก ใช้ปรุงอาหารผัดและแกงจืด",
      caution: "ควรเลือกสูตรโซเดียมต่ำ ลดความเสี่ยงต่อโรคไตและความดัน",
    },
    {
      name: "เกลือ",
      desc: "ใช้เพิ่มรสเค็มในอาหารและถนอมอาหาร",
      caution: "หากบริโภคมากเกินไปจะเสี่ยงต่อโรคไตและความดันโลหิตสูง",
    },
    {
      name: "กะปิ",
      desc: "ทำจากกุ้งหรือเคยหมัก นิยมใช้ในน้ำพริกและแกงไทย",
      caution: "มีโซเดียมสูง ควรใช้พอเหมาะ",
    },
  ],
};

const tabColors: Record<TabKey, {
  gradient: string;
  activeGradient: string;
  cardGradient: string;
  shadow: string;
  icon: string;
}> = {
  เปรี้ยว: {
    gradient: "from-yellow-400 via-orange-400 to-red-500",
    activeGradient: "from-yellow-500 to-red-500",
    cardGradient: "from-yellow-50 to-orange-50",
    shadow: "shadow-yellow-200/50",
    icon: "🍋"
  },
  หวาน: {
    gradient: "from-pink-400 via-rose-400 to-purple-500",
    activeGradient: "from-pink-500 to-purple-600",
    cardGradient: "from-pink-50 to-purple-50",
    shadow: "shadow-pink-200/50",
    icon: "🍯"
  },
  เค็ม: {
    gradient: "from-blue-400 via-teal-400 to-green-500",
    activeGradient: "from-blue-500 to-green-600",
    cardGradient: "from-blue-50 to-teal-50",
    shadow: "shadow-blue-200/50",
    icon: "🧂"
  },
};

export default function SeasoningUI() {
  const [activeTab, setActiveTab] = useState<TabKey>("เปรี้ยว");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 font-kanit">
      {/* Hero Header with Gradient Background */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-pink-400/20 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">✨</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              เครื่องปรุงรสอาหารไทย
            </h1>
            <span className="text-4xl ml-3">✨</span>
          </div>
          {/* <p className="text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            ค้นพบมนูอาหารและวิถีดั้งเดิมคุณภาพพจงสำหรับการดูแลสุขภาพ
          </p> */}
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        {/* Enhanced Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-white/30 inline-flex space-x-2">
            {(Object.keys(data) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative flex items-center px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab
                    ? `bg-gradient-to-r ${tabColors[tab].activeGradient} text-white shadow-2xl ${tabColors[tab].shadow} scale-105`
                    : "text-gray-600 hover:text-gray-800 hover:bg-white/60"
                }`}
              >
                <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">
                  {tabColors[tab].icon}
                </span>
                <span className="relative z-10">{tab}</span>
                {activeTab === tab && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                    <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-transparent rounded-2xl blur-lg"></div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-16">
          {data[activeTab].map((item, index) => (
            <div
              key={index}
              className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02]`}
              style={{
                background: `linear-gradient(135deg, ${tabColors[activeTab].cardGradient.replace('from-', '').replace(' to-', ', ')})`,
                animationDelay: `${index * 0.1}s`
              }}
            >
              {/* Decorative corner elements */}
              <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-white/40 to-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-lg"></div>
              
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header with icon */}
                <div className="flex items-center mb-6">
                  <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${tabColors[activeTab].gradient} rounded-2xl shadow-lg mr-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl text-white">{tabColors[activeTab].icon}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {item.name}
                  </h2>
                </div>
                
                {/* Description */}
                <div className="mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed group-hover:text-gray-800 transition-colors">
                    {item.desc}
                  </p>
                </div>
                
                {/* Caution Box */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-red-200/40 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white text-xl font-bold">⚠️</span>
                    </div>
                    <div>
                      <h4 className="text-red-800 font-semibold text-lg mb-2">ข้อควรระวัง</h4>
                      <p className="text-red-700 text-base leading-relaxed font-medium">
                        {item.caution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          ))}
        </div>

        {/* Footer with animated elements */}
        <div className="text-center pb-12">
          <div className="inline-flex items-center justify-center space-x-4 mb-4">
            <div className={`w-4 h-4 bg-gradient-to-r ${tabColors.เปรี้ยว.gradient} rounded-full animate-bounce`}></div>
            <div className={`w-4 h-4 bg-gradient-to-r ${tabColors.หวาน.gradient} rounded-full animate-bounce`} style={{ animationDelay: "0.2s" }}></div>
            <div className={`w-4 h-4 bg-gradient-to-r ${tabColors.เค็ม.gradient} rounded-full animate-bounce`} style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-gray-500 text-sm">สำรวจรสชาติแท้ของอาหารไทยอย่างปลอดภัย</p>
        </div>
      </div>
    </div>
  );
}