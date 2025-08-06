import type { MenuInterface } from "../../interfaces/Menu";
import { GetAllMenu, GetAllIngredients } from "../../services/https";
import React, { useEffect, useState } from "react";
import { ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IngredientsInterface } from "../../interfaces/Ingredients"

const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"food" | "ingredient">("food");
  const [ingredients, setIngredients] = useState<IngredientsInterface[]>([]);

  const filteredItems = menu.filter(menu =>
    (menu.Title?.toLowerCase() ?? '').includes(query.toLowerCase())
  );

  const filteredIngre = ingredients.filter(ingredients =>
    (ingredients.Name?.toLowerCase() ?? '').includes(query.toLowerCase())
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

  const getAllIngredients = async () => {
    try {
      const res = await GetAllIngredients();
      // console.log(res?.data?.ingredients)
      if (Array.isArray(res?.data?.ingredients)) {
        setIngredients(res.data.ingredients);
      } else {
        setError("Failed to load ingredients items");
      }
    } catch (error) {
      setError("Error fetching ingredients items. Please try again later.");
    }
  };

  useEffect(() => {
    getAllMenu();
    getAllIngredients();
  }, []);

  return (
    <div className="max-w mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-[#2E77F8] text-white px-4 py-6">
        <h2 className="font-semibold text-4xl text-center font-kanit">เมนูอาหารแนะนำ</h2>
      </div>

      {/* 🆕 Tabs Style */}
      <div className="border-b border-gray-300 mt-4">
        <ul className="flex justify-around font-kanit text-lg">
          <li
            onClick={() => setActiveTab("food")}
            className={`flex-1 text-center cursor-pointer pb-2 ${activeTab === "food"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
              }`}
          >
            อาหาร
          </li>
          <li
            onClick={() => setActiveTab("ingredient")}
            className={`flex-1 text-center cursor-pointer pb-2 ${activeTab === "ingredient"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-500"
              }`}
          >
            วัตถุดิบ
          </li>
        </ul>
      </div>


      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mt-5">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2E77F8]" size={20} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`ค้นหา${activeTab === "food" ? "เมนูอาหาร" : "วัตถุดิบ"}...`}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-kanit"
        />
      </div>

      {/* Tab Content */}
      <div className="p-4 space-y-4">
        {activeTab === "food" && (
          <>
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
          </>
        )}

        {activeTab === "ingredient" && (
          <>
            {query && filteredIngre.length === 0 && (
              <p className="text-center text-gray-500 font-kanit mt-4">ไม่พบผลไม้และวัตถุดิบที่คุณค้นหา</p>
            )}
            {(query ? filteredIngre : ingredients).map((item) => (
              <div key={item.ID} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-38 h-30 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.Image} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-2xl font-kanit text-gray-800 ml-3 mb-3">
                      {item.Name}
                    </h3>
                    <h3 className="text-lg sm:text-x font-kanit text-blue-800 ml-3 text-center">
                      <a href={item.Credit} target="_blank" rel="noopener noreferrer">
                        ขอบคุณภาพจาก
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;
