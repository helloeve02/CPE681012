import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Radio, Select } from "antd";
import type { RadioChangeEvent } from "antd";

const NutritionInput = () => {
  const [disease, setDisease] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate("/nutrition-suggestion");
  };

  const onDiseaseChange = (e: RadioChangeEvent) => {
    setDisease(e.target.value);
  };

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  return (
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
            onChange={onChange}
            onSearch={onSearch}
            options={[
              {
                value: "m",
                label: "ชาย",
              },
              {
                value: "f",
                label: "หญิง",
              },
            ]}
            className="!font-kanit"
            dropdownClassName="!font-kanit"
          />
        </div>

        {/* อายุ */}
        <div className="flex flex-col gap-1">
          <label>อายุ</label>
          <Input type="text" placeholder="อายุ" className="!font-kanit" />
        </div>

        {/* ส่วนสูง */}
        <div className="flex flex-col gap-1">
          <label>ส่วนสูง</label>
          <Input type="text" placeholder="ส่วนสูง" className="!font-kanit" />
        </div>

        {/* น้ำหนัก */}
        <div className="flex flex-col gap-1">
          <label>น้ำหนัก</label>
          <Input type="text" placeholder="น้ำหนัก" className="!font-kanit" />
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

          {/* Show Diabetes stage dropdown if ไต is selected */}
          {disease === 1 && (
            <div className="mt-2 flex flex-col gap-y-3">
              <label className="font-normal">เลือกระยะเบาหวาน</label>
              <Select
                showSearch
                placeholder="เลือกระยะเบาหวาน"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={[
                  {
                    value: "type 1",
                    label: "type 1",
                  },
                  {
                    value: "type 2",
                    label: "type 2",
                  },
                ]}
                className="!font-kanit"
                dropdownClassName="!font-kanit"
              />
            </div>
          )}

          {/* Show kidney stage dropdown if ไต is selected */}
          {disease === 2 && (
            <div className="mt-2 flex flex-col gap-y-3">
              <label className="font-normal">เลือกไตระยะ</label>
              <Select
                showSearch
                placeholder="เลือกระยะไต"
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={[
                  {
                    value: "1",
                    label: "ระยะที่ 1",
                  },
                  {
                    value: "2",
                    label: "ระยะที่ 2",
                  },
                  {
                    value: "3a",
                    label: "ระยะที่ 3a",
                  },
                ]}
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
  );
};

export default NutritionInput;
