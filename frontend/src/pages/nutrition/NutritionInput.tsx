import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Radio, Select, Spin } from "antd";
import type { RadioChangeEvent } from "antd";
import { GetAllDisease, GetRuleByUserInfo } from "../../services/https";
import type { DiseasesInterface } from "../../interfaces/Disease";

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
      const rule = await GetRuleByUserInfo(userData);
      console.log(userData);
      if (rule?.data) {
        // Save to localStorage or call your API here
        localStorage.setItem("rule", JSON.stringify(rule.data));
        navigate("/nutrition-suggestion");
      } else {
        alert("ไม่สามารถดึงข้อมูลคำแนะนำได้");
      }
    } catch (error) {
      console.error("Error getting rule:", error);
      alert("เกิดข้อผิดพลาดในการเรียกข้อมูล");
    }
  };

  const onDiseaseChange = (e: RadioChangeEvent) => {
    setDisease(e.target.value);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
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
      }, 500);
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
        <div className="fixed top-1/5 left-1/2 ">
          <Spin />
        </div>
      ) : (
        <div className="h-screen font-kanit">
          <div className="bg-[#2E77F8] p-5 md:p-8 flex items-center justify-center text-white">
            <div className="font-semibold text-2xl md:text-4xl">
              โภชนาการที่เหมาะกับคุณ
            </div>
          </div>

          <div className="text-xl flex justify-center pt-5 md:text-2xl">
            บอกเราเกี่ยวกับคุณ
          </div>

          <div className="text-sm grid gap-[3vh] pl-10 pr-10 md:text-xl md:pl-20 md:pr-20 lg:grid-cols-2">
            {/* เพศ */}
            <div className="flex flex-col gap-1">
              <label className="">เพศ</label>
              <Select
                showSearch
                placeholder="เลือกเพศ"
                optionFilterProp="label"
                value={gender ?? undefined}
                onChange={(value) => setGender(value)}
                onSearch={onSearch}
                options={[
                  { value: "male", label: "ชาย" },
                  { value: "female", label: "หญิง" },
                ]}
                className="!font-kanit"
                dropdownClassName="!font-kanit"
              />
            </div>

            {/* อายุ */}
            <div className="flex flex-col gap-1">
              <label>อายุ</label>
              <Input
                value={age ?? ""}
                onChange={(e) => setAge(Number(e.target.value))}
                type="number"
                placeholder="อายุ"
                className="!font-kanit"
              />
            </div>

            {/* ส่วนสูง */}
            <div className="flex flex-col gap-1">
              <label>ส่วนสูง</label>
              <Input
                value={height ?? ""}
                onChange={(e) => setHeight(Number(e.target.value))}
                type="number"
                placeholder="ส่วนสูง"
                className="!font-kanit"
              />
            </div>

            {/* โรคของคุณ */}
            <div className="flex flex-col gap-2">
              <label>โรคของคุณ</label>
              <Radio.Group
                onChange={onDiseaseChange}
                value={disease}
                className="flex items-center justify-center lg:justify-start lg:gap-50"
              >
                <Radio value={1} className="text-sm md:text-xl !font-kanit">
                  เบาหวาน
                </Radio>
                <Radio value={2} className="text-sm md:text-xl !font-kanit">
                  ไต
                </Radio>
              </Radio.Group>

              {/* Show kidney stage dropdown if ไต is selected */}
              {disease === 2 && (
                <div className="mt-2 flex flex-col gap-y-3">
                  <label className="font-normal">เลือกไตระยะ</label>
                  <Select
                    showSearch
                    placeholder="เลือกระยะไต"
                    optionFilterProp="label"
                    value={diseaseStage ?? undefined}
                    onChange={(value) => setDiseaseStage(value)}
                    onSearch={onSearch}
                    options={kidneyStages}
                    className="!font-kanit"
                    dropdownClassName="!font-kanit"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="p-[4vh] md:pl-20 md:pr-20 lg:p-[6vh] lg:pl-30 lg:pr-30">
            <Button
              type="primary"
              className="w-full !p-4 !text-lg md:!p-5 md:!text-xl !font-kanit"
              onClick={handleConfirm}
            >
              ยืนยัน
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NutritionInput;
