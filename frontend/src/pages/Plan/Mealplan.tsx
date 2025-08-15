import React, { useState } from 'react';
import { ChevronLeft, Download, FileText } from 'lucide-react';
import type { MealdayInterface } from '../../interfaces/Mealday';
import type { MealInterface } from '../../interfaces/Meal';
import type { MealMenuInterface } from '../../interfaces/MealMenu';
import type { MealplanInterface } from '../../interfaces/Mealplan';
import type { DiseaseInterface } from '../../interfaces/Disease';
import type { MenuInterface } from '../../interfaces/Menu';

/* // Interface definitions
interface DiseaseInterface {
  ID?: number;
  Name?: string;
  DiseaseStage?: string;
}
*/
/* interface MenuInterface {
  ID?: number;
  Title?: string;
  Description?: string;
  Region?: string;
  Image?: string;
  AdminID?: number; // FK
} */
/*
interface MealplanInterface {
  ID?: number;
  PlanName?: string;
  AdminID?: number; // FK
  DiseaseID?: number; // FK
}

interface MealdayInterface {
  ID?: number;
  DayofWeek?: string;
  MealplanID?: number; // FK
}

interface MealInterface {
  ID?: number;
  MealType?: string;
  MealdayID?: number; // FK
}*/

/* interface MealMenuInterface {
  ID?: number;
  MenuType?: string;
  Portiontext?: string;
  MealID?: number; // FK
  MenuID?: number; // FK
}  */

// Extended interfaces for UI data
interface MealPlanData {
  mealplan: MealplanInterface;
  disease: DiseaseInterface;
  mealdays: MealdayInterface[];
  meals: MealInterface[];
  menus: MenuInterface[];
  mealMenus: MealMenuInterface[];
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
  const [currentWeek, setCurrentWeek] = useState(1);
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Sample data following the interface structure
  const diseases: DiseaseInterface[] = [
    { ID: 1, Name: "โรคไตเรื้อรัง", DiseaseStage: "A1" },
    { ID: 2, Name: "โรคไตเรื้อรัง", DiseaseStage: "A2" }
  ];

  const mealplans: MealplanInterface[] = [
    { ID: 1, PlanName: "แผนอาหารโรคไตระยะที่ 1", AdminID: 1, DiseaseID: 1 },
    { ID: 2, PlanName: "แผนอาหารโรคไตระยะที่ 2", AdminID: 1, DiseaseID: 2 }
  ];

  const menus: MenuInterface[] = [
    { ID: 1, Title: "ข้าวต้มปลา", Description: "ข้าวต้มปลาสดใส", Region: "ภาคกลาง", AdminID: 1 },
    { ID: 2, Title: "ไข่ต้ม", Description: "ไข่ไก่ต้มสุก", Region: "ทั่วไป", AdminID: 1 },
    { ID: 3, Title: "ข้าวผัดมะเขือเทศ", Description: "ข้าวผัดมะเขือเทศสดใส", Region: "ภาคกลาง", AdminID: 1 },
    { ID: 4, Title: "ข้าวกล้องผัดผัก", Description: "ข้าวกล้องผัดผักรวม", Region: "ทั่วไป", AdminID: 1 }
  ];

  // Recommendations data for each stage
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

