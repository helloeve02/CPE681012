import React, { useState } from "react";
import { Sparkles, AlertTriangle, ChefHat } from 'lucide-react';

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
    gradient: "from-amber-400 via-orange-400 to-orange-500",
    activeGradient: "from-amber-500 to-orange-500",
    cardGradient: "from-amber-50 to-orange-50",
    shadow: "shadow-orange-200/50",
    icon: "🍋"
  },
  หวาน: {
    gradient: "from-pink-400 via-pink-500 to-rose-500",
    activeGradient: "from-pink-500 to-rose-500",
    cardGradient: "from-pink-50 to-rose-50",
    shadow: "shadow-pink-200/50",
    icon: "🍯"
  },
  เค็ม: {
    gradient: "from-blue-500 via-indigo-500 to-indigo-600",
    activeGradient: "from-blue-500 to-indigo-600",
    cardGradient: "from-blue-50 to-indigo-50",
    shadow: "shadow-blue-200/50",
    icon: "🧂"
  },
};

export default function SeasoningUI() {
  const [activeTab, setActiveTab] = useState<TabKey>("เปรี้ยว");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 font-kanit">
      {/* Enhanced Header - เข้าธีมกับหน้าอื่น */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-700"></div>
        </div>
        
        <div className="relative px-6 py-10 text-center">
          <div className="flex items-center justify-center mb-3">
            <ChefHat className="w-7 h-7 mr-3 text-yellow-300" />
            <h1 className="font-bold text-3xl md:text-4xl font-kanit bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              เครื่องปรุงรสอาหารไทย
            </h1>
            <ChefHat className="w-7 h-7 ml-3 text-yellow-300" />
          </div>
          <p className="text-blue-100 font-kanit text-base max-w-xl mx-auto">
            ค้นพบข้อมูลเครื่องปรุงรสและวิธีการใช้อย่างปลอดภัยสำหรับสุขภาพ
          </p>
        </div>
      </div>

      {/* Modern Tabs - ใช้สไตล์เดียวกับหน้าอื่น */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 p-1 rounded-xl mt-4 mb-4">
              {(Object.keys(data) as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-lg font-kanit text-base font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-md transform scale-105"
                      : "text-gray-600 hover:text-blue-500 hover:bg-white/50"
                  }`}
                >
                  <span className="text-xl">{tabColors[tab].icon}</span>
                  <span>{tab}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {data[activeTab].map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl 
                        transition-all duration-500 overflow-hidden border border-gray-100
                        hover:transform hover:scale-[1.02]"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="p-6">
                {/* Header with icon */}
                <div className="flex items-center mb-5">
                  <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${tabColors[activeTab].gradient} rounded-2xl shadow-lg mr-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl text-white">{tabColors[activeTab].icon}</span>
                  </div>
                  <h3 className="text-xl font-kanit font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                </div>
                
                {/* Description */}
                <div className="mb-5">
                  <p className="text-gray-700 font-kanit text-base leading-relaxed group-hover:text-gray-800 transition-colors">
                    {item.desc}
                  </p>
                </div>
                
                {/* Caution Box */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 border border-red-100/60 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <AlertTriangle className="text-white" size={16} />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-red-700 font-kanit font-semibold text-base mb-1.5">ข้อควรระวัง</h4>
                      <p className="text-red-600 font-kanit text-sm leading-relaxed">
                        {item.caution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="text-center pb-6">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className={`w-3 h-3 bg-gradient-to-r ${tabColors.เปรี้ยว.gradient} rounded-full animate-bounce`}></div>
            <div className={`w-3 h-3 bg-gradient-to-r ${tabColors.หวาน.gradient} rounded-full animate-bounce`} style={{ animationDelay: "0.2s" }}></div>
            <div className={`w-3 h-3 bg-gradient-to-r ${tabColors.เค็ม.gradient} rounded-full animate-bounce`} style={{ animationDelay: "0.4s" }}></div>
          </div>
          <p className="text-gray-500 font-kanit text-base max-w-lg mx-auto">
            สำรวจรสชาติแท้ของอาหารไทยอย่างปลอดภัย เพื่อสุขภาพที่ดีของคุณและครอบครัว
          </p>
        </div>
      </div>
    </div>
  );
}