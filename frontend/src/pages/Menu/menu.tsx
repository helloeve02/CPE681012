import type { MenuInterface } from "../../interfaces/Menu";
import { GetAllMenu } from "../../services/https";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
// import type { MenuImageInterface } from "../interfaces/MenuImage";
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [error, setError] = useState("");
  // const [image, setimage] = useState<MenuImageInterface[]>([]);
  const [query, setQuery] = useState("");

  const filteredItems = menu.filter(menu =>
    (menu.Title?.toLowerCase() ?? '').includes(query.toLowerCase())
  );


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
          <h2 className="font-semibold text-4xl text-center font-kanit">เมนูอาหารแนะนำ</h2>
          <div className="w-8"></div>
      </div>
      <div className="relative max-w-md mx-auto mt-5 ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2E77F8]" size={20} />

        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="ค้นหาเมนู..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-kanit"
        />

      </div>
    
      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {query && filteredItems.length === 0 && (
          <p className="text-center text-gray-500 font-kanit mt-4">ไม่พบเมนูที่คุณค้นหา</p>
        )}
        {(query ? filteredItems : menu).map((item) => (
          <div key={item.ID} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-38 h-30 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.Image} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-yellow-500 text-xl">⭐</span>
                  <span className="text-sm sm:text-base font-kanit text-yellow-600 w-full max-w-xs sm:max-w-sm truncate">
                    {item.Region}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-kanit text-gray-800 ml-3">
                  {item.Title}
                </h3>
              </div>
            </div>

            <Link to={`/menu/${item.ID}`}>
              <button className="w-40 max-w-sm bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-full flex items-center justify-center space-x-1 text-sm sm:text-base font-kanit shadow">
                <span>ดูข้อมูลเพิ่มเติม</span>
                <ChevronRight size={19} />
              </button>
            </Link>
          </div>
        ))}
        <div className="bg-[#2E77F8] text-white px-4 py-6">
          <h2 className="font-semibold text-4xl text-center font-kanit">ผัก ผลไม้ แนะนำ</h2>
          <div className="w-8"></div>
      </div>
      <h1>ไก่พพ</h1>
      </div>
      

    </div>
  );
};

export default Menu;
