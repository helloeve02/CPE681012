import { useEffect, useState } from "react";
import { GetAllChooseAvoid } from "../../services/https";
import { Button, Image, Spin } from "antd";
import type { FoodItem } from "../../interfaces/FoodItem";
import { useLocation, useNavigate } from "react-router-dom";
import PDFDownloadButton from "../../components/PDFDownloadButton";
import FoodPopup from "../Nutrition/FoodPopup";
import { getValidRule } from "../../services/https/ruleUtils";

const ChooseAvoid = () => {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [foodGroups, setFoodGroups] = useState<FoodGroupData[]>([]);
  const [activeTab, setActiveTab] = useState<"recommended" | "avoided">(
    "recommended"
  );
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const ruleNumber = getValidRule();
  const handleNext = () => {
    navigate("/mealplanner");
  };

  type FoodGroupData = {
    topic: string;
    recommended: FoodItem[];
    avoided: FoodItem[];
  };

  function transformFoodItems(foodItems: FoodItem[]): FoodGroupData[] {
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

    return Object.entries(groupMap).map(([topic, data]) => ({
      topic,
      recommended: data.recommended,
      avoided: data.avoided,
    }));
  }

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state, foodGroups]);

  useEffect(() => {
    const fetchData = async () => {
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      try {
        const [res] = await Promise.all([GetAllChooseAvoid(), delay(300)]);

        if (res && res.data?.fooditems) {
          setFoodGroups(transformFoodItems(res.data.fooditems));
        }
      } catch (err) {
        console.error("Failed to fetch some data", err);
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchData();
  }, []);

  const renderFoodItems = (items: FoodItem[], isRecommended: boolean) => (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.ID}
          onClick={() => setSelectedItem(item)}
          className={`
            group cursor-pointer relative overflow-hidden rounded-2xl 
            transform transition-all duration-500 hover:scale-105 hover:shadow-2xl
            bg-white border border-gray-100 hover:border-transparent
            ${
              isRecommended
                ? "hover:shadow-green-200/50"
                : "hover:shadow-red-200/50"
            }
            ${
              isVisible
                ? "animate-in slide-in-from-bottom-4 fade-in"
                : "opacity-0"
            }
          `}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={item.Image}
              fallback="https://img.icons8.com/?size=100&id=j1UxMbqzPi7n&format=png&color=000000"
              alt={item.Name}
              preview={false}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            
          </div>

          <div className="p-3">
            <h3 className="font-medium text-gray-800 text-sm leading-tight group-hover:text-gray-900 transition-colors duration-200">
              {item.Name}
            </h3>
            <div
              className={`
              inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium
              ${
                isRecommended
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }
            `}
            >
              <div
                className={`w-2 h-2 rounded-full mr-1 ${
                  isRecommended ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              {isRecommended ? "แนะนำ" : "หลีกเลี่ยง"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4 text-lg font-kanit text-gray-600 animate-pulse">
              กำลังโหลดข้อมูลอาหาร...
            </div>
          </div>
        </div>
      ) : (
        <div className="font-kanit min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>

            <div className="relative p-8 md:p-12 flex items-center justify-center text-white">
              <div className="text-center">
                <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                  อาหารที่ควรเลี่ยง
                </h1>
                <p className="text-blue-100 text-lg md:text-xl opacity-90 animate-in fade-in slide-in-from-top-8 duration-1000 delay-300">
                  คำแนะนำอาหารที่เหมาะสำหรับคุณ
                </p>
              </div>
            </div>
          </div>
          <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center">
                <div className="inline-flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl mt-6 mb-4 shadow-xl border border-white/30">
                  <button
                    onClick={() => setActiveTab("recommended")}
                    className={`
                      px-8 py-4 rounded-xl font-kanit text-lg font-semibold 
                      transition-all duration-500 relative overflow-hidden
                      ${
                        activeTab === "recommended"
                          ? "text-white shadow-xl transform scale-105"
                          : "text-gray-600 hover:text-green-600 hover:bg-white/60"
                      }
                    `}
                  >
                    {activeTab === "recommended" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl"></div>
                    )}
                    <span className="relative flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          activeTab === "recommended"
                            ? "bg-white"
                            : "bg-green-400"
                        }`}
                      ></div>
                      ควรทาน
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("avoided")}
                    className={`
                      px-8 py-4 rounded-xl font-kanit text-lg font-semibold 
                      transition-all duration-500 relative overflow-hidden
                      ${
                        activeTab === "avoided"
                          ? "text-white shadow-xl transform scale-105"
                          : "text-gray-600 hover:text-red-600 hover:bg-white/60"
                      }
                    `}
                  >
                    {activeTab === "avoided" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl"></div>
                    )}
                    <span className="relative flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          activeTab === "avoided" ? "bg-white" : "bg-red-400"
                        }`}
                      ></div>
                      ไม่ควรทาน
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Render food groups */}
          <div className="p-6 md:p-12 lg:px-20 xl:px-32 md:mx-25">
            <div className="max-w-7xl mx-auto space-y-8">
              {foodGroups
                .filter((group) => {
                  if (ruleNumber && ruleNumber >= 17 && ruleNumber <= 22) {
                    return ["เนื้อสัตว์", "ไขมัน"].includes(group.topic);
                  }
                  return true;
                })
                .map((group, groupIndex) => {
                  const id = group.topic;
                  const itemsToShow =
                    activeTab === "recommended"
                      ? group.recommended
                      : group.avoided;
                  if (itemsToShow.length === 0) return null;

                  return (
                    <div
                      id={id}
                      key={group.topic}
                      className={`group relative ${
                        isVisible
                          ? "animate-in slide-in-from-bottom-8 fade-in duration-700"
                          : "opacity-0"
                      }`}
                      style={{ animationDelay: `${groupIndex * 100}ms` }}
                    >
                      <div
                        className={`
                        relative overflow-hidden rounded-3xl p-8 
                        backdrop-blur-sm border border-white/30 shadow-xl
                        transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]
                        ${
                          activeTab === "recommended"
                            ? "bg-gradient-to-br from-green-50/80 to-emerald-50/80 hover:from-green-50/90 hover:to-emerald-50/90"
                            : "bg-gradient-to-br from-red-50/80 to-rose-50/80 hover:from-red-50/90 hover:to-rose-50/90"
                        }
                      `}
                      >
                        <div
                          className={`absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-16 -translate-y-16 ${
                            activeTab === "recommended"
                              ? "bg-green-400"
                              : "bg-red-400"
                          }`}
                        ></div>
                        <div
                          className={`absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 transform -translate-x-12 translate-y-12 ${
                            activeTab === "recommended"
                              ? "bg-emerald-400"
                              : "bg-rose-400"
                          }`}
                        ></div>

                        <div className="relative">
                          <div className="flex items-center mb-6">
                            <div
                              className={`
                              w-1 h-12 rounded-full mr-4
                              ${
                                activeTab === "recommended"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }
                            `}
                            ></div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                              {group.topic}
                            </h2>
                          </div>

                          <div className="mb-6">
                            <div
                              className={`
                              inline-flex items-center px-4 py-2 rounded-full font-semibold text-lg
                              ${
                                activeTab === "recommended"
                                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                                  : "bg-red-100 text-red-700 border-2 border-red-300"
                              }
                            `}
                            >
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${
                                  activeTab === "recommended"
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              {activeTab === "recommended"
                                ? "ควรทาน"
                                : "ควรเลี่ยง"}
                            </div>
                          </div>

                          {renderFoodItems(
                            itemsToShow,
                            activeTab === "recommended"
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* Conditional card */}
            {ruleNumber && ruleNumber >= 17 && ruleNumber <= 22 && (
              <div className="p-6 md:p-12 lg:px-20 xl:px-32">
                <div className="max-w-7xl mx-auto">
                  <div
                    className={`
                  group relative
                  ${
                    isVisible
                      ? "animate-in slide-in-from-bottom-8 fade-in duration-700"
                      : "opacity-0"
                  }
                `}
                  >
                    <div
                      className="
                    relative overflow-hidden rounded-3xl p-8 
                    backdrop-blur-sm border border-white/30 shadow-xl
                    transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]
                    bg-gradient-to-br from-red-50/80 to-rose-50/80 hover:from-red-50/90 hover:to-rose-50/90
                  "
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-16 -translate-y-16 bg-red-400"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 transform -translate-x-12 translate-y-12 bg-rose-400"></div>

                      <div className="relative">
                        <div className="flex items-center mb-6">
                          <div className="w-1 h-12 rounded-full mr-4 bg-red-500"></div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                            อาหารที่ผู้ป่วยเบาหวานควรหลีกเลี่ยง
                          </h3>
                        </div>

                        <div className="mb-6">
                          <div className="inline-flex items-center px-4 py-2 rounded-full font-semibold text-lg bg-red-100 text-red-700 border-2 border-red-300">
                            <div className="w-3 h-3 rounded-full mr-2 bg-red-500"></div>
                            คำแนะนำพิเศษ
                          </div>
                        </div>

                        <div className="grid gap-4 md:gap-6">
                          <div className="group cursor-default relative overflow-hidden rounded-2xl transform transition-all duration-300 hover:scale-105 bg-white border border-red-100 hover:border-red-200 hover:shadow-lg">
                            <div className="p-6">
                              <div className="flex items-center mb-3">
                                <span className="text-2xl mr-3">❎</span>
                                <span className="font-semibold text-red-700 text-lg">
                                  ขนมหวาน
                                </span>
                              </div>
                              <p className="text-red-600 ml-11 text-sm leading-relaxed">
                                เช่น เบเกอรี่ เค้ก พาย คุกกี้ น้ำอัดลม
                              </p>
                            </div>
                          </div>

                          <div className="group cursor-default relative overflow-hidden rounded-2xl transform transition-all duration-300 hover:scale-105 bg-white border border-red-100 hover:border-red-200 hover:shadow-lg">
                            <div className="p-6">
                              <div className="flex items-center mb-3">
                                <span className="text-2xl mr-3">❎</span>
                                <span className="font-semibold text-red-700 text-lg">
                                  ผลไม้หวานจัด
                                </span>
                              </div>
                              <p className="text-red-600 ml-11 text-sm leading-relaxed">
                                เช่น ทุเรียน ขนุน ละมุด ลิ้นจี่ ลำไย ผลไม้ดอง
                                ผลไม้เชื่อม ผลไม้แช่อิ่ม เป็นต้น
                              </p>
                            </div>
                          </div>

                          <div className="group cursor-default relative overflow-hidden rounded-2xl transform transition-all duration-300 hover:scale-105 bg-white border border-red-100 hover:border-red-200 hover:shadow-lg">
                            <div className="p-6">
                              <div className="flex items-center mb-3">
                                <span className="text-2xl mr-3">❎</span>
                                <span className="font-semibold text-red-700 text-lg">
                                  อาหารที่มีรสเค็มจัด
                                </span>
                              </div>
                              <p className="text-red-600 ml-11 text-sm leading-relaxed">
                                เช่น ปลาเค็ม ไข่เค็ม ของหมักดองทุกชนิด
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
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
                ดูแผนอาหารแนะนำ
              </Button>
              <div className="md:w-auto">
                <PDFDownloadButton />
              </div>
            </div>
          </div>
          {/* Popup */}
          <FoodPopup
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      )}
    </>
  );
};

export default ChooseAvoid;
