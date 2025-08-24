import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText, RefreshCw, Shuffle, Settings, Star, Tag, Droplets  } from 'lucide-react';
/* import type { TagInterface } from '../../interfaces/Tag';
import type { MenuInterface } from '../../interfaces/Menu';
import type { MenuTagInterface } from '../../interfaces/MenuTag';
import type { FoodGroupInterface } from '../../interfaces/FoodGroup';
import type { FoodFlagInterface } from '../../interfaces/FoodFlag';
import type { FoodItemInterface } from '../../interfaces/FoodItem';
import type { FoodchoiceDiseaseInterface } from '../../interfaces/FoodchoiceDisease';
import type { FoodChoiceInterface } from '../../interfaces/FoodChoice';
import type { MealInterface } from '../../interfaces/Meal';
import type { MealMenuInterface } from '../../interfaces/MealMenu';
import type { MealFooditemInterface } from '../../interfaces/MealFooditem';
import type { MealdayInterface } from '../../interfaces/Mealday';
import type { MealplanInterface } from '../../interfaces/Mealplan';
import type { DiseasesInterface } from '../../interfaces/Disease';
import type { SlotConfigInterface } from '../../interfaces/SlotConfig'; */
import { useNavigate  } from 'react-router-dom';
import {GenerateWeeklyMealPlan, GetFoodChoicesByDisease, GetAllDisease, GetAllTag,} from "../../services/https/index";


interface TagInterface {
  ID?: number;
  Name?: string;
}

interface MenuTagInterface {
  ID?: number;
  MenuID?: number;
  TagID?: number;
}

interface MenuInterface {
  ID?: number;
  Title?: string;
  Description?: string;
  Region?: string;
  Image?: string;
  Credit?: string;
  AdminID?: number;
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
  Description?: string;
  FoodFlagID?: number;
}

interface FoodChoiceInterface {
  ID?: number;
  FoodName?: string;
}

interface FoodchoiceDiseaseInterface {
  ID?: number;
  Description?: string;
  DiseaseID?: number;
  FoodChoiceID?: number;
}

interface DiseasesInterface {
  ID?: number;
  Name?: string;
  Stage?: string;
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
  PortionText?: string;
  MealID?: number;
  MenuID?: number;
} 

 interface SlotConfigInterface {
  slotName: string;
  selectedTags: TagInterface[];
  mealTypes: string[];
}

interface RecommendationData {
  title: string;
  general: string[];
  nutrition: Record<string, string>;
  foods: {
    แนะนำ: string[];
    ควรหลีกเลี่ยง: string[];
  };
  foodChoices: FoodchoiceDiseaseInterface[];
}

