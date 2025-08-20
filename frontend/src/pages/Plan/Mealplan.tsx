import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText, RefreshCw, Shuffle } from 'lucide-react';

// Interface definitions
interface DiseaseInterface {
  ID?: number;
  Name?: string;
  DiseaseStage?: string;
}

interface MenuInterface {
  ID?: number;
  Title?: string;
  Description?: string;
  Region?: string;
  Image?: string;
  AdminID?: number;
  Credit?: string;
  Tags: string[];
}

interface MealplanInterface {
  ID?: number;
  PlanName?: string;
  AdminID?: number;
  DiseaseID?: number;
}

interface MealdayInterface {
  ID?: number;
  DayofWeek?: string;
  MealplanID?: number;
}

interface MealInterface {
  ID?: number;
  MealType?: string;
  MealdayID?: number;
}

interface MealMenuInterface {
  ID?: number;
  MenuType?: string;
  PortionText?: string;
  MealID?: number;
  MenuID?: number;
}

interface RecommendationData {
  title: string;
  general: string[];
  nutrition: Record<string, string>;
  foods: {
    แนะนำ: string[];
    ควรหลีกเลี่ยง: string[];
  };
}

const MealPlannerApp = () => {
  const [selectedStage, setSelectedStage] = useState<'A1' | 'A2'>('A1');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [currentMealPlan, setCurrentMealPlan] = useState<Record<string, Record<string, MealMenuInterface[]>>>({});
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [lastRandomized, setLastRandomized] = useState<Date>(new Date());

  // Sample data
  const diseases: DiseaseInterface[] = [
    { ID: 1, Name: "โรคไตเรื้อรัง", DiseaseStage: "A1" },
    { ID: 2, Name: "โรคไตเรื้อรัง", DiseaseStage: "A2" }
  ];

  const mealplans: MealplanInterface[] = [
    { ID: 1, PlanName: "แผนอาหารโรคไตระยะที่ 1", AdminID: 1, DiseaseID: 1 },
    { ID: 2, PlanName: "แผนอาหารโรคไตระยะที่ 2", AdminID: 1, DiseaseID: 2 }
  ];

  // ข้อมูลเมนูแยกตาม tags สำหรับการสุ่ม
  const menuDatabase: Record<string, MenuInterface[]> = {
    A1: [
      { ID: 1, Title: "ข้าวต้มปลา", Description: "ข้าวต้มปลาสดใส", Region: "ภาคกลาง", AdminID: 1, Tags: ["เช้า", "A1", "โปรตีนต่ำ"] },
      { ID: 2, Title: "ไข่ต้ม", Description: "ไข่ไก่ต้มสุก", Region: "ทั่วไป", AdminID: 1, Tags: ["เช้า", "A1", "โปรตีน"] },
      { ID: 3, Title: "ข้าวผัดมะเขือเทศ", Description: "ข้าวผัดมะเขือเทศสดใส", Region: "ภาคกลาง", Tags: ["กลางวัน", "A1", "ผัก"] },
      { ID: 4, Title: "ข้าวกล้องผัดผัก", Description: "ข้าวกล้องผัดผักรวม", Region: "ทั่วไป", Tags: ["เย็น", "A1", "ไฟเบอร์สูง"] },
      { ID: 5, Title: "แกงจืดมะระ", Description: "แกงจืดมะระใส่หมูสับ", Region: "ทั่วไป", Tags: ["กลางวัน", "A1", "ต่ำโซเดียม"] },
      { ID: 6, Title: "ปลาทอดกระเทียม", Description: "ปลาทอดกระเทียมกรอบ", Region: "ภาคกลาง", Tags: ["เย็น", "A1", "โปรตีน"] },
      { ID: 7, Title: "ผัดผักบุ้งไฟแดง", Description: "ผัดผักบุ้งไฟแดงไม่เผ็ด", Region: "ทั่วไป", Tags: ["กลางวัน", "A1", "ผัก"] },
      { ID: 8, Title: "โจ๊กไก่", Description: "โจ๊กไก่สดใส", Region: "ทั่วไป", Tags: ["เช้า", "A1", "ย่อยง่าย"] },
      { ID: 9, Title: "ข้าวผัดไข่", Description: "ข้าวผัดไข่แบบง่ายๆ", Region: "ทั่วไป", Tags: ["เย็น", "A1", "โปรตีน"] },
      { ID: 10, Title: "แกงจืดฟัก", Description: "แกงจืดฟักทองใส", Region: "ทั่วไป", Tags: ["กลางวัน", "A1", "ต่ำโซเดียม"] }
    ],
    A2: [
      { ID: 11, Title: "ข้าวต้มไก่", Description: "ข้าวต้มไก่อ่อนๆ", Region: "ทั่วไป", AdminID: 1, Tags: ["เช้า", "A2", "โปรตีนจำกัด"] },
      { ID: 12, Title: "ผัดผักกาดขาว", Description: "ผัดผักกาดขาวใสๆ", Region: "ทั่วไป", Tags: ["กลางวัน", "A2", "ผัก", "ต่ำโพแทสเซียม"] },
      { ID: 13, Title: "ข้าวขาวผัดผัก", Description: "ข้าวขาวผัดผักรวม", Region: "ทั่วไป", Tags: ["เย็น", "A2", "คาร์โบไฮเดรต"] },
      { ID: 14, Title: "แกงจืดมะระอ่อน", Description: "แกงจืดมะระอ่อนใสๆ", Region: "ทั่วไป", Tags: ["กลางวัน", "A2", "ต่ำโซเดียม"] },
      { ID: 15, Title: "ไข่ขาวต้ม", Description: "ไข่ขาวต้มไม่ใส่แดง", Region: "ทั่วไป", Tags: ["เช้า", "A2", "โปรตีนจำกัด"] },
      { ID: 16, Title: "ปลาน้ำจืดนึ่ง", Description: "ปลาน้ำจืดนึ่งมะนาว", Region: "ทั่วไป", Tags: ["เย็น", "A2", "โปรตีนคุณภาพ"] },
      { ID: 17, Title: "ผัดกะหล่ำปลี", Description: "ผัดกะหล่ำปลีใสๆ", Region: "ทั่วไป", Tags: ["กลางวัน", "A2", "ผัก"] },
      { ID: 18, Title: "โจ๊กข้าวขาว", Description: "โจ๊กข้าวขาวใสไม่ใส่เครื่อง", Region: "ทั่วไป", Tags: ["เช้า", "A2", "ย่อยง่าย"] },
      { ID: 19, Title: "ข้าวผัดขาว", Description: "ข้าวผัดขาวธรรมดา", Region: "ทั่วไป", Tags: ["เย็น", "A2", "คาร์โบไฮเดรต"] },
      { ID: 20, Title: "แกงจืดตำลึง", Description: "แกงจืดตำลึงใสๆ", Region: "ทั่วไป", Tags: ["กลางวัน", "A2", "ต่ำโซเดียม"] }
    ]
  };

  // คำแนะนำสำหรับแต่ละระยะ
  const recommendations: Record<string, RecommendationData> = {
    A1: {
      title: "คำแนะนำสำหรับผู้ป่วยโรคไตระยะที่ 1",
      general: [
        "ดื่มน้ำให้เพียงพอ อย่างน้อยวันละ 8-10 แก้ว",
        "จำกัดเกลือในอาหารไม่เกิน 2,300 มิลลิกรัมต่อวัน",
        "รับประทานผลไม้และผัก 5-9 ส่วนต่อวัน",
        "เลือกโปรตีนคุณภาพดี เช่น ปลา ไก่ หรือเต้าหู้"
      ],
      nutrition: {
        "โซเดียม": "< 2,300 มก./วัน",
        "โปรตีน": "0.8 กรัม/กก.น้ำหนัก",
        "ฟอสฟอรัส": "800-1,000 มก./วัน",
        "โพแทสเซียม": "3,500-4,500 มก./วัน"
      },
      foods: {
        แนะนำ: [
          "ข้าวกล้อง ข้าวโอ๊ต",
          "ปลาทะเล ไก่ไร้หนัง",
          "ผักใบเขียว ผักสีส้ม",
          "ผลไม้สด เช่น แอปเปิ้ล องุ่น"
        ],
        ควรหลีกเลี่ยง: [
          "อาหารแปรรูป ไส้กรอก แฮม",
          "อาหารกระป๋อง อาหารดอง",
          "เครื่องดื่มแอลกอฮอล์",
          "ขนมหวาน เค้ก คุกกี้"
        ]
      }
    },
    A2: {
      title: "คำแนะนำสำหรับผู้ป่วยโรคไตระยะที่ 2",
      general: [
        "ควบคุมความดันโลหิตให้อยู่ในระดับปกติ",
        "จำกัดโซเดียมมากขึ้น ไม่เกิน 2,000 มิลลิกรัมต่อวัน",
        "ลดโปรตีนลง เพื่อลดภาระการทำงานของไต",
        "ตรวจสุขภาพและติดตามค่าไตเป็นประจำ"
      ],
      nutrition: {
        "โซเดียม": "< 2,000 มก./วัน",
        "โปรตีน": "0.6-0.8 กรัม/กก.น้ำหนัก",
        "ฟอสฟอรัส": "600-800 มก./วัน",
        "โพแทสเซียม": "2,500-3,500 มก./วัน"
      },
      foods: {
        แนะนำ: [
          "ข้าวขาว ก๋วยเตี๋ยว",
          "ปลาน้ำจืด ไข่ขาว",
          "ผักบุ้ง กะหล่ำปลี",
          "แอปเปิ้ล สับปะรด"
        ],
        ควรหลีกเลี่ยง: [
          "เนื้อแดง ปลาเค็ม",
          "ถั่วเมล็ดแห้ง นม",
          "กล้วย ส้ม มะม่วง",
          "ช็อกโกแลต ถั่วลิสง"
        ]
      }
    }
  };

  // ฟังก์ชันสำหรับสุ่มเมนูตาม tag และมื้อ
  const getRandomMenuByMealType = (stage: string, mealType: string): MealMenuInterface[] => {
    const availableMenus = menuDatabase[stage]?.filter(menu => 
      menu.Tags.includes(mealType) && menu.Tags.includes(stage)
    ) || [];

    if (availableMenus.length === 0) return [];

    // สุ่มเมนู 2-4 รายการต่อมื้อ
    const menuCount = Math.floor(Math.random() * 3) + 2; // 2-4 รายการ
    const selectedMenus: MealMenuInterface[] = [];
    
    for (let i = 0; i < Math.min(menuCount, availableMenus.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableMenus.length);
      const menu = availableMenus[randomIndex];
      
      selectedMenus.push({
        ID: Math.random() * 1000,
        MenuType: mealType,
        PortionText: `${menu.Title} (${getRandomPortion()})`,
        MealID: Math.random() * 1000,
        MenuID: menu.ID
      });
      
      // เอาเมนูที่เลือกแล้วออกเพื่อไม่ให้ซ้ำ
      availableMenus.splice(randomIndex, 1);
    }

    return selectedMenus;
  };

  // ฟังก์ชันสำหรับสุ่มขนาดส่วน
  const getRandomPortion = (): string => {
    const portions = [
      "1/2 จาน", "1 จาน", "1.5 จาน", 
      "1 ทัพพี", "1.5 ทัพพี", "2 ทัพพี",
      "1 ชิ้น", "2 ชิ้น", "3 ชิ้น",
      "1 ฟอง", "2 ฟอง", "1/2 ถ้วย", "1 ถ้วย"
    ];
    return portions[Math.floor(Math.random() * portions.length)];
  };

  // ฟังก์ชันสำหรับสุ่มแผนอาหารใหม่ทั้งสัปดาห์
  const generateRandomMealPlan = (stage: string) => {
    const days = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];
    const mealTypes = ["เช้า", "กลางวัน", "เย็น"];
    
    const newMealPlan: Record<string, Record<string, MealMenuInterface[]>> = {};

    days.forEach(day => {
      newMealPlan[day] = {};
      mealTypes.forEach(mealType => {
        newMealPlan[day][mealType] = getRandomMenuByMealType(stage, mealType);
      });
    });

    return newMealPlan;
  };

  // ฟังก์ชันสำหรับสุ่มแผนใหม่
  const handleRandomizePlan = async () => {
    setIsRandomizing(true);
    
    // จำลองการโหลด
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPlan = generateRandomMealPlan(selectedStage);
    setCurrentMealPlan(newPlan);
    setLastRandomized(new Date());
    setIsRandomizing(false);
  };

  // สร้างแผนเริ่มต้นเมื่อ component mount หรือเปลี่ยนระยะ
  useEffect(() => {
    const initialPlan = generateRandomMealPlan(selectedStage);
    setCurrentMealPlan(initialPlan);
  }, [selectedStage]);

  const dayColors: Record<string, string> = {
    วันจันทร์: 'bg-yellow-100',
    วันอังคาร: 'bg-pink-100', 
    วันพุธ: 'bg-green-100',
    วันพฤหัสบดี: 'bg-orange-100',
    วันศุกร์: 'bg-blue-100',
    วันเสาร์: 'bg-purple-100',
    วันอาทิตย์: 'bg-red-100'
  };

  const getCurrentMealplan = (): MealplanInterface | undefined => {
    return mealplans.find(plan => 
      plan.DiseaseID === diseases.find(d => d.DiseaseStage === selectedStage)?.ID
    );
  };

  const getCurrentDisease = (): DiseaseInterface | undefined => {
    return diseases.find(d => d.DiseaseStage === selectedStage);
  };

  const handleDownload = () => {
    const currentPlan = getCurrentMealplan();
    console.log('Downloading meal plan:', currentPlan?.PlanName);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentMealplan = getCurrentMealplan();
  const currentDisease = getCurrentDisease();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">
            แผนมื้ออาหารประจำสัปดาห์ - ระยะ {selectedStage}
          </h2>
        </div>

        {/* Randomize Button */}
        <div className="flex justify-center mb-4">
          <button 
            onClick={handleRandomizePlan}
            disabled={isRandomizing}
            className="flex items-center gap-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRandomizing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                กำลังสุ่มแผนใหม่...
              </>
            ) : (
              <>
                <Shuffle className="w-5 h-5" />
                สุ่มแผนอาหารใหม่
              </>
            )}
          </button>
        </div>

        {/* Last Updated Info */}
        <div className="text-center text-sm text-gray-600 mb-4">
          สุ่มล่าสุด: {lastRandomized.toLocaleDateString('th-TH')} {lastRandomized.toLocaleTimeString('th-TH')}
        </div>

        {/* Disease Info Header */}
        <div className="bg-blue-600 text-white py-2 px-4 rounded-t-lg">
          <h3 className="font-medium">
            {currentDisease?.Name} {currentDisease?.DiseaseStage && `ระยะที่ ${selectedStage === 'A1' ? '1' : '2'}`}
          </h3>
        </div>

        {/* Meal Plan Table */}
        <div className="bg-white border border-gray-300 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 w-24">วัน/มื้อ</th>
                <th className="border border-gray-300 px-4 py-2 bg-purple-200">เช้า</th>
                <th className="border border-gray-300 px-4 py-2 bg-teal-200">กลางวัน</th>
                <th className="border border-gray-300 px-4 py-2 bg-purple-200">เย็น</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(currentMealPlan).map(([day, meals]) => (
                <tr key={day}>
                  <td className={`border border-gray-300 px-4 py-4 font-medium ${dayColors[day]}`}>
                    {day}
                  </td>
                  <td className="border border-gray-300 px-4 py-4">
                    <ul className="space-y-1">
                      {meals.เช้า?.map((mealMenu) => (
                        <li key={mealMenu.ID} className="text-sm flex items-start">
                          <span className="w-2 h-2 bg-black rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {mealMenu.PortionText}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-4">
                    <ul className="space-y-1">
                      {meals.กลางวัน?.map((mealMenu) => (
                        <li key={mealMenu.ID} className="text-sm flex items-start">
                          <span className="w-2 h-2 bg-black rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {mealMenu.PortionText}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border border-gray-300 px-4 py-4">
                    <ul className="space-y-1">
                      {meals.เย็น?.map((mealMenu) => (
                        <li key={mealMenu.ID} className="text-sm flex items-start">
                          <span className="w-2 h-2 bg-black rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {mealMenu.PortionText}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            พิมพ์
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            ดาวน์โหลด
          </button>
          <button 
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FileText className="w-4 h-4" />
            {showRecommendations ? 'ซ่อนคำแนะนำ' : 'ดูคำแนะนำ'}
          </button>
        </div>

        {/* Recommendations Section */}
        {showRecommendations && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-blue-600 mb-6 text-center">
              {recommendations[selectedStage].title}
            </h3>

            {/* General Recommendations */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                คำแนะนำทั่วไป
              </h4>
              <ul className="space-y-2 pl-5">
                {recommendations[selectedStage].general.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutritional Guidelines */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                แนวทางโภชนาการ
              </h4>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(recommendations[selectedStage].nutrition).map(([nutrient, amount]) => (
                    <div key={nutrient} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="font-medium text-gray-700">{nutrient}:</span>
                      <span className="text-green-600 font-semibold">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Food Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  อาหารที่แนะนำ
                </h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {recommendations[selectedStage].foods.แนะนำ.map((food, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  อาหารที่ควรหลีกเลี่ยง
                </h4>
                <div className="bg-red-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {recommendations[selectedStage].foods.ควรหลีกเลี่ยง.map((food, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start">
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>หมายเหตุ:</strong> คำแนะนำเหล่านี้เป็นแนวทางทั่วไป ควรปรึกษาแพทย์หรือนักโภชนาการ
                    เพื่อการวางแผนอาหารที่เหมาะสมกับสภาวะสุขภาพของท่านโดยเฉพาะ
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealPlannerApp;