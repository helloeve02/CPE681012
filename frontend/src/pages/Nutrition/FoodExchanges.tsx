import { useEffect, useState } from "react";
import { GetAllFoodExchanges } from "../../services/https";
import { Spin } from "antd";
import type { FoodExchangeInterface } from "../../interfaces/FoodExchange";

const FoodExchanges = () => {
  const [isLoading, setLoading] = useState(true);
  const [foodExchanges, setFoodExchanges] = useState<FoodExchangeInterface[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
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
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 100)
      }, 300);
    };

    fetchData();
  }, []);

  // Group food exchanges by food group
  const groupedFoodExchanges = foodExchanges.reduce((acc, exchange) => {
    const groupName = exchange.FoodItem?.FoodFlag?.FoodGroup?.Name || "ไม่ระบุหมวดหมู่";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(exchange);
    return acc;
  }, {} as Record<string, any[]>);

 return (
    <>
      {isLoading ? (
        <div className="font-kanit fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4 text-lg font-medium text-gray-600 animate-pulse">
              กำลังโหลดข้อมูลอาหารแลกเปลี่ยน...
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

          {/* Compact Info Banner */}
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
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 md:p-6 shadow-lg border border-white/30">
                <div className="flex items-center mb-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-blue-600 rounded-full mr-3"></div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2 text-lg">💡</span>
                    เกี่ยวกับอาหารแลกเปลี่ยน
                  </h2>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  ระบบอาหารแลกเปลี่ยนช่วยให้คุณสามารถวางแผนการรับประทานอาหารได้อย่างสมดุล 
                  โดยแต่ละหมวดหมู่อาหารจะมีปริมาณและหน่วยที่เหมาะสมสำหรับ 1 ส่วนแลกเปลี่ยน
                </p>
              </div>
            </div>

            {/* Compact Food Groups */}
            <div className="max-w-5xl mx-auto space-y-8">
              {Object.entries(groupedFoodExchanges).map(([groupName, exchanges], groupIndex) => (
                <div 
                  key={groupName}
                  className={`
                    ${
                      isVisible
                        ? "animate-in slide-in-from-bottom-8 fade-in duration-700"
                        : "opacity-0"
                    }
                  `}
                  style={{ animationDelay: `${200 + groupIndex * 200}ms` }}
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 overflow-hidden">
                    {/* Compact Group Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:p-5 relative overflow-hidden">
                      <div className="relative z-10">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-lg mr-3 backdrop-blur-sm">
                            🍽️
                          </div>
                          <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                              หมวดหมู่ {groupName}
                            </h2>
                            <p className="text-white/90 text-sm md:text-base">
                              {groupName} 1 ส่วน เท่ากับ
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Compact Food Items Grid */}
                    <div className="p-4 md:p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                        {exchanges.map((exchange, index) => (
                          <div 
                            key={exchange.ID}
                            className={`
                              group bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 
                              hover:border-blue-300/50 hover:shadow-lg hover:bg-white/80
                              transform transition-all duration-300 hover:scale-102 overflow-hidden
                              ${
                                isVisible
                                  ? "animate-in slide-in-from-bottom-4 fade-in"
                                  : "opacity-0"
                              }
                            `}
                            style={{ animationDelay: `${400 + groupIndex * 200 + index * 50}ms` }}
                          >
                            {/* Compact Food Image */}
                            {exchange.FoodItem?.Image && (
                              <div className="relative h-20 overflow-hidden">
                                <img
                                  src={exchange.FoodItem.Image}
                                  alt={exchange.FoodItem.Name || "อาหาร"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjgwIiB2aWV3Qm94PSIwIDAgNDAwIDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iODAiIGZpbGw9IiNGM0Y0RjYiLz48Y2lyY2xlIGN4PSIyMDAiIGN5PSI0MCIgcj0iMjAiIGZpbGw9IiNENUQ3REEiLz48L3N2Zz4=";
                                  }}
                                />
                              </div>
                            )}

                            {/* Compact Food Details */}
                            <div className="p-3">
                              <div className="text-center mb-3">
                                <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                                  {exchange.FoodItem?.Name || "ไม่ระบุชื่อ"}
                                </h3>
                              </div>

                              {/* Compact Amount Display */}
                              <div className="relative">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-3 text-center border border-blue-200/50 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300">
                                  <div className="flex items-baseline justify-center space-x-1">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                      {exchange.Amount || "1"}
                                    </span>
                                    <span className="text-sm text-gray-600 font-semibold">
                                      {exchange.Unit || "ส่วน"}
                                    </span>
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500 font-medium">
                                    = 1 ส่วนแลกเปลี่ยน
                                  </div>
                                </div>
                                
                                {/* Smaller Decorative Elements */}
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>

                              {/* Compact Credit Link */}
                              {exchange.FoodItem?.Credit && (
                                <div className="mt-2 text-center">
                                  <a
                                    href={exchange.FoodItem.Credit}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition-all duration-200 font-medium"
                                  >
                                    เครดิตรูปภาพ
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Compact Empty State */}
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
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/30">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                    <span className="text-4xl opacity-60">🍽️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-3">
                    ไม่มีข้อมูลอาหารแลกเปลี่ยน
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    กรุณาเพิ่มข้อมูลอาหารแลกเปลี่ยนเพื่อแสดงผลในหน้านี้
                  </p>
                </div>
              </div>
            )}

            {/* Compact Info Section */}
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
              <div className="bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/30">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600 mr-3 shadow-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">
                      วิธีใช้ระบบแลกเปลี่ยน
                    </h4>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    <div className="bg-white/60 rounded-xl p-4 border border-blue-200/50">
                      <div className="text-2xl mb-2">🎯</div>
                      <h5 className="font-bold text-gray-800 mb-1 text-sm">เลือกอาหาร</h5>
                      <p className="text-gray-600 text-xs">เลือกอาหารจากหมวดหมู่เดียวกันเพื่อแลกเปลี่ยน</p>
                    </div>
                    
                    <div className="bg-white/60 rounded-xl p-4 border border-green-200/50">
                      <div className="text-2xl mb-2">⚖️</div>
                      <h5 className="font-bold text-gray-800 mb-1 text-sm">ชั่งปริมาณ</h5>
                      <p className="text-gray-600 text-xs">ใช้ปริมาณที่แสดงเป็น 1 ส่วนแลกเปลี่ยน</p>
                    </div>
                    
                    <div className="bg-white/60 rounded-xl p-4 border border-purple-200/50">
                      <div className="text-2xl mb-2">🎉</div>
                      <h5 className="font-bold text-gray-800 mb-1 text-sm">สนุกกับการทาน</h5>
                      <p className="text-gray-600 text-xs">เพลิดเพลินกับอาหารที่หลากหลายและมีประโยชน์</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodExchanges;