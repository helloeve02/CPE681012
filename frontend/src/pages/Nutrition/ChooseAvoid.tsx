import { useEffect, useState } from "react";
import { GetAllChooseAvoid } from "../../services/https";
import { Button, Image, Spin } from "antd";
import type { FoodItem } from "../../interfaces/FoodItem";
import FoodPopup from "./FoodPopup";
import { FilePdfOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import PDFDownloadButton from "../../components/PDFDownloadButton";

const ChooseAvoid = () => {
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [foodGroups, setFoodGroups] = useState<FoodGroupData[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const handleOpenPDF = () => {
    navigate("/pdf-viewer");
  };
  const handleNext = () => {
    navigate("/mealplanner");
  };
  type FoodGroupData = {
    topic: string; // FoodGroup.Name
    recommended: FoodItem[];
    avoided: FoodItem[];
  };

  function transformFoodItems(foodItems: FoodItem[]): FoodGroupData[] {
    // Map of group name to recommended/avoided foods
    const groupMap: Record<
      string,
      { recommended: FoodItem[]; avoided: FoodItem[] }
    > = {};

    foodItems.forEach((item) => {
      const groupName = item.FoodFlag.FoodGroup.Name ?? "Unknown Group";
      const flag = item.FoodFlag.Flag;

      if (!groupMap[groupName]) {
        groupMap[groupName] = { recommended: [], avoided: [] };
      }

      if (flag === "ควรรับประทาน") {
        groupMap[groupName].recommended.push(item);
      } else if (flag === "ควรหลีกเลี่ยง") {
        groupMap[groupName].avoided.push(item);
      }
    });

    // Convert map to array for rendering
    return Object.entries(groupMap).map(([topic, data]) => ({
      topic,
      recommended: data.recommended,
      avoided: data.avoided,
    }));
  }

  useEffect(() => {
    if (location.state?.scrollTo) {
      console.log(
        "scrollTo from ImportanceOfNutrition:",
        location.state.scrollTo
      );

      const el = document.getElementById(location.state.scrollTo);
      if (el) {
        console.log("Found element:", el.id);
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        console.warn("No element found with id:", location.state.scrollTo);
      }
    }
  }, [location.state, foodGroups]);

  useEffect(() => {
    const fetchData = async () => {
      const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

      try {
        // Run API call and delay in parallel
        const [res] = await Promise.all([
          GetAllChooseAvoid(),
          delay(300), // ensures at least 500ms loading
        ]);

        if (res && res.data?.fooditems) {
          setFoodGroups(transformFoodItems(res.data.fooditems));
        }
      } catch (err) {
        console.error("Failed to fetch some data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="fixed top-1/5 left-1/2 ">
          <Spin />
        </div>
      ) : (
        <div className="font-kanit">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-5 md:p-8 flex items-center justify-center text-white">
            <div className="font-semibold text-2xl md:text-4xl">
              อาหารที่ควรเลี่ยง
            </div>
          </div>
          <div className="p-8 md:pr-30 md:pl-30 lg:pr-80 lg:pl-80">
            <div className="grid grid-cols-1 gap-4">
              {foodGroups.map((group) => {
                const id = (group.topic);

                console.log(
                  "Rendering:",
                  group.topic,
                  "->",
                  (group.topic)
                ); // in ChooseAvoid

                return (
                  <div
                    id={id}
                    key={group.topic}
                    className="border p-4 rounded shadow"
                  >
                    <div className="text-xl font-semibold mb-2">
                      {group.topic}
                    </div>
                    <div className="flex gap-2">
                      {/* Recommended */}
                      <div className="flex-1">
                        <strong className="text-green-600">ควรทาน</strong>
                        <ul className="grid gap-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          {group.recommended.map((item) => (
                            <li
                              key={item.ID}
                              onClick={() => setSelectedItem(item)}
                              className="cursor-pointer flex flex-col items-start md:text-sm transition-colors duration-200 hover:bg-gray-300 md:p-2 rounded"
                            >
                              <span>• {item.Name}</span>
                              <Image
                                src={item.Image}
                                fallback="https://img.icons8.com/?size=100&id=j1UxMbqzPi7n&format=png&color=000000"
                                alt={item.Name}
                                preview={false}
                                className="w-full aspect-square object-cover rounded mt-1"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="w-px bg-black m-2"></div>

                      {/* Avoided */}
                      <div className="flex-1">
                        <strong className="text-red-500">ควรเลี่ยง</strong>
                        <ul className="grid gap-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                          {group.avoided.map((item) => (
                            <li
                              key={item.ID}
                              onClick={() => setSelectedItem(item)}
                              className="cursor-pointer flex flex-col items-start md:text-sm transition-colors duration-200 hover:bg-gray-300 md:p-2 rounded"
                            >
                              <span>• {item.Name}</span>
                              <Image
                                src={item.Image}
                                fallback="https://img.icons8.com/?size=100&id=j1UxMbqzPi7n&format=png&color=000000"
                                alt={item.Name}
                                preview={false}
                                className="w-full aspect-square object-cover rounded mt-1"
                              />
                            </li>
                          ))}
                          {/* Popup component */}
                          <FoodPopup
                            item={selectedItem}
                            onClose={() => setSelectedItem(null)}
                          />
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex p-3 ml-4 md:ml-10 md:pl-20 md:pr-20 lg:p-[6vh] lg:pl-50 lg:pr-60">
            <Button
              type="primary"
              className="w-full !p-4 !text-lg md:!p-5 md:!text-xl !font-kanit"
              onClick={handleNext}
            >
              ดูแผนอาหารแนะนำ
            </Button>
            <div className="flex">
              <PDFDownloadButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChooseAvoid;
