import type { MenuInterface } from "../../interfaces/Menu";
import { GetAllMenu, GetAllIngredients, GetAllTag } from "../../services/https";
import React, { useEffect, useState } from "react";
import { ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { IngredientsInterface } from "../../interfaces/Ingredients"
import type { TagInterface } from "../../interfaces/Tag"
const Menu: React.FC = () => {
  const [menu, setMenu] = useState<MenuInterface[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"food" | "ingredient">("food");
  const [ingredients, setIngredients] = useState<IngredientsInterface[]>([]);
  const [tags, setTags] = useState<TagInterface[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);

  const filteredItems = menu.filter(menuItem => {
    const matchQuery = (menuItem.Title?.toLowerCase() ?? '').includes(query.toLowerCase());

    if (selectedTags.length === 0) {
      return matchQuery;
    } else {
      const hasSelectedTag = menuItem.Tags?.some(
        tag => tag.ID !== undefined && selectedTags.includes(tag.ID)
      );
      return matchQuery && Boolean(hasSelectedTag);
    }

  });

  // ฟังก์ชัน toggle checkbox tag
  const toggleTag = (tagID: number) => {
    if (selectedTags.includes(tagID)) {
      setSelectedTags(selectedTags.filter(id => id !== tagID));
    } else {
      setSelectedTags([...selectedTags, tagID]);
    }
  };

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

  const getAllTags = async () => {
    try {
      const res = await GetAllTag(); // สมมติว่ามี API นี้ดึงแท็กทั้งหมด
      console.log(res?.data?.tag)
      if (Array.isArray(res?.data?.tag)) {
        setTags(res.data.tag);
      } else {
        setError("Failed to load tags");
      }
    } catch (error) {
      setError("Error fetching tags. Please try again later.");
    }
  };

  useEffect(() => {
    getAllMenu();
    getAllIngredients();
    getAllTags();
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
      {/* รวม search bar กับ dropdown tag ไว้ในบรรทัดเดียวกัน */}
      <div className="max-w-md mx-auto mt-5 flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2E77F8]" size={20} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`ค้นหา${activeTab === "food" ? "เมนูอาหาร" : "วัตถุดิบ"}...`}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 font-kanit"
          />
        </div>

        {/* Dropdown Checkbox แสดงแท็ก เฉพาะ tab อาหาร */}
        {activeTab === "food" && (
          <div className=" border-gray-300 rounded-lg p-3 font-kanit relative max-w-xs min-w-[20px] ">
            <p
              className="font-xl mb-2 cursor-pointer select-none"
              onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
            >
              กรองตามแท็กอาหาร <span>{isTagDropdownOpen ? "▲" : "▼"}</span>
            </p>
            {isTagDropdownOpen && (
              <div className="flex flex-col gap-3 max-h-20 overflow-y-auto border-t border-gray-200 pt-2">
                {tags
                  .filter((tag): tag is TagInterface & { ID: number } => tag.ID !== undefined)
                  .map(tag => (
                    <label key={tag.ID} className="inline-flex items-center space-x-2 cursor-pointer whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.ID)}
                        onChange={() => toggleTag(tag.ID)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                      <span>{tag.Name}</span>
                    </label>
                  ))}
              </div>
            )}


          </div>
        )}
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
