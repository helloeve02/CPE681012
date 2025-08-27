import React, { useState, useEffect } from 'react';
import { ChevronLeft, Download, FileText, RefreshCw, Shuffle, Settings, Star, Tag, Droplets, Sparkles, Calendar, Clock } from 'lucide-react';
import type { TagInterface } from '../../interfaces/Tag';
import type { FoodchoiceDiseaseInterface } from '../../interfaces/FoodchoiceDisease';
import type { FoodChoiceInterface } from '../../interfaces/FoodChoice';
import type { MealMenuInterface } from '../../interfaces/MealMenu';
import type { DiseasesInterface } from '../../interfaces/Disease';
import type { SlotConfigInterface } from '../../interfaces/SlotConfig';
import { useNavigate } from 'react-router-dom';
import { GenerateWeeklyMealPlan, GetMealplansByDisease, GetFoodChoicesByDisease, GetAllDisease, GetAllTag, GetMenusByTagIDs, GetFruits, GetDesserts, GetDiabeticDesserts, } from "../../services/https/index";

// type สำหรับแต่ละมื้อในวัน
interface DailyMeals {
  เช้า: MealMenuInterface[];
  'ว่างเช้า': MealMenuInterface[];
  กลางวัน: MealMenuInterface[];
  'ว่างบ่าย': MealMenuInterface[];
  เย็น: MealMenuInterface[];
}

// type สำหรับทั้งสัปดาห์
export type MealPlan = {
  [day: string]: DailyMeals; // key เป็นชื่อวัน เช่น "วันจันทร์"
};

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

// Define type for base recommendations
interface BaseRecommendation {
  title: string;
  general: string[];
  nutrition: Record<string, string>;
  foods: {
    แนะนำ: string[];
    ควรหลีกเลี่ยง: string[];
  };
}

// Define the base recommendations with proper typing
interface BaseRecommendations {
  [key: number]: BaseRecommendation;
}

