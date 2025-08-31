import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Radio, Select, Spin } from "antd";
import { GetAllDisease, FindRuleByUserInfo } from "../../services/https";
import type { DiseasesInterface } from "../../interfaces/Disease";
import { InfoCircleOutlined } from "@ant-design/icons";

const NutritionInput = () => {
  const [disease, setDisease] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(true);
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
        const expiresAt = now + 12 * 60 * 60 * 1000; // 12 hours from now

        const ruleWithExpiry = {
          rule: rule.data,
          expiresAt,
        };
        // Save to localStorage
        localStorage.setItem("rule", JSON.stringify(ruleWithExpiry));
        navigate("/nutrition-suggestion");
      } else {
        alert("ไม่สามารถดึงข้อมูลคำแนะนำได้");
      }
    } catch (error) {
      console.error("Error getting rule:", error);
      alert("เกิดข้อผิดพลาดในการเรียกข้อมูล");
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
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    fetchData();
  }, []);

  const kidneyStages = diseases
    .filter((item) => item.Name?.toLowerCase() === "โรคไต")
    .map((item) => ({
      value: item.Stage,
      label: item.Stage,
    }));
  console.log(kidneyStages);

  return (
    <>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <Spin size="large" />
        </div>
      ) : (
        <div className="font-kanit min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Header */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90"></div>
            <div className="relative p-8 md:p-12 text-center text-white">
              <h1 className="font-bold text-3xl md:text-5xl lg:text-6xl mb-2 animate-in slide-in-from-top-4 fade-in duration-1000">
                โภชนาการที่เหมาะกับคุณ
              </h1>
              <p className="text-blue-100 text-lg md:text-xl opacity-90 animate-in slide-in-from-top-8 fade-in duration-1000 delay-300">
                โปรดกรอกข้อมูลส่วนตัวเพื่อรับคำแนะนำ
              </p>
            </div>
          </div>

          {/* Input Form */}
          <div className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-16">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-xl border border-white/30 animate-in slide-in-from-bottom-4 fade-in duration-700">
              <div className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <InfoCircleOutlined className="text-blue-600 mr-3" />
                บอกเราเกี่ยวกับคุณ
              </div>

              <div className="grid gap-6 md:grid-cols-2 text-sm md:text-base">
                {/* เพศ */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">เพศ</label>
                  <Select
                    showSearch
                    placeholder="เลือกเพศ"
                    optionFilterProp="label"
                    value={gender ?? undefined}
                    onChange={setGender}
                    options={[
                      { value: "male", label: "ชาย" },
                      { value: "female", label: "หญิง" },
                    ]}
                    className="!font-kanit"
                    dropdownClassName="!font-kanit"
                  />
                </div>

                {/* อายุ */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">อายุ</label>
                  <Input
                    value={age ?? ""}
                    onChange={(e) => setAge(Number(e.target.value))}
                    type="number"
                    placeholder="อายุ"
                    className="!font-kanit"
                  />
                </div>

                {/* ส่วนสูง */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">ส่วนสูง</label>
                  <Input
                    value={height ?? ""}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    type="number"
                    placeholder="ส่วนสูง"
                    className="!font-kanit"
                  />
                </div>

                {/* โรค */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium text-gray-700">โรคของคุณ</label>
                  <Radio.Group
                    onChange={(e) => setDisease(e.target.value)}
                    value={disease}
                    className="flex gap-8"
                  >
                    <Radio value={1} className="!font-kanit text-gray-700">เบาหวาน</Radio>
                    <Radio value={2} className="!font-kanit text-gray-700">ไต</Radio>
                  </Radio.Group>

                  {disease === 2 && (
                    <div className="mt-2 flex flex-col gap-2">
                      <label className="text-sm text-gray-600">เลือกระยะไต</label>
                      <Select
                        showSearch
                        placeholder="เลือกระยะ"
                        optionFilterProp="label"
                        value={diseaseStage ?? undefined}
                        onChange={(value) => setDiseaseStage(value)}
                        options={kidneyStages}
                        className="!font-kanit mt-1"
                        dropdownClassName="!font-kanit"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Button */}
              <div className="mt-10">
                <Button
                  type="primary"
                  className="
                    w-full !h-14 !text-lg md:!text-xl !font-kanit font-semibold
                    !bg-gradient-to-r !from-blue-600 !to-indigo-700
                    !border-0 !rounded-2xl !shadow-xl
                    hover:!from-blue-700 hover:!to-indigo-800
                    hover:!shadow-2xl hover:!scale-105
                    transition-all duration-300
                  "
                  onClick={handleConfirm}
                >
                  ยืนยันข้อมูล
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NutritionInput;
