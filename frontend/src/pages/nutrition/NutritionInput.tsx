import { useState } from "react";
import { Button, Dropdown, Input, Radio } from "antd";
import type { RadioChangeEvent } from "antd";
import { DownOutlined } from "@ant-design/icons";
const NutritionInput = () => {
  const genderItems = [
    { key: "1", label: "หญิง" },
    { key: "2", label: "ชาย" },
    { key: "3", label: "อื่นๆ" },
  ];

  const kidneyStages = [
    { key: "1", label: "ไตระยะที่ 1" },
    { key: "2", label: "ไตระยะที่ 2" },
    { key: "3", label: "ไตระยะที่ 3" },
    { key: "4", label: "ไตระยะที่ 4" },
    { key: "5", label: "ไตระยะที่ 5" },
  ];

  const diabetesStages = [
    { key: "1", label: "Type 1" },
    { key: "2", label: "Type 2" },
  ];

  const [disease, setDisease] = useState<number | null>(null);
  const [kidneyStage, setKidneyStage] = useState<string | null>(null);
  const [diabetesStage, setDiabetesStage] = useState<string | null>(null);

  const onDiseaseChange = (e: RadioChangeEvent) => {
    setDisease(e.target.value);
    setKidneyStage(null);
    setDiabetesStage(null);
  };

  return (
    <div className="h-screen font-kanit">
      <div className="bg-[#2E77F8] w-full p-5 md:p-10 flex items-center justify-center text-white">
        <div className="font-semibold text-2xl md:text-4xl">
          โภชนาการที่เหมาะกับคุณ
        </div>
      </div>

      <div className="text-xl flex justify-center pt-5 md:text-2xl">
        บอกเราเกี่ยวกับคุณ
      </div>

      <div className="text-sm flex flex-col gap-[3vh] pl-10 pr-10 md:text-xl md:pl-20 md:pr-20">
        {/* เพศ */}
        <div className="flex flex-col gap-1">
          <label className="font-bold">เพศ</label>
          <Dropdown
            menu={{
              items: genderItems,
              selectable: true,
              defaultSelectedKeys: ["3"],
            }}
          >
            <Input
              readOnly
              value={"กรุณากรอกเพศ"}
              suffix={<DownOutlined />}
              className="text-gray-400"
            />
          </Dropdown>
        </div>

        {/* อายุ */}
        <div className="flex flex-col font-semibold gap-1">
          <label>อายุ</label>
          <Input type="text" placeholder="อายุ" />
        </div>

        {/* ส่วนสูง */}
        <div className="flex flex-col font-semibold gap-1">
          <label>ส่วนสูง</label>
          <Input type="text" placeholder="ส่วนสูง" />
        </div>

        {/* น้ำหนัก */}
        <div className="flex flex-col font-semibold gap-1">
          <label>น้ำหนัก</label>
          <Input type="text" placeholder="น้ำหนัก" />
        </div>

        {/* โรคของคุณ */}
        <div className="flex flex-col gap-1 ">
          <label className="font-semibold">โรคของคุณ</label>
          <Radio.Group
            onChange={onDiseaseChange}
            value={disease}
            className="flex items-center justify-center"
          >
            <Radio value={1} className="text-sm md:text-xl font-kanit">
              เบาหวาน
            </Radio>
            <Radio value={2} className="text-sm md:text-xl font-kanit">
              ไต
            </Radio>
          </Radio.Group>

          {/* Show Diabetes stage dropdown if ไต is selected */}
          {disease === 1 && (
            <div className="mt-2 flex flex-col gap-y-3">
              <label className="font-normal">เลือกระยะเบาหวาน</label>
              <Dropdown
                menu={{
                  items: diabetesStages,
                  onClick: ({ key }) => setDiabetesStage(key),
                  selectable: true,
                  defaultSelectedKeys: diabetesStage ? [diabetesStage] : [],
                }}
              >
                <Input
                  readOnly
                  value={
                    diabetesStage
                      ? diabetesStages.find(
                          (item) => item.key === diabetesStage
                        )?.label
                      : "เลือกระยะเบาหวานของคุณ"
                  }
                  suffix={<DownOutlined />}
                  className={diabetesStage ? "" : "text-[#BFBFBF] md:text-xl"}
                />
              </Dropdown>
            </div>
          )}

          {/* Show kidney stage dropdown if ไต is selected */}
          {disease === 2 && (
            <div className="mt-2 flex flex-col gap-y-3">
              <label className="font-normal">เลือกไตระยะ</label>
              <Dropdown
                menu={{
                  items: kidneyStages,
                  onClick: ({ key }) => setKidneyStage(key),
                  selectable: true,
                  defaultSelectedKeys: kidneyStage ? [kidneyStage] : [],
                }}
              >
                <Input
                  readOnly
                  value={
                    kidneyStage
                      ? kidneyStages.find((item) => item.key === kidneyStage)
                          ?.label
                      : "เลือกไตระยะของคุณ"
                  }
                  suffix={<DownOutlined />}
                  className={kidneyStage ? "" : "text-gray-400"}
                />
              </Dropdown>
            </div>
          )}
        </div>
      </div>
      <div className="p-[4vh] md:pl-20 md:pr-20">
        <Button type="primary" className="w-full md:text-2xl p-5 md:p-8">
          ยืนยัน
        </Button>
      </div>
    </div>
  );
};

export default NutritionInput;
