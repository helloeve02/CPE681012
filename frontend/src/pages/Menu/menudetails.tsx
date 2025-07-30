import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetMenuById } from "../../services/https/index";
import { ChevronLeft } from 'lucide-react';
import type { MenuInterface } from "../../interfaces/Menu";

const FoodDetail = () => {
  const { id } = useParams();

  const [menu, setMenu] = useState<MenuInterface | null>(null);


  const extractIngredients = (description: string) => {
    const part = description.split("วิธีทำ")[0]; // เอาเฉพาะก่อน "วิธีทำ"
    const lines = part.split("\n").filter(line => line.trim().startsWith("-"));

    const ingredients = lines.map(line => {
      const cleaned = line.replace(/^[-\t\s]+/, ""); // ลบ -, tab, ช่องว่างต้นบรรทัด
      const [nameWithAmount, weightMatch] = cleaned.split(/\(([^)]+)\)/); // แยกชื่อ+ปริมาณ กับน้ำหนัก
      const [name, quantity] = nameWithAmount.split(":").map(s => s.trim());

      return {
        name,
        quantity,
        weight: weightMatch ? weightMatch.trim() : "-"
      };
    });

    return ingredients;
  };

  useEffect(() => {
    const fetchMenu = async () => {
      if (!id) return;
      try {
        const res = await GetMenuById(id);
        const data = res.data;
        const dataArray = Array.isArray(data) ? data : [data];
        setMenu(dataArray[0].menu);
        console.log(dataArray[0].menu);
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, [id]);

  if (!id) return <p>ไม่พบ ID</p>;
  if (!menu) return <p>Loading...</p>;

  const description = menu.Description ?? "";
  const ingredients = extractIngredients(description);


  return (
    <div className="max-w mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#2E77F8] text-white px-4 py-6">
        <h2 className="font-semibold text-4xl text-center font-kanit">เมนูอาหารแนะนำ</h2>
        <div className="w-8"></div>
      </div>

      {/* Food Image */}
      <div className="px-4 py-6">
        <div className="w-full max-w-2xl aspect-[16/9] bg-gray-200 rounded-lg overflow-hidden mb-4 mx-auto">
          <img
            src={menu.Image}
            alt={menu.Title}
            className="w-full h-full object-cover"

          />

        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-kanit text-blue-800 ml-3 text-center">
            <a href= {menu.Credit} target="_blank" rel="noopener noreferrer">
              ขอบคุณภาพจาก
            </a>
          </h2>
        </div>


        {/* Category Badge */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-yellow-500 text-sm">⭐</span>
          <span className="text-xl text-gray-600 font-kanit">{menu.Region}</span>

        </div>

        <h3 className="text-2xl font-bold font-kanit text-gray-800 ">ส่วนประกอบ</h3>
        <h3 className="text-l font-kanit text-gray-800 ">**ปริมาณสารอาหารอาจแตกต่างกันไปตามแต่ละบุคคล**</h3>
      </div>

      {/* Ingredients Table */}
      <div className="px-4 mb-6  font-kanit">
        <div className="bg-gray-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-100 p-3 text-sm font-medium text-gray-700 ">
            <div  className= "font-kanit">ส่วนประกอบ</div>
            <div className="text-center">ปริมาณ</div>
            <div className="text-center">น้ำหนัก</div>
          </div>

          {ingredients.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-3 p-3 border-b border-gray-200 last:border-b-0 text-sm"
            >
              <div className="text-gray-800">{item.name}</div>
              <div className="text-center text-gray-600">{item.quantity}</div>
              <div className="text-center text-gray-600">{item.weight}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
