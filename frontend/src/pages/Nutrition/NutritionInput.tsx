import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Radio, Select, Tooltip } from "antd";
import { GetAllDisease, FindRuleByUserInfo } from "../../services/https";
import type { DiseasesInterface } from "../../interfaces/Disease";
import {
  InfoCircleOutlined,
  UserOutlined,
  CalendarOutlined,
  LineChartOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  CheckCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";

const NutritionInput = () => {
  const [disease, setDisease] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);
  const [gender, setGender] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [diseaseStage, setDiseaseStage] = useState<string | null>(null);
  const [diseases, setDiseases] = useState<DiseasesInterface[]>([]);

  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (
      age === null ||
      height === null ||
      gender === null ||
      disease === null
    ) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (age < 15) {
      alert("อายุต้องไม่ต่ำกว่า 15 ปี");
      return;
    }

    if (height < 100 || height > 999) {
      alert("ส่วนสูงต้องเป็นตัวเลข 3 หลัก (เช่น 150 ซม.)");
      return;
    }

    if (disease === 2 && !diseaseStage) {
      alert("กรุณาเลือกระยะของโรคไต");
      return;
    }

    const userData = {
      age,
      height,
      gender,
      disease_stage: disease === 2 && diseaseStage ? diseaseStage : "-",
    };

    try {
      const rule = await FindRuleByUserInfo(userData);
      console.log(userData);
      if (rule?.data) {
        const now = Date.now();
        const expiresAt = now + 2 * 60 * 60 * 1000; // 2 hours from now

        const ruleWithExpiry = {
          rule: rule.data,
          expiresAt,
        };

        localStorage.setItem("rule", JSON.stringify(ruleWithExpiry));
        navigate("/nutrition-suggestion");
      } else {
        alert("ไม่สามารถดึงข้อมูลคำแนะนำได้");
      }
    } catch (error) {
      console.error("Error getting rule:", error);
      alert(error);
    }
  };

  const getAllDisease = async () => {
    try {
      const res = await GetAllDisease();
      if (Array.isArray(res?.data?.diseases)) {
        setDiseases(res.data.diseases);
      } else {
        console.log("Failed to load disease stage.");
      }
    } catch (error) {
      console.log("Error fetching disease stage. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllDisease();

      // Enhanced loading sequence
      setTimeout(() => {
        setLoading(false);
      }, 100);

      // Staggered animation sequence
      setTimeout(() => {
        setAnimationStage(1); // Header animation
      }, 600);

      setTimeout(() => {
        setAnimationStage(2); // Form container animation
      }, 800);

      setTimeout(() => {
        setAnimationStage(3); // Form fields animation
      }, 1000);

      setTimeout(() => {
        setAnimationStage(4); // Info card and button animation
      }, 1400);

      console.log(React);
    };

    fetchData();
  }, []);

  const kidneyStages = diseases
    .filter((item) => item.Name?.toLowerCase() === "โรคไต")
    .map((item) => ({
      value: item.Stage,
      label: item.Stage,
    }));

  const isFormValid =
    age !== null &&
    height !== null &&
    gender !== null &&
    disease !== null &&
    (disease !== 2 || diseaseStage !== null);

  // Animation classes
  const fadeInUp = "animate-[fadeInUp_0.8s_ease-out_forwards]";
  const fadeInLeft = "animate-[fadeInLeft_0.6s_ease-out_forwards]";
  const fadeInRight = "animate-[fadeInRight_0.6s_ease-out_forwards]";
  const fadeInScale = "animate-[fadeInScale_0.6s_ease-out_forwards]";
  console.log(fadeInUp, fadeInRight);
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .animate-bounce-custom {
          animation: bounce 2s infinite;
        }
      `}</style>

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
                <span className="text-xl font-semibold text-gray-800">
                  กำลังโหลดข้อมูล...
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="font-kanit min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Enhanced Header with staggered animation */}
          <div
            className={`
              relative overflow-hidden opacity-0
              ${animationStage >= 1 ? fadeInLeft : ""}
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
              <div className="absolute top-32 right-16 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
              <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full animate-pulse delay-2000"></div>
            </div>

            <div className="relative p-8 md:p-12 flex items-center justify-center text-white">
              <div className="text-center max-w-4xl">
                <div
                  className={`
                    mb-6 opacity-0
                    ${
                      animationStage >= 1
                        ? "animate-[fadeInScale_1s_ease-out_0.3s_forwards]"
                        : ""
                    }
                  `}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4 animate-bounce-custom">
                    <HeartOutlined className="text-4xl" />
                  </div>
                </div>
                <h1
                  className={`
                    font-bold text-3xl md:text-5xl lg:text-6xl mb-4 opacity-0
                    ${
                      animationStage >= 1
                        ? "animate-[fadeInUp_1s_ease-out_0.5s_forwards]"
                        : ""
                    }
                  `}
                >
                  โภชนาการที่เหมาะกับคุณ
                </h1>
                <p
                  className={`
                    text-blue-100 text-lg md:text-xl opacity-0 max-w-2xl mx-auto
                    ${
                      animationStage >= 1
                        ? "animate-[fadeInUp_1s_ease-out_0.7s_forwards]"
                        : ""
                    }
                  `}
                >
                  โปรดกรอกข้อมูลส่วนตัวเพื่อรับคำแนะนำโภชนาการที่เหมาะสมกับสถานะสุขภาพของคุณ
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Input Form */}
          <div className="p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
              <div
                className={`
                  bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/30 opacity-0
                  ${animationStage >= 2 ? fadeInScale : ""}
                `}
              >
                {/* Header Section */}
                <div
                  className={`
                    flex items-center mb-8 opacity-0
                    ${
                      animationStage >= 2
                        ? "animate-[fadeInLeft_0.8s_ease-out_0.2s_forwards]"
                        : ""
                    }
                  `}
                >
                  <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-4"></div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
                      <InfoCircleOutlined className="mr-3 text-blue-600" />
                      บอกเราเกี่ยวกับคุณ
                    </h2>
                    <p className="text-gray-600 mt-2">
                      กรอกข้อมูลพื้นฐานเพื่อรับคำแนะนำที่แม่นยำ
                    </p>
                  </div>
                </div>

                {/* Form Fields with enhanced staggered animation */}
                <div className="grid gap-8 md:grid-cols-2">
                  {/* เพศ */}
                  <div
                    className={`
                      opacity-0
                      ${
                        animationStage >= 3
                          ? "animate-[fadeInLeft_0.6s_ease-out_0.1s_forwards]"
                          : ""
                      }
                    `}
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 transition-all duration-300 hover:shadow-lg hover:scale-105">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600 mr-3">
                          <UserOutlined />
                        </div>
                        <label className="font-semibold text-gray-800 text-lg">
                          เพศ
                        </label>
                      </div>
                      <Select
                        showSearch
                        placeholder="เลือกเพศ"
                        optionFilterProp="label"
                        value={gender ?? undefined}
                        onChange={setGender}
                        options={[
                          { value: "male", label: "👨 ชาย" },
                          { value: "female", label: "👩 หญิง" },
                        ]}
                        className="!font-kanit w-full"
                        dropdownClassName="!font-kanit"
                        size="large"
                      />
                    </div>
                  </div>

                  {/* อายุ */}
                  <div
                    className={`
                      opacity-0
                      ${
                        animationStage >= 3
                          ? "animate-[fadeInRight_0.6s_ease-out_0.2s_forwards]"
                          : ""
                      }
                    `}
                  >
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 transition-all duration-300 hover:shadow-lg hover:scale-105">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-green-600 mr-3">
                          <CalendarOutlined />
                        </div>
                        <label className="font-semibold text-gray-800 text-lg">
                          อายุ
                        </label>
                      </div>
                      <Input
                        value={age ?? ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setAge(value >= 0 ? value : null);
                        }}
                        type="number"
                        placeholder="กรอกอายุ (ปี)"
                        className="!font-kanit"
                        size="large"
                        suffix="ปี"
                        min={15}
                      />
                      {age !== null && age < 15 && (
                        <p className="text-red-500 mt-2 text-sm">
                          อายุต้องไม่ต่ำกว่า 15 ปี
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ส่วนสูง */}
                  <div
                    className={`
                      opacity-0
                      ${
                        animationStage >= 3
                          ? "animate-[fadeInLeft_0.6s_ease-out_0.3s_forwards]"
                          : ""
                      }
                    `}
                  >
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 transition-all duration-300 hover:shadow-lg hover:scale-105">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-purple-600 mr-3">
                          <LineChartOutlined />
                        </div>
                        <label className="font-semibold text-gray-800 text-lg">
                          ส่วนสูง
                        </label>
                      </div>
                      <Input
                        value={height ?? ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          setHeight(value >= 0 ? value : null);
                        }}
                        type="number"
                        placeholder="กรอกส่วนสูง (ซม.)"
                        className="!font-kanit"
                        size="large"
                        suffix="ซม."
                        min={100}
                        max={999}
                      />
                      {height !== null && (height < 100 || height > 999) && (
                        <p className="text-red-500 mt-2 text-sm">
                          ส่วนสูงต้องเป็นตัวเลข 3 หลัก (เช่น 150 ซม.)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* โรค */}
                  <div
                    className={`
                      opacity-0
                      ${
                        animationStage >= 3
                          ? "animate-[fadeInRight_0.6s_ease-out_0.4s_forwards]"
                          : ""
                      }
                    `}
                  >
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200 transition-all duration-300 hover:shadow-lg hover:scale-105">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center text-orange-600 mr-3">
                          <MedicineBoxOutlined />
                        </div>
                        <label className="font-semibold text-gray-800 text-lg">
                          โรคของคุณ
                        </label>
                      </div>

                      <Radio.Group
                        onChange={(e) => {
                          setDisease(e.target.value);
                          if (e.target.value !== 2) {
                            setDiseaseStage(null);
                          }
                        }}
                        value={disease}
                        className="w-full"
                      >
                        <div className="space-y-3">
                          <div
                            onClick={() => setDisease(1)}
                            className="cursor-pointer bg-white/60 rounded-xl p-4 border border-orange-200 transition-all duration-200 hover:bg-white/80"
                          >
                            <Radio
                              value={1}
                              className="!font-kanit text-gray-700 text-base"
                            >
                              🩺 เบาหวาน
                            </Radio>
                          </div>
                          <div
                            onClick={() => setDisease(2)}
                            className="cursor-pointer bg-white/60 rounded-xl p-4 border border-orange-200 transition-all duration-200 hover:bg-white/80"
                          >
                            <Radio
                              value={2}
                              className="!font-kanit text-gray-700 text-base"
                            >
                              🫘 โรคไต
                            </Radio>
                          </div>
                        </div>
                      </Radio.Group>
                    </div>
                  </div>
                </div>

                {/* Kidney Stage Selection */}
                {disease === 2 && (
                  <div
                    className={`
                      mt-8 opacity-0
                      ${
                        animationStage >= 3
                          ? "animate-[fadeInUp_0.6s_ease-out_0.5s_forwards]"
                          : ""
                      }
                    `}
                  >
                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-200 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center text-teal-600 mr-3">
                          <LineChartOutlined />
                        </div>
                        <label className="font-semibold text-gray-800 text-lg">
                          ระยะของโรคไต
                        </label>
                      </div>
                      <Select
                        showSearch
                        placeholder="เลือกระยะของโรคไต"
                        optionFilterProp="label"
                        value={diseaseStage ?? undefined}
                        onChange={(value) => setDiseaseStage(value)}
                        options={kidneyStages.map((stage) => ({
                          ...stage,
                          label: `📊 ${stage.label}`,
                        }))}
                        className="!font-kanit w-full"
                        dropdownClassName="!font-kanit"
                        size="large"
                      />
                    </div>
                  </div>
                )}

                {/* Information Card */}
                <div
                  className={`
                    mt-8 opacity-0
                    ${
                      animationStage >= 4
                        ? "animate-[fadeInUp_0.6s_ease-out_0.1s_forwards]"
                        : ""
                    }
                  `}
                >
                  <div className="bg-gradient-to-br from-gray-50/80 to-white/80 rounded-2xl p-6 border border-gray-200/50">
                    <div className="flex items-start">
                      <InfoCircleOutlined className="text-blue-500 text-xl mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          ข้อมูลสำคัญ
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          ข้อมูลที่ท่านกรอกจะถูกใช้ในการคำนวณค่า IBW (Ideal Body
                          Weight)
                          และเลือกแผนโภชนาการที่เหมาะสมกับสถานะสุขภาพของท่าน
                          โดยข้อมูลดังกล่าวจะถูกจัดเก็บไว้ในระบบเป็นเวลา 2
                          ชั่วโมง
                          ท่านสามารถดาวน์โหลดข้อมูลคำแนะนำทางโภชนาการเพื่อเก็บไว้ได้
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Button */}
                <div
                  className={`
                    mt-10 opacity-0
                    ${
                      animationStage >= 4
                        ? "animate-[fadeInScale_0.8s_ease-out_0.3s_forwards]"
                        : ""
                    }
                  `}
                >
                  <Tooltip
                    title={
                      !isFormValid
                        ? "กรุณากรอกข้อมูลให้ครบถ้วน"
                        : "คลิกเพื่อดูคำแนะนำโภชนาการ"
                    }
                  >
                    <Button
                      type="primary"
                      disabled={!isFormValid}
                      className={`
                        w-full !h-16 !text-lg md:!text-xl !font-kanit font-semibold
                        !bg-gradient-to-r !from-blue-600 !to-indigo-700
                        !border-0 !rounded-2xl !shadow-xl
                        hover:!from-blue-700 hover:!to-indigo-800
                        hover:!shadow-2xl hover:!scale-105
                        transition-all duration-300
                        disabled:!opacity-50 disabled:!cursor-not-allowed
                        disabled:hover:!scale-100 disabled:hover:!shadow-xl
                        ${isFormValid ? "animate-pulse" : ""}
                      `}
                      onClick={handleConfirm}
                      icon={<CheckCircleOutlined />}
                    >
                      <span className="flex items-center justify-center">
                        ยืนยันข้อมูลและดูคำแนะนำ
                        <RightOutlined className="ml-2" />
                      </span>
                    </Button>
                  </Tooltip>
                </div>

                {/* Progress indicator */}
                <div
                  className={`
                    mt-6 flex justify-center opacity-0
                    ${
                      animationStage >= 4
                        ? "animate-[fadeInUp_0.6s_ease-out_0.5s_forwards]"
                        : ""
                    }
                  `}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        gender ? "bg-blue-500 animate-pulse" : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        age ? "bg-blue-500 animate-pulse" : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        height ? "bg-blue-500 animate-pulse" : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`w-3 h-3 rounded-full transition-all duration-500 ${
                        disease ? "bg-blue-500 animate-pulse" : "bg-gray-300"
                      }`}
                    ></div>
                    {disease === 2 && (
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-500 ${
                          diseaseStage
                            ? "bg-blue-500 animate-pulse"
                            : "bg-gray-300"
                        }`}
                      ></div>
                    )}
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

export default NutritionInput;
