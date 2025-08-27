import { Button, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  NutritionData,
  PortionData,
  RuleData,
} from "../../interfaces/Nutrition";
import {
  GetCaloriesByRule,
  GetNutritionDataByRule,
  GetPortionDataByRule,
  GetRuleDetailByRule,
} from "../../services/https";
import { getValidRule } from "../../services/https/ruleUtils";
import PDFDownloadButton from "../../components/PDFDownloadButton";
import { FireOutlined, InfoCircleOutlined, CalendarOutlined } from "@ant-design/icons";

const NutritionSuggestion = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  const handleNext = () => {
    navigate("/choose-avoid");
  };
  
  const handlePortion = () => {
    navigate("/importance-of-nutrition");
  };

  const [nutritionDatas, setNutritionDatas] = useState<NutritionData[]>([]);
  const [portionDatas, setPortionDatas] = useState<PortionData[]>([]);
  const [caloryDatas, setCaloryDatas] = useState<number>();
  const [ruleDatas, setRuleData] = useState<RuleData>();

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

  const getRuleDatas = async (ruleNum: number) => {
    try {
      const res = await GetRuleDetailByRule(ruleNum);
      if (res?.data?.RuleDetail) {
        setRuleData(res?.data?.RuleDetail);
      } else {
        console.log("Failed to load rule details.");
      }
    } catch (error) {
      console.log("Error fetching rule details. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const ruleNum = getValidRule();
      if (!ruleNum) {
        navigate("/nutrition");
        return;
      }
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      try {
        await Promise.all([
          getNutritionDatas(ruleNum),
          getPortionDatas(ruleNum),
          getCaloryDatas(ruleNum),
          getRuleDatas(ruleNum),
          delay(300),
        ]);
      } catch (err) {
        console.error("Failed to fetch some data", err);
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchData();
  }, []);

  const groupedByFoodGroup = portionDatas.reduce((acc, item) => {
    if (!acc[item.food_group_name]) {
      acc[item.food_group_name] = [];
    }
    acc[item.food_group_name].push(item);
    return acc;
  }, {} as Record<string, typeof portionDatas>);

  const mealTimes = ["เช้า", "กลางวัน", "เย็น"];

  const mealTimeIcons = {
    "เช้า": "🌅",
    "กลางวัน": "☀️", 
    "เย็น": "🌙"
  };

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4 text-lg font-kanit text-gray-600 animate-pulse">
              กำลังโหลดข้อมูลโภชนาการ...
            </div>
          </div>
        </div>
      ) : (
        <div className="font-kanit min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>
            
            <div className="relative p-8 md:p-12 flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                  ปริมาณที่ควรทานต่อวัน
                </h1>
                <p className="text-blue-100 text-lg md:text-xl opacity-90 animate-in fade-in slide-in-from-top-8 duration-1000 delay-300">
                  แผนโภชนาการเฉพาะบุคคล
                </p>
              </div>
            </div>
          </div>

          {/* Patient Info Card */}
          <div className="p-6 md:p-12">
            <div className={`
              max-w-6xl mx-auto mb-8
              ${isVisible ? 'animate-in slide-in-from-bottom-4 fade-in duration-700' : 'opacity-0'}
            `}>
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/30">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    <InfoCircleOutlined className="mr-3 text-blue-600" />
                    รายละเอียดผู้ป่วย
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                    <div className="font-semibold text-blue-800 mb-2">โรค</div>
                    <div className="text-gray-700">
                      {ruleDatas?.DiseaseName}{" "}
                      {ruleDatas?.DiseaseStage &&
                        ruleDatas.DiseaseStage !== "-" &&
                        `${ruleDatas.DiseaseStage}`}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                    <div className="font-semibold text-green-800 mb-2">อายุ</div>
                    <div className="text-gray-700">
                      {ruleDatas?.AgeMin === 0
                        ? `ไม่เกิน ${ruleDatas.AgeMax} ปี`
                        : ruleDatas?.AgeMax === 200
                        ? `${ruleDatas?.AgeMin} ปี ขึ้นไป`
                        : `${ruleDatas?.AgeMin} - ${ruleDatas?.AgeMax} ปี`}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                    <div className="font-semibold text-purple-800 mb-2">IBW</div>
                    <div className="text-gray-700">
                      {ruleDatas?.IBWMin === 0
                        ? `ไม่เกิน ${ruleDatas.IBWMax} kg.`
                        : ruleDatas?.IBWMax === 200
                        ? `${ruleDatas.IBWMin} kg. ขึ้นไป`
                        : `${ruleDatas?.IBWMin} - ${ruleDatas?.IBWMax} kg.`}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="text-sm text-gray-600">
                    <strong>IBW (Ideal Body Weight)</strong> = น้ำหนักมาตรฐานตามส่วนสูง (ซม.) ลบ 105 สำหรับผู้หญิง หรือ 100 สำหรับผู้ชาย
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Portion Table */}
            <div className={`
              lg:hidden mb-8
              ${isVisible ? 'animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200' : 'opacity-0'}
            `}>
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <CalendarOutlined className="mr-3" />
                    ตารางปริมาณอาหาร
                  </h3>
                </div>
                
                <div className="p-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="p-3 text-left font-semibold text-gray-700 rounded-l-xl"></th>
                          {mealTimes.map((mealTime) => (
                            <th key={mealTime} className="p-3 text-center font-semibold text-gray-700">
                              <div className="flex flex-col items-center">
                                <span className="text-2xl mb-1">{mealTimeIcons[mealTime as keyof typeof mealTimeIcons]}</span>
                                <span>{mealTime}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(groupedByFoodGroup).map(([foodGroupName, items], index) => (
                          <tr key={foodGroupName} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'}`}>
                            <td className="p-3 font-semibold text-gray-700 border-r border-gray-100">
                              {foodGroupName}
                            </td>
                            {mealTimes.map((mealTime) => {
                              const item = items.find((i) => i.meal_time_name === mealTime);
                              return (
                                <td key={`${foodGroupName}-${mealTime}`} className="p-3 text-center text-gray-600">
                                  {item && item.amount > 0 ? (
                                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg py-1 px-2 text-sm font-medium">
                                      {item.amount} {item.unit}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Portion Table */}
            <div className={`
              hidden lg:block mb-8
              ${isVisible ? 'animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200' : 'opacity-0'}
            `}>
              <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <CalendarOutlined className="mr-3" />
                    ตารางปริมาณอาหารแต่ละมื้อ
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <th className="p-4 text-left font-semibold text-gray-700 rounded-l-xl w-32"></th>
                          {Object.keys(groupedByFoodGroup).map((foodGroupName) => (
                            <th key={foodGroupName} className="p-4 text-center font-semibold text-gray-700 min-w-32">
                              {foodGroupName}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {mealTimes.map((mealTime, index) => (
                          <tr key={mealTime} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'}`}>
                            <td className="p-4 font-semibold text-gray-700 border-r border-gray-100">
                              <div className="flex items-center">
                                <span className="text-2xl mr-3">{mealTimeIcons[mealTime as keyof typeof mealTimeIcons]}</span>
                                <span>{mealTime}</span>
                              </div>
                            </td>
                            {Object.values(groupedByFoodGroup).map((items, groupIndex) => {
                              const item = items.find((i) => i.meal_time_name === mealTime);
                              return (
                                <td key={`${mealTime}-${groupIndex}`} className="p-4 text-center text-gray-600">
                                  {item && item.amount > 0 ? (
                                    <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg py-2 px-3 text-sm font-medium inline-block">
                                      {item.amount} {item.unit}
                                    </div>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Info Link */}
            <div className={`
              max-w-6xl mx-auto text-right mb-8
              ${isVisible ? 'animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300' : 'opacity-0'}
            `}>
              <button
                onClick={handlePortion}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <InfoCircleOutlined className="mr-2" />
                ความสำคัญของโภชนาการ
              </button>
            </div>

            {/* Calorie & Nutrition Card */}
            <div className={`
              max-w-6xl mx-auto mb-8
              ${isVisible ? 'animate-in slide-in-from-bottom-8 fade-in duration-700 delay-400' : 'opacity-0'}
            `}>
              <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-orange-200/50">
                <div className="flex items-center mb-6">
                  <div className="w-1 h-12 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-4"></div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                    <FireOutlined className="mr-3 text-orange-600" />
                    พลังงาน {caloryDatas} กิโลแคลอรี่
                  </h3>
                </div>
                
                <div className="border-t border-orange-200 pt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nutritionDatas.map((item, index) => (
                      <div 
                        key={item.nutrition_group_name}
                        className={`
                          bg-white/60 rounded-2xl p-4 border border-orange-200
                          transform transition-all duration-500 hover:scale-105 hover:shadow-lg
                          ${isVisible ? 'animate-in slide-in-from-bottom-4 fade-in' : 'opacity-0'}
                        `}
                        style={{ animationDelay: `${500 + index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-gray-700">
                            {item.nutrition_group_name}
                          </div>
                          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        </div>
                        <div className="mt-2 text-lg font-bold text-orange-700">
                          {item.amount_in_grams} กรัม
                        </div>
                        <div className="text-sm text-orange-600">
                          ({item.amount_in_percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`
              max-w-6xl mx-auto
              ${isVisible ? 'animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500' : 'opacity-0'}
            `}>
              <div className="flex flex-col md:flex-row gap-4">
                <Button
                  type="primary"
                  className={`
                    flex-1 !h-16 !text-xl !font-kanit !font-semibold
                    !bg-gradient-to-r !from-blue-600 !to-indigo-700
                    !border-0 !rounded-2xl !shadow-xl
                    hover:!from-blue-700 hover:!to-indigo-800
                    hover:!shadow-2xl hover:!scale-105
                    !transition-all !duration-300
                  `}
                  onClick={handleNext}
                >
                  ดูสิ่งที่ควรเลือกทานและหลีกเลี่ยง
                </Button>
                <div className="md:w-auto">
                  <PDFDownloadButton variant="outline" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NutritionSuggestion;