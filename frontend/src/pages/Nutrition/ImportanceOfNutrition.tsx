import { useEffect, useState } from "react";
import { IoFishOutline } from "react-icons/io5";
import { LuApple, LuDroplets } from "react-icons/lu";
import { PiBreadDuotone } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { getValidRule } from "../../services/https/ruleUtils";

const data = [
  {
    linkto: "ข้าว/แป้ง",
    title: "คาร์โบไฮเดรต",
    icon: <PiBreadDuotone size={32} />,
    duty: "พลังงานหลัก",
    source: "ข้าว แป้ง",
    insufficient: "ไม่มีแรงสลายกล้ามเนื้อมาเป็นพลังงาน",
    minerals: "ทั้งฟอสฟอรัส โพแทสเซียม และโซเดียม",
    gradient: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-50/80 to-orange-50/80",
    borderColor: "border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    linkto: "ผลไม้",
    title: "เกลือแร่ วิตามิน",
    icon: <LuApple size={32} />,
    duty: "ร่างกายทำงานปกติ มีใยอาหารช่วยในการขับถ่าย",
    source: "ผัก ผลไม้",
    insufficient: "ท้องผูก เกลือแร่ต่ำ",
    minerals: "โพแทสเซียม โซเดียม",
    gradient: "from-green-400 to-emerald-500",
    bgGradient: "from-green-50/80 to-emerald-50/80",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
  },
  {
    linkto: "เนื้อสัตว์",
    title: "โปรตีน",
    icon: <IoFishOutline size={32} />,
    duty: "ซ่อมแซมเสริมสร้าง ส่วนที่สึกหรอ",
    source: "นม เนื้อสัวต์ต่างๆ ไข่ ถั่ว",
    insufficient: "เจ็บป่วยง่าย ฟื้นไข้ช้า กล้ามเนื้อฟ่อ",
    minerals: "ฟอสฟอรัส โซเดียม",
    gradient: "from-red-400 to-pink-500",
    bgGradient: "from-red-50/80 to-pink-50/80",
    borderColor: "border-red-200",
    iconColor: "text-red-600",
  },
  {
    linkto: "ไขมัน",
    title: "พลังงาน",
    icon: <LuDroplets size={32} />,
    duty: "ร่างกายทำงานปกติ",
    source: "น้ำมัน น้ำตาล เกลือซีอิ๊ว น้ำปลา",
    insufficient: "ร่างกายผิดปกติ อ่อนเพลีย มักเกินมากกว่าขาด",
    minerals: "โซเดียม โพแทสเซียม",
    gradient: "from-purple-400 to-indigo-500",
    bgGradient: "from-purple-50/80 to-indigo-50/80",
    borderColor: "border-purple-200",
    iconColor: "text-purple-600",
  },
];

