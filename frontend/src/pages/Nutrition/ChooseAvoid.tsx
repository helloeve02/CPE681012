import React from "react";

const ChooseAvoid = () => {
  type Food = {
    name: string;
    image: string;
  };
  type FoodItem = {
    topic: string;
    items: Food[];
  };
  const recommendedFoods: FoodItem[] = [
    {
      topic: "ข้าว/แป้ง",
      items: [
        {
          name: "ข้าวสวย",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "ข้าวจ้าว",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
      ],
    },
    {
      topic: "เนื้อ",
      items: [
        {
          name: "เนื้อหมู",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "เนื้อไก่",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
      ],
    },
    {
      topic: "ผัก",
      items: [
        {
          name: "ข้าวเหนียว",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "ขนมปังขาว",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
      ],
    },
  ];

  const avoidedFoods: FoodItem[] = [
    {
      topic: "ข้าว/แป้ง",
      items: [
        {
          name: "ข้าวเหนียว",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "ขนมปังขาว",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
      ],
    },
    {
      topic: "เนื้อ",
      items: [
        {
          name: "เนื้อทอด",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "เบคอน",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "เนื้อทอด",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "เบคอน",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
      ],
    },
    {
      topic: "ผัก",
      items: [
        {
          name: "เนื้อทอด",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "เบคอน",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "เนื้อทอด",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
        {
          name: "เบคอน",
          image:
            "https://blog.wu.ac.th/wp-content/uploads/2023/01/8-768x768.jpg",
        },
      ],
    },
  ];
  const allTopics = Array.from(
    new Set([...recommendedFoods, ...avoidedFoods].map((d) => d.topic))
  );
  return (
    <div className="font-kanit">
        <div className="bg-[#2E77F8] p-5 md:p-8 flex items-center justify-center text-white">
        <div className="font-semibold text-2xl md:text-4xl">
          เลือกทานและหลีกเลี่ยง
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTopics.map((topic) => {
            const rec = recommendedFoods.find((f) => f.topic === topic);
            const avoid = avoidedFoods.find((f) => f.topic === topic);

            return (
              <div key={topic} className="border p-4 rounded shadow">
                <div className="text-xl font-semibold mb-2">{topic}</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <strong>ควรทาน</strong>
                     <ul className="grid gap-1 grid-cols-[repeat(auto-fit,minmax(60px,1fr))]">
                      {rec?.items.map((item, i) => (
                        <li key={i} className="flex flex-col items-start md:text-sm">
                          <span>{item.name}</span>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="hidden md:inline-block w-20 h-20 object-cover rounded mt-1"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="w-px bg-black m-2"></div>
                  <div className="flex-1">
                    <strong>ควรเลี่ยง</strong>
                    <ul className="grid gap-2 grid-cols-[repeat(auto-fit,minmax(40px,1fr))]">
                      {avoid?.items.map((item, i) => (
                        <li key={i} className="flex flex-col items-start md:text-sm">
                          <span>{item.name}</span>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="hidden md:inline-block w-20 h-20 object-cover rounded mt-1"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChooseAvoid;
