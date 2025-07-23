import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText } from 'lucide-react';

// Interfaces ตาม requirement ของคุณ
interface MealInterface {
  ID?: number;
  MealType?: string;
  MealdayID?: number; // FK
}

interface MealdayInterface {
  ID?: number;
  DayofWeek?: string;
  MealplanID?: number; // FK
}

interface MealMenuInterface {
  ID?: number;
  MenuType?: string;
  Portiontext?: string;
  MealID?: number; // FK
  MenuID?: number; // FK
}

interface MealplanInterface {
  ID?: number;
  PlanName?: string;
  AdminID?: number; // FK
  DiseaseID?: number; // FK
}

// Interface สำหรับ Menu items
interface MenuInterface {
  ID?: number;
  MenuName?: string;
  Description?: string;
}

// Interface สำหรับ Disease
interface DiseaseInterface {
  ID?: number;
  DiseaseName?: string;
  DiseaseCode?: string;
}

// Interface สำหรับการแสดงผลแนะนำ
interface RecommendationInterface {
  title: string;
  general: string[];
  nutrition: { [key: string]: string };
  foods: {
    แนะนำ: string[];
    ควรหลีกเลี่ยง: string[];
  };
}

const MealPlannerApp = () => {
  const [selectedMealplan, setSelectedMealplan] = useState<MealplanInterface | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  // Mock data - ในโปรดักชั่นจะมาจาก API
  const [mealplans] = useState<MealplanInterface[]>([
    { ID: 1, PlanName: 'แผน A1', AdminID: 1, DiseaseID: 1 },
    { ID: 2, PlanName: 'แผน A2', AdminID: 1, DiseaseID: 1 }
  ]);

  const [diseases] = useState<DiseaseInterface[]>([
    { ID: 1, DiseaseName: 'โรคไตเรื้อรัง', DiseaseCode: 'CKD' }
  ]);

  const [mealdays] = useState<MealdayInterface[]>([
    // สำหรับ Mealplan ID 1 (A1)
    { ID: 1, DayofWeek: 'วันจันทร์', MealplanID: 1 },
    { ID: 2, DayofWeek: 'วันอังคาร', MealplanID: 1 },
    { ID: 3, DayofWeek: 'วันพุธ', MealplanID: 1 },
    { ID: 4, DayofWeek: 'วันพฤหัสบดี', MealplanID: 1 },
    { ID: 5, DayofWeek: 'วันศุกร์', MealplanID: 1 },
    { ID: 6, DayofWeek: 'วันเสาร์', MealplanID: 1 },
    { ID: 7, DayofWeek: 'วันอาทิตย์', MealplanID: 1 },
    // สำหรับ Mealplan ID 2 (A2)
    { ID: 8, DayofWeek: 'วันจันทร์', MealplanID: 2 },
    { ID: 9, DayofWeek: 'วันอังคาร', MealplanID: 2 },
    { ID: 10, DayofWeek: 'วันพุธ', MealplanID: 2 },
    { ID: 11, DayofWeek: 'วันพฤหัสบดี', MealplanID: 2 },
    { ID: 12, DayofWeek: 'วันศุกร์', MealplanID: 2 },
    { ID: 13, DayofWeek: 'วันเสาร์', MealplanID: 2 },
    { ID: 14, DayofWeek: 'วันอาทิตย์', MealplanID: 2 }
  ]);

  const [meals] = useState<MealInterface[]>([
    // วันจันทร์ - Mealplan A1
    { ID: 1, MealType: 'เช้า', MealdayID: 1 },
    { ID: 2, MealType: 'กลางวัน', MealdayID: 1 },
    { ID: 3, MealType: 'เย็น', MealdayID: 1 },
    // วันอังคาร - Mealplan A1
    { ID: 4, MealType: 'เช้า', MealdayID: 2 },
    { ID: 5, MealType: 'กลางวัน', MealdayID: 2 },
    { ID: 6, MealType: 'เย็น', MealdayID: 2 },
    // เพิ่มเติมสำหรับวันอื่นๆ...
    { ID: 7, MealType: 'เช้า', MealdayID: 3 },
    { ID: 8, MealType: 'กลางวัน', MealdayID: 3 },
    { ID: 9, MealType: 'เย็น', MealdayID: 3 },
    { ID: 10, MealType: 'เช้า', MealdayID: 4 },
    { ID: 11, MealType: 'กลางวัน', MealdayID: 4 },
    { ID: 12, MealType: 'เย็น', MealdayID: 4 },
    { ID: 13, MealType: 'เช้า', MealdayID: 5 },
    { ID: 14, MealType: 'กลางวัน', MealdayID: 5 },
    { ID: 15, MealType: 'เย็น', MealdayID: 5 },
    { ID: 16, MealType: 'เช้า', MealdayID: 6 },
    { ID: 17, MealType: 'กลางวัน', MealdayID: 6 },
    { ID: 18, MealType: 'เย็น', MealdayID: 6 },
    { ID: 19, MealType: 'เช้า', MealdayID: 7 },
    { ID: 20, MealType: 'กลางวัน', MealdayID: 7 },
    { ID: 21, MealType: 'เย็น', MealdayID: 7 },
    
    // วันจันทร์ - Mealplan A2
    { ID: 22, MealType: 'เช้า', MealdayID: 8 },
    { ID: 23, MealType: 'กลางวัน', MealdayID: 8 },
    { ID: 24, MealType: 'เย็น', MealdayID: 8 },
    // เพิ่มเติมสำหรับ A2...
    { ID: 25, MealType: 'เช้า', MealdayID: 9 },
    { ID: 26, MealType: 'กลางวัน', MealdayID: 9 },
    { ID: 27, MealType: 'เย็น', MealdayID: 9 },
    { ID: 28, MealType: 'เช้า', MealdayID: 10 },
    { ID: 29, MealType: 'กลางวัน', MealdayID: 10 },
    { ID: 30, MealType: 'เย็น', MealdayID: 10 },
    { ID: 31, MealType: 'เช้า', MealdayID: 11 },
    { ID: 32, MealType: 'กลางวัน', MealdayID: 11 },
    { ID: 33, MealType: 'เย็น', MealdayID: 11 },
    { ID: 34, MealType: 'เช้า', MealdayID: 12 },
    { ID: 35, MealType: 'กลางวัน', MealdayID: 12 },
    { ID: 36, MealType: 'เย็น', MealdayID: 12 },
    { ID: 37, MealType: 'เช้า', MealdayID: 13 },
    { ID: 38, MealType: 'กลางวัน', MealdayID: 13 },
    { ID: 39, MealType: 'เย็น', MealdayID: 13 },
    { ID: 40, MealType: 'เช้า', MealdayID: 14 },
    { ID: 41, MealType: 'กลางวัน', MealdayID: 14 },
    { ID: 42, MealType: 'เย็น', MealdayID: 14 }
  ]);

  const [menus] = useState<MenuInterface[]>([
    { ID: 1, MenuName: 'ข้าวต้มปลา', Description: 'ข้าวต้มปลาสด' },
    { ID: 2, MenuName: 'ไข่ต้ม', Description: 'ไข่ต้มสุก' },
    { ID: 3, MenuName: 'ข้าวผัดมะเขือเทศ', Description: 'ข้าวผัดใส่มะเขือเทศ' },
    { ID: 4, MenuName: 'ข้าวกล้องผัดผัก', Description: 'ข้าวกล้องผัดผักรวม' },
    { ID: 5, MenuName: 'ข้าวต้มมูก', Description: 'ข้าวต้มหมู' },
    { ID: 6, MenuName: 'โจ๊ก', Description: 'โจ๊กข้าวสาร' },
    { ID: 7, MenuName: 'แซนด์วิช', Description: 'แซนด์วิชแฮม' },
    { ID: 8, MenuName: 'ผัดไทย', Description: 'ผัดไทยกุ้ง' }
  ]);

  const [mealMenus] = useState<MealMenuInterface[]>([
    // วันจันทร์ A1 - เช้า
    { ID: 1, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 1, MenuID: 1 },
    { ID: 2, MenuType: 'เสริม', Portiontext: '1 ฟอง', MealID: 1, MenuID: 2 },
    // วันจันทร์ A1 - กลางวัน
    { ID: 3, MenuType: 'หลัก', Portiontext: '1.5 ทัพพี', MealID: 2, MenuID: 3 },
    // วันจันทร์ A1 - เย็น
    { ID: 4, MenuType: 'หลัก', Portiontext: '1 ทัพพี', MealID: 3, MenuID: 4 },
    
    // วันอังคาร A1
    { ID: 5, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 4, MenuID: 5 },
    { ID: 6, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 5, MenuID: 6 },
    { ID: 7, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 6, MenuID: 6 },
    
    // วันพุธ A1
    { ID: 8, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 7, MenuID: 6 },
    { ID: 9, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 8, MenuID: 6 },
    { ID: 10, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 9, MenuID: 4 },
    
    // วันพฤหัสบดี A1
    { ID: 11, MenuType: 'หลัก', Portiontext: '2 ชิ้น', MealID: 10, MenuID: 7 },
    { ID: 12, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 11, MenuID: 1 },
    { ID: 13, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 12, MenuID: 6 },
    
    // วันศุกร์ A1
    { ID: 14, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 13, MenuID: 6 },
    { ID: 15, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 14, MenuID: 6 },
    { ID: 16, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 15, MenuID: 6 },
    
    // วันเสาร์ A1
    { ID: 17, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 16, MenuID: 1 },
    { ID: 18, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 17, MenuID: 8 },
    { ID: 19, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 18, MenuID: 4 },
    
    // วันอาทิตย์ A1
    { ID: 20, MenuType: 'หลัก', Portiontext: '2 ชิ้น', MealID: 19, MenuID: 7 },
    { ID: 21, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 20, MenuID: 1 },
    { ID: 22, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 21, MenuID: 4 },
    
    // A2 data...
    { ID: 23, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 22, MenuID: 6 },
    { ID: 24, MenuType: 'หลัก', Portiontext: '1.5 ทัพพี', MealID: 23, MenuID: 3 },
    { ID: 25, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 24, MenuID: 4 },
    
    { ID: 26, MenuType: 'หลัก', Portiontext: '0.5 ชาม', MealID: 25, MenuID: 5 },
    { ID: 27, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 26, MenuID: 6 },
    { ID: 28, MenuType: 'หลัก', Portiontext: '1 ทัพพี', MealID: 27, MenuID: 4 },
    
    { ID: 29, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 28, MenuID: 6 },
    { ID: 30, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 29, MenuID: 6 },
    { ID: 31, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 30, MenuID: 4 },
    
    { ID: 32, MenuType: 'หลัก', Portiontext: '2 ชิ้น', MealID: 31, MenuID: 7 },
    { ID: 33, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 32, MenuID: 1 },
    { ID: 34, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 33, MenuID: 6 },
    
    { ID: 35, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 34, MenuID: 1 },
    { ID: 36, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 35, MenuID: 6 },
    { ID: 37, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 36, MenuID: 6 },
    
    { ID: 38, MenuType: 'หลัก', Portiontext: '1 ชาม', MealID: 37, MenuID: 1 },
    { ID: 39, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 38, MenuID: 8 },
    { ID: 40, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 39, MenuID: 4 },
    
    { ID: 41, MenuType: 'หลัก', Portiontext: '2 ชิ้น', MealID: 40, MenuID: 7 },
    { ID: 42, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 41, MenuID: 1 },
    { ID: 43, MenuType: 'หลัก', Portiontext: '1 จาน', MealID: 42, MenuID: 4 }
  ]);

  // Recommendations data
  const recommendations: { [key: string]: RecommendationInterface } = {
    '1': {
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
    '2': {
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

  const dayColors = {
    'วันจันทร์': 'bg-yellow-100',
    'วันอังคาร': 'bg-pink-100', 
    'วันพุธ': 'bg-green-100',
    'วันพฤหัสบดี': 'bg-orange-100',
    'วันศุกร์': 'bg-blue-100',
    'วันเสาร์': 'bg-purple-100',
    'วันอาทิตย์': 'bg-red-100'
  };

  // Set default selected mealplan
  useEffect(() => {
    if (mealplans.length > 0 && !selectedMealplan) {
      setSelectedMealplan(mealplans[0]);
    }
  }, [mealplans, selectedMealplan]);

  // Functions to get related data
  const getMealMenusByMealId = (mealId: number): MealMenuInterface[] => {
    return mealMenus.filter(mm => mm.MealID === mealId);
  };

  const getMenuById = (menuId: number): MenuInterface | undefined => {
    return menus.find(menu => menu.ID === menuId);
  };

  const getMealsByDayId = (dayId: number): MealInterface[] => {
    return meals.filter(meal => meal.MealdayID === dayId);
  };

  const getMealdaysByMealplanId = (mealplanId: number): MealdayInterface[] => {
    return mealdays.filter(day => day.MealplanID === mealplanId);
  };

  const getDiseaseStage = (mealplanName: string): string => {
    return mealplanName?.includes('A1') ? '1' : '2';
  };

  const handleDownload = () => {
    console.log('Downloading meal plan...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMealplanChange = (mealplanId: string) => {
    const plan = mealplans.find(mp => mp.ID === parseInt(mealplanId));
    setSelectedMealplan(plan || null);
  };

  if (!selectedMealplan) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">กำลังโหลด...</div>;
  }

  const currentMealdays = getMealdaysByMealplanId(selectedMealplan.ID!);
  const diseaseStage = getDiseaseStage(selectedMealplan.PlanName!);
  const currentRecommendations = recommendations[diseaseStage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white px-4 py-4">
        <div className="flex items-center">
          <ChevronLeft className="w-6 h-6 mr-3" />
          <h1 className="text-lg font-medium">ความรู้ แผนอาหารแนะนำ</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Stage Selector */}
        <div className="flex justify-end mb-4">
          <div className="bg-white border border-gray-300 rounded px-3 py-2">
            <span className="text-sm text-gray-600">เลือกแผน:</span>
            <select 
              value={selectedMealplan.ID || ''} 
              onChange={(e) => handleMealplanChange(e.target.value)}
              className="ml-2 border-none outline-none bg-transparent"
            >
              {mealplans.map(plan => (
                <option key={plan.ID} value={plan.ID}>
                  {plan.PlanName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-4">
          แผนมื้ออาหารประจำสัปดาห์ที่ 1
        </h2>

        {/* Week Header */}
        <div className="bg-blue-600 text-white py-2 px-4 rounded-t-lg">
          <h3 className="font-medium">
            {selectedMealplan.PlanName} - สำหรับผู้ป่วยโรคไตระยะที่ {diseaseStage}
          </h3>
        </div>

        {/* Meal Plan Table */}
        <div className="bg-white border border-gray-300 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 w-24">{selectedMealplan.PlanName}</th>
                <th className="border border-gray-300 px-4 py-2 bg-purple-200">เช้า</th>
                <th className="border border-gray-300 px-4 py-2 bg-teal-200">กลางวัน</th>
                <th className="border border-gray-300 px-4 py-2 bg-purple-200">เย็น</th>
              </tr>
            </thead>
            <tbody>
              {currentMealdays.map((mealday) => {
                const dayMeals = getMealsByDayId(mealday.ID!);
                const mealsGrouped = dayMeals.reduce((acc, meal) => {
                  const mealType = meal.MealType!;
                  if (!acc[mealType]) acc[mealType] = [];
                  
                  const mealMenuItems = getMealMenusByMealId(meal.ID!);
                  const menuItems = mealMenuItems.map(mm => {
                    const menu = getMenuById(mm.MenuID!);
                    return `${menu?.MenuName || ''} ${mm.Portiontext || ''}`;
                  });
                  
                  acc[mealType] = menuItems;
                  return acc;
                }, {} as { [key: string]: string[] });

                return (
                  <tr key={mealday.ID}>
                    <td className={`border border-gray-300 px-4 py-4 font-medium ${dayColors[mealday.DayofWeek || ''] || 'bg-gray-100'}`}>
                      {mealday.DayofWeek}
                    </td>
                    <td className="border border-gray-300 px-4 py-4">
                      <ul className="space-y-1">
                        {(mealsGrouped['เช้า'] || []).map((item, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="w-2 h-2 bg-black rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-gray-300 px-4 py-4">
                      <ul className="space-y-1">
                        {(mealsGrouped['กลางวัน'] || []).map((item, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="w-2 h-2 bg-black rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="border border-gray-300 px-4 py-4">
                      <ul className="space-y-1">
                        {(mealsGrouped['เย็น'] || []).map((item, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="w-2 h-2 bg-black rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
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
        {showRecommendations && currentRecommendations && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-blue-600 mb-6 text-center">
              {currentRecommendations.title}
            </h3>

            {/* General Recommendations */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                คำแนะนำทั่วไป
              </h4>
              <ul className="space-y-2 pl-5">
                {currentRecommendations.general.map((item, index) => (
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
                  {Object.entries(currentRecommendations.nutrition).map(([nutrient, amount]) => (
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
              {/* Recommended Foods */}
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  อาหารที่แนะนำ
                </h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {currentRecommendations.foods.แนะนำ.map((food, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{food}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Foods to Avoid */}
              <div>
                <h4 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  อาหารที่ควรหลีกเลี่ยง
                </h4>
                <div className="bg-red-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {currentRecommendations.foods.ควรหลีกเลี่ยง.map((food, index) => (
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

        {/* Debug Information (สำหรับการพัฒนา - สามารถลบออกได้) */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">ข้อมูลการพัฒนา:</h4>
          <p className="text-sm text-gray-600">
            แผนที่เลือก: {selectedMealplan.PlanName} (ID: {selectedMealplan.ID})
          </p>
          <p className="text-sm text-gray-600">
            จำนวนวันในแผน: {currentMealdays.length} วัน
          </p>
          <p className="text-sm text-gray-600">
            ระยะโรค: {diseaseStage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MealPlannerApp;