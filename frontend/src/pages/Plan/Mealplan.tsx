import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText, RefreshCw, Shuffle } from 'lucide-react';
import type { TagInterface } from '../../interfaces/Tag';
import type { MenuInterface } from '../../interfaces/Menu';
import type { FoodFlagInterface } from '../../interfaces/FoodFlag';
import type { FoodGroupInterface } from '../../interfaces/FoodGroup';
import type { FoodItemInterface } from '../../interfaces/FoodItem';
import type { MealInterface } from '../../interfaces/Meal';
import type { MealdayInterface } from '../../interfaces/Mealday';
import type { MealMenuInterface } from '../../interfaces/MealMenu';
import type { MealplanInterface } from '../../interfaces/Mealplan';
// Interface
/* interface TagInterface {
  ID?: number;
  Name?: string;
}

interface MenuInterface {
  ID?: number;
  Title?: string;
  Description?: string;
  Region?: string;
  Image?: string;
  AdminID?: number;
  Credit?: string;
  Tags: TagInterface[];
}

interface FoodGroupInterface {
  ID?: number;
  Name?: string;
}

interface FoodFlagInterface {
  ID?: number;
  Flag?: string;
  FoodGroupID?: number;
}

interface FoodItemInterface {
  ID?: number;
  Name?: string;
  Image?: string;
  Credit?: string;
  FoodFlagID?: number;
}

interface MealplanInterface {
  ID?: number;
  PlanName?: string;
  AdminID?: number;
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
  PortionText?: string;
  MealID?: number;
  MenuID?: number;
} */

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

  // Sample tags data
  const tags: TagInterface[] = [
    { ID: 1, Name: "ภาคใต้" },
    { ID: 2, Name: "ภาคกลาง" },
    { ID: 3, Name: "ภาคอีสาน" },
    { ID: 4, Name: "ต้ม" },
    { ID: 5, Name: "ยำ" },
    { ID: 6, Name: "น้ำพริก" },
    { ID: 7, Name: "แกง" },
    { ID: 8, Name: "ลาบ" },
    { ID: 9, Name: "เส้น" },
    { ID: 10, Name: "ผัด" },
    { ID: 11, Name: "ทอด" },
    { ID: 12, Name: "นึ่ง" },
    { ID: 13, Name: "ส้มตำ" }
  ];

  // Sample food groups
  const foodGroups: FoodGroupInterface[] = [
    { ID: 1, Name: "ข้าว/แป้ง" },
    { ID: 2, Name: "แป้งปลอดโปรตีน" },
    { ID: 3, Name: "ผัก" },
    { ID: 4, Name: "ผลไม้" },
    { ID: 5, Name: "เนื้อสัตว์" },
    { ID: 6, Name: "ไขมัน" },
    { ID: 7, Name: "ซอสปรุงรส" },
    { ID: 8, Name: "นม" }

  ];

  // Sample food flags
  const foodFlags: FoodFlagInterface[] = [
    { ID: 1, Flag: "ควรรับประทาน", FoodGroupID: 1 },
    { ID: 2, Flag: "ควรรับประทาน", FoodGroupID: 1 },
    { ID: 3, Flag: "ควรรับประทาน", FoodGroupID: 2 },
    { ID: 4, Flag: "ควรรับประทาน", FoodGroupID: 1 },
    { ID: 5, Flag: "ควรหลีกเลี่ยง", FoodGroupID: 1 },
    { ID: 6, Flag: "ควรหลีกเลี่ยง", FoodGroupID: 2 },
    { ID: 7, Flag: "ควรหลีกเลี่ยง", FoodGroupID: 1 },
    { ID: 8, Flag: "ควรหลีกเลี่ยง", FoodGroupID: 1 },
    { ID: 9, Flag: "ควรหลีกเลี่ยง", FoodGroupID: 2 }
  ];

  // Sample food items (fruits for snacks)
  const foodItems: FoodItemInterface[] = [
    { ID: 1, Name: "แอปเปิ้ล", FoodFlagID: 1 },
    { ID: 2, Name: "สับปะรด", FoodFlagID: 1 },
    { ID: 3, Name: "มะละกอ", FoodFlagID: 1 },
    { ID: 4, Name: "ฝรั่ง", FoodFlagID: 1 },
    { ID: 5, Name: "องุ่น", FoodFlagID: 1 },
    { ID: 6, Name: "แตงโม", FoodFlagID: 1 },
    { ID: 7, Name: "ส้มโอ", FoodFlagID: 1 },
    { ID: 8, Name: "มะม่วง", FoodFlagID: 2 }, 
    { ID: 9, Name: "กล้วย", FoodFlagID: 2 }, 
    { ID: 10, Name: "ลิ้นจี่", FoodFlagID: 1 }
  ];

  // Sample mealplans
  const mealplans: MealplanInterface[] = [
    { ID: 1, PlanName: "แผนอาหารโรคไตระยะที่ 1", AdminID: 1 },
    { ID: 2, PlanName: "แผนอาหารโรคไตระยะที่ 2", AdminID: 1 }
  ];

  // Menu database with new structure using TagInterface
  const menuDatabase: Record<string, MenuInterface[]> = {
    A1: [
      { 
        ID: 1, 
        Title: "ข้าวต้มปลา", 
        Description: "ข้าวต้มปลาสดใส", 
        Region: "ภาคกลาง", 
        AdminID: 1, 
        Tags: [
          { ID: 1, Name: "เช้า" },
          { ID: 4, Name: "A1" },
          { ID: 6, Name: "โปรตีน" }
        ] 
      },
      { 
        ID: 2, 
        Title: "ไข่ต้ม", 
        Description: "ไข่ไก่ต้มสุก", 
        Region: "ทั่วไป", 
        AdminID: 1, 
        Tags: [
          { ID: 1, Name: "เช้า" },
          { ID: 4, Name: "A1" },
          { ID: 6, Name: "โปรตีน" }
        ] 
      },
      { 
        ID: 3, 
        Title: "ข้าวผัดมะเขือเทศ", 
        Description: "ข้าวผัดมะเขือเทศสดใส", 
        Region: "ภาคกลาง", 
        Tags: [
          { ID: 2, Name: "กลางวัน" },
          { ID: 4, Name: "A1" },
          { ID: 7, Name: "ผัก" }
        ] 
      },
      { 
        ID: 4, 
        Title: "ข้าวกล้องผัดผัก", 
        Description: "ข้าวกล้องผัดผักรวม", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 3, Name: "เย็น" },
          { ID: 4, Name: "A1" },
          { ID: 8, Name: "ไฟเบอร์สูง" }
        ] 
      },
      { 
        ID: 5, 
        Title: "แกงจืดมะระ", 
        Description: "แกงจืดมะระใส่หมูสับ", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 2, Name: "กลางวัน" },
          { ID: 4, Name: "A1" }
        ] 
      },
      { 
        ID: 6, 
        Title: "ปลาทอดกระเทียม", 
        Description: "ปลาทอดกระเทียมกรอบ", 
        Region: "ภาคกลาง", 
        Tags: [
          { ID: 3, Name: "เย็น" },
          { ID: 4, Name: "A1" },
          { ID: 6, Name: "โปรตีน" }
        ] 
      },
      { 
        ID: 7, 
        Title: "ผัดผักบุ้งไฟแดง", 
        Description: "ผัดผักบุ้งไฟแดงไม่เผ็ด", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 2, Name: "กลางวัน" },
          { ID: 4, Name: "A1" },
          { ID: 7, Name: "ผัก" }
        ] 
      },
      { 
        ID: 8, 
        Title: "โจ๊กไก่", 
        Description: "โจ๊กไก่สดใส", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 1, Name: "เช้า" },
          { ID: 4, Name: "A1" }
        ] 
      },
      { 
        ID: 9, 
        Title: "ข้าวผัดไข่", 
        Description: "ข้าวผัดไข่แบบง่ายๆ", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 3, Name: "เย็น" },
          { ID: 4, Name: "A1" },
          { ID: 6, Name: "โปรตีน" }
        ] 
      },
      { 
        ID: 10, 
        Title: "แกงจืดฟัก", 
        Description: "แกงจืดฟักทองใส", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 2, Name: "กลางวัน" },
          { ID: 4, Name: "A1" }
        ] 
      }
    ],
    A2: [
      { 
        ID: 11, 
        Title: "ข้าวต้มไก่", 
        Description: "ข้าวต้มไก่อ่อนๆ", 
        Region: "ทั่วไป", 
        AdminID: 1, 
        Tags: [
          { ID: 1, Name: "เช้า" },
          { ID: 5, Name: "A2" }
        ] 
      },
      { 
        ID: 12, 
        Title: "ผัดผักกาดขาว", 
        Description: "ผัดผักกาดขาวใสๆ", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 2, Name: "กลางวัน" },
          { ID: 5, Name: "A2" },
          { ID: 7, Name: "ผัก" }
        ] 
      },
      { 
        ID: 13, 
        Title: "ข้าวขาวผัดผัก", 
        Description: "ข้าวขาวผัดผักรวม", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 3, Name: "เย็น" },
          { ID: 5, Name: "A2" }
        ] 
      },
      { 
        ID: 14, 
        Title: "แกงจืดมะระอ่อน", 
        Description: "แกงจืดมะระอ่อนใสๆ", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 2, Name: "กลางวัน" },
          { ID: 5, Name: "A2" }
        ] 
      },
      { 
        ID: 15, 
        Title: "ไข่ขาวต้ม", 
        Description: "ไข่ขาวต้มไม่ใส่แดง", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 1, Name: "เช้า" },
          { ID: 5, Name: "A2" }
        ] 
      },
      { 
        ID: 16, 
        Title: "ปลาน้ำจืดนึ่ง", 
        Description: "ปลาน้ำจืดนึ่งมะนาว", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 3, Name: "เย็น" },
          { ID: 5, Name: "A2" },
          { ID: 6, Name: "โปรตีน" }
        ] 
      },
      { 
        ID: 17, 
        Title: "ผัดกะหล่ำปลี", 
        Description: "ผัดกะหล่ำปลีใสๆ", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 2, Name: "กลางวัน" },
          { ID: 5, Name: "A2" },
          { ID: 7, Name: "ผัก" }
        ] 
      },
      { 
        ID: 18, 
        Title: "โจ๊กข้าวขาว", 
        Description: "โจ๊กข้าวขาวใสไม่ใส่เครื่อง", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 1, Name: "เช้า" },
          { ID: 5, Name: "A2" }
        ] 
      },
      { 
        ID: 19, 
        Title: "ข้าวผัดขาว", 
        Description: "ข้าวผัดขาวธรรมดา", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 3, Name: "เย็น" },
          { ID: 5, Name: "A2" }
        ] 
      },
      { 
        ID: 20, 
        Title: "แกงจืดตำลึง", 
        Description: "แกงจืดตำลึงใสๆ", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 2, Name: "กลางวัน" },
          { ID: 5, Name: "A2" }
        ] 
      }
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

  // ฟังก์ชันสำหรับสุ่มเมนูตาม tag และมื้อ (ป้องกันการซ้ำในวันเดียวกัน)
  const getRandomMenuByMealTypeNoRepeat = (stage: string, mealType: string, usedMenus: number[]): MealMenuInterface[] => {
    const availableMenus = menuDatabase[stage]?.filter(menu => 
      menu.Tags.some(tag => tag.Name === mealType) && 
      menu.Tags.some(tag => tag.Name === stage) &&
      !usedMenus.includes(menu.ID || 0) // ป้องกันการซ้ำ
    ) || [];

    if (availableMenus.length === 0) return [];

    // สุ่มเมนู 1 รายการต่อมื้อ
    const selectedMenus: MealMenuInterface[] = [];
    
    if (availableMenus.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMenus.length);
      const menu = availableMenus[randomIndex];
      
      // เพิ่ม ID ของเมนูที่เลือกแล้วเข้า usedMenus
      if (menu.ID) {
        usedMenus.push(menu.ID);
      }
      
      selectedMenus.push({
        ID: Math.random() * 1000,
        PortionText: menu.Title,
        MealID: Math.random() * 1000,
        MenuID: menu.ID
      });
    }

    return selectedMenus;
  };

  // ฟังก์ชันสำหรับสุ่มผลไม้สำหรับมื้อว่าง (ป้องกันการซ้ำในวันเดียวกัน)
  const getRandomSnackItemsNoRepeat = (stage: string, usedFruits: number[]): MealMenuInterface[] => {
    // สุ่มว่าจะมีมื้อว่างหรือไม่ (โอกาส 60% ที่จะมี)
    const hasSnack = Math.random() < 0.6;
    if (!hasSnack) return [];

    // หาผลไม้ที่มี FoodFlag เป็น "ควรรับประทาน"
    const suitableFlag = foodFlags.find(flag => flag.Flag === "ควรรับประทาน");
    if (!suitableFlag) return [];

    let availableFruits = foodItems.filter(item => 
      item.FoodFlagID === suitableFlag.ID &&
      !usedFruits.includes(item.ID || 0) // ป้องกันการซ้ำ
    );

    // สำหรับ A2 ให้หลีกเลี่ยงผลไม้บางชนิด
    if (stage === 'A2') {
      const avoidFlag = foodFlags.find(flag => flag.Flag === "หลีกเลี่ยง");
      if (avoidFlag) {
        const fruitsToAvoid = foodItems.filter(item => item.FoodFlagID === avoidFlag.ID);
        const avoidNames = fruitsToAvoid.map(fruit => fruit.Name);
        availableFruits = availableFruits.filter(fruit => !avoidNames.includes(fruit.Name));
      }
    }

    if (availableFruits.length === 0) return [];

    // สุ่มผลไม้ 1 ชนิด
    const selectedFruits: MealMenuInterface[] = [];
    
    if (availableFruits.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableFruits.length);
      const fruit = availableFruits[randomIndex];
      
      // เพิ่ม ID ของผลไม้ที่เลือกแล้วเข้า usedFruits
      if (fruit.ID) {
        usedFruits.push(fruit.ID);
      }
      
      selectedFruits.push({
        ID: Math.random() * 1000,
        PortionText: fruit.Name,
        MealID: Math.random() * 1000,
        MenuID: fruit.ID
      });
    }

    return selectedFruits;
  };

  // ฟังก์ชันสำหรับสุ่มแผนอาหารใหม่ทั้งสัปดาห์ รวมมื้อว่าง
  const generateRandomMealPlan = (stage: string) => {
    const days = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];
    const mealTypes = ["เช้า", "ว่างเช้า", "กลางวัน", "ว่างบ่าย", "เย็น"];
    
    const newMealPlan: Record<string, Record<string, MealMenuInterface[]>> = {};

    days.forEach(day => {
      newMealPlan[day] = {};
      
      // เก็บรายการที่ใช้แล้วในแต่ละวัน
      const usedMenusToday: number[] = [];
      const usedFruitsToday: number[] = [];
      
      mealTypes.forEach(mealType => {
        if (mealType === "ว่างเช้า" || mealType === "ว่างบ่าย") {
          // สำหรับมื้อว่าง ใช้ผลไม้และป้องกันการซ้ำในวันเดียวกัน
          newMealPlan[day][mealType] = getRandomSnackItemsNoRepeat(stage, usedFruitsToday);
        } else {
          // สำหรับมื้อหลัก ใช้เมนูปกติและป้องกันการซ้ำในวันเดียวกัน
          newMealPlan[day][mealType] = getRandomMenuByMealTypeNoRepeat(stage, mealType, usedMenusToday);
        }
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
      plan.ID === (selectedStage === 'A1' ? 1 : 2)
    );
  };

  const handleDownload = () => {
    const currentPlan = getCurrentMealplan();
    console.log('Downloading meal plan:', currentPlan?.PlanName);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentMealplan = getCurrentMealplan();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold">
            แผนมื้ออาหารประจำสัปดาห์ - ระยะ {selectedStage}
          </h2>
        </div>

        {/* Stage Selection */}
        <div className="flex justify-center mb-4">
          <div className="flex bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setSelectedStage('A1')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedStage === 'A1'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ระยะที่ 1
            </button>
            <button
              onClick={() => setSelectedStage('A2')}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedStage === 'A2'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ระยะที่ 2
            </button>
          </div>
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
            โรคไตเรื้อรัง ระยะที่ {selectedStage === 'A1' ? '1' : '2'}
          </h3>
        </div>

        {/* Meal Plan Table */}
        <div className="bg-white border border-gray-300 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 w-24">วัน/มื้อ</th>
                <th className="border border-gray-300 px-4 py-2 bg-purple-200">เช้า</th>
                <th className="border border-gray-300 px-4 py-2 bg-orange-200">ว่างเช้า</th>
                <th className="border border-gray-300 px-4 py-2 bg-teal-200">กลางวัน</th>
                <th className="border border-gray-300 px-4 py-2 bg-orange-200">ว่างบ่าย</th>
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
                  <td className="border border-gray-300 px-4 py-4 bg-orange-50">
                    {meals.ว่างเช้า && meals.ว่างเช้า.length > 0 ? (
                      <ul className="space-y-1">
                        {meals.ว่างเช้า.map((mealMenu) => (
                          <li key={mealMenu.ID} className="text-sm flex items-start">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {mealMenu.PortionText}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-sm italic">-</span>
                    )}
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
                  <td className="border border-gray-300 px-4 py-4 bg-orange-50">
                    {meals.ว่างบ่าย && meals.ว่างบ่าย.length > 0 ? (
                      <ul className="space-y-1">
                        {meals.ว่างบ่าย.map((mealMenu) => (
                          <li key={mealMenu.ID} className="text-sm flex items-start">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {mealMenu.PortionText}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 text-sm italic">-</span>
                    )}
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