  // Meal plan data structure using interfaces
  const mealPlans: Record<string, Record<string, Record<string, MealMenuInterface[]>>> = {
    A1: {
      วันจันทร์: {
        เช้า: [
          { ID: 1, MenuType: "เช้า", PortionText: "ข้าวต้มปลา", MealID: 1, MenuID: 1 },
          { ID: 2, MenuType: "เช้า", PortionText: "ไข่ต้ม 1 ฟอง", MealID: 1, MenuID: 2 },
          { ID: 3, MenuType: "เช้า", PortionText: "น้ำ 2 แก้ว", MealID: 1, MenuID: undefined },
          { ID: 4, MenuType: "เช้า", PortionText: "ผัก 1/2 จาน", MealID: 1, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 5, MenuType: "กลางวัน", PortionText: "ข้าวผัดมะเขือเทศ/มะรืน", MealID: 2, MenuID: 3 },
          { ID: 6, MenuType: "กลางวัน", PortionText: "ข้าว 1.5 ทัพพี", MealID: 2, MenuID: undefined },
          { ID: 7, MenuType: "กลางวัน", PortionText: "น้ำมัตงา 4 ช้อน", MealID: 2, MenuID: undefined },
          { ID: 8, MenuType: "กลางวัน", PortionText: "มะระน้อม 15 เม็ด", MealID: 2, MenuID: undefined }
        ],
        เย็น: [
          { ID: 9, MenuType: "เย็น", PortionText: "ข้าวกล้องผัดผัก", MealID: 3, MenuID: 4 },
          { ID: 10, MenuType: "เย็น", PortionText: "ข้าว 1 ทัพพี", MealID: 3, MenuID: undefined },
          { ID: 11, MenuType: "เย็น", PortionText: "เนื้อ 1/2 ก้อน", MealID: 3, MenuID: undefined },
          { ID: 12, MenuType: "เย็น", PortionText: "น้ำ 2 แก้ว", MealID: 3, MenuID: undefined }
        ]
      },
      วันอังคาร: {
        เช้า: [
          { ID: 13, MenuType: "เช้า", PortionText: "ข้าวต้มมูก", MealID: 4, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 14, MenuType: "กลางวัน", PortionText: "ข้าวกบซูป", MealID: 5, MenuID: undefined },
          { ID: 15, MenuType: "กลางวัน", PortionText: "ข้าว 1.5 ทัพพี", MealID: 5, MenuID: undefined },
          { ID: 16, MenuType: "กลางวัน", PortionText: "น้ำ 4 แก้ว", MealID: 5, MenuID: undefined },
          { ID: 17, MenuType: "กลางวัน", PortionText: "มะระพร้าว 15 เม็ด", MealID: 5, MenuID: undefined }
        ],
        เย็น: [
          { ID: 18, MenuType: "เย็น", PortionText: "แกงจืด", MealID: 6, MenuID: undefined },
          { ID: 19, MenuType: "เย็น", PortionText: "ข้าว 1/2 จาน", MealID: 6, MenuID: undefined }
        ]
      },
      วันพุธ: {
        เช้า: [
          { ID: 20, MenuType: "เช้า", PortionText: "โจ๊ก", MealID: 7, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 21, MenuType: "กลางวัน", PortionText: "แกงจืด", MealID: 8, MenuID: undefined }
        ],
        เย็น: [
          { ID: 22, MenuType: "เย็น", PortionText: "ผัดผัก", MealID: 9, MenuID: undefined },
          { ID: 23, MenuType: "เย็น", PortionText: "ข้าวรวด", MealID: 9, MenuID: undefined }
        ]
      },
      วันพฤหัสบดี: {
        เช้า: [
          { ID: 24, MenuType: "เช้า", PortionText: "แซนด์วิช", MealID: 10, MenuID: undefined },
          { ID: 25, MenuType: "เช้า", PortionText: "โยดส์", MealID: 10, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 26, MenuType: "กลางวัน", PortionText: "ปลาป่น", MealID: 11, MenuID: undefined }
        ],
        เย็น: [
          { ID: 27, MenuType: "เย็น", PortionText: "ต้มน้ำใส", MealID: 12, MenuID: undefined },
          { ID: 28, MenuType: "เย็น", PortionText: "แอปเปิ้ล", MealID: 12, MenuID: undefined }
        ]
      },
      วันศุกร์: {
        เช้า: [
          { ID: 29, MenuType: "เช้า", PortionText: "ไมล์อดกิล", MealID: 13, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 30, MenuType: "กลางวัน", PortionText: "แกงจืดพาซต้า", MealID: 14, MenuID: undefined }
        ],
        เย็น: [
          { ID: 31, MenuType: "เย็น", PortionText: "คมุมพอยเสาวรส", MealID: 15, MenuID: undefined }
        ]
      },
      วันเสาร์: {
        เช้า: [
          { ID: 32, MenuType: "เช้า", PortionText: "ข้าวต้มไก่", MealID: 16, MenuID: undefined },
          { ID: 33, MenuType: "เช้า", PortionText: "ผัก", MealID: 16, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 34, MenuType: "กลางวัน", PortionText: "ผัดไทย", MealID: 17, MenuID: undefined }
        ],
        เย็น: [
          { ID: 35, MenuType: "เย็น", PortionText: "ผัดเสาวรส", MealID: 18, MenuID: undefined },
          { ID: 36, MenuType: "เย็น", PortionText: "ผัดเสาวรสน้ำใส", MealID: 18, MenuID: undefined }
        ]
      },
      วันอาทิตย์: {
        เช้า: [
          { ID: 37, MenuType: "เช้า", PortionText: "แซนด์วิช", MealID: 19, MenuID: undefined },
          { ID: 38, MenuType: "เช้า", PortionText: "นมสดโครงครั่ว", MealID: 19, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 39, MenuType: "กลางวัน", PortionText: "ปลาเสียง", MealID: 20, MenuID: undefined }
        ],
        เย็น: [
          { ID: 40, MenuType: "เย็น", PortionText: "ผัดเสาหู้ฟูเหมียว", MealID: 21, MenuID: undefined },
          { ID: 41, MenuType: "เย็น", PortionText: "ขั้มเล้าอาหาร", MealID: 21, MenuID: undefined }
        ]
      }
    },
    A2: {
      วันจันทร์: {
        เช้า: [
          { ID: 42, MenuType: "เช้า", PortionText: "ไมล์อดกิล", MealID: 22, MenuID: undefined },
          { ID: 43, MenuType: "เช้า", PortionText: "ผัก 1/2 จาน", MealID: 22, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 44, MenuType: "กลางวัน", PortionText: "ข้าวผัดมะเขือเทศ/มะรืน", MealID: 23, MenuID: 3 },
          { ID: 45, MenuType: "กลางวัน", PortionText: "ข้าว 1.5 ทัพพี", MealID: 23, MenuID: undefined },
          { ID: 46, MenuType: "กลางวัน", PortionText: "น้ำมัตงา 4 ช้อน", MealID: 23, MenuID: undefined },
          { ID: 47, MenuType: "กลางวัน", PortionText: "มะระน้อม 15 เม็ด", MealID: 23, MenuID: undefined }
        ],
        เย็น: [
          { ID: 48, MenuType: "เย็น", PortionText: "ผัดผัก", MealID: 24, MenuID: undefined }
        ]
      },
      วันอังคาร: {
        เช้า: [
          { ID: 49, MenuType: "เช้า", PortionText: "ข้าวต้มมูก", MealID: 25, MenuID: undefined },
          { ID: 50, MenuType: "เช้า", PortionText: "ข้าว 1/2 จาน", MealID: 25, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 51, MenuType: "กลางวัน", PortionText: "ข้าวกบซูป", MealID: 26, MenuID: undefined }
        ],
        เย็น: [
          { ID: 52, MenuType: "เย็น", PortionText: "ข้าวกล้องผัดผัก", MealID: 27, MenuID: 4 },
          { ID: 53, MenuType: "เย็น", PortionText: "ข้าว 1 ทัพพี", MealID: 27, MenuID: undefined },
          { ID: 54, MenuType: "เย็น", PortionText: "เนื้อ 1/2 ก้อน", MealID: 27, MenuID: undefined },
          { ID: 55, MenuType: "เย็น", PortionText: "น้ำ 2 แก้วใส", MealID: 27, MenuID: undefined }
        ]
      },
      วันพุธ: {
        เช้า: [
          { ID: 56, MenuType: "เช้า", PortionText: "โจ๊ก", MealID: 28, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 57, MenuType: "กลางวัน", PortionText: "แกงจืด", MealID: 29, MenuID: undefined }
        ],
        เย็น: [
          { ID: 58, MenuType: "เย็น", PortionText: "ผัดผัก", MealID: 30, MenuID: undefined },
          { ID: 59, MenuType: "เย็น", PortionText: "ข้าวรวด", MealID: 30, MenuID: undefined }
        ]
      },
      วันพฤหัสบดี: {
        เช้า: [
          { ID: 60, MenuType: "เช้า", PortionText: "แซนด์วิช", MealID: 31, MenuID: undefined },
          { ID: 61, MenuType: "เช้า", PortionText: "โยดส์", MealID: 31, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 62, MenuType: "กลางวัน", PortionText: "ปลาป่น", MealID: 32, MenuID: undefined }
        ],
        เย็น: [
          { ID: 63, MenuType: "เย็น", PortionText: "ต้มน้ำใส", MealID: 33, MenuID: undefined },
          { ID: 64, MenuType: "เย็น", PortionText: "แอปเปิ้ล", MealID: 33, MenuID: undefined }
        ]
      },
      วันศุกร์: {
        เช้า: [
          { ID: 65, MenuType: "เช้า", PortionText: "ข้าวต้มปลา", MealID: 34, MenuID: 1 },
          { ID: 66, MenuType: "เช้า", PortionText: "ข้าว 1 ทัพพี", MealID: 34, MenuID: undefined },
          { ID: 67, MenuType: "เช้า", PortionText: "น้ำ 2 แก้วใส", MealID: 34, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 68, MenuType: "กลางวัน", PortionText: "แกงจืดพาซต้า", MealID: 35, MenuID: undefined }
        ],
        เย็น: [
          { ID: 69, MenuType: "เย็น", PortionText: "คมุมพอยเสาวรส", MealID: 36, MenuID: undefined }
        ]
      },
      วันเสาร์: {
        เช้า: [
          { ID: 70, MenuType: "เช้า", PortionText: "ข้าวต้มไก่", MealID: 37, MenuID: undefined },
          { ID: 71, MenuType: "เช้า", PortionText: "ผัก", MealID: 37, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 72, MenuType: "กลางวัน", PortionText: "ผัดไทย", MealID: 38, MenuID: undefined }
        ],
        เย็น: [
          { ID: 73, MenuType: "เย็น", PortionText: "ผัดเสาวรส", MealID: 39, MenuID: undefined },
          { ID: 74, MenuType: "เย็น", PortionText: "ผัดเสาวรสน้ำใส", MealID: 39, MenuID: undefined }
        ]
      },
      วันอาทิตย์: {
        เช้า: [
          { ID: 75, MenuType: "เช้า", PortionText: "แซนด์วิช", MealID: 40, MenuID: undefined },
          { ID: 76, MenuType: "เช้า", PortionText: "นมสดโครงครั่ว", MealID: 40, MenuID: undefined }
        ],
        กลางวัน: [
          { ID: 77, MenuType: "กลางวัน", PortionText: "ปลาเสียง", MealID: 41, MenuID: undefined }
        ],
        เย็น: [
          { ID: 78, MenuType: "เย็น", PortionText: "ผัดเสาหู้ฟูเหมียว", MealID: 42, MenuID: undefined },
          { ID: 79, MenuType: "เย็น", PortionText: "ขั้มเล้าอาหาร", MealID: 42, MenuID: undefined }
        ]
      }
    }
  };

