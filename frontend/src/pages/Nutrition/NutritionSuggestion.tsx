// import React from "react";

import { Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NutritionData, PortionData } from "../../interfaces/Nutrition";
import {
  GetCaloriesByRule,
  GetNutritionDataByRule,
  GetPortionDataByRule,
} from "../../services/https";
import { getValidRule } from "../../services/https/ruleUtils";
import { FilePdfOutlined } from "@ant-design/icons";

const NutritionSuggestion = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const handleNext = () => {
    navigate("/choose-avoid");
  };
  const handleOpenPDF = () => {
    const dataToSend = {
      nutritionDatas,
      portionDatas,
      caloryDatas,
    };
    const encoded = encodeURIComponent(JSON.stringify(dataToSend));
    window.open(`/pdf-viewer?data=${encoded}`, "_blank");
  };

  const [nutritionDatas, setNutritionDatas] = useState<NutritionData[]>([]);
  const [portionDatas, setPortionDatas] = useState<PortionData[]>([]);
  const [caloryDatas, setCaloryDatas] = useState<number>();

  const getNutritionDatas = async (ruleNum: number) => {
    try {
      const res = await GetNutritionDataByRule(ruleNum);
      if (Array.isArray(res?.data?.nutritionRecommendations)) {
        const mappedData = res.data.nutritionRecommendations.map(
          (item: any): NutritionData => ({
            nutrition_group_name: item.NutritionGroupName,
            amount_in_grams: item.AmountInGrams,
            amount_in_percentage: item.AmountInPercentage,
          })
        );

        setNutritionDatas(mappedData);
      } else {
        console.log("Failed to load nutrition recommendation.");
      }
    } catch (error) {
      console.log(
        "Error fetching nutrition recommendation. Please try again later."
      );
    }
  };

  const getPortionDatas = async (ruleNum: number) => {
    try {
      const res = await GetPortionDataByRule(ruleNum);
      if (Array.isArray(res?.data?.portionRecommendations)) {
        const mappedData = res.data.portionRecommendations.map(
          (item: any): PortionData => ({
            food_group_name: item.FoodGroupName,
            unit: item.Unit,
            meal_time_name: item.MealTimeName,
            amount: item.Amount,
          })
        );

        setPortionDatas(mappedData);
      } else {
        console.log("Failed to load portion recommendation.");
      }
    } catch (error) {
      console.log(
        "Error fetching portion recommendation. Please try again later."
      );
    }
  };

  const getCaloryDatas = async (ruleNum: number) => {
    try {
      const res = await GetCaloriesByRule(ruleNum);
      if (res?.data?.calories) {
        setCaloryDatas(res?.data?.calories);
      } else {
        console.log("Failed to load calory recommendation.");
      }
    } catch (error) {
      console.log(
        "Error fetching calory recommendation. Please try again later."
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const ruleNum = getValidRule();
      if (!ruleNum) {
        navigate("/nutrition");
        return;
      }
      getNutritionDatas(ruleNum);
      getPortionDatas(ruleNum);
      getCaloryDatas(ruleNum);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated portionDatas:", portionDatas);
  }, [portionDatas]);
  const groupedByFoodGroup = portionDatas.reduce((acc, item) => {
    if (!acc[item.food_group_name]) {
      acc[item.food_group_name] = [];
    }
    acc[item.food_group_name].push(item);
    console.log(acc);
    return acc;
  }, {} as Record<string, typeof portionDatas>);

  const mealTimes = ["เช้า", "กลางวัน", "เย็น"];

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/5 left-1/2 ">
          <Spin />
        </div>
      ) : (
        <div className="h-screen font-kanit">
          <div className="bg-[#2E77F8] p-5 md:p-8 flex items-center justify-center text-white">
            <div className="font-semibold text-2xl md:text-4xl">
              ปริมาณที่ควรทานต่อวัน
            </div>
          </div>
          {/* For small screen */}
          <div className="p-4 space-y-4 lg:hidden">
            <table className="min-w-full border-collapse border border-gray-500">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2 w-35"></th>{" "}
                  {mealTimes.map((mealTime) => (
                    <th
                      key={mealTime}
                      className="border border-gray-400 p-2 text-center whitespace-nowrap"
                    >
                      {mealTime}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedByFoodGroup).map(
                  ([foodGroupName, items]) => (
                    <tr key={foodGroupName}>
                      <td className="border border-gray-400 p-2 font-semibold">
                        {foodGroupName}
                      </td>
                      {mealTimes.map((mealTime) => {
                        const item = items.find(
                          (i) => i.meal_time_name === mealTime
                        );
                        return (
                          <td
                            key={`${foodGroupName}-${mealTime}`}
                            className="border border-gray-400 p-2 text-center whitespace-nowrap"
                          >
                            {item && item.amount > 0 ? `${item.amount} ${item.unit}` : "-"}
                          </td>
                        );
                      })}
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="border border-gray-500 p-3 rounded shadow-sm">
              <div className="font-semibold mb-2">
                พลังงาน {caloryDatas} กิโลแคลอรี่
              </div>
              <hr className="border-t border-gray-400" />
              <ul className="m-1 list-disc list-inside space-y-1">
                {nutritionDatas.map((item) => (
                  <li key={item.nutrition_group_name}>
                    {item.nutrition_group_name}&nbsp;:&nbsp;&nbsp;
                    {item.amount_in_grams} กรัม&nbsp;&nbsp;
                    {item.amount_in_percentage} เปอร์เซ็น
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Medium and up: show this */}
          <div className="hidden lg:block m-5 ml-40 mr-50">
            <table className="min-w-full border-collapse border border-gray-500 table-fixed">
              <thead>
                <tr>
                  <th className="border border-gray-400 p-2 w-25"></th>
                  {Object.keys(groupedByFoodGroup).map((foodGroupName) => (
                    <th
                      key={foodGroupName}
                      className="border border-gray-400 p-2 text-center whitespace-nowrap"
                    >
                      {foodGroupName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mealTimes.map((mealTime) => (
                  <tr key={mealTime}>
                    <td className="min-w-25 border border-gray-400 p-2 pl-5 font-semibold whitespace-nowrap">
                      {mealTime}
                    </td>
                    {Object.values(groupedByFoodGroup).map((items) => {
                      const item = items.find(
                        (i) => i.meal_time_name === mealTime
                      );
                      return (
                        <td
                          key={mealTime}
                          className="w-30 border border-gray-400 p-2 text-center whitespace-nowrap"
                        >
                          {item && item.amount > 0 ? `${item.amount} ${item.unit}` : "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-5 border border-gray-500 p- rounded shadow-sm hidden lg:block">
              <div className="m-2 ml-5 text-xl font-semibold mb-2">
                พลังงาน {caloryDatas} กิโลแคลอรี่
              </div>
              <hr className="border-t border-gray-400" />
              <ul className="list-disc list-inside space-y-1 m-2 ml-8">
                {nutritionDatas.map((item) => (
                  <li key={item.nutrition_group_name}>
                    {item.nutrition_group_name} : {item.amount_in_grams} กรัม ({item.amount_in_percentage}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex p-3 md:pl-20 md:pr-20 lg:p-[6vh] lg:pl-50 lg:pr-60">
            <Button
              type="primary"
              className="w-full !p-4 !text-lg md:!p-5 md:!text-xl !font-kanit"
              onClick={handleNext}
            >
              ดูสิ่งที่ควรเลือกทานและหลีกเลี่ยง
            </Button>
            <FilePdfOutlined onClick={handleOpenPDF} className="ml-5 text-4xl cursor-pointer !text-gray-800 hover:!text-blue-600 transition-colors transform hover:scale-110 active:!text-blue-600 active:scale-110"/>
          </div>
        </div>
      )}
    </>
  );
};

export default NutritionSuggestion;
