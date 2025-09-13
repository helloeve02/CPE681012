import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import NutritionPDF from "./NutritionPDF";
import {
  GetAllChooseAvoid,
  GetAllFoodExchanges,
  GetCaloriesByRule,
  GetNutritionDataByRule,
  GetPortionDataByRule,
  GetRuleDetailByRule,
} from "../../services/https";
import { getValidRule } from "../../services/https/ruleUtils";
import type {
  ConditionalCardItem,
  NutritionData,
  PortionData,
  RuleData,
} from "../../interfaces/Nutrition";
import type { FoodItem } from "../../interfaces/FoodItem";
import type { FoodExchangeInterface } from "../../interfaces/FoodExchange";

export type FoodGroupData = {
  topic: string; // FoodGroup.Name
  recommended: FoodItem[];
  avoided: FoodItem[];
};

// -------------------- FETCH DATA FUNCTION --------------------

export async function fetchNutritionPdfData() {
  const ruleNum = getValidRule() ?? 0;
  if (!ruleNum) {
    throw new Error("No valid rule found");
  }

  const conditionalCardData: ConditionalCardItem[] =
    ruleNum >= 17 && ruleNum <= 22
      ? [
          {
            name: "ขนมหวาน",
            description:
              "เช่น เบเกอรี่ เค้ก พาย คุกกี้ น้ำอัดลม",
          },
          {
            name: "ผลไม้หวานจัด",
            description:
              "เช่น ทุเรียน ขนุน ละมุด ลิ้นจี่ ลำไย ผลไม้ดอง ผลไม้เชื่อม ผลไม้แช่อิ่ม เป็นต้น",
          },
          {
            name: "อาหารที่มีรสเค็มจัด",
            description: "เช่น ปลาเค็ม ไข่เค็ม ของหมักดองทุกชนิด",
          },
        ]
      : [];

  // -------------------- HELPER: Transform choose/avoid food --------------------
  function transformFoodItems(foodItems: FoodItem[]): FoodGroupData[] {
    const groupMap: Record<string, { recommended: FoodItem[]; avoided: FoodItem[] }> = {};

    foodItems.forEach((item) => {
      const groupName = item.FoodFlag.FoodGroup.Name ?? "Unknown Group";
      const flag = item.FoodFlag.Flag;

      if (
        ruleNum >= 17 &&
        ruleNum <= 22 &&
        groupName !== "เนื้อสัตว์" &&
        groupName !== "ไขมัน"
      ) {
        return;
      }

      if (!groupMap[groupName]) {
        groupMap[groupName] = { recommended: [], avoided: [] };
      }

      if (flag === "ควรรับประทาน") {
        groupMap[groupName].recommended.push(item);
      } else if (flag === "ควรหลีกเลี่ยง") {
        groupMap[groupName].avoided.push(item);
      }
    });

    return Object.entries(groupMap).map(([topic, data]) => ({
      topic,
      recommended: data.recommended,
      avoided: data.avoided,
    }));
  }

  // -------------------- FETCH ALL --------------------
  const [
    nutritionRes,
    portionRes,
    caloryRes,
    ruleRes,
    chooseAvoidRes,
    foodExchangesRes,
  ] = await Promise.all([
    GetNutritionDataByRule(ruleNum),
    GetPortionDataByRule(ruleNum),
    GetCaloriesByRule(ruleNum),
    GetRuleDetailByRule(ruleNum),
    GetAllChooseAvoid(),
    GetAllFoodExchanges(),
  ]);

  // -------------------- TRANSFORM DATA --------------------
  const nutritionDatas: NutritionData[] =
    Array.isArray(nutritionRes?.data?.nutritionRecommendations)
      ? nutritionRes.data.nutritionRecommendations.map((item: any) => ({
          nutrition_group_name: item.NutritionGroupName,
          amount_in_grams: item.AmountInGrams,
          amount_in_percentage: item.AmountInPercentage,
        }))
      : [];

  const portionDatas: PortionData[] =
    Array.isArray(portionRes?.data?.portionRecommendations)
      ? portionRes.data.portionRecommendations.map((item: any) => ({
          food_group_name: item.FoodGroupName,
          unit: item.Unit,
          meal_time_name: item.MealTimeName,
          amount: item.Amount,
        }))
      : [];

  const caloryDatas: number = caloryRes?.data?.calories ?? 0;
  const ruleDatas: RuleData | null = ruleRes?.data?.RuleDetail ?? null;

  if (!ruleDatas) {
    throw new Error("Failed to fetch rule details");
  }

  const foodGroups: FoodGroupData[] = chooseAvoidRes?.data?.fooditems
    ? transformFoodItems(chooseAvoidRes.data.fooditems)
    : [];

  // -------------------- FOOD EXCHANGES --------------------
  const apiFoodExchanges: FoodExchangeInterface[] =
  Array.isArray(foodExchangesRes?.data?.foodexchanges)
    ? foodExchangesRes.data.foodexchanges
    : [];

// Hardcoded food exchanges
const hardcodedFoodExchanges: FoodExchangeInterface[] = [
  {
    ID: 999990,
    Amount: "1/2-1/3",
    Unit: "ถ้วยตวง",
    FoodItem: {
      Name: "ผักสุก",
      Image:
        "https://www.sgethai.com/wp-content/uploads/2022/02/%E0%B8%9C%E0%B8%B1%E0%B8%81%E0%B8%95%E0%B9%89%E0%B8%A13.jpg",
      Credit:
        "https://www.sgethai.com/article/%E0%B8%9C%E0%B8%B1%E0%B8%81%E0%B8%95%E0%B9%89%E0%B8%A1-%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%A3%E0%B9%84%E0%B8%A1%E0%B9%88/?srsltid=AfmBOop5vfQQUi84RikxtIN899oG_xSGVp7CjPEuGQbB40p28BjQiyTO",
      FoodFlag: { FoodGroup: { Name: "ผัก", Unit: "ส่วน" } },
    },
  },
  {
    ID: 999991,
    Amount: "3/4 - 1",
    Unit: "ถ้วยตวง",
    FoodItem: {
      Name: "ผักดิบ",
      Image:
        "https://s.isanook.com/wo/0/ud/14/73853/73853-thumbnail.jpg?ip/crop/w1200h700/q80/webp",
      Credit: "https://www.sanook.com/women/73853/",
      FoodFlag: { FoodGroup: { Name: "ผัก", Unit: "ส่วน" } },
    },
  },
  {
    ID: 999992,
    Amount: "2",
    Unit: "ช้อนโต๊ะ",
    FoodItem: {
      Name: "เนื้อสัตว์",
      Image:
        "https://www.foodnetworksolution.com/uploads/process/7d5db8ee90181960985e37bd89ad1a57.jpg",
      Credit:
        "https://www.foodnetworksolution.com/wiki/word/1141/meat-%E0%B9%80%E0%B8%99%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%AA%E0%B8%B1%E0%B8%95%E0%B8%A7%E0%B9%8C",
      FoodFlag: { FoodGroup: { Name: "เนื้อสัตว์", Unit: "ส่วน" } },
    },
  },
];

// Merge API and hardcoded
const foodExchangeGroups: FoodExchangeInterface[] = [
  ...apiFoodExchanges,
  ...hardcodedFoodExchanges,
];

  // -------------------- RETURN --------------------
  return {
    nutritionDatas,
    portionDatas,
    caloryDatas,
    ruleDatas,
    foodGroups,
    foodExchangeGroups,
    conditionalCardData,
  };
}

