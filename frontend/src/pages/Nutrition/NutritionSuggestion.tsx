import { Button, Spin, Tooltip } from "antd";
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
import {
  FireOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { LuApple, LuDroplets, LuEggFried } from "react-icons/lu";
import { IoFishOutline } from "react-icons/io5";
import { TbSalt } from "react-icons/tb";

const NutritionSuggestion = () => {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [ruleNum, setRuleNum] = useState<number | null>(null);

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

      setRuleNum(ruleNum);
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
    เช้า: "🌅",
    กลางวัน: "☀️",
    เย็น: "🌙",
  };

  const columnToCard: { [key: string]: string } = {
    "ข้าว/แป้ง": "protein-card",
    แป้งปลอดโปรตีน: "protein-card",
    ผัก: "potassium-card",
    ผลไม้: "potassium-card",
    เนื้อสัตว์: "phosphorus-card",
    ไขมัน: "fat-card",
    ซอสปรุงรส: "sodium-card",
  };

  const scrollToCard = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100; // height of fixed header
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const extraAdvice = [
    {
      id: "protein-card",
      title: "โปรตีน",
      icon: <LuEggFried size={32} />,
      risk: "การรับประทานอาหารประเภทโปรตีนสูง ในผู้ที่ไตมีการทำงานเสื่อมไปบางส่วน อาจเร่งการดำเนินของโรคไตให้เร็วขึ้นได้ เพราะอาหารเหล่านี้ทำให้เลือดในร่างกายมีความเป็นกรดมากขึ้น ไตจึงต้องทำงานหนักเพื่อขับยูเรียซึ่งเป็นของเสียที่ได้จากการสลายโปรตีนและเพิ่มการขับกรดออกจากร่างกาย",
      recommendation: {
        preDialysis:
          "ควรรับประทานโปรตีนในแต่ละวัน ให้น้อยกว่าคนปกติเล็กน้อย คือ ประมาณ 0.6 – 0.8 กรัม/น้ำหนักตัว 1 กก./วัน",
        dialysis:
          "ควรรับประทานโปรตีนในแต่ละวัน เพิ่มมากกว่าคนปกติ คือ ประมาณ 1.0 – 1.2 กรัม/น้ำหนักตัว 1 กก./วัน เนื่องจากร่างกายสูญเสียโปรตีนไปบางส่วนจากกระบวนการฟอกไต",
      },
      note: "โปรตีนพบในอาหาร เช่น เนื้อสัตว์ ไก่ ปลา ไข่ นม และถั่วต่าง ๆ รวมถึงอาหารประเภทข้าว/แป้งอีกด้วย",
      tips: null,
    },
    {
      id: "phosphorus-card",
      title: "ฟอสฟอรัส",
      icon: <IoFishOutline size={32} />,
      risk: "ปริมาณฟอสฟอรัสที่สูง อาจมีส่วนทำให้กระดูกพรุน และเกิดภาวะหลอดเลือดแดงแข็ง",
      recommendation: "ไม่ควรเกิน 800 – 1,000 มิลลิกรัม/วัน",
      note: "ปกติแล้วเรามักจะได้เกลือแร่ฟอสฟอรัสจากเนื้อสัตว์และนม จากอาหารที่เราทาน ดังนั้นเราจึงควรหลีกเลี่ยงอาหารที่มีฟอสฟอรัสสูง เพื่อป้องกันภาวะฟอสฟอรัสในเลือดสูง",
      tips: null,
    },
    {
      id: "potassium-card",
      title: "โพแทสเซียม",
      icon: <LuApple size={32} />,
      risk: "โพแทสเซียมที่สูงทำให้หัวใจเต้นผิดปกติ",
      recommendation: "ไม่ควรเกิน 2,000 – 2,500 มิลลิกรัม/วัน",
      note: null,
      tips: "การนำผักมาสับเป็นชิ้นเล็ก ๆ ต้มในน้ำแล้วเทน้ำทิ้ง จะกำจัดโพแทสเซียมออกได้ประมาณร้อยละ 20 – 30 อย่างไรก็ตาม อาหารจะสูญเสียคุณค่าของวิตามินที่จำเป็นด้วย",
    },
    {
      id: "sodium-card",
      title: "โซเดียม",
      icon: <TbSalt size={32} />,
      risk: "การรับประทานโซเดียมมากส่งผลให้เกิดภาวะความดันโลหิตสูงและบวมน้ำ",
      recommendation: "ไม่เกิน 2,000 มิลลิกรัม/วัน",
      note: "เครื่องปรุงเป็นแหล่งของโซเดียม",
      tips: "ควรเลือกเครื่องปรุงอย่างใดอย่างหนึ่งในการปรุงอาหารแต่ละมื้อ หากมีการใช้เครื่องปรุง 2 ชนิด ต้องลดปริมาณเครื่องปรุงแต่ละชนิดต่อมื้อลงให้เหลือแค่อย่างละครึ่งจากข้อแนะนำ",
    },
    {
      id: "fat-card",
      title: "ไขมัน",
      icon: <LuDroplets size={32} />, // replace with an appropriate icon
      risk: "ไขมันเป็นอาหารที่ให้พลังงานสูง การรับประทานไขมันมากเกินไป โดยเฉพาะไขมันตัวร้าย (LDL-Cholesterol) อาจเพิ่มความเสี่ยงต่อโรคหัวใจและหลอดเลือด",
      recommendation:
        "แนะนำให้รับประทานมื้อละ 2-3 ช้อนชา เลือกไขมันชนิดดีเพื่อสุขภาพ",
      note: "ไขมันที่แนะนำควรเลือกไขมันชนิดดี เช่น น้ำมันที่มีกรดโอเลอิกสูง ได้แก่ น้ำมันรำข้าว น้ำมันมะกอก น้ำมันคาโนล่า น้ำมันถั่วเหลือง น้ำมันดอกทานตะวัน",
      tips: "ควรหลีกเลี่ยงไขมันอิ่มตัวสูง เช่น น้ำมันจากสัตว์ น้ำมันปาล์ม น้ำมันมะพร้าว และหลีกเลี่ยงไขมันทรานส์ที่แฝงในอาหาร เช่น เนยเทียม มาการีน เบเกอรี่ คุกกี้",
    },
  ];

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
            <div
              className={`
              max-w-6xl mx-auto mb-8
              ${
                isVisible
                  ? "animate-in slide-in-from-bottom-4 fade-in duration-700"
                  : "opacity-0"
              }
            `}
            >
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
                    <div className="font-semibold text-green-800 mb-2">
                      อายุ
                    </div>
                    <div className="text-gray-700">
                      {ruleDatas?.AgeMin === 0
                        ? `ไม่เกิน ${ruleDatas.AgeMax} ปี`
                        : ruleDatas?.AgeMax === 200
                        ? `${ruleDatas?.AgeMin} ปี ขึ้นไป`
                        : `${ruleDatas?.AgeMin} - ${ruleDatas?.AgeMax} ปี`}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-200">
                    <div className="font-semibold text-purple-800 mb-2">
                      IBW
                    </div>
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
                    <strong>IBW (Ideal Body Weight)</strong> =
                    น้ำหนักมาตรฐานตามส่วนสูง (ซม.) ลบ 105 สำหรับผู้หญิง หรือ 100
                    สำหรับผู้ชาย
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Portion Table */}
            <div
              className={`
              lg:hidden mb-8
              ${
                isVisible
                  ? "animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200"
                  : "opacity-0"
              }
            `}
            >
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
                            <th
                              key={mealTime}
                              className="p-3 text-center font-semibold text-gray-700"
                            >
                              <div className="flex flex-col items-center">
                                <span className="text-2xl mb-1">
                                  {
                                    mealTimeIcons[
                                      mealTime as keyof typeof mealTimeIcons
                                    ]
                                  }
                                </span>
                                <span>{mealTime}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(groupedByFoodGroup).map(
                          ([foodGroupName, items], index) => (
                            <tr
                              key={foodGroupName}
                              onClick={() =>
                                scrollToCard(columnToCard[foodGroupName])
                              }
                              className={`border-b border-gray-100 ${
                                index % 2 === 0
                                  ? "bg-white/50"
                                  : "bg-gray-50/50"
                              }`}
                            >
                              <td className="p-3 font-semibold text-gray-700 border-r border-gray-100">
                                {foodGroupName}
                              </td>
                              {mealTimes.map((mealTime) => {
                                const item = items.find(
                                  (i) => i.meal_time_name === mealTime
                                );
                                return (
                                  <td
                                    key={`${foodGroupName}-${mealTime}`}
                                    className="p-3 text-center text-gray-600"
                                  >
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
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Portion Table */}
            <div
              className={`
              hidden lg:block mb-8
              ${
                isVisible
                  ? "animate-in slide-in-from-bottom-8 fade-in duration-700 delay-200"
                  : "opacity-0"
              }
            `}
            >
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
                          {Object.keys(groupedByFoodGroup).map(
                            (foodGroupName) => (
                              <th
                                onClick={() =>
                                  scrollToCard(columnToCard[foodGroupName])
                                }
                                key={foodGroupName}
                                className="
  relative cursor-pointer p-4 text-center font-semibold text-gray-700 min-w-32
  overflow-hidden transition-all duration-300 ease-in-out
  hover:text-transparent hover:bg-clip-text
  hover:bg-gradient-to-r hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600
  
  after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5
  after:bg-gradient-to-r after:from-blue-500 after:to-purple-500
  after:transition-all after:duration-300 after:-translate-x-1/2
  hover:after:w-3/4
"
                              >
                                <Tooltip title="ดูคำแนะนำเพิ่มเติม">
                                  <span>{foodGroupName}</span>
                                </Tooltip>
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {mealTimes.map((mealTime, index) => (
                          <tr
                            key={mealTime}
                            className={`border-b border-gray-100 ${
                              index % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"
                            }`}
                          >
                            <td className="p-4 font-semibold text-gray-700 border-r border-gray-100">
                              <div className="flex items-center">
                                <span className="text-2xl mr-3">
                                  {
                                    mealTimeIcons[
                                      mealTime as keyof typeof mealTimeIcons
                                    ]
                                  }
                                </span>
                                <span>{mealTime}</span>
                              </div>
                            </td>
                            {Object.values(groupedByFoodGroup).map(
                              (items, groupIndex) => {
                                const item = items.find(
                                  (i) => i.meal_time_name === mealTime
                                );
                                return (
                                  <td
                                    key={`${mealTime}-${groupIndex}`}
                                    className="p-4 text-center text-gray-600"
                                  >
                                    {item && item.amount > 0 ? (
                                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg py-2 px-3 text-sm font-medium inline-block">
                                        {item.amount} {item.unit}
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                );
                              }
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Info Link */}
            <div
              className={`
              max-w-6xl mx-auto text-right mb-8
              ${
                isVisible
                  ? "animate-in slide-in-from-bottom-8 fade-in duration-700 delay-300"
                  : "opacity-0"
              }
            `}
            >
              <button
                onClick={handlePortion}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <InfoCircleOutlined className="mr-2" />
                ความสำคัญของโภชนาการ
              </button>
            </div>

            {/* Calorie & Nutrition Card */}
            <div
              className={`
              max-w-6xl mx-auto mb-8
              ${
                isVisible
                  ? "animate-in slide-in-from-bottom-8 fade-in duration-700 delay-400"
                  : "opacity-0"
              }
            `}
            >
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
                          ${
                            isVisible
                              ? "animate-in slide-in-from-bottom-4 fade-in"
                              : "opacity-0"
                          }
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

            {/* Extra Nutrition Advice Cards */}
            {(ruleNum! < 17 || ruleNum! > 22) && (
              <div
                className={`
              max-w-6xl mx-auto mb-8
              ${
                isVisible
                  ? "animate-in slide-in-from-bottom-8 fade-in duration-700 delay-600"
                  : "opacity-0"
              }
            `}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/30">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-12 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full mr-4"></div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                      <BulbOutlined className="mr-3 text-emerald-600" />
                      คำแนะนำเพิ่มเติม
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-1 gap-1">
                    {extraAdvice.map((advice, index) => (
                      <div
                        id={advice.id}
                        key={advice.title}
                        className={`
                        bg-gradient-to-br from-gray-50/80 to-white/80 rounded-2xl p-6 border border-gray-200/50
                        transform transition-all duration-500 hover:scale-105 hover:shadow-lg
                        ${
                          isVisible
                            ? "animate-in slide-in-from-bottom-4 fade-in"
                            : "opacity-0"
                        }
                      `}
                        style={{ animationDelay: `${700 + index * 100}ms` }}
                      >
                        {/* Header */}
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-600 mr-4">
                            {advice.icon}
                          </div>
                          <h4 className="text-xl font-bold text-gray-800">
                            {advice.title}
                          </h4>
                        </div>

                        {/* Risk Section */}
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <WarningOutlined className="text-red-500 mr-2" />
                            <span className="font-semibold text-red-700">
                              ความเสี่ยง
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed bg-red-50 p-3 rounded-lg border-l-4 border-red-200">
                            {advice.risk}
                          </p>
                        </div>

                        {/* Recommendation Section */}
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <CheckCircleOutlined className="text-green-500 mr-2" />
                            <span className="font-semibold text-green-700">
                              คำแนะนำ
                            </span>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-200">
                            {typeof advice.recommendation === "object" ? (
                              <div className="space-y-2">
                                <div className="text-sm text-gray-700">
                                  <strong className="text-green-800">
                                    ก่อนฟอกไต:
                                  </strong>{" "}
                                  {advice.recommendation.preDialysis}
                                </div>
                                <div className="text-sm text-gray-700">
                                  <strong className="text-green-800">
                                    ระหว่างฟอกไต:
                                  </strong>{" "}
                                  {advice.recommendation.dialysis}
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {advice.recommendation}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Note Section */}
                        {advice.note && (
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <InfoCircleOutlined className="text-blue-500 mr-2" />
                              <span className="font-semibold text-blue-700">
                                หมายเหตุ
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed bg-blue-50 p-3 rounded-lg border-l-4 border-blue-200">
                              {advice.note}
                            </p>
                          </div>
                        )}

                        {/* Tips Section */}
                        {advice.tips && (
                          <div>
                            <div className="flex items-center mb-2">
                              <BulbOutlined className="text-amber-500 mr-2" />
                              <span className="font-semibold text-amber-700">
                                เทคนิค
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed bg-amber-50 p-3 rounded-lg border-l-4 border-amber-200">
                              {advice.tips}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              className={`
              max-w-6xl mx-auto
              ${
                isVisible
                  ? "animate-in slide-in-from-bottom-8 fade-in duration-700 delay-700"
                  : "opacity-0"
              }
            `}
            >
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
