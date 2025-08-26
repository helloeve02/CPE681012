import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import NutritionPDF from "./NutritionPDF";
import {
  GetAllChooseAvoid,
  GetCaloriesByRule,
  GetNutritionDataByRule,
  GetPortionDataByRule,
  GetRuleDetailByRule,
} from "../../services/https";
import { getValidRule } from "../../services/https/ruleUtils";
import type {
  NutritionData,
  PortionData,
  RuleData,
} from "../../interfaces/Nutrition";
import { Spin } from "antd";
import type { FoodItem } from "../../interfaces/FoodItem";
export type FoodGroupData = {
  topic: string; // FoodGroup.Name
  recommended: FoodItem[];
  avoided: FoodItem[];
};

// At the top of the file, below your imports

export async function fetchNutritionPdfData() {
  const ruleNum = getValidRule();
  if (!ruleNum) {
    throw new Error("No valid rule found");
  }

  // Helper: transform food items (copied from your function)
  function transformFoodItems(foodItems: FoodItem[]): FoodGroupData[] {
    const groupMap: Record<string, { recommended: FoodItem[]; avoided: FoodItem[] }> = {};

    foodItems.forEach((item) => {
      const groupName = item.FoodFlag.FoodGroup.Name ?? "Unknown Group";
      const flag = item.FoodFlag.Flag;

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

  // Fetch all in parallel
  const [
    nutritionRes,
    portionRes,
    caloryRes,
    ruleRes,
    chooseAvoidRes,
  ] = await Promise.all([
    GetNutritionDataByRule(ruleNum),
    GetPortionDataByRule(ruleNum),
    GetCaloriesByRule(ruleNum),
    GetRuleDetailByRule(ruleNum),
    GetAllChooseAvoid(),
  ]);

  // Map responses to your data format
  const nutritionDatas =
    Array.isArray(nutritionRes?.data?.nutritionRecommendations) ?
      nutritionRes.data.nutritionRecommendations.map((item: any) => ({
        nutrition_group_name: item.NutritionGroupName,
        amount_in_grams: item.AmountInGrams,
        amount_in_percentage: item.AmountInPercentage,
      })) : [];

  const portionDatas =
    Array.isArray(portionRes?.data?.portionRecommendations) ?
      portionRes.data.portionRecommendations.map((item: any) => ({
        food_group_name: item.FoodGroupName,
        unit: item.Unit,
        meal_time_name: item.MealTimeName,
        amount: item.Amount,
      })) : [];

  const caloryDatas = caloryRes?.data?.calories ?? 0;
  const ruleDatas = ruleRes?.data?.RuleDetail ?? null;

  if (!ruleDatas) {
    throw new Error("Failed to fetch rule details");
  }

  const foodGroups = chooseAvoidRes?.data?.fooditems
    ? transformFoodItems(chooseAvoidRes.data.fooditems)
    : [];

  return {
    nutritionDatas,
    portionDatas,
    caloryDatas,
    ruleDatas,
    foodGroups,
  };
}


const PDFViewerPage = () => {
  const navigate = useNavigate();

  const [nutritionDatas, setNutritionDatas] = useState<NutritionData[]>([]);
  const [portionDatas, setPortionDatas] = useState<PortionData[]>([]);
  const [caloryDatas, setCaloryDatas] = useState<number>(0);
  const [ruleDatas, setRuleDatas] = useState<RuleData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [foodGroups, setFoodGroups] = useState<FoodGroupData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNutritionPdfData();
        setNutritionDatas(data.nutritionDatas);
        setPortionDatas(data.portionDatas);
        setCaloryDatas(data.caloryDatas);
        setRuleDatas(data.ruleDatas);
        setFoodGroups(data.foodGroups);
      } catch (err) {
        console.error(err);
        navigate("/nutrition"); // fallback on error or missing ruleNum
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading || !ruleDatas) {
    return (
      <div className="fixed top-1/5 left-1/2">
        <Spin />
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
          foodGroups={foodGroups}
        />
      </PDFViewer>
    </div>
  );
};

export default PDFViewerPage;