  const dayColors: Record<string, string> = {
    วันจันทร์: 'bg-yellow-100',
    วันอังคาร: 'bg-pink-100', 
    วันพุธ: 'bg-green-100',
    วันพฤหัสบดี: 'bg-orange-100',
    วันศุกร์: 'bg-blue-100',
    วันเสาร์: 'bg-purple-100',
    วันอาทิตย์: 'bg-red-100'
  };

  // Get current mealplan data
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
      {/* Header */}
      {/* <div className="bg-blue-500 text-white px-4 py-4">
        <div className="flex items-center">
          <ChevronLeft className="w-6 h-6 mr-3" />
          <h1 className="text-lg font-medium">ความรู้ แผนอาหารแนะนำ</h1>
        </div> */}
      {/* </div> */}

      {/* Content */}
      <div className="p-4">
        {/* Stage Selector */}
        <div className="flex justify-end mb-4">
          <div className="bg-white border border-gray-300 rounded px-3 py-2">
            <span className="text-sm text-gray-600">เลือกแผน:</span>
            <select 
              value={selectedStage} 
              onChange={(e) => setSelectedStage(e.target.value as 'A1' | 'A2')}
              className="ml-2 border-none outline-none bg-transparent"
            >
              <option value="A1">แผน A1</option>
              <option value="A2">แผน A2</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-4">
          {currentMealplan?.PlanName || `แผนมื้ออาหารประจำสัปดาห์ที่ ${currentWeek}`}
        </h2>

        {/* Week Header */}
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
                <th className="border border-gray-300 px-4 py-2 w-24">แผน {selectedStage}</th>
                <th className="border border-gray-300 px-4 py-2 bg-purple-200">เช้า</th>
                <th className="border border-gray-300 px-4 py-2 bg-teal-200">กลางวัน</th>
                <th className="border border-gray-300 px-4 py-2 bg-purple-200">เย็น</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(mealPlans[selectedStage]).map(([day, meals]) => (
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
              {/* Recommended Foods */}
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

              {/* Foods to Avoid */}
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

export default MealPlannerApp