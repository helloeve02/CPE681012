import type { MenuInterface } from "../../interfaces/Menu";
import { GetAllMenu } from "../../services/https";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Funnel } from 'lucide-react';
// import type { MenuImageInterface } from "../interfaces/MenuImage";

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [error, setError] = useState("");
  // const [image, setimage] = useState<MenuImageInterface[]>([]);

  const getAllMenu = async () => {
    try {
      const res = await GetAllMenu();
      if (Array.isArray(res?.data?.menu)) {
        setMenu(res.data.menu);
      } else {
        setError("Failed to load menu items");
      }
    } catch (error) {
      setError("Error fetching menu items. Please try again later.");
    }
  };

  useEffect(() => {
    getAllMenu();
    // getAllMenuImage();
  }, []);

  return (
    <div className="max-w mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#2E77F8] text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-full border border-white border-opacity-30">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-3xl text-center font-kanit">เมนูอาหารแนะนำ</h2>
          <div className="w-8"></div>
        </div>

      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-1 text-xl font-kanit mt-3 ml-auto">
        <Funnel size={19} />
        <span>กรอง</span>

      </button>
      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {menu.map((item) => (
          <div key={item.ID} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-38 h-30 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.Image}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="text-xl font-kanit text-yellow-600">{item.Region}</span>
                </div>
                <h3 className="text-2xl font-kanit text-gray-800 ml-3">{item.Title}</h3>
              </div>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-1 text-xl font-kanit">
              <span>ดูข้อมูลเพิ่มเติม</span>
              <ChevronRight size={19} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
