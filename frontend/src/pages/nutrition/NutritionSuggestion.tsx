import React from "react";

type MealTime = "เช้า" | "ว่างสาย" | "กลางวัน" | "ว่างบ่าย" | "เย็น";

type Meal = {
  amount: number;
  unit: string;
};

type NutritionItem = {
  topic: string;
  meals: Record<MealTime, Meal>;
};

const NutritionSuggestion = () => {
  const mealOrder: MealTime[] = [
    "เช้า",
    "ว่างสาย",
    "กลางวัน",
    "ว่างบ่าย",
    "เย็น",
  ];

  {
    /* placeholder data */
  }
  const nutritionData: NutritionItem[] = [
    {
      topic: "ข้าว/แป้ง",
      meals: {
        เช้า: { amount: 50, unit: "กรัม" },
        ว่างสาย: { amount: 0, unit: "กรัม" },
        กลางวัน: { amount: 60, unit: "กรัม" },
        ว่างบ่าย: { amount: 0, unit: "กรัม" },
        เย็น: { amount: 50, unit: "กรัม" },
      },
    },
    {
      topic: "ผัก",
      meals: {
        เช้า: { amount: 30, unit: "กรัม" },
        ว่างสาย: { amount: 0, unit: "กรัม" },
        กลางวัน: { amount: 100, unit: "กรัม" },
        ว่างบ่าย: { amount: 0, unit: "กรัม" },
        เย็น: { amount: 100, unit: "กรัม" },
      },
    },
    {
      topic: "ผลไม้",
      meals: {
        เช้า: { amount: 0, unit: "กรัม" },
        ว่างสาย: { amount: 80, unit: "กรัม" },
        กลางวัน: { amount: 0, unit: "กรัม" },
        ว่างบ่าย: { amount: 100, unit: "กรัม" },
        เย็น: { amount: 0, unit: "กรัม" },
      },
    },
    {
      topic: "เนื้อสัตว์",
      meals: {
        เช้า: { amount: 20, unit: "กรัม" },
        ว่างสาย: { amount: 0, unit: "กรัม" },
        กลางวัน: { amount: 40, unit: "กรัม" },
        ว่างบ่าย: { amount: 0, unit: "กรัม" },
        เย็น: { amount: 30, unit: "กรัม" },
      },
    },
    {
      topic: "ไขมัน",
      meals: {
        เช้า: { amount: 5, unit: "กรัม" },
        ว่างสาย: { amount: 0, unit: "กรัม" },
        กลางวัน: { amount: 10, unit: "กรัม" },
        ว่างบ่าย: { amount: 0, unit: "กรัม" },
        เย็น: { amount: 10, unit: "กรัม" },
      },
    },
    {
      topic: "เครื่องปรุง",
      meals: {
        เช้า: { amount: 1, unit: "กรัม" },
        ว่างสาย: { amount: 0, unit: "กรัม" },
        กลางวัน: { amount: 3, unit: "กรัม" },
        ว่างบ่าย: { amount: 0, unit: "กรัม" },
        เย็น: { amount: 2, unit: "กรัม" },
      },
    },
  ];

  return (
    <div className="h-screen font-kanit">
      <div className="bg-[#2E77F8] p-5 md:p-8 flex items-center justify-center text-white">
        <div className="font-semibold text-2xl md:text-4xl">
          ปริมาณอาหารที่เหมาะกับคุณ
        </div>
      </div>
      <div className="p-4 space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
        {nutritionData.map(({ topic, meals }) => (
          <div
            key={topic}
            className="border border-gray-500 p-3 rounded shadow-sm"
          >
            <div className="text-xl font-semibold mb-2">{topic}</div>
            <hr className="border-t border-gray-400" />
            <ul className="list-disc list-inside space-y-1">
              {mealOrder.map((mealTime) =>
                meals[mealTime] ? (
                  <li className="md:pl-5" key={mealTime}>
                    {mealTime}: {meals[mealTime].amount} {meals[mealTime].unit}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionSuggestion;