const MealPlannerApp = () => {
  const navigate = useNavigate();
  const [selectedDisease, setSelectedDisease] = useState<DiseasesInterface>({ ID: 1, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ 1-3a" });
  const [diseases, setDiseases] = useState<DiseasesInterface[]>([]);
  const [allTags, setAllTags] = useState<TagInterface[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSlotConfig, setShowSlotConfig] = useState(false);
  const [currentMealPlan, setCurrentMealPlan] = useState<MealPlan>({});
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [lastRandomized, setLastRandomized] = useState<Date>(new Date());
  const [foodChoices, setFoodChoices] = useState<FoodChoiceInterface[]>([]);
  const [foodChoiceDiseases, setFoodChoiceDiseases] = useState<FoodchoiceDiseaseInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slotConfigs, setSlotConfigs] = useState<SlotConfigInterface[]>([
    { slotName: "มื้อเช้า", selectedTags: [], mealTypes: ["เช้า"] },
    { slotName: "มื้อกลางวัน", selectedTags: [], mealTypes: ["กลางวัน"] },
    { slotName: "มื้อเย็น", selectedTags: [], mealTypes: ["เย็น"] }
  ]);
  const [fruits, setFruits] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [diabeticDesserts, setDiabeticDesserts] = useState([]);
  const loadAdditionalData = async () => {
    try {
      const [fruitsRes, dessertsRes, diabeticDessertsRes] = await Promise.all([
        GetFruits(),         // FoodItem ที่มี FoodFlagID = 3
        GetDesserts(),       // Menu ที่มี TagID = 15  
        GetDiabeticDesserts() // Menu ที่มี TagID = 16
      ]);

      if (fruitsRes?.data) setFruits(fruitsRes.data);
      if (dessertsRes?.data) setDesserts(dessertsRes.data);
      if (diabeticDessertsRes?.data) setDiabeticDesserts(diabeticDessertsRes.data);
    } catch (error) {
      console.error("Error loading additional data:", error);
    }
  };
  useEffect(() => {
    if (diseases.length > 0 && allTags.length > 0) {
      loadAdditionalData();
    }
  }, [diseases, allTags]);
  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedDisease.ID) {
      loadFoodChoicesByDisease(selectedDisease.ID);
    }
  }, [selectedDisease]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Load diseases
      const diseasesResponse = await GetAllDisease();
      if (diseasesResponse?.data && Array.isArray(diseasesResponse.data)) {
        setDiseases(diseasesResponse.data);
        if (diseasesResponse.data.length > 0) {
          setSelectedDisease(diseasesResponse.data[0]);
        }
      } else {
        // Fallback with mock data if API fails
        console.warn("API failed, using mock diseases data");
        const mockDiseases = [
          { ID: 1, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ 1-3a" },
          { ID: 2, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ 3b-5" },
          { ID: 2, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ HD" },
          { ID: 2, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ CAPD" },
          { ID: 2, Name: "โรคเบาหวาน", Stage: "-" }
        ];
        setDiseases(mockDiseases);
        setSelectedDisease(mockDiseases[0]);
      }

      // Load tags
      const tagsResponse = await GetAllTag();
      if (tagsResponse?.data && Array.isArray(tagsResponse.data)) {
        setAllTags(tagsResponse.data);
      } else {
        // Fallback with mock tags if API fails
        console.warn("API failed, using mock tags data");
        const mockTags = [
          { ID: 1, Name: "มังสวิรัติ" },
          { ID: 2, Name: "ไม่มีแป้ง" },
          { ID: 3, Name: "โซเดียมต่ำ" },
          { ID: 4, Name: "โปรตีนต่ำ" },
          { ID: 5, Name: "โพแทสเซียมต่ำ" }
        ];
        setAllTags(mockTags);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setError("ไม่สามารถโหลดข้อมูลเริ่มต้นได้ กรุณาลองใหม่อีกครั้ง");
      // Set fallback data when API completely fails
      const mockDiseases = [
        { ID: 1, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ 1-3a" },
        { ID: 2, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ 3b-5" },
        { ID: 2, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ HD" },
        { ID: 2, Name: "โรคไตเรื้อรัง", Stage: "ระยะที่ CAPD" },
        { ID: 2, Name: "โรคเบาหวาน", Stage: "-" }
      ];
      const mockTags = [
        { ID: 1, Name: "มังสวิรัติ" },
        { ID: 2, Name: "ไม่มีแป้ง" },
        { ID: 3, Name: "โซเดียมต่ำ" },
        { ID: 4, Name: "โปรตีนต่ำ" },
        { ID: 5, Name: "โพแทสเซียมต่ำ" }
      ];
      setDiseases(mockDiseases);
      setAllTags(mockTags);
      setSelectedDisease(mockDiseases[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFoodChoicesByDisease = async (diseaseId: number) => {
    try {
      const response = await GetFoodChoicesByDisease(diseaseId);
      if (response?.data && Array.isArray(response.data)) {
        setFoodChoiceDiseases(response.data);
      } else {
        console.warn("Food choices API failed or returned invalid data");
        setFoodChoiceDiseases([]);
      }
    } catch (error) {
      console.error("Error loading food choices:", error);
      setFoodChoiceDiseases([]);
    }
  };

  // Enhanced recommendations with real data
  const getRecommendations = (): RecommendationData => {
    const baseRecommendations: BaseRecommendations = {
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
        }
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
        }
      }
    };

    const diseaseId = selectedDisease.ID || 1;
    const recommendation = baseRecommendations[diseaseId] || baseRecommendations[1];

    return {
      ...recommendation,
      foodChoices: foodChoiceDiseases
    };
  };

  // แก้ไข handleRandomizePlan function
  const handleRandomizePlan = async () => {
    setIsRandomizing(true);

    try {
      // Prepare tag IDs from slot configurations  
      const allSelectedTagIds = slotConfigs.reduce((acc, slot) => {
        const tagIds = slot.selectedTags.map(tag => tag.ID).filter((id): id is number => id !== undefined);
        return [...acc, ...tagIds];
      }, [] as number[]);

      // Remove duplicates
      const uniqueTagIds = [...new Set(allSelectedTagIds)];

      // Call backend API
      const result = await GenerateWeeklyMealPlan({
        diseaseID: selectedDisease.ID || 1,
        tagIDs: uniqueTagIds
      });

      if (result?.success && result?.weeklyMealPlan) {
        // Transform backend response ให้ตรงกับ UI format
        const transformedPlan: MealPlan = {};

        result.weeklyMealPlan.forEach((dayPlan: any) => {
          const dayName = dayPlan.day;
          transformedPlan[dayName] = {
            เช้า: dayPlan.เช้า ? [{
              ID: Math.random(),
              PortionText: dayPlan.เช้า.Title || dayPlan.เช้า.Name || dayPlan.เช้า.NameTh,
              MenuID: dayPlan.เช้า.ID,
              isFoodItem: false
            }] : [],

            // สำหรับมื้อว่างเช้า - ผลไม้หรือของหวาน
            'ว่างเช้า': dayPlan['ว่างเช้า'] ? [{
              ID: Math.random(),
              PortionText: dayPlan['ว่างเช้า'].FoodName || // สำหรับ FoodItem (ผลไม้)
                dayPlan['ว่างเช้า'].Title ||
                dayPlan['ว่างเช้า'].Name ||
                dayPlan['ว่างเช้า'].NameTh,
              MenuID: dayPlan['ว่างเช้า'].ID,
              isFoodItem: !!dayPlan['ว่างเช้า'].FoodName, // true ถ้าเป็น FoodItem
              isSpecialDessert: dayPlan['ว่างเช้า'].TagID === 16 // true ถ้าเป็นของหวานสำหรับเบาหวาน
            }] : [],

            กลางวัน: dayPlan.กลางวัน ? [{
              ID: Math.random(),
              PortionText: dayPlan.กลางวัน.Title || dayPlan.กลางวัน.Name || dayPlan.กลางวัน.NameTh,
              MenuID: dayPlan.กลางวัน.ID,
              isFoodItem: false
            }] : [],

            // สำหรับมื้อว่างบ่าย - ผลไม้หรือของหวาน
            'ว่างบ่าย': dayPlan['ว่างบ่าย'] ? [{
              ID: Math.random(),
              PortionText: dayPlan['ว่างบ่าย'].FoodName || // สำหรับ FoodItem (ผลไม้)
                dayPlan['ว่างบ่าย'].Title ||
                dayPlan['ว่างบ่าย'].Name ||
                dayPlan['ว่างบ่าย'].NameTh,
              MenuID: dayPlan['ว่างบ่าย'].ID,
              isFoodItem: !!dayPlan['ว่างบ่าย'].FoodName, // true ถ้าเป็น FoodItem
              isSpecialDessert: dayPlan['ว่างบ่าย'].TagID === 16 // true ถ้าเป็นของหวานสำหรับเบาหวาน
            }] : [],

            เย็น: dayPlan.เย็น ? [{
              ID: Math.random(),
              PortionText: dayPlan.เย็น.Title || dayPlan.เย็น.Name || dayPlan.เย็น.NameTh,
              MenuID: dayPlan.เย็น.ID,
              isFoodItem: false
            }] : []
          };
        });

        setCurrentMealPlan(transformedPlan);
        setLastRandomized(new Date());
      } else {
        console.error("Failed to generate meal plan:", result);
        generateFallbackMealPlan();
      }
    } catch (error) {
      console.error("Error generating meal plan:", error);
      generateFallbackMealPlan();
    }

    setIsRandomizing(false);
  };

  // Fallback meal plan generation (using mock data) - FIXED TYPE ERROR
  const generateFallbackMealPlan = () => {
    const days = ["วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์", "วันอาทิตย์"];
    const mealTypes: (keyof DailyMeals)[] = ["เช้า", "ว่างเช้า", "กลางวัน", "ว่างบ่าย", "เย็น"];

    const mockMenus = ["ข้าวต้มปลา", "ไข่ต้ม", "ข้าวผัดมะเขือเทศ", "ผัดผักกาดขาว"];
    const mockFruits = ["แอปเปิ้ล", "สับปะรด", "มะละกอ", "องุ่น"]; // FoodItems
    const mockDesserts = ["วุ้นมะพร้าว", "ขนมหวานแครอท", "เต้าหู้นุ่มน้ำตาล"]; // Menus
    const mockDiabeticDesserts = ["วุ้นไม่มีน้ำตาล", "ขนมหวานแครอทไม่มีน้ำตาล"]; // Menus สำหรับเบาหวาน

    const newMealPlan: MealPlan = {};
    const isDiabetic = selectedDisease.ID === 5; // โรคเบาหวาน

    days.forEach(day => {
      const dailyMeals: DailyMeals = {
        เช้า: [],
        'ว่างเช้า': [],
        กลางวัน: [],
        'ว่างบ่าย': [],
        เย็น: []
      };

      mealTypes.forEach(mealType => {
        if (mealType === "ว่างเช้า" || mealType === "ว่างบ่าย") {
          // สุ่มระหว่างผลไม้กับของหวาน (70% ผลไม้, 30% ของหวาน)
          const isFreuit = Math.random() < 0.7;

          if (isFreuit) {
            // เลือกผลไม้ (FoodItem)
            const randomFruit = mockFruits[Math.floor(Math.random() * mockFruits.length)];
            dailyMeals[mealType] = [{
              ID: Math.random() * 1000,
              PortionText: randomFruit,
              MenuID: Math.random() * 1000,
              isFoodItem: true,
              isSpecialDessert: false
            }];
          } else {
            // เลือกของหวาน (Menu)
            let selectedDessert;
            let isSpecialDessert = false;

            if (isDiabetic) {
              selectedDessert = mockDiabeticDesserts[Math.floor(Math.random() * mockDiabeticDesserts.length)];
              isSpecialDessert = true;
            } else {
              selectedDessert = mockDesserts[Math.floor(Math.random() * mockDesserts.length)];
            }

            dailyMeals[mealType] = [{
              ID: Math.random() * 1000,
              PortionText: selectedDessert,
              MenuID: Math.random() * 1000,
              isFoodItem: false,
              isSpecialDessert: isSpecialDessert
            }];
          }
        } else {
          // มื้อหลัก (เช้า, กลางวัน, เย็น) ใช้ Menu ปกติ
          const randomMenu = mockMenus[Math.floor(Math.random() * mockMenus.length)];
          dailyMeals[mealType] = [{
            ID: Math.random() * 1000,
            PortionText: randomMenu,
            MenuID: Math.random() * 1000,
            isFoodItem: false,
            isSpecialDessert: false
          }];
        }
      });

      newMealPlan[day] = dailyMeals;
    });

    setCurrentMealPlan(newMealPlan);
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

  const handleGoToFluidCalc = () => {
    navigate('/fluidcalculator');
    console.log('Navigating to Maintenance Fluid page...');
  };

  const dayColors: Record<string, string> = {
    'วันจันทร์': 'bg-gradient-to-br from-yellow-100 to-yellow-200',
    'วันอังคาร': 'bg-gradient-to-br from-pink-100 to-pink-200',
    'วันพุธ': 'bg-gradient-to-br from-green-100 to-green-200',
    'วันพฤหัสบดี': 'bg-gradient-to-br from-orange-100 to-orange-200',
    'วันศุกร์': 'bg-gradient-to-br from-blue-100 to-blue-200',
    'วันเสาร์': 'bg-gradient-to-br from-purple-100 to-purple-200',
    'วันอาทิตย์': 'bg-gradient-to-br from-red-100 to-red-200'
  };

  const handleDownload = () => {
    console.log('Downloading meal plan...');
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate initial meal plan
  useEffect(() => {
    if (diseases.length > 0 && allTags.length > 0) {
      generateFallbackMealPlan();
    }
  }, [diseases, allTags]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Enhanced Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-300">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
            <span className="font-kanit text-xl text-gray-700">กำลังโหลดข้อมูล...</span>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Error Display */}
      {error && (
        <div className="mx-4 mt-4">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="font-kanit font-bold text-red-800">เกิดข้อผิดพลาด</h3>
                <p className="font-kanit text-red-700">{error}</p>
              </div>
              <button
                onClick={() => { setError(null); loadInitialData(); }}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
                         text-white px-4 py-2 rounded-xl font-kanit font-medium shadow-lg 
                         hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-700"></div>
        </div>
        <div className="relative px-6 py-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 mr-3 text-yellow-300 animate-pulse" />
            <h1 className="font-bold text-4xl md:text-5xl font-kanit bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              ระบบวางแผนมื้ออาหารรายสัปดาห์
            </h1>
            <Sparkles className="w-8 h-8 ml-3 text-yellow-300 animate-pulse" />
          </div>
          <p className="text-blue-100 font-kanit text-xl max-w-3xl mx-auto">
            วางแผนอาหารที่เหมาะสมกับระยะโรคและภาวะสุขภาพของคุณ
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Disease Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 min-w-96 border border-gray-100 
                        hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              <label className="block text-lg font-kanit font-semibold text-gray-800">
                เลือกระยะโรค
              </label>
            </div>
            <select
              value={selectedDisease.ID || ''}
              onChange={(e) => {
                const diseaseId = parseInt(e.target.value);
                const disease = diseases.find(d => d.ID === diseaseId);
                if (disease) setSelectedDisease(disease);
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none 
                       focus:ring-4 focus:ring-blue-100 focus:border-blue-500 font-kanit text-lg
                       bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50
                       transition-all duration-300"
            >
              {Array.isArray(diseases) && diseases.map(disease => (
                <option key={disease.ID} value={disease.ID}>
                  {disease.Name} {disease.Stage}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setShowSlotConfig(!showSlotConfig)}
            className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 
                     hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-4 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl 
                     transform hover:scale-105 transition-all duration-300"
          >
            <Settings className="w-5 h-5" />
            ตั้งค่า Slot การสุ่มเมนู
          </button>

          <button
            onClick={handleGoToFluidCalc}
            className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-teal-600 
                     hover:from-cyan-600 hover:to-teal-700 text-white px-8 py-4 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl 
                     transform hover:scale-105 transition-all duration-300"
          >
            <Droplets className="w-5 h-5" />
            คำนวณ Maintenance Fluid
          </button>
        </div>

        {/* Enhanced Slot Configuration Panel */}
        {showSlotConfig && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100 
                        animate-in fade-in slide-in-from-top duration-500">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r 
                            from-indigo-500 to-purple-600 rounded-full mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-kanit font-bold text-gray-800 mb-2">
                ตั้งค่า Slot การสุ่มเมนูอาหาร
              </h3>
              <p className="text-gray-600 font-kanit">
                กำหนดประเภทอาหารที่ต้องการสำหรับแต่ละมื้อ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {slotConfigs.map((slot, slotIndex) => (
                <div key={slotIndex} className="bg-gradient-to-br from-gray-50 to-blue-50 
                                               border-2 border-gray-200 rounded-2xl p-6
                                               hover:shadow-lg hover:border-blue-300 
                                               transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 
                                  rounded-full flex items-center justify-center mr-3">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-kanit font-semibold text-gray-800 text-lg">{slot.slotName}</h4>
                      <span className="font-kanit text-sm text-gray-500">
                        ({slot.mealTypes.join(', ')})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Array.isArray(allTags) && allTags.filter(tag => tag.Name !== "ของหวาน").map(tag => (
                      <label key={tag.ID} className="flex items-center space-x-3 cursor-pointer 
                                                   p-3 rounded-xl hover:bg-white/70 transition-colors">
                        <input
                          type="checkbox"
                          checked={slot.selectedTags.some(t => t.ID === tag.ID)}
                          onChange={() => handleTagToggle(slotIndex, tag)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-blue-500" />
                          <span className="font-kanit text-gray-700">{tag.Name}</span>
                        </div>
                      </label>
                    ))}
                  </div>

                  {slot.selectedTags.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="font-kanit text-sm text-blue-800 font-medium mb-2">เลือกแล้ว:</p>
                      <div className="flex flex-wrap gap-1">
                        {slot.selectedTags.map(t => (
                          <span key={t.ID} className="bg-blue-500 text-white px-2 py-1 
                                                    rounded-full text-xs font-kanit">
                            {t.Name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 
                          border border-yellow-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <div>
                  <p className="font-kanit text-yellow-800 font-medium mb-1">หมายเหตุ:</p>
                  <p className="font-kanit text-yellow-700 text-sm leading-relaxed">
                    การเลือก tag จะช่วยให้ระบบสุ่มเมนูที่ตรงกับความต้องการของคุณมากขึ้น
                    หากไม่เลือก tag ระบบจะสุ่มจากเมนูทั้งหมดที่เหมาะสมกับโรค
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Randomize Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleRandomizePlan}
            disabled={isRandomizing}
            className="group relative bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 
                     hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 
                     text-white px-12 py-4 rounded-2xl font-kanit text-xl font-bold 
                     shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 
                     disabled:cursor-not-allowed transform hover:scale-105 
                     transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full 
                          group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative flex items-center gap-3">
              {isRandomizing ? (
                <>
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  กำลังสุ่มแผนใหม่...
                </>
              ) : (
                <>
                  <Shuffle className="w-6 h-6" />
                  สุ่มแผนอาหารใหม่
                </>
              )}
            </div>
          </button>
        </div>

        {/* Enhanced Last Updated Info */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Clock className="w-5 h-5 text-gray-500" />
          <span className="font-kanit text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border">
            สุ่มล่าสุด: {lastRandomized.toLocaleDateString('th-TH')} {lastRandomized.toLocaleTimeString('th-TH')}
          </span>
        </div>

        {/* Enhanced Meal Plan Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Enhanced Disease Info Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white py-6 px-8">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-kanit font-bold text-2xl mb-1">
                  {selectedDisease.Name} {selectedDisease.Stage}
                </h3>
                <p className="font-kanit text-blue-100">
                  แผนการรับประทานอาหารรายสัปดาห์
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Meal Plan Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <th className="border border-gray-200 px-6 py-4 font-kanit font-bold text-gray-800">
                    วัน/มื้อ
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-purple-100 to-purple-200 
                               font-kanit font-bold text-purple-800">
                    🌅 เช้า
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-orange-100 to-orange-200 
                               font-kanit font-bold text-orange-800">
                    ☕ ว่างเช้า
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-teal-100 to-teal-200 
                               font-kanit font-bold text-teal-800">
                    🌞 กลางวัน
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-orange-100 to-orange-200 
                               font-kanit font-bold text-orange-800">
                    🍎 ว่างบ่าย
                  </th>
                  <th className="border border-gray-200 px-6 py-4 bg-gradient-to-br from-purple-100 to-purple-200 
                               font-kanit font-bold text-purple-800">
                    🌙 เย็น
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentMealPlan).map(([day, meals]) => (
                  <tr key={day} className="hover:bg-blue-50/50 transition-colors duration-200">
                    <td className={`border border-gray-200 px-6 py-6 font-kanit font-bold text-gray-800 
                                  ${dayColors[day]} text-center`}>
                      {day}
                    </td>
                    <td className="border border-gray-200 px-6 py-6">
                      <ul className="space-y-2">
                        {meals?.เช้า?.map((mealMenu) => (
                          <li key={mealMenu.ID} className="flex items-start group">
                            <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 
                    rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 
                    transition-transform duration-200"></div>
                            <button
                              onClick={() => navigate(`/menu/${mealMenu.MenuID}`)}
                              className="font-kanit text-gray-700 group-hover:text-purple-700 
                 transition-colors duration-200 text-left hover:underline
                 cursor-pointer focus:outline-none focus:ring-2 
                 focus:ring-purple-500 focus:ring-opacity-50 rounded px-1"
                            >
                              {mealMenu.PortionText}
                            </button>
                          </li>
                        ))}
                        {(!meals?.เช้า || meals?.เช้า?.length === 0) && (
                          <span className="font-kanit text-gray-400 italic">ไม่มีเมนู</span>
                        )}
                      </ul>
                    </td>
                    <td className="border border-gray-200 px-6 py-6 bg-gradient-to-br from-orange-50/50 to-yellow-50/50">
                      {meals?.['ว่างเช้า'] && meals['ว่างเช้า'].length > 0 ? (
                        <ul className="space-y-2">
                          {meals['ว่างเช้า'].map((mealMenu) => (
                            <li key={mealMenu.ID} className="flex items-start group">
                              <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 
                        rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 
                        transition-transform duration-200"></div>
                              {mealMenu.isFoodItem ? (
                                // ถ้าเป็น FoodItem (ผลไม้) ให้คลิกไปหน้ารายละเอียด FoodItem
                                <button
                                  onClick={() => navigate(`/fooditem/${mealMenu.MenuID}`)}
                                  className="font-kanit text-gray-700 group-hover:text-green-700 
                       transition-colors duration-200 text-left hover:underline
                       cursor-pointer focus:outline-none focus:ring-2 
                       focus:ring-green-500 focus:ring-opacity-50 rounded px-1"
                                >
                                  {mealMenu.PortionText}
                                  <span className="text-xs text-green-600 ml-1">(ผลไม้)</span>
                                </button>
                              ) : (
                                // ถ้าเป็น Menu (ของหวาน) ให้คลิกไปหน้ารายละเอียด Menu
                                <button
                                  onClick={() => navigate(`/menu/${mealMenu.MenuID}`)}
                                  className="font-kanit text-gray-700 group-hover:text-purple-700 
                       transition-colors duration-200 text-left hover:underline
                       cursor-pointer focus:outline-none focus:ring-2 
                       focus:ring-purple-500 focus:ring-opacity-50 rounded px-1"
                                >
                                  {mealMenu.PortionText}
                                  {mealMenu.isSpecialDessert ? (
                                    <span className="text-xs text-blue-600 ml-1">(ของหวานเบาหวาน)</span>
                                  ) : (
                                    <span className="text-xs text-purple-600 ml-1">(ของหวาน)</span>
                                  )}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="font-kanit text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="border border-gray-200 px-6 py-6">
                      <ul className="space-y-2">
                        {meals?.กลางวัน?.map((mealMenu) => (
                          <li key={mealMenu.ID} className="flex items-start group">
                            <div className="w-3 h-3 bg-gradient-to-br from-teal-400 to-teal-600 
                    rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 
                    transition-transform duration-200"></div>
                            <button
                              onClick={() => navigate(`/menu/${mealMenu.MenuID}`)}
                              className="font-kanit text-gray-700 group-hover:text-teal-700 
                 transition-colors duration-200 text-left hover:underline
                 cursor-pointer focus:outline-none focus:ring-2 
                 focus:ring-teal-500 focus:ring-opacity-50 rounded px-1"
                            >
                              {mealMenu.PortionText}
                            </button>
                          </li>
                        ))}
                        {(!meals?.กลางวัน || meals?.กลางวัน?.length === 0) && (
                          <span className="font-kanit text-gray-400 italic">ไม่มีเมนู</span>
                        )}
                      </ul>
                    </td>
                    <td className="border border-gray-200 px-6 py-6 bg-gradient-to-br from-orange-50/50 to-yellow-50/50">
                      {meals?.['ว่างเช้า'] && meals['ว่างเช้า'].length > 0 ? (
                        <ul className="space-y-2">
                          {meals['ว่างเช้า'].map((mealMenu) => (
                            <li key={mealMenu.ID} className="flex items-start group">
                              <div className="w-3 h-3 bg-gradient-to-br from-orange-400 to-orange-600 
                        rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 
                        transition-transform duration-200"></div>
                              {mealMenu.isFoodItem ? (
                                // ถ้าเป็น FoodItem (ผลไม้) ให้คลิกไปหน้ารายละเอียด FoodItem
                                <button
                                  onClick={() => navigate(`/fooditem/${mealMenu.MenuID}`)}
                                  className="font-kanit text-gray-700 group-hover:text-green-700 
                       transition-colors duration-200 text-left hover:underline
                       cursor-pointer focus:outline-none focus:ring-2 
                       focus:ring-green-500 focus:ring-opacity-50 rounded px-1"
                                >
                                  {mealMenu.PortionText}
                                  <span className="text-xs text-green-600 ml-1">(ผลไม้)</span>
                                </button>
                              ) : (
                                // ถ้าเป็น Menu (ของหวาน) ให้คลิกไปหน้ารายละเอียด Menu
                                <button
                                  onClick={() => navigate(`/menu/${mealMenu.MenuID}`)}
                                  className="font-kanit text-gray-700 group-hover:text-purple-700 
                       transition-colors duration-200 text-left hover:underline
                       cursor-pointer focus:outline-none focus:ring-2 
                       focus:ring-purple-500 focus:ring-opacity-50 rounded px-1"
                                >
                                  {mealMenu.PortionText}
                                  {mealMenu.isSpecialDessert ? (
                                    <span className="text-xs text-blue-600 ml-1">(ของหวานเบาหวาน)</span>
                                  ) : (
                                    <span className="text-xs text-purple-600 ml-1">(ของหวาน)</span>
                                  )}
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="font-kanit text-gray-400 italic">-</span>
                      )}
                    </td>
                    <td className="border border-gray-200 px-6 py-6">
                      <ul className="space-y-2">
                        {meals?.เย็น?.map((mealMenu) => (
                          <li key={mealMenu.ID} className="flex items-start group">
                            <div className="w-3 h-3 bg-gradient-to-br from-purple-400 to-purple-600 
                    rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-110 
                    transition-transform duration-200"></div>
                            <button
                              onClick={() => navigate(`/menu/${mealMenu.MenuID}`)}
                              className="font-kanit text-gray-700 group-hover:text-purple-700 
                 transition-colors duration-200 text-left hover:underline
                 cursor-pointer focus:outline-none focus:ring-2 
                 focus:ring-purple-500 focus:ring-opacity-50 rounded px-1"
                            >
                              {mealMenu.PortionText}
                            </button>
                          </li>
                        ))}
                        {(!meals?.เย็น || meals?.เย็น?.length === 0) && (
                          <span className="font-kanit text-gray-400 italic">ไม่มีเมนู</span>
                        )}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <button
            onClick={handlePrint}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 
                     hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl 
                     transform hover:scale-105 transition-all duration-300"
          >
            <FileText className="w-5 h-5" />
            พิมพ์แผนอาหาร
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 
                     hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl 
                     transform hover:scale-105 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
            ดาวน์โหลด PDF
          </button>
          <button
            onClick={() => setShowRecommendations(!showRecommendations)}
            className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 
                     hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 
                     rounded-2xl font-kanit text-lg font-medium shadow-lg hover:shadow-xl 
                     transform hover:scale-105 transition-all duration-300"
          >
            <FileText className="w-5 h-5" />
            {showRecommendations ? 'ซ่อนคำแนะนำ' : 'ดูคำแนะนำโภชนาการ'}
          </button>
        </div>

        {/* Enhanced Recommendations Section */}
        {showRecommendations && (
          <div className="mt-12 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden 
                        animate-in fade-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white py-8 px-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 
                              rounded-full mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="font-kanit font-bold text-2xl mb-2">
                  {getRecommendations()?.title}
                </h3>
                <p className="font-kanit text-orange-100">
                  คำแนะนำโภชนาการและการดูแลสุขภาพ
                </p>
              </div>
            </div>

            <div className="p-8">
              {/* General Recommendations */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full 
                                flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                  <h4 className="font-kanit text-xl font-bold text-gray-800">
                    คำแนะนำทั่วไป
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getRecommendations()?.general.map((item, index) => (
                    <div key={index} className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 
                                              rounded-2xl border border-blue-100 hover:shadow-md transition-all duration-300">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full 
                                    flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="font-kanit text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutritional Guidelines */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full 
                                flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <h4 className="font-kanit text-xl font-bold text-gray-800">
                    แนวทางโภชนาการ
                  </h4>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(getRecommendations()?.nutrition || {}).map(([nutrient, amount]) => (
                      <div key={nutrient} className="flex justify-between items-center p-4 bg-white 
                                                   rounded-xl border border-green-200 shadow-sm
                                                   hover:shadow-md transition-all duration-300">
                        <span className="font-kanit font-semibold text-gray-700">{nutrient}:</span>
                        <span className="font-kanit text-green-600 font-bold bg-green-100 px-3 py-1 
                                       rounded-full">{amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Food Choice Recommendations */}
              {Array.isArray(getRecommendations()?.foodChoices) && getRecommendations()?.foodChoices.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full 
                                  flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">F</span>
                    </div>
                    <h4 className="font-kanit text-xl font-bold text-gray-800">
                      คำแนะนำการเลือกอาหาร
                    </h4>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                    <div className="grid grid-cols-1 gap-4">
                      {getRecommendations()?.foodChoices.map((fc, index) => (
                        <div key={index} className="flex items-start p-4 bg-white rounded-xl 
                                                  border border-purple-200 shadow-sm hover:shadow-md 
                                                  transition-all duration-300">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 
                                        rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-white text-xs font-bold">{fc.FoodChoiceID}</span>
                          </div>
                          <div>
                            <span className="font-kanit font-semibold text-purple-700">
                              อาหารหมายเลข {fc.FoodChoiceID}:
                            </span>
                            <span className="font-kanit text-gray-700 ml-2">
                              {fc.Description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Food Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full 
                                  flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">✓</span>
                    </div>
                    <h4 className="font-kanit text-xl font-bold text-green-600">
                      อาหารที่แนะนำ
                    </h4>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 
                                border border-green-200">
                    <ul className="space-y-3">
                      {getRecommendations()?.foods.แนะนำ.map((food, index) => (
                        <li key={index} className="flex items-start p-3 bg-white rounded-xl 
                                                 border border-green-200 hover:shadow-sm transition-all duration-300">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 
                                        rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className="font-kanit text-gray-700">{food}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full 
                                  flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">✕</span>
                    </div>
                    <h4 className="font-kanit text-xl font-bold text-red-600">
                      อาหารที่ควรหลีกเลี่ยง
                    </h4>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 
                                border border-red-200">
                    <ul className="space-y-3">
                      {getRecommendations()?.foods.ควรหลีกเลี่ยง.map((food, index) => (
                        <li key={index} className="flex items-start p-3 bg-white rounded-xl 
                                                 border border-red-200 hover:shadow-sm transition-all duration-300">
                          <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 
                                        rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                            <span className="text-white text-xs font-bold">✕</span>
                          </div>
                          <span className="font-kanit text-gray-700">{food}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 
                            border-yellow-400 rounded-2xl p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full 
                                flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold text-sm">!</span>
                  </div>
                  <div>
                    <p className="font-kanit font-semibold text-yellow-800 mb-2">
                      ข้อควรระวัง
                    </p>
                    <p className="font-kanit text-yellow-700 leading-relaxed">
                      คำแนะนำเหล่านี้เป็นแนวทางทั่วไป ควรปรึกษาแพทย์หรือนักโภชนาการ
                      เพื่อการวางแผนอาหารที่เหมาะสมกับสภาวะสุขภาพของท่านโดยเฉพาะ
                    </p>
                  </div>
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