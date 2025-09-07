import { useEffect, useState } from "react";
import { GetAllFoodExchanges } from "../../services/https";
import type { FoodExchangeInterface } from "../../interfaces/FoodExchange";
import FoodPopup from "./FoodPopup";

const FoodExchanges = () => {
  const [isLoading, setLoading] = useState(true);
  const [foodExchanges, setFoodExchanges] = useState<FoodExchangeInterface[]>(
    []
  );
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<FoodExchangeInterface | null>(null);

  const getAllFoodExchanges = async () => {
    try {
      const res = await GetAllFoodExchanges();
      if (Array.isArray(res?.data?.foodexchanges)) {
        setFoodExchanges(res.data.foodexchanges);
      } else {
        console.log("Failed to load food exchanges.");
      }
    } catch (error) {
      console.log("Error fetching food exchanges. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllFoodExchanges();
      // Add hard-coded FoodGroup with some dummy items
      setFoodExchanges((prev) => [
        ...prev,
        {
          ID: 999990,
          Amount: "1/2-1/3",
          Unit: "ถ้วยตวง",
          FoodItem: {
            Name: "ผักสุก",
            Image:
              "https://www.sgethai.com/wp-content/uploads/2022/02/%E0%B8%9C%E0%B8%B1%E0%B8%81%E0%B8%95%E0%B9%89%E0%B8%A13.jpg",
            Credit:
              "https://www.sgethai.com/article/%E0%B8%9C%E0%B8%B1%E0%B8%81%E0%B8%95%E0%B9%89%E0%B8%A1-%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B8%AD%E0%B8%A2%E0%B9%88%E0%B8%B2%E0%B8%87%E0%B9%84%E0%B8%A3%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B9%83%E0%B8%AB%E0%B9%89/?srsltid=AfmBOop5vfQQUi84RikxtIN899oG_xSGVp7CjPEuGQbB40p28BjQiyTO",
            FoodFlag: { FoodGroup: { Name: "ผัก" } },
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
            FoodFlag: { FoodGroup: { Name: "ผัก" } },
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
            FoodFlag: { FoodGroup: { Name: "เนื้อสัตว์" } },
          },
        },
      ]);
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100);
      }, 300);
    };

    fetchData();
  }, []);

  // Group food exchanges by food group
  const groupedFoodExchanges = foodExchanges.reduce((acc, exchange) => {
    const groupName =
      exchange.FoodItem?.FoodFlag?.FoodGroup?.Name || "ไม่ระบุหมวดหมู่";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(exchange);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      {isLoading ? (
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
      ) : (
        <div className="font-kanit min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Compact Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 via-blue-600/90 to-purple-700/90"></div>

            {/* Smaller Floating Elements */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-16 right-12 w-10 h-10 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-12 left-1/4 w-8 h-8 bg-white/10 rounded-full animate-pulse delay-500"></div>

            <div className="relative p-6 md:p-10 flex items-center justify-center text-white">
              <div className="text-center max-w-3xl">
                <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                  รายการอาหารแลกเปลี่ยน
                </h1>
                <p className="text-blue-100 text-lg md:text-xl opacity-90 animate-in fade-in slide-in-from-top-8 duration-1000 delay-300 mb-3">
                  1 ส่วน เท่ากับ เท่าไร?
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-white/50 to-transparent mx-auto rounded animate-in fade-in duration-1000 delay-500"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Info Banner */}
          <div
            className={`
              p-4 md:p-6
              ${
                isVisible
                  ? "animate-in slide-in-from-bottom-4 fade-in duration-700"
                  : "opacity-0"
              }
            `}
          >
            <div className="max-w-5xl mx-auto mb-6">
              <div className="group relative overflow-hidden bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/30 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/90">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full transform -translate-x-10 translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative">
                  <div className="flex items-center mb-4">
                    <div className="w-1 h-10 bg-gradient-to-b from-emerald-500 to-blue-600 rounded-full mr-4 group-hover:h-12 transition-all duration-300"></div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center group-hover:text-emerald-700 transition-colors duration-300">
                      <span className="mr-3 text-2xl group-hover:scale-110 transition-transform duration-300">💡</span>
                      เกี่ยวกับอาหารแลกเปลี่ยน
                    </h2>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed group-hover:text-gray-800 transition-colors duration-300">
                    ระบบอาหารแลกเปลี่ยนช่วยให้คุณสามารถวางแผนการรับประทานอาหารได้อย่างสมดุล
                    โดยแต่ละหมวดหมู่อาหารจะมีปริมาณและหน่วยที่เหมาะสมสำหรับ 1
                    ส่วนแลกเปลี่ยน
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Food Groups */}
            <div className="max-w-5xl mx-auto space-y-8">
              {Object.entries(groupedFoodExchanges).map(
                ([groupName, exchanges], groupIndex) => (
                  <div
                    key={groupName}
                    className={`
                      group relative
                      ${
                        isVisible
                          ? "animate-in slide-in-from-bottom-8 fade-in duration-700"
                          : "opacity-0"
                      }
                    `}
                    style={{ animationDelay: `${200 + groupIndex * 200}ms` }}
                  >
                    <div className="relative overflow-hidden bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/30 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-white/90">
                      {/* Decorative background elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-purple-400/5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-400/5 to-blue-400/5 rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>

                      {/* Enhanced Group Header */}
                      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 overflow-hidden group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mr-4 backdrop-blur-sm group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300 shadow-lg">
                              🍽️
                            </div>
                            <div>
                              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-blue-100 transition-colors duration-300">
                                หมวดหมู่ {groupName}
                              </h2>
                              <p className="text-white/90 text-base md:text-lg group-hover:text-white transition-colors duration-300">
                                {groupName} 1 ส่วน เท่ากับ
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Food Items Grid */}
                      <div className="p-6 md:p-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                          {exchanges.map((exchange, index) => (
                            <div
                              key={exchange.ID}
                              onClick={() => setSelectedItem(exchange)}
                              className={`
                                group/item relative overflow-hidden cursor-pointer
                                bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 
                                hover:border-blue-300/50 hover:shadow-2xl hover:bg-white/90
                                transform transition-all duration-500 hover:scale-110 hover:-translate-y-2
                                ${
                                  isVisible
                                    ? "animate-in slide-in-from-bottom-4 fade-in"
                                    : "opacity-0"
                                }
                              `}
                              style={{
                                animationDelay: `${
                                  400 + groupIndex * 200 + index * 50
                                }ms`,
                              }}
                            >
                              {/* Enhanced decorative elements */}
                              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full transform translate-x-8 -translate-y-8 group-hover/item:scale-150 group-hover/item:opacity-20 transition-all duration-700"></div>
                              <div className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full transform -translate-x-6 translate-y-6 group-hover/item:scale-150 group-hover/item:opacity-20 transition-all duration-700"></div>

                              {/* Enhanced Food Image */}
                              {exchange.FoodItem?.Image && (
                                <div className="relative h-24 overflow-hidden rounded-t-2xl">
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-10"></div>
                                  <img
                                    src={exchange.FoodItem.Image}
                                    alt={exchange.FoodItem.Name || "อาหาร"}
                                    className="w-full h-full object-cover group-hover/item:scale-125 transition-transform duration-700"
                                    onError={(e) => {
                                      const target =
                                        e.target as HTMLImageElement;
                                      target.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgNDAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iODAiIGZpbGw9IiNGM0Y0RjYiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSI0MCIgcj0iMjAiIGZpbGw9IiNENUQ3REEiLz48L3N2Zz4=";
                                    }}
                                  />
                                </div>
                              )}

                              {/* Enhanced Food Details */}
                              <div className="relative p-4">
                                <div className="text-center mb-4">
                                  <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover/item:text-blue-700 transition-colors duration-300 line-clamp-2">
                                    {exchange.FoodItem?.Name || "ไม่ระบุชื่อ"}
                                  </h3>
                                </div>

                                {/* Enhanced Amount Display */}
                                <div className="relative">
                                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-2 text-center border border-blue-200/50 group-hover/item:from-blue-100 group-hover/item:to-indigo-200 group-hover/item:border-blue-300 group-hover/item:shadow-lg transition-all duration-500">
                                    <div className="flex items-baseline justify-center space-x-1">
                                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover/item:from-blue-700 group-hover/item:to-purple-700 transition-all duration-300">
                                        {exchange.Amount || "1"}
                                      </span>
                                      <span className="text-sm text-gray-600 font-semibold group-hover/item:text-gray-800 transition-colors duration-300">
                                        {exchange.Unit || "ส่วน"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Enhanced Decorative Elements */}
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all duration-300 shadow-lg"></div>
                                  <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-60 group-hover/item:opacity-100 group-hover/item:scale-125 transition-all duration-300 shadow-lg"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Enhanced Empty State */}
            {Object.keys(groupedFoodExchanges).length === 0 && (
              <div
                className={`
                  max-w-3xl mx-auto text-center py-12
                  ${
                    isVisible
                      ? "animate-in slide-in-from-bottom-8 fade-in duration-700"
                      : "opacity-0"
                  }
                `}
              >
                <div className="group relative overflow-hidden bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:bg-white/90">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-400/5 to-gray-500/5 rounded-full transform translate-x-12 -translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-br from-gray-300/5 to-gray-400/5 rounded-full transform -translate-x-10 translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300">
                      <span className="text-5xl opacity-60 group-hover:opacity-80 transition-opacity duration-300">🍽️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                      ไม่มีข้อมูลอาหารแลกเปลี่ยน
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      กรุณาเพิ่มข้อมูลอาหารแลกเปลี่ยนเพื่อแสดงผลในหน้านี้
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Info Section */}
            <div
              className={`
                max-w-5xl mx-auto mt-8 mb-6
                ${
                  isVisible
                    ? "animate-in slide-in-from-bottom-8 fade-in duration-700 delay-1000"
                    : "opacity-0"
                }
              `}
            >
              <div className="group relative overflow-hidden bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-gradient-to-br hover:from-white/90 hover:to-blue-50/90">
                {/* Enhanced decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/5 to-indigo-400/5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-400/5 to-pink-400/5 rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative text-center">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-blue-600 mr-4 shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-300">
                      <span className="text-3xl group-hover:scale-110 transition-transform duration-300">📊</span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                      วิธีใช้ระบบแลกเปลี่ยน
                    </h4>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="group/card relative overflow-hidden bg-white/60 rounded-2xl p-6 border border-blue-200/50 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:bg-white/80 hover:border-blue-300">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/5 to-blue-500/5 rounded-full transform translate-x-8 -translate-y-8 group-hover/card:scale-150 transition-transform duration-700"></div>
                      <div className="relative">
                        <div className="text-3xl mb-3 group-hover/card:scale-110 transition-transform duration-300">🎯</div>
                        <h5 className="font-bold text-gray-800 mb-2 text-lg group-hover/card:text-blue-700 transition-colors duration-300">
                          เลือกอาหาร
                        </h5>
                        <p className="text-gray-600 text-sm group-hover/card:text-gray-700 transition-colors duration-300">
                          เลือกอาหารจากหมวดหมู่เดียวกันเพื่อแลกเปลี่ยน
                        </p>
                      </div>
                    </div>

                    <div className="group/card relative overflow-hidden bg-white/60 rounded-2xl p-6 border border-green-200/50 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:bg-white/80 hover:border-green-300">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-400/5 to-green-500/5 rounded-full transform translate-x-8 -translate-y-8 group-hover/card:scale-150 transition-transform duration-700"></div>
                      <div className="relative">
                        <div className="text-3xl mb-3 group-hover/card:scale-110 transition-transform duration-300">⚖️</div>
                        <h5 className="font-bold text-gray-800 mb-2 text-lg group-hover/card:text-green-700 transition-colors duration-300">
                          ชั่งปริมาณ
                        </h5>
                        <p className="text-gray-600 text-sm group-hover/card:text-gray-700 transition-colors duration-300">
                          ใช้ปริมาณที่แสดงเป็น 1 ส่วนแลกเปลี่ยน
                        </p>
                      </div>
                    </div>

                    <div className="group/card relative overflow-hidden bg-white/60 rounded-2xl p-6 border border-purple-200/50 transition-all duration-500 hover:shadow-xl hover:scale-105 hover:bg-white/80 hover:border-purple-300">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-400/5 to-purple-500/5 rounded-full transform translate-x-8 -translate-y-8 group-hover/card:scale-150 transition-transform duration-700"></div>
                      <div className="relative">
                        <div className="text-3xl mb-3 group-hover/card:scale-110 transition-transform duration-300">🎉</div>
                        <h5 className="font-bold text-gray-800 mb-2 text-lg group-hover/card:text-purple-700 transition-colors duration-300">
                          สนุกกับการทาน
                        </h5>
                        <p className="text-gray-600 text-sm group-hover/card:text-gray-700 transition-colors duration-300">
                          เพลิดเพลินกับอาหารที่หลากหลายและมีประโยชน์
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FoodPopup
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      )}
    </>
  );
};

export default FoodExchanges;