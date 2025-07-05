import type { MenuInterface } from "../interfaces/Menu";
import { GetAllMenu } from "../services/https";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [error, setError] = useState("");

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
  }, []);

  return (
    <div className="max-w mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-blue-500 text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button className="p-2 rounded-full border border-white border-opacity-30">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-lg font-medium">ความรู้ เมนูอาหารแนะนำ</h1>
          <div className="w-8"></div>
        </div>
        <h2 className="text-2xl font-bold text-center">เมนูอาหารแนะนำ</h2>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {menu.map((item) => (
          <div key={item.ID} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  // src={item.image} 
                  alt={item.Title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-yellow-500 text-sm">⭐</span>
                  <span className="text-xs text-gray-600">{item.Region}</span>
                </div>
                <h3 className="font-medium text-gray-800">{item.Title}</h3>
              </div>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm flex items-center space-x-1">
              <span>ดูข้อมูลเพิ่มเติม</span>
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