const MealPlannerApp = () => {
  const [selectedDisease, setSelectedDisease] = useState<DiseasesInterface>({ ID: 1, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ 1-3a" });
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSlotConfig, setShowSlotConfig] = useState(false);
  const [currentMealPlan, setCurrentMealPlan] = useState<Record<string, Record<string, MealMenuInterface[]>>>({});
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [lastRandomized, setLastRandomized] = useState<Date>(new Date());
  const [slotConfigs, setSlotConfigs] = useState<SlotConfigInterface[]>([
    { slotName: "มื้อเช้า", selectedTags: [], mealTypes: ["เช้า"] },
    { slotName: "มื้อกลางวัน", selectedTags: [], mealTypes: ["กลางวัน"] },
    { slotName: "มื้อเย็น", selectedTags: [], mealTypes: ["เย็น"] }
  ]);
  const navigate = useNavigate();
  const handleGoToFluidCalc = () => {
    navigate('/maintenancefluid');
    console.log('Navigating to Maintenance Fluid page...');
  };

  // Sample diseases - ใช้ข้อมูลตามระบบใหม่
  const diseases: DiseasesInterface[] = [
    { ID: 1, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ 1-3a" },
    { ID: 2, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ 3b-5" }
  ];

  // Expanded tags with more variety
  const allTags: TagInterface[] = [
    { ID: 1, Name: "ภาคใต้" },
    { ID: 2, Name: "ภาคกลาง" },
    { ID: 3, Name: "ภาคอีสาน" },
    { ID: 4, Name: "ภาคเหนือ" },
    { ID: 5, Name: "ต้ม" },
    { ID: 6, Name: "ยำ" },
    { ID: 7, Name: "น้ำพริก" },
    { ID: 8, Name: "แกง" },
    { ID: 9, Name: "ลาบ" },
    { ID: 10, Name: "เส้น" },
    { ID: 11, Name: "ผัด" },
    { ID: 12, Name: "ทอด" },
    { ID: 13, Name: "นึ่ง" },
    { ID: 14, Name: "ส้มตำ" },
    { ID: 15, Name: "ของหวาน" },
    { ID: 16, Name: "โปรตีนต่ำ" },
    { ID: 17, Name: "โซเดียมต่ำ" },
    { ID: 18, Name: "ไขมันต่ำ" },
    { ID: 19, Name: "ไฟเบอร์สูง" },
    { ID: 20, Name: "วิตามินสี" }
  ];

  // Food groups including fruits
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

  // Food flags
  const foodFlags: FoodFlagInterface[] = [
    { ID: 1, Flag: "ควรรับประทาน", FoodGroupID: 4 },
    { ID: 2, Flag: "ควรหลีกเลี่ยง", FoodGroupID: 4 },
    { ID: 3, Flag: "ควรรับประทาน", FoodGroupID: 1 },
    { ID: 4, Flag: "ควรหลีกเลี่ยง", FoodGroupID: 1 }
  ];

  // Food items (fruits and desserts for snacks)
  const foodItems: FoodItemInterface[] = [
    // Fruits - should eat
    { ID: 1, Name: "แอปเปิ้ล", Description: "ผลไม้สดใหม่", FoodFlagID: 1 },
    { ID: 2, Name: "สับปะรด", Description: "ผลไม้รสหวานซ่าส์", FoodFlagID: 1 },
    { ID: 3, Name: "มะละกอ", Description: "ผลไม้เขตร้อน", FoodFlagID: 1 },
    { ID: 4, Name: "ฝรั่ง", Description: "ผลไม้รสหวานอมเปรียว", FoodFlagID: 1 },
    { ID: 5, Name: "องุ่น", Description: "ผลไม้เล็กรสหวาน", FoodFlagID: 1 },
    { ID: 6, Name: "แตงโม", Description: "ผลไม้น้ำมาก", FoodFlagID: 1 },
    // Fruits - should avoid for some stages
    { ID: 7, Name: "กล้วย", Description: "ผลไม้โพแทสเซียมสูง", FoodFlagID: 2 },
    { ID: 8, Name: "ส้ม", Description: "ผลไม้วิตามินซีสูง", FoodFlagID: 2 },
    { ID: 9, Name: "มะม่วง", Description: "ผลไม้น้ำตาลสูง", FoodFlagID: 2 }
  ];

  // Food choices ตามข้อมูลใหม่
  const foodChoices: FoodChoiceInterface[] = [
    { ID: 1, FoodName: "นม และผลิตภัณฑ์นมไขมันต่ำหรือไร้ไขมัน" },
    { ID: 2, FoodName: "เนื้อสัตว์ไม่ติดหนัง ไม่ติดมัน เนื้อหมู เนื้อไก่ เนื้อวัว อาหารทะเล ไข่ ไข่ขาว เต้าหู้ โปรตีนเกษตร" },
    { ID: 3, FoodName: "ธัญพืชและผลิตภัณฑ์: ข้าว แป้ง ก๋วยเตี๋ยว ขนมจีน ขนมปัง ข้าวโพด ข้าวฟ่าง ข้าวโอ๊ต ทั้งขัดสี และไม่ขัดสี" },
    { ID: 4, FoodName: "ถั่ว: ถั่วเหลือง ถั่วเหลือง ถั่วเขียว ถั่วแดง ถั่วดำ ถั่วลิสง เม็ดมะม่วงหิมพานต์ อัลมอลด์" },
    { ID: 5, FoodName: "น้ำมันชนิดดี: น้ำมันพืช น้ำมันรำข้าว น้ำมันมะกอก น้ำมันถั่วเหลือง" },
    { ID: 6, FoodName: "ไขมันอิ่มตัว ไขมันทรานส์" },
    { ID: 7, FoodName: "สมุนไพร และเครื่องเทศ" },
    { ID: 8, FoodName: "เกลือ น้ำปลา ซีอิ้ว เครื่องปรุงรสที่มีโซเดียม" },
    { ID: 9, FoodName: "ขนมหวาน น้ำตาล เครื่องดื่มที่ใส่น้ำตาล" },
    { ID: 10, FoodName: "อาหารที่มีฟอสฟอรัสแอบซ่อน" }
  ];

  // Food choice diseases ตามข้อมูลใหม่
  const foodChoiceDiseases: FoodchoiceDiseaseInterface[] = [
    // ระยะที่ 1-3a
    { ID: 1, Description: "รับประทานในปริมาณที่เหมาะสม", DiseaseID: 1, FoodChoiceID: 1 },
    { ID: 2, Description: "รับประทานในปริมาณที่เหมาะสม", DiseaseID: 1, FoodChoiceID: 2 },
    { ID: 3, Description: "รับประทานให้หลากหลายในปริมาณที่เหมาะสม", DiseaseID: 1, FoodChoiceID: 3 },
    { ID: 4, Description: "รับประทานในปริมาณที่เหมาะสม", DiseaseID: 1, FoodChoiceID: 4 },
    { ID: 5, Description: "รับประทานในปริมาณที่เหมาะสม", DiseaseID: 1, FoodChoiceID: 5 },
    { ID: 6, Description: "หลีกเลี่ยง", DiseaseID: 1, FoodChoiceID: 6 },
    { ID: 7, Description: "ใช้ได้", DiseaseID: 1, FoodChoiceID: 7 },
    { ID: 8, Description: "จำกัดการรับประทาน", DiseaseID: 1, FoodChoiceID: 8 },
    { ID: 9, Description: "จำกัดการรับประทาน", DiseaseID: 1, FoodChoiceID: 9 },
    { ID: 10, Description: "หลีกเลี่ยงเด็ดขาด", DiseaseID: 1, FoodChoiceID: 10 },
    
    // ระยะที่ 3b-5
    { ID: 11, Description: "มีโปรตีน มีโพแทสเซียม และฟอสฟอรัสสูง", DiseaseID: 2, FoodChoiceID: 1 },
    { ID: 12, Description: "จำกัดปริมาณและ ระวังโพแทสเซียมและฟอสฟอรัสในอาหารบางชนิด", DiseaseID: 2, FoodChoiceID: 2 },
    { ID: 13, Description: "ธัญพืชและผลิตภัณฑ์ที่ไม่ขัดสีมีโพแทสเซียมและฟอสฟอรัสสูง", DiseaseID: 2, FoodChoiceID: 3 },
    { ID: 14, Description: "มีทั้งโพแทสเซียมและฟอสฟอรัสสูง", DiseaseID: 2, FoodChoiceID: 4 },
    { ID: 15, Description: "รับประทานในปริมาณที่เหมาะสม", DiseaseID: 2, FoodChoiceID: 5 },
    { ID: 16, Description: "หลีกเลี่ยง", DiseaseID: 2, FoodChoiceID: 6 },
    { ID: 17, Description: "ใช้ได้", DiseaseID: 2, FoodChoiceID: 7 },
    { ID: 18, Description: "จำกัดการรับประทาน", DiseaseID: 2, FoodChoiceID: 8 },
    { ID: 19, Description: "จำกัดการรับประทาน", DiseaseID: 2, FoodChoiceID: 9 },
    { ID: 20, Description: "หลีกเลี่ยงเด็ดขาด", DiseaseID: 2, FoodChoiceID: 10 }
  ];

  // Menu database with disease-specific tags
  const menuDatabase: Record<number, MenuInterface[]> = {
    1: [ // Kidney disease stage 1-3a
      { 
        ID: 1, 
        Title: "ข้าวต้มปลา", 
        Description: "ข้าวต้มปลาสดใส", 
        Region: "ภาคกลาง", 
        AdminID: 1, 
        Tags: [
          { ID: 5, Name: "ต้ม" },
          { ID: 16, Name: "โปรตีนต่ำ" },
          { ID: 17, Name: "โซเดียมต่ำ" }
        ] 
      },
      { 
        ID: 2, 
        Title: "ไข่ต้ม", 
        Description: "ไข่ไก่ต้มสุก", 
        Region: "ทั่วไป", 
        AdminID: 1, 
        Tags: [
          { ID: 5, Name: "ต้ม" },
          { ID: 16, Name: "โปรตีนต่ำ" }
        ] 
      },
      { 
        ID: 3, 
        Title: "ข้าวผัดมะเขือเทศ", 
        Description: "ข้าวผัดมะเขือเทศสดใส", 
        Region: "ภาคกลาง", 
        Tags: [
          { ID: 11, Name: "ผัด" },
          { ID: 19, Name: "ไฟเบอร์สูง" },
          { ID: 20, Name: "วิตามินสี" }
        ] 
      },
      { 
        ID: 15, 
        Title: "วุ้นมะพร้าว", 
        Description: "ขนมหวานเย็นๆ", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 15, Name: "ของหวาน" },
          { ID: 18, Name: "ไขมันต่ำ" }
        ] 
      }
    ],
    2: [ // Kidney disease stage 3b-5
      { 
        ID: 11, 
        Title: "ข้าวต้มไก่", 
        Description: "ข้าวต้มไก่อ่อนๆ", 
        Region: "ทั่วไป", 
        AdminID: 1, 
        Tags: [
          { ID: 5, Name: "ต้ม" },
          { ID: 16, Name: "โปรตีนต่ำ" },
          { ID: 17, Name: "โซเดียมต่ำ" }
        ] 
      },
      { 
        ID: 12, 
        Title: "ผัดผักกาดขาว", 
        Description: "ผัดผักกาดขาวใสๆ", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 11, Name: "ผัด" },
          { ID: 17, Name: "โซเดียมต่ำ" },
          { ID: 19, Name: "ไฟเบอร์สูง" }
        ] 
      },
      { 
        ID: 16, 
        Title: "เฌอปุดดิ้งผลไม้", 
        Description: "ขนมหวานน้ำตาลน้อย", 
        Region: "ทั่วไป", 
        Tags: [
          { ID: 15, Name: "ของหวาน" },
          { ID: 18, Name: "ไขมันต่ำ" }
        ] 
      }
    ]
  };

  // Meal plans - ปรับให้ตรงกับระยะโรคใหม่
  const mealplans: MealplanInterface[] = [
    { ID: 1, PlanName: "แผนอาหารโรคไตเรื้อรัง ระยะที่ 1-3a", AdminID: 1, DiseaseID: 1 },
    { ID: 2, PlanName: "แผนอาหารโรคไตเรื้อรัง ระยะที่ 3b-5", AdminID: 1, DiseaseID: 2 }
  ];

  // Enhanced recommendations with food choice diseases ตามระยะโรคใหม่
  const recommendations: Record<number, RecommendationData> = {
    1: {
      title: "คำแนะนำสำหรับผู้ป่วยโรคไตเรื้อรัง ระยะที่ 1-3a",
      general: [
        "ดื่มน้ำให้เพียงพอ อย่างน้อยวันละ 8-10 แก้ว",
        "จำกัดเกลือในอาหารไม่เกิน 2,300 มิลลิกรัมต่อวัน",
        "รับประทานผลไม้และผัก 5-9 ส่วนต่อวัน",
        "เลือกโปรตีนคุณภาพดี และควบคุมปริมาณ",
        "หลีกเลี่ยงไขมันอิ่มตัวและไขมันทรานส์",
        "ใช้สมุนไพรและเครื่องเทศแทนการปรุงรสด้วยเกลือ"
      ],
      nutrition: {
        "โซเดียม": "< 2,300 มก./วัน",
        "โปรตีน": "0.8-1.0 กรัม/กก.น้ำหนัก",
        "ฟอสฟอรัส": "800-1,000 มก./วัน",
        "โพแทสเซียม": "3,500-4,500 มก./วัน"
      },
      foods: {
        แนะนำ: [
          "นมและผลิตภัณฑ์นมไขมันต่ำหรือไร้ไขมัน",
          "เนื้อสัตว์ไม่ติดหนัง ไข่ขาว เต้าหู้", 
          "ธัญพืชและผลิตภัณฑ์หลากหลาย",
          "ถั่วต่างๆ อัลมอลด์",
          "น้ำมันชนิดดี เช่น น้ำมันมะกอก"
        ],
        ควรหลีกเลี่ยง: [
          "ไขมันอิ่มตัว ไขมันทรานส์",
          "อาหารที่มีเกลือสูง น้ำปลา ซีอิ้ว",
          "ขนมหวาน น้ำตาล เครื่องดื่มหวาน", 
          "อาหารที่มีฟอสฟอรัสแอบซ่อน"
        ]
      },
      foodChoices: foodChoiceDiseases.filter(fc => fc.DiseaseID === 1)
    },
    2: {
      title: "คำแนะนำสำหรับผู้ป่วยโรคไตเรื้อรัง ระยะที่ 3b-5",
      general: [
        "ควบคุมความดันโลหิตให้อยู่ในระดับปกติ",
        "จำกัดโซเดียมมากขึ้น ไม่เกิน 2,000 มิลลิกรัมต่อวัน",
        "ลดโปรตีนลง เพื่อลดภาระการทำงานของไต",
        "ระวังโพแทสเซียมและฟอสฟอรัสในอาหาร",
        "ตรวจสุขภาพและติดตามค่าไตเป็นประจำ",
        "หลีกเลี่ยงอาหารที่มีฟอสฟอรัสแอบซ่อนเด็ดขาด"
      ],
      nutrition: {
        "โซเดียม": "< 2,000 มก./วัน",
        "โปรตีน": "0.6-0.8 กรัม/กก.น้ำหนัก",
        "ฟอสฟอรัส": "600-800 มก./วัน", 
        "โพแทสเซียม": "2,000-3,000 มก./วัน"
      },
      foods: {
        แนะนำ: [
          "น้ำมันชนิดดี ในปริมาณที่เหมาะสม",
          "สมุนไพรและเครื่องเทศสำหรับปรุงรส",
          "ธัญพืชขัดสี เช่น ข้าวขาว แป้ง"
        ],
        ควรหลีกเลี่ยง: [
          "นม ผลิตภัณฑ์นม (โปรตีน โพแทสเซียม ฟอสฟอรัสสูง)",
          "เนื้อสัตว์ปริมาณมาก (ระวังโพแทสเซียมและฟอสฟอรัส)",
          "ธัญพืชไม่ขัดสี (โพแทสเซียมและฟอสฟอรัสสูง)", 
          "ถั่วต่างๆ (โพแทสเซียมและฟอสฟอรัสสูง)",
          "ไขมันอิ่มตัว ไขมันทรานส์",
          "เกลือ น้ำปลา ซีอิ้ว",
          "ขนมหวาน น้ำตาล",
          "อาหารที่มีฟอสฟอรัสแอบซ่อน"
        ]
      },
      foodChoices: foodChoiceDiseases.filter(fc => fc.DiseaseID === 2)
    }
  };

  // Function to get menu by tags and disease
  const getMenuByTags = (diseaseId: number, selectedTags: TagInterface[], isSnack: boolean = false): MenuInterface[] => {
    const availableMenus = menuDatabase[diseaseId] || [];
    
    if (isSnack) {
      // For snacks, look for dessert menus
      return availableMenus.filter(menu => 
        menu.Tags.some(tag => tag.Name === "ของหวาน")
      );
    }
    
    if (selectedTags.length === 0) {
      // If no tags selected, return non-dessert menus
      return availableMenus.filter(menu => 
        !menu.Tags.some(tag => tag.Name === "ของหวาน")
      );
    }
    
    // Filter by selected tags and exclude desserts for main meals
    return availableMenus.filter(menu => 
      selectedTags.some(selectedTag => 
        menu.Tags.some(tag => tag.ID === selectedTag.ID)
      ) && !menu.Tags.some(tag => tag.Name === "ของหวาน")
    );
  };

  // Function to get fruits for snacks
  const getFruitsForSnack = (diseaseId: number): FoodItemInterface[] => {
    const suitableFlag = foodFlags.find(flag => flag.Flag === "ควรรับประทาน" && flag.FoodGroupID === 4);
    if (!suitableFlag) return [];

    let availableFruits = foodItems.filter(item => item.FoodFlagID === suitableFlag.ID);
    
    // For stage 2, avoid certain fruits
    if (diseaseId === 2) {
      const avoidFlag = foodFlags.find(flag => flag.Flag === "ควรหลีกเลี่ยง" && flag.FoodGroupID === 4);
      if (avoidFlag) {
        const fruitsToAvoid = foodItems.filter(item => item.FoodFlagID === avoidFlag.ID);
        const avoidNames = fruitsToAvoid.map(fruit => fruit.Name);
        availableFruits = availableFruits.filter(fruit => !avoidNames.includes(fruit.Name));
      }
    }
    
    return availableFruits;
  };

  // Function to generate random meal plan with slot configuration
  const generateRandomMealPlan = () => {
    const days = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];
    const mealTypes = ["เช้า", "ว่างเช้า", "กลางวัน", "ว่างบ่าย", "เย็น"];
    
    const newMealPlan: Record<string, Record<string, MealMenuInterface[]>> = {};

    days.forEach(day => {
      newMealPlan[day] = {};
      
      mealTypes.forEach(mealType => {
        if (mealType === "ว่างเช้า" || mealType === "ว่างบ่าย") {
          // For snacks - mix fruits and dessert menus
          const snackItems: MealMenuInterface[] = [];
          
          // 70% chance for fruits
          if (Math.random() < 0.7) {
            const availableFruits = getFruitsForSnack(selectedDisease.ID || 1);
            if (availableFruits.length > 0) {
              const randomFruit = availableFruits[Math.floor(Math.random() * availableFruits.length)];
              snackItems.push({
                ID: Math.random() * 1000,
                PortionText: randomFruit.Name || "",
                MealID: Math.random() * 1000,
                MenuID: randomFruit.ID
              });
            }
          } else {
            // 30% chance for dessert menu
            const availableDesserts = getMenuByTags(selectedDisease.ID || 1, [], true);
            if (availableDesserts.length > 0) {
              const randomDessert = availableDesserts[Math.floor(Math.random() * availableDesserts.length)];
              snackItems.push({
                ID: Math.random() * 1000,
                PortionText: randomDessert.Title || "",
                MealID: Math.random() * 1000,
                MenuID: randomDessert.ID
              });
            }
          }
          
          newMealPlan[day][mealType] = snackItems;
        } else {
          // For main meals - use slot configuration
          const slotConfig = slotConfigs.find(slot => slot.mealTypes.includes(mealType));
          const availableMenus = getMenuByTags(selectedDisease.ID || 1, slotConfig?.selectedTags || []);
          
          const selectedMenus: MealMenuInterface[] = [];
          if (availableMenus.length > 0) {
            const randomMenu = availableMenus[Math.floor(Math.random() * availableMenus.length)];
            selectedMenus.push({
              ID: Math.random() * 1000,
              PortionText: randomMenu.Title || "",
              MealID: Math.random() * 1000,
              MenuID: randomMenu.ID
            });
          }
          
          newMealPlan[day][mealType] = selectedMenus;
        }
      });
    });

    return newMealPlan;
  };

  const handleRandomizePlan = async () => {
    setIsRandomizing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPlan = generateRandomMealPlan();
    setCurrentMealPlan(newPlan);
    setLastRandomized(new Date());
    setIsRandomizing(false);
  };

  const handleTagToggle = (slotIndex: number, tag: TagInterface) => {
    setSlotConfigs(prev => prev.map((slot, index) => {
      if (index === slotIndex) {
        const isSelected = slot.selectedTags.some(t => t.ID === tag.ID);
        return {
          ...slot,
          selectedTags: isSelected 
            ? slot.selectedTags.filter(t => t.ID !== tag.ID)
            : [...slot.selectedTags, tag]
        };
      }
      return slot;
    }));
  };

  useEffect(() => {
    const initialPlan = generateRandomMealPlan();
    setCurrentMealPlan(initialPlan);
  }, [selectedDisease, slotConfigs]);

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
    return mealplans.find(plan => plan.DiseaseID === selectedDisease.ID);
  };

  const handleDownload = () => {
    const currentPlan = getCurrentMealplan();
    console.log('Downloading meal plan:', currentPlan?.PlanName);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ระบบวางแผนมื้ออาหารรายสัปดาห์ตามระยะโรค
          </h1>
          <p className="text-gray-600">วางแผนอาหารที่เหมาะสมกับภาวะสุขภาพของคุณ</p>
        </div>

        {/* Disease Selection - แทนที่ด้วย Dropdown */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 min-w-72">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลือกระยะโรค
            </label>
            <select
              value={selectedDisease.ID}
              onChange={(e) => {
                const diseaseId = parseInt(e.target.value);
                const disease = diseases.find(d => d.ID === diseaseId);
                if (disease) setSelectedDisease(disease);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {diseases.map(disease => (
                <option key={disease.ID} value={disease.ID}>
                  {disease.Name} {disease.Stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Slot Configuration Button */}
        <div className="flex justify-center mb-4">
          <button 
            onClick={() => setShowSlotConfig(!showSlotConfig)}
            className="flex items-center gap-2 bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
            ตั้งค่า Slot การสุ่มเมนู
          </button>

          {/* เพิ่มปุ่มไปหน้าคำนวณน้ำ */}
          <button 
            onClick={handleGoToFluidCalc}
            className="flex items-center gap-2 bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <Droplets className="w-4 h-4" />
            คำนวณ Maintenance Fluid
          </button>
        </div>

        {/* Slot Configuration Panel */}
        {showSlotConfig && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-indigo-500" />
              ตั้งค่า Slot การสุ่มเมนูอาหาร
            </h3>
            
            <div className="space-y-6">
              {slotConfigs.map((slot, slotIndex) => (
                <div key={slotIndex} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-500 mr-2" />
                    <h4 className="font-medium text-gray-700">{slot.slotName}</h4>
                    <span className="ml-2 text-sm text-gray-500">
                      ({slot.mealTypes.join(', ')})
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {allTags.filter(tag => tag.Name !== "ของหวาน").map(tag => (
                      <button
                        key={tag.ID}
                        onClick={() => handleTagToggle(slotIndex, tag)}
                        className={`px-3 py-1 rounded-full text-xs transition-colors flex items-center gap-1 ${
                          slot.selectedTags.some(t => t.ID === tag.ID)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Tag className="w-3 h-3" />
                        {tag.Name}
                      </button>
                    ))}
                  </div>
                  
                  {slot.selectedTags.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      เลือกแล้ว: {slot.selectedTags.map(t => t.Name).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>หมายเหตุ:</strong> การเลือก tag จะช่วยให้ระบบสุ่มเมนูที่ตรงกับความต้องการของคุณมากขึ้น 
                หากไม่เลือก tag ระบบจะสุ่มจากเมนูทั้งหมดที่เหมาะสมกับโรค
              </p>
            </div>
          </div>
        )}

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
        <div className="bg-blue-600 text-white py-3 px-4 rounded-t-lg">
          <h3 className="font-medium">
            {selectedDisease.Name} {selectedDisease.Stage} - {getCurrentMealplan()?.PlanName}
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
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {mealMenu.PortionText}
                        </li>
                      ))}
                      {meals.เช้า?.length === 0 && (
                        <span className="text-gray-400 text-sm italic">ไม่มีเมนู</span>
                      )}
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
                          <span className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {mealMenu.PortionText}
                        </li>
                      ))}
                      {meals.กลางวัน?.length === 0 && (
                        <span className="text-gray-400 text-sm italic">ไม่มีเมนู</span>
                      )}
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
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {mealMenu.PortionText}
                        </li>
                      ))}
                      {meals.เย็น?.length === 0 && (
                        <span className="text-gray-400 text-sm italic">ไม่มีเมนู</span>
                      )}
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
              {recommendations[selectedDisease.ID || 1]?.title}
            </h3>

            {/* General Recommendations */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                คำแนะนำทั่วไป
              </h4>
              <ul className="space-y-2 pl-5">
                {recommendations[selectedDisease.ID || 1]?.general.map((item, index) => (
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
                  {Object.entries(recommendations[selectedDisease.ID || 1]?.nutrition || {}).map(([nutrient, amount]) => (
                    <div key={nutrient} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="font-medium text-gray-700">{nutrient}:</span>
                      <span className="text-green-600 font-semibold">{amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Food Choice Recommendations */}
            {recommendations[selectedDisease.ID || 1]?.foodChoices.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                  คำแนะนำการเลือกอาหาร
                </h4>
                <div className="bg-purple-50 rounded-lg p-4">
                  <ul className="space-y-3">
                    {recommendations[selectedDisease.ID || 1]?.foodChoices.map((fc, index) => {
                      const foodChoice = foodChoices.find(f => f.ID === fc.FoodChoiceID);
                      return (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <div>
                            <span className="font-medium text-purple-700">{foodChoice?.FoodName}: </span>
                            <span className="text-gray-700">{fc.Description}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* Food Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-green-600 mb-3 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  อาหารที่แนะนำ
                </h4>
                <div className="bg-green-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    {recommendations[selectedDisease.ID || 1]?.foods.แนะนำ.map((food, index) => (
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
                    {recommendations[selectedDisease.ID || 1]?.foods.ควรหลีกเลี่ยง.map((food, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
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