const ImportanceOfNutrition = () => {
  const [isLoading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [ruleNum, setRuleNum] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ruleNum = getValidRule();
    if (!ruleNum) {
      navigate("/nutrition");
      return;
    }

    setRuleNum(ruleNum);

    setTimeout(() => {
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }, 400);
  }, []);

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
        <div className="min-h-screen font-kanit bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>

            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>

            <div className="relative p-8 md:p-12 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 animate-in zoom-in duration-1000">
                  <FireOutlined className="text-3xl text-white" />
                </div>
                <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
                  ความสำคัญของโภชนาการ
                </h1>
                <p className="text-blue-100 text-lg md:text-xl opacity-90 animate-in fade-in slide-in-from-top-8 duration-1000 delay-300">
                  เข้าใจสารอาหารที่ร่างกายต้องการ
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              {/* Introduction Card */}
              <div
                className={`
                mb-12 ${
                  isVisible
                    ? "animate-in slide-in-from-bottom-4 fade-in duration-700"
                    : "opacity-0"
                }
              `}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-xl border border-white/30">
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                      4 หมวดสารอาหารหลัก
                    </h2>
                    <p className="text-gray-600 text-lg">
                      แต่ละสารอาหารมีบทบาทสำคัญต่อร่างกาย
                      คลิกเพื่อดูอาหารที่แนะนำ
                    </p>
                  </div>
                </div>
              </div>

              {/* Nutrition Cards Grid */}
              <div className="space-y-6">
                {data.map((item, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      navigate("/choose-avoid", {
                        state: { scrollTo: item.linkto },
                      })
                    }
                    className={`
                      group cursor-pointer transform transition-all duration-500
                      hover:scale-[1.02] hover:shadow-2xl
                      ${
                        isVisible
                          ? "animate-in slide-in-from-bottom-8 fade-in duration-700"
                          : "opacity-0"
                      }
                    `}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div
                      className={`
                      relative overflow-hidden rounded-3xl p-6 md:p-8
                      bg-gradient-to-br ${item.bgGradient} backdrop-blur-md
                      border ${item.borderColor} shadow-xl
                      group-hover:shadow-2xl transition-all duration-500
                    `}
                    >
                      {/* Decorative background elements */}
                      <div
                        className={`
                        absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient}
                        rounded-full opacity-10 transform translate-x-16 -translate-y-16
                      `}
                      ></div>
                      <div
                        className={`
                        absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${item.gradient}
                        rounded-full opacity-10 transform -translate-x-12 translate-y-12
                      `}
                      ></div>

                      <div className="relative flex items-start gap-6">
                        {/* Icon Section */}
                        <div
                          className={`
                          flex-shrink-0 w-20 h-20 rounded-2xl
                          bg-gradient-to-br ${item.gradient} shadow-lg
                          flex items-center justify-center text-white
                          transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                        `}
                        >
                          {item.icon}
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                              {item.title}
                            </h3>
                            <div className="flex items-center text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                              <span className="text-sm font-medium mr-2 hidden sm:inline">
                                ดูอาหารแนะนำ
                              </span>
                              <ArrowRightOutlined className="transform group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                          </div>

                          {/* Info Cards */}
                          <div className="space-y-3">
                            <div className="bg-white/60 rounded-2xl p-4 border border-white/50">
                              <div className="flex items-start gap-3">
                                <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-gray-700 mb-1">
                                    หน้าที่
                                  </div>
                                  <div className="text-gray-600">
                                    {item.duty}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="bg-white/60 rounded-2xl p-4 border border-white/50">
                                <div className="font-semibold text-gray-700 mb-2 flex items-center">
                                  <div
                                    className={`w-2 h-2 rounded-full ${item.iconColor.replace(
                                      "text-",
                                      "bg-"
                                    )} mr-2`}
                                  ></div>
                                  แหล่งอาหาร
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {item.source}
                                </div>
                              </div>

                              <div className="bg-white/60 rounded-2xl p-4 border border-white/50">
                                <div className="font-semibold text-gray-700 mb-2 flex items-center">
                                  <div className="w-2 h-2 rounded-full bg-blue-400 mr-2"></div>
                                  เกลือแร่ที่มีมาก
                                </div>
                                <div className="text-gray-600 text-sm">
                                  {item.minerals}
                                </div>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-4 border border-red-200">
                              <div className="flex items-start gap-3">
                                <ExclamationCircleOutlined className="text-red-500 mt-1 flex-shrink-0" />
                                <div>
                                  <div className="font-semibold text-red-700 mb-1">
                                    หากทานไม่เพียงพอ
                                  </div>
                                  <div className="text-red-600 text-sm">
                                    {item.insufficient}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Effects */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nutritional Deficiency Warning Section */}
              {ruleNum! > 0 && (ruleNum! < 17 || ruleNum! > 22) && (
                <div
                  className={`
                mt-12 transition-all duration-700
                ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }
              `}
                  style={{ transitionDelay: "500ms" }}
                >
                  <div className="bg-gradient-to-r from-orange-50/90 to-red-50/90 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-orange-200/50 shadow-xl">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <div className="text-2xl text-white">⚠</div>
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                          สัญญาณบอกเหตุ ภาวะขาดสารอาหารใน
                          ผู้ป่วยฟอกเลือดด้วยเครื่องไตเทียม
                        </h3>
                        <p className="text-gray-600">
                          สัญญาณของร่างกายอะไรบ้าง ที่เป็นสัญญาณที่มักพบใน
                          กลุ่มผู้ป่วยฟอกเลือดด้วยเครื่องไตเทียมที่มีภาวะขาดสารอาหาร
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/70 rounded-2xl p-6 mb-6 border border-orange-200/50">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                        <div className="text-orange-500 mr-3 text-xl">👤</div>
                        วิธีการประเมิน ภาวะขาดสารอาหารเบื้องต้น
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            1
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-800 font-medium">
                              เบื่ออาหาร รับประทานอาหารน้อยกว่า ที่เคยทานได้
                            </div>
                            <div className="text-gray-600 text-sm mt-1">
                              ติดต่อกันนานมากกว่า 7 วัน
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            2
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-800 font-medium">
                              น้ำหนักตัวลดลงโดยไม่ได้ตั้งใจ
                            </div>
                            <div className="text-gray-600 text-sm mt-1">
                              &gt;5% ในช่วง 3 เดือนที่ผ่านมา
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            3
                          </div>
                          <div className="flex-1">
                            <div className="text-gray-800 font-medium">
                              ดัชนีมวลกาย (BMI)
                            </div>
                            <div className="text-gray-600 text-sm mt-1">
                              &lt; 18.5 กก./ตร.ม.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-red-100/80 to-pink-100/80 rounded-2xl p-5 border border-red-200">
                      <div className="flex items-start gap-3">
                        <div className="text-red-500 text-xl mt-1 flex-shrink-0">
                          ❗
                        </div>
                        <div>
                          <div className="font-bold text-red-800 mb-2">
                            หากคุณเริ่มมีสัญญาณของภาวะขาดสารอาหาร
                          </div>
                          <div className="text-red-700">
                            ให้รีบปรึกษาแพทย์หรือบุคลากรทางการแพทย์
                            เพื่อรับคำแนะนำและรับการรักษาต่อไป
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div
                className={`
                mt-12 text-center
                ${
                  isVisible
                    ? "animate-in slide-in-from-bottom-8 fade-in duration-700 delay-700"
                    : "opacity-0"
                }
              `}
              >
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-8 border border-blue-200/50">
                  <div className="text-2xl font-bold text-gray-800 mb-4">
                    แล้วมีอาหารอะไรบ้างที่ควรกิน แล้วก็ไม่ควรกิน?
                  </div>
                  <p className="text-gray-600 mb-6">
                    อยากรู้ว่าอะไรควรกินหรือหลีกเลี่ยง?
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-blue-600">
                    <span>👆</span>
                    <span className="font-medium">
                      คลิก "ดูอาหารแนะนำ" ในแต่ละหมวดด้านบนได้เลย!
                    </span>
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

export default ImportanceOfNutrition;