// -------------------- PDF VIEWER COMPONENT --------------------

const PDFViewerPage = () => {
  const navigate = useNavigate();

  const [nutritionDatas, setNutritionDatas] = useState<NutritionData[]>([]);
  const [portionDatas, setPortionDatas] = useState<PortionData[]>([]);
  const [caloryDatas, setCaloryDatas] = useState<number>(0);
  const [ruleDatas, setRuleDatas] = useState<RuleData | null>(null);
  const [foodGroups, setFoodGroups] = useState<FoodGroupData[]>([]);
  const [foodExchangeGroups, setFoodExchangeGroups] = useState<FoodExchangeInterface[]>([]);
  const [conditionalCardData, setConditionalCardData] = useState<ConditionalCardItem[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNutritionPdfData();
        setNutritionDatas(data.nutritionDatas);
        setPortionDatas(data.portionDatas);
        setCaloryDatas(data.caloryDatas);
        setRuleDatas(data.ruleDatas);
        setFoodGroups(data.foodGroups);
        setFoodExchangeGroups(data.foodExchangeGroups);
        setConditionalCardData(data.conditionalCardData);
      } catch (err) {
        console.error(err);
        navigate("/nutrition");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading || !ruleDatas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden font-kanit">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-80 h-80 bg-gradient-to-r from-cyan-300/30 to-teal-300/30 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl px-12 py-8 border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xl font-semibold text-gray-800">กำลังโหลดข้อมูล...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-0 w-screen h-screen z-[9999] bg-white">
      <PDFViewer width="100%" height="100%">
        <NutritionPDF
          nutritionDatas={nutritionDatas}
          portionDatas={portionDatas}
          caloryDatas={caloryDatas}
          ruleDatas={ruleDatas}
          foodGroups={foodGroups} // choose/avoid
          foodExchangeGroups={foodExchangeGroups} // food exchanges (raw API)
          conditionalCardData={conditionalCardData}
        />
      </PDFViewer>
    </div>
  );
};

export default PDFViewerPage;
