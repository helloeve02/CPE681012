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

const PDFViewerPage = () => {
  const navigate = useNavigate();

  const [nutritionDatas, setNutritionDatas] = useState<NutritionData[]>([]);
  const [portionDatas, setPortionDatas] = useState<PortionData[]>([]);
  const [caloryDatas, setCaloryDatas] = useState<number>(0);
  const [ruleDatas, setRuleDatas] = useState<RuleData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [foodGroups, setFoodGroups] = useState<FoodGroupData[]>([]);

  const getNutritionDatas = async (ruleNum: number) => {
    try {
      const res = await GetNutritionDataByRule(ruleNum);
      if (Array.isArray(res?.data?.nutritionRecommendations)) {
        const mapped = res.data.nutritionRecommendations.map((item: any) => ({
          nutrition_group_name: item.NutritionGroupName,
          amount_in_grams: item.AmountInGrams,
          amount_in_percentage: item.AmountInPercentage,
        }));
        setNutritionDatas(mapped);
      } else {
        console.warn("Failed to load nutrition recommendation.");
      }
    } catch (err) {
      console.error("Error fetching nutrition data", err);
    }
  };

  const getPortionDatas = async (ruleNum: number) => {
    try {
      const res = await GetPortionDataByRule(ruleNum);
      if (Array.isArray(res?.data?.portionRecommendations)) {
        const mapped = res.data.portionRecommendations.map((item: any) => ({
          food_group_name: item.FoodGroupName,
          unit: item.Unit,
          meal_time_name: item.MealTimeName,
          amount: item.Amount,
        }));
        setPortionDatas(mapped);
      } else {
        console.warn("Failed to load portion recommendation.");
      }
    } catch (err) {
      console.error("Error fetching portion data", err);
    }
  };

  const getCaloryDatas = async (ruleNum: number) => {
    try {
      const res = await GetCaloriesByRule(ruleNum);
      if (res?.data?.calories) {
        setCaloryDatas(res.data.calories);
      } else {
        console.warn("Failed to load calory data.");
      }
    } catch (err) {
      console.error("Error fetching calory data", err);
    }
  };

  const getRuleDatas = async (ruleNum: number) => {
    try {
      const res = await GetRuleDetailByRule(ruleNum);
      if (res?.data?.RuleDetail) {
        setRuleDatas(res.data.RuleDetail);
      } else {
        console.warn("Failed to load rule details.");
      }
    } catch (err) {
      console.error("Error fetching rule data", err);
    }
  };

  function transformFoodItems(foodItems: FoodItem[]): FoodGroupData[] {
    // Map of group name to recommended/avoided foods
    const groupMap: Record<
      string,
      { recommended: FoodItem[]; avoided: FoodItem[] }
    > = {};

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

    // Convert map to array for rendering
    return Object.entries(groupMap).map(([topic, data]) => ({
      topic,
      recommended: data.recommended,
      avoided: data.avoided,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      const ruleNum = getValidRule();
      if (!ruleNum) {
        navigate("/nutrition");
        return;
      }

      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      try {
        // First: Run the "void" API calls in parallel
        await Promise.all([
          getNutritionDatas(ruleNum),
          getPortionDatas(ruleNum),
          getCaloryDatas(ruleNum),
          getRuleDatas(ruleNum),
        ]);

        // Then get data from GetAllChooseAvoid separately
        const res = await GetAllChooseAvoid();

        if (res && res.data?.fooditems) {
          setFoodGroups(transformFoodItems(res.data.fooditems));
        }

        // Run delay separately or combine with others if needed
        await delay(300);
      } catch (err) {
        console.error("Failed to fetch one or more data sets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
